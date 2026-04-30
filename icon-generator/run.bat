@echo off
setlocal

chcp 65001 >nul
set PYTHONUTF8=1

cd /d "%~dp0"
echo [icon-generator] Starting...
python main.py
echo.
echo [icon-generator] Done.
pause

