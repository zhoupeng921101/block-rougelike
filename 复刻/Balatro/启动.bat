@echo off
chcp 65001 >nul
setlocal
rem 启动 Balatro 复刻件：只跑 localhost，不部署、不分发。
rem 用法：双击直接进主菜单；或 启动.bat ALEEB 直接开这一局

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo 没找到 npm，先装 Node.js：https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo 首次运行，安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败
        pause
        exit /b 1
    )
)

set "OPEN_PATH=/"
if not "%~1"=="" set "OPEN_PATH=/?seed=%~1"

rem 8080 已被占用，多半是上次的 dev server 还开着，直接开浏览器
netstat -ano | findstr /r /c:":8080 .*LISTENING" >nul
if not errorlevel 1 (
    echo 8080 已在监听，直接打开浏览器
    start "" "http://localhost:8080%OPEN_PATH%"
    exit /b 0
)

echo 启动 dev server：http://localhost:8080%OPEN_PATH%  （关掉本窗口即停止）
call npm run dev -- --host localhost --strictPort --open "%OPEN_PATH%"
pause
