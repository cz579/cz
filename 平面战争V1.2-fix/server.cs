using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace PingMianWar {
    static class Server {
        const int DefaultPort = 8765;
        const int RoomTtlSec = 4 * 3600;
        const int MaxBody = 8 * 1024 * 1024;
        const string RoomChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        static string Root;
        static int Port = DefaultPort;
        static readonly object Gate = new object();
        static readonly Dictionary<string, Room> Rooms = new Dictionary<string, Room>();
        static readonly Random Rng = new Random();
        static TcpListener Listener;
        static volatile bool Stopping;

        class ChatLine {
            public int Id;
            public string Side;
            public string Text;
        }

        class Room {
            public string Code;
            public int Seq;
            public string StateJson;
            public bool Guest;
            public DateTime Updated;
            public DateTime HostSeen;
            public DateTime GuestSeen;
            public int ChatSeq;
            public List<ChatLine> Chat = new List<ChatLine>();
        }

        static int Main() {
            try {
                Console.OutputEncoding = Encoding.UTF8;
                Console.InputEncoding = Encoding.UTF8;
            } catch { }

            Root = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory).TrimEnd('\\', '/');
            Directory.SetCurrentDirectory(Root);
            Console.Title = "平面战争 联机服务器";

            Port = PickPort(DefaultPort);
            Listener = new TcpListener(IPAddress.Any, Port);
            Listener.Start();

            List<string> ips = LocalIps();
            Console.WriteLine(new string('=', 48));
            Console.WriteLine("  平面战争 联机服务器已启动");
            Console.WriteLine("  本机: http://127.0.0.1:" + Port + "/");
            for (int i = 0; i < ips.Count; i++) {
                Console.WriteLine("  局域网: http://" + ips[i] + ":" + Port + "/");
            }
            Console.WriteLine("  对方在「联机对战」里填写上面的 IP 和房间号即可加入。");
            Console.WriteLine("  关闭本窗口即停止房间。");
            Console.WriteLine(new string('=', 48));

            try {
                Process.Start("http://127.0.0.1:" + Port + "/");
            } catch { }

            Console.CancelKeyPress += delegate(object sender, ConsoleCancelEventArgs e) {
                e.Cancel = true;
                Stopping = true;
                try { Listener.Stop(); } catch { }
            };

            try {
                while (!Stopping) {
                    TcpClient client;
                    try {
                        client = Listener.AcceptTcpClient();
                    } catch {
                        if (Stopping) break;
                        continue;
                    }
                    ThreadPool.QueueUserWorkItem(HandleClient, client);
                }
            } finally {
                try { Listener.Stop(); } catch { }
            }
            Console.WriteLine();
            Console.WriteLine("服务器已停止。");
            return 0;
        }

        static int PickPort(int start) {
            for (int p = start; p < start + 8; p++) {
                Socket sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                try {
                    sock.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                    sock.Bind(new IPEndPoint(IPAddress.Any, p));
                    sock.Close();
                    return p;
                } catch {
                    try { sock.Close(); } catch { }
                }
            }
            return start;
        }

        static int IpRank(string ip) {
            if (ip.StartsWith("192.168.")) return 0;
            if (ip.StartsWith("10.")) return 1;
            string[] parts = ip.Split('.');
            if (parts.Length == 4 && parts[0] == "172") {
                int n;
                if (int.TryParse(parts[1], out n) && n >= 16 && n <= 31) return 2;
            }
            if (ip.StartsWith("26.")) return 3;
            if (ip.StartsWith("198.18.")) return 9;
            return 5;
        }

        static List<string> LocalIps() {
            List<string> ips = new List<string>();
            try {
                using (Socket s = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp)) {
                    s.Connect("8.8.8.8", 80);
                    IPEndPoint ep = s.LocalEndPoint as IPEndPoint;
                    if (ep != null && ep.Address != null) {
                        string ip = ep.Address.ToString();
                        if (ip.Length > 0 && ips.IndexOf(ip) < 0) ips.Add(ip);
                    }
                }
            } catch { }
            try {
                IPAddress[] addrs = Dns.GetHostAddresses(Dns.GetHostName());
                for (int i = 0; i < addrs.Length; i++) {
                    if (addrs[i].AddressFamily != AddressFamily.InterNetwork) continue;
                    string ip = addrs[i].ToString();
                    if (ip.Length == 0 || ip.StartsWith("127.")) continue;
                    if (ips.IndexOf(ip) < 0) ips.Add(ip);
                }
            } catch { }
            ips.Sort(delegate(string a, string b) { return IpRank(a).CompareTo(IpRank(b)); });
            if (ips.Count == 0) ips.Add("127.0.0.1");
            return ips;
        }

        static string MakeCode() {
            for (int n = 0; n < 80; n++) {
                char[] buf = new char[4];
                for (int i = 0; i < 4; i++) buf[i] = RoomChars[Rng.Next(RoomChars.Length)];
                string code = new string(buf);
                if (!Rooms.ContainsKey(code)) return code;
            }
            char[] longBuf = new char[6];
            for (int i = 0; i < 6; i++) longBuf[i] = RoomChars[Rng.Next(RoomChars.Length)];
            return new string(longBuf);
        }

        static void PurgeRooms() {
            DateTime now = DateTime.UtcNow;
            List<string> dead = new List<string>();
            foreach (KeyValuePair<string, Room> kv in Rooms) {
                if ((now - kv.Value.Updated).TotalSeconds > RoomTtlSec) dead.Add(kv.Key);
            }
            for (int i = 0; i < dead.Count; i++) Rooms.Remove(dead[i]);
        }

        static void HandleClient(object state) {
            TcpClient client = (TcpClient)state;
            NetworkStream ns = null;
            try {
                client.NoDelay = true;
                ns = client.GetStream();
                ns.ReadTimeout = 20000;
                ns.WriteTimeout = 20000;
                HttpReq req;
                if (!ReadRequest(ns, out req)) return;
                HttpRes res = Dispatch(req);
                WriteResponse(ns, res);
                Log(req, res.Status);
            } catch (Exception ex) {
                try { Console.Error.WriteLine(ex.Message); } catch { }
            } finally {
                try { if (ns != null) ns.Close(); } catch { }
                try { client.Close(); } catch { }
            }
        }

        class HttpReq {
            public string Method;
            public string Path;
            public string Query;
            public string Body;
        }

        class HttpRes {
            public int Status = 200;
            public string ContentType = "application/json; charset=utf-8";
            public byte[] Body = new byte[0];
            public bool Cors;
        }

        static void Log(HttpReq req, int status) {
            try {
                Console.Error.WriteLine("[" + DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss") + "] \"" + req.Method + " " + req.Path + "\" " + status);
            } catch { }
        }

        static bool ReadRequest(NetworkStream ns, out HttpReq req) {
            req = null;
            MemoryStream head = new MemoryStream();
            int match = 0;
            byte[] one = new byte[1];
            while (head.Length < 65536) {
                int n = ns.Read(one, 0, 1);
                if (n <= 0) return false;
                head.Write(one, 0, 1);
                if (one[0] == (match == 0 || match == 2 ? (byte)13 : (byte)10)) match++;
                else match = one[0] == 13 ? 1 : 0;
                if (match == 4) break;
            }
            if (match != 4) return false;
            string headerText = Encoding.UTF8.GetString(head.ToArray());
            string[] lines = headerText.Split(new string[] { "\r\n" }, StringSplitOptions.None);
            if (lines.Length < 1) return false;
            string[] start = lines[0].Split(' ');
            if (start.Length < 2) return false;
            string rawPath = start[1];
            string path = rawPath;
            string query = "";
            int q = rawPath.IndexOf('?');
            if (q >= 0) {
                path = rawPath.Substring(0, q);
                query = rawPath.Substring(q + 1);
            }
            try { path = Uri.UnescapeDataString(path); } catch { }
            int contentLength = 0;
            for (int i = 1; i < lines.Length; i++) {
                string line = lines[i];
                int c = line.IndexOf(':');
                if (c <= 0) continue;
                string name = line.Substring(0, c).Trim();
                string val = line.Substring(c + 1).Trim();
                if (name.Equals("Content-Length", StringComparison.OrdinalIgnoreCase)) {
                    int.TryParse(val, out contentLength);
                }
            }
            if (contentLength < 0 || contentLength > MaxBody) return false;
            byte[] bodyBytes = new byte[contentLength];
            int got = 0;
            while (got < contentLength) {
                int n = ns.Read(bodyBytes, got, contentLength - got);
                if (n <= 0) return false;
                got += n;
            }
            req = new HttpReq();
            req.Method = start[0].ToUpperInvariant();
            req.Path = path;
            req.Query = query;
            req.Body = contentLength > 0 ? Encoding.UTF8.GetString(bodyBytes) : "";
            return true;
        }

        static void WriteResponse(NetworkStream ns, HttpRes res) {
            if (res.Body == null) res.Body = new byte[0];
            string reason = "OK";
            if (res.Status == 204) reason = "No Content";
            else if (res.Status == 400) reason = "Bad Request";
            else if (res.Status == 403) reason = "Forbidden";
            else if (res.Status == 404) reason = "Not Found";
            else if (res.Status == 409) reason = "Conflict";
            else if (res.Status == 500) reason = "Internal Server Error";
            StringBuilder sb = new StringBuilder();
            sb.Append("HTTP/1.1 ").Append(res.Status).Append(' ').Append(reason).Append("\r\n");
            sb.Append("Content-Length: ").Append(res.Body.Length).Append("\r\n");
            if (!string.IsNullOrEmpty(res.ContentType) && res.Status != 204) {
                sb.Append("Content-Type: ").Append(res.ContentType).Append("\r\n");
            }
            sb.Append("Connection: close\r\n");
            if (res.Cors) {
                sb.Append("Access-Control-Allow-Origin: *\r\n");
                sb.Append("Access-Control-Allow-Headers: Content-Type\r\n");
                sb.Append("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
                sb.Append("Cache-Control: no-store\r\n");
            }
            sb.Append("\r\n");
            byte[] head = Encoding.ASCII.GetBytes(sb.ToString());
            ns.Write(head, 0, head.Length);
            if (res.Body.Length > 0 && res.Status != 204) ns.Write(res.Body, 0, res.Body.Length);
            ns.Flush();
        }

        static HttpRes Dispatch(HttpReq req) {
            if (req.Method == "OPTIONS") {
                HttpRes opt = new HttpRes();
                opt.Status = 204;
                opt.Cors = true;
                return opt;
            }
            if (req.Path == "/api/info" && req.Method == "GET") {
                List<string> ips = LocalIps();
                StringBuilder js = new StringBuilder();
                js.Append("{\"ok\":true,\"ips\":");
                js.Append(JsonStringArray(ips));
                js.Append(",\"port\":").Append(Port).Append('}');
                return JsonRaw(js.ToString(), 200);
            }
            if (req.Path.StartsWith("/api/room/") && req.Method == "GET") {
                return GetRoom(req);
            }
            if (req.Method == "POST") {
                if (req.Path == "/api/host") return HostRoom(req);
                if (req.Path == "/api/join") return JoinRoom(req);
                if (req.Path == "/api/chat") return PostChat(req);
                if (req.Path.StartsWith("/api/room/")) return PushRoom(req);
                return JsonErr("未知接口", 404);
            }
            if (req.Path.StartsWith("/api/")) return JsonErr("未知接口", 404);
            if (req.Method == "GET" || req.Method == "HEAD") return ServeFile(req);
            return JsonErr("未知接口", 404);
        }

        static HttpRes GetRoom(HttpReq req) {
            string code = RoomCodeFromPath(req.Path);
            string side = QueryValue(req.Query, "side");
            lock (Gate) {
                PurgeRooms();
                Room room;
                if (!Rooms.TryGetValue(code, out room)) return JsonErr("房间不存在或已关闭", 404);
                DateTime now = DateTime.UtcNow;
                room.Updated = now;
                if (side == "player") room.HostSeen = now;
                else if (side == "ai") room.GuestSeen = now;
                StringBuilder js = new StringBuilder();
                js.Append("{\"ok\":true,\"code\":").Append(JsonString(code));
                js.Append(",\"seq\":").Append(room.Seq);
                js.Append(",\"guest\":").Append(room.Guest ? "true" : "false");
                js.Append(",\"host\":true");
                js.Append(",\"status\":").Append(JsonString(room.Guest ? "play" : "wait"));
                js.Append(",\"state\":").Append(string.IsNullOrEmpty(room.StateJson) ? "null" : room.StateJson);
                js.Append(",\"chat\":").Append(ChatJson(room));
                js.Append('}');
                return JsonRaw(js.ToString(), 200);
            }
        }

        static HttpRes HostRoom(HttpReq req) {
            Dictionary<string, string> body = TopLevelRaw(req.Body);
            if (body == null) return JsonErr("请求体无效", 400);
            lock (Gate) {
                PurgeRooms();
                string code = MakeCode();
                DateTime now = DateTime.UtcNow;
                Room room = new Room();
                room.Code = code;
                room.Seq = 0;
                room.StateJson = null;
                room.Guest = false;
                room.Updated = now;
                room.HostSeen = now;
                Rooms[code] = room;
                List<string> ips = LocalIps();
                StringBuilder js = new StringBuilder();
                js.Append("{\"ok\":true,\"code\":").Append(JsonString(code));
                js.Append(",\"side\":\"player\",\"ips\":").Append(JsonStringArray(ips));
                js.Append(",\"port\":").Append(Port).Append('}');
                return JsonRaw(js.ToString(), 200);
            }
        }

        static HttpRes JoinRoom(HttpReq req) {
            Dictionary<string, string> body = TopLevelRaw(req.Body);
            if (body == null) return JsonErr("请求体无效", 400);
            string code = Unquote(GetRaw(body, "code"));
            if (code == null) code = "";
            code = code.Trim().ToUpperInvariant();
            lock (Gate) {
                PurgeRooms();
                Room room;
                if (!Rooms.TryGetValue(code, out room)) {
                    return JsonErr("房间不存在。请确认房间号和主机地址。", 404);
                }
                if (room.Guest) return JsonErr("该房间已有红方玩家", 409);
                room.Guest = true;
                DateTime now = DateTime.UtcNow;
                room.Updated = now;
                room.GuestSeen = now;
                return JsonRaw("{\"ok\":true,\"code\":" + JsonString(code) + ",\"side\":\"ai\"}", 200);
            }
        }

        static HttpRes PushRoom(HttpReq req) {
            Dictionary<string, string> body = TopLevelRaw(req.Body);
            if (body == null) return JsonErr("请求体无效", 400);
            string code = RoomCodeFromPath(req.Path);
            string state = GetRaw(body, "state");
            if (string.IsNullOrEmpty(state) || state[0] != '{') return JsonErr("缺少战场数据", 400);
            string side = Unquote(GetRaw(body, "side"));
            lock (Gate) {
                PurgeRooms();
                Room room;
                if (!Rooms.TryGetValue(code, out room)) return JsonErr("房间不存在或已关闭", 404);
                room.StateJson = state;
                room.Seq = room.Seq + 1;
                DateTime now = DateTime.UtcNow;
                room.Updated = now;
                if (side == "player") room.HostSeen = now;
                else if (side == "ai") room.GuestSeen = now;
                return JsonRaw("{\"ok\":true,\"seq\":" + room.Seq + "}", 200);
            }
        }

        static HttpRes PostChat(HttpReq req) {
            Dictionary<string, string> body = TopLevelRaw(req.Body);
            if (body == null) return JsonErr("请求体无效", 400);
            string code = Unquote(GetRaw(body, "code"));
            if (code == null) code = "";
            code = code.Trim().ToUpperInvariant();
            string text = Unquote(GetRaw(body, "text"));
            if (text == null) text = "";
            StringBuilder cleaned = new StringBuilder();
            for (int i = 0; i < text.Length; i++) {
                char c = text[i];
                cleaned.Append(c < 32 ? ' ' : c);
            }
            text = cleaned.ToString().Trim();
            if (text.Length > 120) text = text.Substring(0, 120);
            if (text.Length == 0) return JsonErr("请输入内容", 400);
            string side = Unquote(GetRaw(body, "side"));
            if (side != "ai") side = "player";
            lock (Gate) {
                PurgeRooms();
                Room room;
                if (!Rooms.TryGetValue(code, out room)) return JsonErr("房间不存在或已关闭", 404);
                if (room.Chat == null) room.Chat = new List<ChatLine>();
                room.ChatSeq = room.ChatSeq + 1;
                ChatLine line = new ChatLine();
                line.Id = room.ChatSeq;
                line.Side = side;
                line.Text = text;
                room.Chat.Add(line);
                if (room.Chat.Count > 80) room.Chat.RemoveRange(0, room.Chat.Count - 80);
                DateTime now = DateTime.UtcNow;
                room.Updated = now;
                if (side == "player") room.HostSeen = now;
                else room.GuestSeen = now;
                return JsonRaw("{\"ok\":true,\"chat\":" + ChatJson(room) + "}", 200);
            }
        }

        static string ChatJson(Room room) {
            StringBuilder js = new StringBuilder();
            js.Append('[');
            if (room != null && room.Chat != null) {
                for (int i = 0; i < room.Chat.Count; i++) {
                    if (i > 0) js.Append(',');
                    ChatLine line = room.Chat[i];
                    js.Append("{\"id\":").Append(line.Id);
                    js.Append(",\"side\":").Append(JsonString(line.Side));
                    js.Append(",\"text\":").Append(JsonString(line.Text));
                    js.Append('}');
                }
            }
            js.Append(']');
            return js.ToString();
        }

        static string RoomCodeFromPath(string path) {
            string code = path.Substring("/api/room/".Length).Trim().Trim('/');
            return code.ToUpperInvariant();
        }

        static string QueryValue(string query, string key) {
            if (string.IsNullOrEmpty(query)) return "";
            string[] parts = query.Split('&');
            for (int i = 0; i < parts.Length; i++) {
                string p = parts[i];
                int eq = p.IndexOf('=');
                string k = eq >= 0 ? p.Substring(0, eq) : p;
                string v = eq >= 0 ? p.Substring(eq + 1) : "";
                try { k = Uri.UnescapeDataString(k); } catch { }
                try { v = Uri.UnescapeDataString(v); } catch { }
                if (k == key) return v;
            }
            return "";
        }

        static HttpRes ServeFile(HttpReq req) {
            string rel = req.Path.Replace('/', '\\').TrimStart('\\');
            if (rel.Length == 0) rel = "index.html";
            string full = Path.GetFullPath(Path.Combine(Root, rel));
            string rootSlash = Root.EndsWith("\\") ? Root : Root + "\\";
            if (!full.StartsWith(rootSlash, StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(full, Root, StringComparison.OrdinalIgnoreCase)) {
                HttpRes forbid = new HttpRes();
                forbid.Status = 403;
                forbid.ContentType = "text/plain; charset=utf-8";
                forbid.Body = Encoding.UTF8.GetBytes("Forbidden");
                return forbid;
            }
            if (Directory.Exists(full)) {
                full = Path.Combine(full, "index.html");
            }
            if (!File.Exists(full)) {
                HttpRes missing = new HttpRes();
                missing.Status = 404;
                missing.ContentType = "text/plain; charset=utf-8";
                missing.Body = Encoding.UTF8.GetBytes("Not Found");
                return missing;
            }
            byte[] data = File.ReadAllBytes(full);
            HttpRes ok = new HttpRes();
            ok.Status = 200;
            ok.ContentType = MimeOf(full);
            ok.Body = data;
            return ok;
        }

        static string MimeOf(string path) {
            string ext = Path.GetExtension(path).ToLowerInvariant();
            if (ext == ".html" || ext == ".htm") return "text/html; charset=utf-8";
            if (ext == ".js") return "application/javascript; charset=utf-8";
            if (ext == ".css") return "text/css; charset=utf-8";
            if (ext == ".json") return "application/json; charset=utf-8";
            if (ext == ".png") return "image/png";
            if (ext == ".jpg" || ext == ".jpeg") return "image/jpeg";
            if (ext == ".gif") return "image/gif";
            if (ext == ".svg") return "image/svg+xml";
            if (ext == ".ico") return "image/x-icon";
            if (ext == ".woff") return "font/woff";
            if (ext == ".woff2") return "font/woff2";
            if (ext == ".txt") return "text/plain; charset=utf-8";
            return "application/octet-stream";
        }

        static HttpRes JsonErr(string msg, int status) {
            return JsonRaw("{\"ok\":false,\"error\":" + JsonString(msg) + "}", status);
        }

        static HttpRes JsonRaw(string json, int status) {
            HttpRes res = new HttpRes();
            res.Status = status;
            res.Cors = true;
            res.ContentType = "application/json; charset=utf-8";
            res.Body = Encoding.UTF8.GetBytes(json);
            return res;
        }

        static string JsonString(string s) {
            if (s == null) return "null";
            StringBuilder sb = new StringBuilder();
            sb.Append('"');
            for (int i = 0; i < s.Length; i++) {
                char c = s[i];
                if (c == '"' || c == '\\') { sb.Append('\\'); sb.Append(c); }
                else if (c == '\n') sb.Append("\\n");
                else if (c == '\r') sb.Append("\\r");
                else if (c == '\t') sb.Append("\\t");
                else if (c < 32) sb.Append("\\u").Append(((int)c).ToString("x4"));
                else sb.Append(c);
            }
            sb.Append('"');
            return sb.ToString();
        }

        static string JsonStringArray(List<string> items) {
            StringBuilder sb = new StringBuilder();
            sb.Append('[');
            for (int i = 0; i < items.Count; i++) {
                if (i > 0) sb.Append(',');
                sb.Append(JsonString(items[i]));
            }
            sb.Append(']');
            return sb.ToString();
        }

        static string GetRaw(Dictionary<string, string> body, string key) {
            string v;
            if (body != null && body.TryGetValue(key, out v)) return v;
            return null;
        }

        static string Unquote(string raw) {
            if (string.IsNullOrEmpty(raw) || raw == "null") return "";
            raw = raw.Trim();
            if (raw.Length >= 2 && raw[0] == '"' && raw[raw.Length - 1] == '"') {
                StringBuilder sb = new StringBuilder();
                for (int i = 1; i < raw.Length - 1; i++) {
                    if (raw[i] == '\\' && i + 1 < raw.Length - 1) {
                        char n = raw[++i];
                        if (n == 'n') sb.Append('\n');
                        else if (n == 'r') sb.Append('\r');
                        else if (n == 't') sb.Append('\t');
                        else sb.Append(n);
                    } else sb.Append(raw[i]);
                }
                return sb.ToString();
            }
            return raw;
        }

        static Dictionary<string, string> TopLevelRaw(string json) {
            Dictionary<string, string> d = new Dictionary<string, string>();
            if (string.IsNullOrEmpty(json)) return d;
            int i = SkipWs(json, 0);
            if (i >= json.Length || json[i] != '{') return null;
            i++;
            while (i < json.Length) {
                i = SkipWs(json, i);
                if (i >= json.Length) return null;
                if (json[i] == '}') return d;
                if (json[i] != '"') return null;
                string key;
                i = ReadJsonString(json, i, out key);
                if (i < 0) return null;
                i = SkipWs(json, i);
                if (i >= json.Length || json[i] != ':') return null;
                i++;
                i = SkipWs(json, i);
                int start = i;
                i = SkipValue(json, i);
                if (i < 0) return null;
                d[key] = json.Substring(start, i - start).Trim();
                i = SkipWs(json, i);
                if (i < json.Length && json[i] == ',') { i++; continue; }
                if (i < json.Length && json[i] == '}') return d;
                return null;
            }
            return d;
        }

        static int SkipWs(string s, int i) {
            while (i < s.Length && char.IsWhiteSpace(s[i])) i++;
            return i;
        }

        static int ReadJsonString(string s, int i, out string value) {
            value = null;
            if (i >= s.Length || s[i] != '"') return -1;
            i++;
            StringBuilder sb = new StringBuilder();
            while (i < s.Length) {
                char c = s[i++];
                if (c == '"') { value = sb.ToString(); return i; }
                if (c == '\\') {
                    if (i >= s.Length) return -1;
                    char n = s[i++];
                    if (n == 'n') sb.Append('\n');
                    else if (n == 'r') sb.Append('\r');
                    else if (n == 't') sb.Append('\t');
                    else if (n == 'u' && i + 4 <= s.Length) {
                        int cp;
                        if (int.TryParse(s.Substring(i, 4), System.Globalization.NumberStyles.HexNumber, null, out cp)) {
                            sb.Append((char)cp);
                        }
                        i += 4;
                    } else sb.Append(n);
                } else sb.Append(c);
            }
            return -1;
        }

        static int SkipValue(string s, int i) {
            i = SkipWs(s, i);
            if (i >= s.Length) return -1;
            char c = s[i];
            if (c == '"') {
                string dummy;
                return ReadJsonString(s, i, out dummy);
            }
            if (c == '{' || c == '[') {
                char open = c;
                char close = c == '{' ? '}' : ']';
                int depth = 0;
                while (i < s.Length) {
                    char ch = s[i];
                    if (ch == '"') {
                        string dummy;
                        i = ReadJsonString(s, i, out dummy);
                        if (i < 0) return -1;
                        continue;
                    }
                    if (ch == open) depth++;
                    else if (ch == close) {
                        depth--;
                        i++;
                        if (depth == 0) return i;
                        continue;
                    }
                    i++;
                }
                return -1;
            }
            while (i < s.Length) {
                char ch = s[i];
                if (ch == ',' || ch == '}' || ch == ']' || char.IsWhiteSpace(ch)) break;
                i++;
            }
            return i;
        }
    }
}
