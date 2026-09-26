#!/bin/bash
# 启动 Balatro 复刻件：只跑 localhost，不部署、不分发。
# 用法：Finder 里双击直接进主菜单；或 ./启动.command ALEEB 直接开这一局

cd "$(dirname "$0")" || exit 1

if ! command -v npm >/dev/null 2>&1; then
    echo "没找到 npm，先装 Node.js：https://nodejs.org/ （或 brew install node）"
    read -r -p "按回车退出"
    exit 1
fi

if [ ! -d node_modules ]; then
    echo "首次运行，安装依赖..."
    if ! npm install; then
        echo "依赖安装失败"
        read -r -p "按回车退出"
        exit 1
    fi
fi

OPEN_PATH="/"
if [ -n "$1" ]; then
    OPEN_PATH="/?seed=$1"
fi

# 8080 已被占用，多半是上次的 dev server 还开着，直接开浏览器
if lsof -nP -iTCP:8080 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "8080 已在监听，直接打开浏览器"
    open "http://localhost:8080${OPEN_PATH}"
    exit 0
fi

echo "启动 dev server：http://localhost:8080${OPEN_PATH}  （Ctrl+C 或关掉本窗口即停止）"
npm run dev -- --host localhost --strictPort --open "$OPEN_PATH"
