@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 平面战争 联机服务器

if not exist "%~dp0server.exe" (
  echo.
  echo 缺少 server.exe，无法启动联机房间。
  echo 请确认本文件夹完整。
  echo.
  pause
  exit /b 1
)

echo 正在启动房间服务器...
echo 关闭本窗口即停止联机房间。
echo.
"%~dp0server.exe"
if errorlevel 1 (
  echo.
  echo 服务器异常退出。请把上面的报错截图发给对方或开发者。
  echo.
  pause
)
