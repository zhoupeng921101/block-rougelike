/**
 * 把原作的 7 个「叠加层」shader 从 LÖVE 方言转成 WebGL 1（GLSL ES 1.0）的片元着色器。
 *
 *     node tools/gen-edition-shaders.mjs
 *
 * 为什么不手抄：7 个文件的头部、`dissolve_mask`、`hue / RGB / HSL` 几乎一样，只有 `effect()` 不同，
 * 手抄 7 份迟早有一份和原文漂开。它们的顶点部分（`#ifdef VERTEX` 起）**逐字节相同**，
 * 也与 `dissolve.fs` 的相同，所以不生成——共用 `shaders/dissolve.ts` 的 `DISSOLVE_VERT`。
 *
 * 方言替换（与 `dissolve.ts` 头部那张表同一套）：
 *
 * | LÖVE | GLSL ES |
 * |---|---|
 * | `extern` | `uniform` |
 * | `number` | `float` |
 * | `MY_HIGHP_OR_MEDIUMP` 与它的 `#if` 定义块 | 删掉，由统一的 `precision` 声明代替 |
 * | `effect(colour, Image texture, texture_coords, screen_coords)` | `effect(colour, texture_coords)`，`main` 里调 |
 * | `Texel(texture, uv)` | `texture2D(uMainSampler, uv)` |
 *
 * 片元里还有三个只给顶点用的 `extern`（`mouse_screen_pos` / `hovering` / `screen_scale`），整段切掉：
 * WebGL 1 要求两个阶段同名 uniform 的精度一致，顶点默认 highp、片元可能是 mediump，留着会链接失败。
 *
 * **整数字面量断言**：LÖVE 在桌面上用的 GLSL 会把 `2*x` 里的 2 隐式转成浮点，GLSL ES 1.0 不会、直接编译失败。
 * 现在的 7 个文件只有 `tex[3]` 这种下标，生成器见到别的就抛——本机截不到图，编译错误只能靠这里先拦。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/资源/shaders');
const OUT = resolve(HERE, '../src/game/shaders/editions.generated.ts');

const NAMES = ['holo', 'foil', 'polychrome', 'negative', 'negative_shine', 'voucher', 'booster'];

function convert(name) {
    const src = readFileSync(resolve(SRC, `${name}.fs`), 'utf8').replace(/\r\n/g, '\n');

    // 顶点部分之前、那三个顶点 extern 之前截断
    const cut = src.indexOf('extern MY_HIGHP_OR_MEDIUMP vec2 mouse_screen_pos;');
    if (cut < 0) throw new Error(`${name}.fs：找不到顶点 extern 的起点`);
    let body = src.slice(0, cut);

    // 精度宏的定义块
    body = body.replace(/#if defined\(VERTEX\)[\s\S]*?#endif\n/, '');
    if (body.includes('#')) throw new Error(`${name}.fs：还有别的预处理指令，转换规则没覆盖`);

    body = body
        .replace(/MY_HIGHP_OR_MEDIUMP\s+/g, '')
        .replace(/\bextern\b/g, 'uniform')
        .replace(/\bnumber\b/g, 'float')
        .replace(
            /vec4 effect\(\s*vec4 colour,\s*Image texture,\s*vec2 texture_coords,\s*vec2 screen_coords\s*\)/,
            'vec4 effect(vec4 colour, vec2 texture_coords)',
        )
        .replace(/Texel\(\s*texture\s*,/g, 'texel_straight(');

    for (const bad of ['Image', 'Texel', 'screen_coords', 'extern', 'love_']) {
        if (body.includes(bad)) throw new Error(`${name}.fs：转换后还剩 \`${bad}\``);
    }
    if (!body.includes('vec4 effect(vec4 colour, vec2 texture_coords)')) {
        throw new Error(`${name}.fs：effect 的签名和预期不一样`);
    }

    // 整数字面量：去掉注释与 `[n]` 下标之后，不能再有不带小数点的数字
    const code = body.replace(/\/\/.*$/gm, '').replace(/\[\d+\]/g, '[_]');
    const ints = code.match(/(?<![\w.])\d+(?![\w.])/g);
    if (ints) throw new Error(`${name}.fs：有整数字面量 ${[...new Set(ints)].join(', ')}，GLSL ES 1.0 不会隐式转浮点`);

    return `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;

// Phaser 上传的纹理是预乘 alpha、混合也按预乘（ONE, ONE_MINUS_SRC_ALPHA），原作 LÖVE 是非预乘。
// 采样时还原成非预乘、按原文算，出口再乘回去——否则叠加层在透明像素上加的颜色会整块发亮
vec4 texel_straight(vec2 uv)
{
    vec4 t = texture2D(uMainSampler, uv);
    if (t.a > 0.0) t.rgb /= t.a;
    return t;
}

${body.trim()}

void main ()
{
    vec4 c = effect(vec4(1.0), outTexCoord);
    gl_FragColor = vec4(c.rgb * c.a, c.a);
}
`;
}

const entries = NAMES.map((n) => `    ${n}: /* glsl */ \`\n${convert(n)}\`,`).join('\n');

writeFileSync(
    OUT,
    `/**
 * 7 个叠加层 shader 的片元部分。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-edition-shaders.mjs\` 然后重跑 \`node tools/gen-edition-shaders.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/资源/shaders/<name>.fs\`。顶点部分共用 \`DISSOLVE_VERT\`（见生成器头注释）。
 */

export type OverlayShader = ${NAMES.map((n) => `'${n}'`).join(' | ')};

export const OVERLAY_FRAGS: Record<OverlayShader, string> = {
${entries}
};
`,
    'utf8',
);

console.log(`写出 ${NAMES.length} 个 shader → ${OUT}`);
