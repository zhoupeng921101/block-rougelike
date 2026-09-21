#!/usr/bin/env node
// 经 Chrome DevTools Protocol 操作模拟器浏览器里的复刻件（22 号票）。
//
//   node tools/cdp.mjs eval '<js 表达式>'        在页面里求值，打印结果（await 可用）
//   node tools/cdp.mjs logs [秒]                 收集这段时间的控制台输出与异常
//   node tools/cdp.mjs snap <out.png>            取回画布原图（Phaser `renderer.snapshot`），尺寸就是画布尺寸
//   node tools/cdp.mjs reload                    重载页面
//
// 与实机逐像素对照：页面开 `?look=mobile&win=2560x1440`，画布就是 2560×1440，`snap` 出来与 adb 截图同尺寸。
// WebView 的 `Page.captureScreenshot` 抓不到 WebGL 内容（是白的），视口覆写也不可靠，所以走画布快照。
//
// 前置：`adb forward tcp:9222 localabstract:webview_devtools_remote_<pid>`（pid 从 /proc/net/unix 找），
// 本脚本会自动找、自动转发。只连本机回环。
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ADB = process.env.EMU_ADB ?? 'D:/Program Files/leidian/LDPlayer14/adb.exe';
const SERIAL = process.env.EMU_SERIAL ?? 'emulator-5554';
const PORT = 9222;

function forward() {
    const unix = execFileSync(ADB, ['-s', SERIAL, 'shell', 'cat /proc/net/unix'], { encoding: 'utf8' });
    const sock = unix.match(/@(webview_devtools_remote_\d+|chrome_devtools_remote)/)?.[1];
    if (!sock) throw new Error('模拟器里没有 devtools 套接字：浏览器开着吗？');
    execFileSync(ADB, ['-s', SERIAL, 'forward', `tcp:${PORT}`, `localabstract:${sock}`]);
}

async function target() {
    forward();
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    // 同一个浏览器可能开着好几个标签页，取当前显示的那个（attached），没有就取第一个 localhost 页
    const pages = list.filter((t) => t.type === 'page' && t.url.includes('localhost:8080'));
    const page = pages.find((t) => JSON.parse(t.description || '{}').attached) ?? pages[0];
    if (!page) throw new Error('没找到复刻件的页面');
    return page.webSocketDebuggerUrl;
}

async function connect() {
    const ws = new WebSocket(await target());
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0;
    const pending = new Map();
    const listeners = [];
    ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id && pending.has(msg.id)) {
            const { res, rej } = pending.get(msg.id);
            pending.delete(msg.id);
            msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
        } else if (msg.method) {
            for (const l of listeners) l(msg);
        }
    };
    const send = (method, params = {}) =>
        new Promise((res, rej) => {
            const n = ++id;
            pending.set(n, { res, rej });
            ws.send(JSON.stringify({ id: n, method, params }));
        });
    return { send, on: (l) => listeners.push(l), close: () => ws.close() };
}

const [cmd, ...rest] = process.argv.slice(2);
const cdp = await connect();
try {
    if (cmd === 'eval') {
        const r = await cdp.send('Runtime.evaluate', { expression: rest[0], awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) console.error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
        else console.log(typeof r.result.value === 'string' ? r.result.value : JSON.stringify(r.result.value, null, 1));
    } else if (cmd === 'logs') {
        await cdp.send('Runtime.enable');
        cdp.on((m) => {
            if (m.method === 'Runtime.consoleAPICalled') {
                console.log(`[${m.params.type}]`, m.params.args.map((a) => a.value ?? a.description).join(' '));
            } else if (m.method === 'Runtime.exceptionThrown') {
                console.log('[exception]', m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
            }
        });
        await new Promise((r) => setTimeout(r, Number(rest[0] ?? 3) * 1000));
    } else if (cmd === 'snap') {
        const r = await cdp.send('Runtime.evaluate', {
            expression: 'new Promise((res) => window.__game.renderer.snapshot((img) => res(img.src)))',
            awaitPromise: true,
            returnByValue: true,
        });
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
        writeFileSync(rest[0], Buffer.from(r.result.value.replace(/^data:image\/png;base64,/, ''), 'base64'));
        console.log(rest[0]);
    } else if (cmd === 'reload') {
        await cdp.send('Emulation.clearDeviceMetricsOverride');
        await cdp.send('Page.reload', { ignoreCache: true });
    } else {
        console.error('用法见文件头注释');
        process.exitCode = 2;
    }
} finally {
    cdp.close();
}
