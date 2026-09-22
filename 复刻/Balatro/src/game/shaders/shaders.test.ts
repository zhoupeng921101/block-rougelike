/// <reference types="node" />
/**
 * 所有 shader 都按 WebGL 1（GLSL ES 1.00）编译一遍。
 *
 * 本机截不到图（见 README），表现层的改动在会话里几乎没法自动验。
 * 但 shader 有一类错是可以离线抓的：**编译不过**——那在浏览器里就是整张卡不画、控制台一行红字。
 * 最常见的来源是 LÖVE 的桌面 GLSL 会做、GLSL ES 1.0 不做的隐式 int → float。
 *
 * 用 Khronos 的 `glslangValidator`（devDependency 里带预编译的二进制）。
 * `dissolve` / `background` / `CRT` 是在浏览器里实测跑通过的，当对照组：它们过了，说明校验口径对。
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { BACKGROUND_FRAG, BACKGROUND_VERT } from './background';
import { CRT_FRAG, CRT_VERT } from './crt';
import { DISSOLVE_FRAG, DISSOLVE_VERT } from './dissolve';
import { OVERLAY_FRAGS } from './editions.generated';
import { FLAME_FRAG } from './flame';
import { SPLASH_FRAG } from './splash';

const BIN = join(
    process.cwd(),
    'node_modules/glslang-validator-prebuilt-predownloaded/bin',
    process.platform === 'win32' ? 'glslangValidator.exe' : `glslangValidator.${process.platform === 'darwin' ? 'darwin' : 'linux'}`,
);
const DIR = mkdtempSync(join(tmpdir(), 'balatro-glsl-'));

/** 编译一段源码，返回错误输出；过了就是空串 */
function compile(name: string, stage: 'vert' | 'frag', source: string): string {
    const file = join(DIR, `${name}.${stage}`);
    writeFileSync(file, `#version 100\n${source}`);
    try {
        execFileSync(BIN, [file], { encoding: 'utf8' });
        return '';
    } catch (e) {
        return String((e as { stdout?: string }).stdout ?? e);
    }
}

describe('shader 按 GLSL ES 1.00 编译', () => {
    const cases: Array<[string, 'vert' | 'frag', string]> = [
        ['dissolve', 'frag', DISSOLVE_FRAG],
        ['dissolve', 'vert', DISSOLVE_VERT],
        ['background', 'frag', BACKGROUND_FRAG],
        ['background', 'vert', BACKGROUND_VERT],
        ['crt', 'frag', CRT_FRAG],
        ['crt', 'vert', CRT_VERT],
        ['flame', 'frag', FLAME_FRAG],
        ['splash', 'frag', SPLASH_FRAG],
        ...Object.entries(OVERLAY_FRAGS).map(([n, src]) => [n, 'frag', src] as [string, 'frag', string]),
    ];

    for (const [name, stage, source] of cases) {
        it(`${name}.${stage}`, () => {
            expect(compile(name, stage, source)).toBe('');
        });
    }
});
