#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""平面战争 局域网联机服务器（标准库，无需额外安装）。"""
from __future__ import annotations

import json
import os
import random
import socket
import sys
import threading
import time
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8765
CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
ROOM_TTL = 4 * 3600

rooms = {}
lock = threading.Lock()


def _ip_rank(ip):
    if ip.startswith("192.168."):
        return 0
    if ip.startswith("10."):
        return 1
    parts = ip.split(".")
    if len(parts) == 4 and parts[0] == "172":
        try:
            n = int(parts[1])
            if 16 <= n <= 31:
                return 2
        except ValueError:
            pass
    if ip.startswith("26."):
        return 3
    if ip.startswith("198.18."):
        return 9
    return 5


def local_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        if ip and ip not in ips:
            ips.append(ip)
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if ip and not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    ips.sort(key=_ip_rank)
    return ips or ["127.0.0.1"]


def make_code():
    for _ in range(80):
        code = "".join(random.choice(CHARS) for _ in range(4))
        if code not in rooms:
            return code
    return "".join(random.choice(CHARS) for _ in range(6))


def purge_rooms():
    now = time.time()
    dead = [k for k, r in rooms.items() if now - r.get("updated", 0) > ROOM_TTL]
    for k in dead:
        rooms.pop(k, None)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Cache-Control", "no-store")

    def _json(self, payload, status=200):
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self._cors()
        self.end_headers()
        self.wfile.write(raw)

    def _read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0:
            return {}
        if length > 8 * 1024 * 1024:
            return None
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8"))
        except Exception:
            return None

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/info":
            self._json({"ok": True, "ips": local_ips(), "port": PORT})
            return
        if parsed.path.startswith("/api/room/"):
            code = parsed.path.split("/api/room/", 1)[-1].strip("/").upper()
            qs = parse_qs(parsed.query)
            side = (qs.get("side") or [""])[0]
            with lock:
                purge_rooms()
                room = rooms.get(code)
                if not room:
                    self._json({"ok": False, "error": "房间不存在或已关闭"}, 404)
                    return
                now = time.time()
                room["updated"] = now
                if side == "player":
                    room["hostSeen"] = now
                elif side == "ai":
                    room["guestSeen"] = now
                self._json({
                    "ok": True,
                    "code": code,
                    "seq": room["seq"],
                    "guest": bool(room["guest"]),
                    "host": True,
                    "status": "play" if room["guest"] else "wait",
                    "state": room["state"],
                    "chat": room.get("chat") or [],
                })
            return
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        body = self._read_json()
        if body is None:
            self._json({"ok": False, "error": "请求体无效"}, 400)
            return
        with lock:
            purge_rooms()
            if parsed.path == "/api/host":
                code = make_code()
                now = time.time()
                rooms[code] = {
                    "code": code,
                    "seq": 0,
                    "state": None,
                    "chat": [],
                    "chatSeq": 0,
                    "guest": False,
                    "updated": now,
                    "hostSeen": now,
                    "guestSeen": 0,
                    "sizeKey": body.get("sizeKey") or "normal",
                    "ocean": bool(body.get("ocean")),
                }
                self._json({"ok": True, "code": code, "side": "player", "ips": local_ips(), "port": PORT})
                return
            if parsed.path == "/api/join":
                code = str(body.get("code") or "").strip().upper()
                room = rooms.get(code)
                if not room:
                    self._json({"ok": False, "error": "房间不存在。请确认房间号和主机地址。"}, 404)
                    return
                if room["guest"]:
                    self._json({"ok": False, "error": "该房间已有红方玩家"}, 409)
                    return
                room["guest"] = True
                room["updated"] = time.time()
                room["guestSeen"] = time.time()
                self._json({"ok": True, "code": code, "side": "ai"})
                return
            if parsed.path.startswith("/api/room/"):
                code = parsed.path.split("/api/room/", 1)[-1].strip("/").upper()
                room = rooms.get(code)
                if not room:
                    self._json({"ok": False, "error": "房间不存在或已关闭"}, 404)
                    return
                state = body.get("state")
                if not isinstance(state, dict):
                    self._json({"ok": False, "error": "缺少战场数据"}, 400)
                    return
                room["state"] = state
                room["seq"] = int(room.get("seq") or 0) + 1
                room["updated"] = time.time()
                side = body.get("side")
                if side == "player":
                    room["hostSeen"] = time.time()
                elif side == "ai":
                    room["guestSeen"] = time.time()
                self._json({"ok": True, "seq": room["seq"]})
                return
            if parsed.path == "/api/chat":
                code = str(body.get("code") or "").strip().upper()
                room = rooms.get(code)
                if not room:
                    self._json({"ok": False, "error": "房间不存在或已关闭"}, 404)
                    return
                text = str(body.get("text") or "")
                text = "".join(ch if ord(ch) >= 32 else " " for ch in text).strip()
                if len(text) > 120:
                    text = text[:120]
                if not text:
                    self._json({"ok": False, "error": "请输入内容"}, 400)
                    return
                side = body.get("side")
                if side != "ai":
                    side = "player"
                room["chatSeq"] = int(room.get("chatSeq") or 0) + 1
                chat = list(room.get("chat") or [])
                chat.append({"id": room["chatSeq"], "side": side, "text": text})
                if len(chat) > 80:
                    chat = chat[-80:]
                room["chat"] = chat
                now = time.time()
                room["updated"] = now
                if side == "player":
                    room["hostSeen"] = now
                else:
                    room["guestSeen"] = now
                self._json({"ok": True, "chat": chat})
                return
        self._json({"ok": False, "error": "未知接口"}, 404)


def pick_port(start):
    for port in range(start, start + 8):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(("0.0.0.0", port))
            sock.close()
            return port
        except OSError:
            try:
                sock.close()
            except Exception:
                pass
    return start


def main():
    global PORT
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    os.chdir(ROOT)
    PORT = pick_port(PORT)
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    ips = local_ips()
    print("=" * 48)
    print("  平面战争 联机服务器已启动")
    print("  本机: http://127.0.0.1:%s/" % PORT)
    for ip in ips:
        print("  局域网: http://%s:%s/" % (ip, PORT))
    print("  对方在「联机对战」里填写上面的 IP 和房间号即可加入。")
    print("  关闭本窗口即停止房间。")
    print("=" * 48)
    webbrowser.open("http://127.0.0.1:%s/" % PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止。")


if __name__ == "__main__":
    main()
