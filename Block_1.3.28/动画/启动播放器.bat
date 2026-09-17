@echo off
cd /d "%~dp0"
echo.
echo   Block 1.3.28 骨架动画播放器
echo   浏览器会自己弹出来; 关掉本窗口就停服务器。
echo.
python "%~dp0..\..\GossipHarbor_3.97.0\工具\block_player.py" "%~dp0." --serve
pause
