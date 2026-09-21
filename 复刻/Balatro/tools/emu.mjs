#!/usr/bin/env node
// 驱动雷电模拟器里的正版 Balatro（1.0.1o 移动版），用来取实机真值与外观基准。
//
//   node tools/emu.mjs shot <out.png>        截屏，缩到 1280×720 存盘（原始 2560×1440 另存 .raw.png）
//   node tools/emu.mjs tap <x> <y>           点按，坐标用 1280×720 那张缩略图的
//   node tools/emu.mjs swipe <x1> <y1> <x2> <y2> [ms]
//   node tools/emu.mjs text <str>            往当前输入框敲字（仅 ASCII）
//   node tools/emu.mjs key <keycode>         例：BACK / ENTER / DEL
//
// adb 路径可用 EMU_ADB 覆盖，设备序列号用 EMU_SERIAL 覆盖。
// 只读本机模拟器，不联网；截下来的原作画面属于受保护素材，不入库。
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ADB = process.env.EMU_ADB ?? 'D:/Program Files/leidian/LDPlayer14/adb.exe';
const SERIAL = process.env.EMU_SERIAL ?? 'emulator-5554';
const PHYS_W = 2560;
const VIEW_W = 1280;
const K = PHYS_W / VIEW_W;

function adb(args, opts = {}) {
  return execFileSync(ADB, ['-s', SERIAL, ...args], { maxBuffer: 64 << 20, ...opts });
}

const [cmd, ...rest] = process.argv.slice(2);
const px = (v) => String(Math.round(Number(v) * K));

switch (cmd) {
  case 'shot': {
    const out = rest[0] ?? 'emu.png';
    const raw = out.replace(/\.png$/, '.raw.png');
    writeFileSync(raw, adb(['exec-out', 'screencap', '-p']));
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', raw, '-vf', `scale=${VIEW_W}:-1`, out]);
    console.log(out);
    break;
  }
  case 'tap':
    // `input tap` 的按下／抬起间隔太短，连点时 LÖVE 常只认成悬停（实测三连点只选中一张）；
    // 原地按 120ms 稳定
    adb(['shell', 'input', 'swipe', px(rest[0]), px(rest[1]), px(rest[0]), px(rest[1]), '120']);
    break;
  case 'swipe':
    adb(['shell', 'input', 'swipe', px(rest[0]), px(rest[1]), px(rest[2]), px(rest[3]), rest[4] ?? '300']);
    break;
  case 'text':
    // 一次性 `input text` 会被 LÖVE 的文本框吞字、乱序（实测 TESTSEED → TESTDES），逐字送、每字隔一帧以上
    for (const ch of rest[0]) {
      adb(['shell', 'input', 'text', ch]);
      await new Promise((r) => setTimeout(r, 150));
    }
    break;
  case 'clear':
    for (let i = 0; i < Number(rest[0] ?? 8); i++) {
      adb(['shell', 'input', 'keyevent', 'KEYCODE_DEL']);
      await new Promise((r) => setTimeout(r, 100));
    }
    break;
  case 'key':
    adb(['shell', 'input', 'keyevent', `KEYCODE_${rest[0]}`]);
    break;
  default:
    console.error('用法见文件头注释');
    process.exit(2);
}
