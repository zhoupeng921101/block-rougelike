/**
 * `CRT.fs` 从 LÖVE 移植到 Phaser 4 的全屏 `Shader` GameObject。
 *
 * 原文件：`参考/产物/Balatro_1.0.1o/资源/shaders/CRT.fs`（153 行，19 个 shader 里最大的）
 * 调用处：`源码/game.lua:3293-3301`
 *
 * **剥掉了两段死码**（原作就把它们写死为 0，不是我们的简化）：
 *
 * - `bloom_fac` —— `game.lua:3296` 硬编码 `send('bloom_fac', 0)`。
 *   整个 7×7 = 49 次采样的 bloom 循环永不执行。
 * - `glitch_intensity` —— `game.lua:3300` 硬编码 0，真值那行还被注释掉了
 *   （`--0.1*G.SETTINGS.GRAPHICS.crt/100 + ...`）。
 *   于是 `offset_l` / `offset_r` 恒为 0，`artifact_amplifier` 恒为 1。
 *
 * 剥掉之后代数化简：凡是 `artifact_amplifier` 出现的地方都代入 1，
 * `bloom_fac` 出现的地方都代入 0。**这是等价变换，不是近似。**
 *
 * 另：`noise_fac` 在原作里整段被注释掉，也没搬。
 */

export const CRT_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;

uniform float time;
uniform vec2 distortion_fac;
uniform vec2 scale_fac;
uniform float feather_fac;
uniform float crt_intensity;
uniform float scanlines;
/** 原作的 love_ScreenSize，只用到 .x（色散的像素补偿） */
uniform vec2 uScreenSize;

#define BUFF 0.01

void main ()
{
    vec2 tc = outTexCoord;

    // 重新居中
    tc = tc * 2.0 - vec2(1.0);
    tc *= scale_fac;

    // 从中心向外鼓
    tc += (tc.yx * tc.yx) * tc * (distortion_fac - 1.0);

    // 边缘平滑过渡到黑。原注释：没有 buffer 的话这里会很怪
    float mask = (1.0 - smoothstep(1.0 - feather_fac, 1.0, abs(tc.x) - BUFF))
               * (1.0 - smoothstep(1.0 - feather_fac, 1.0, abs(tc.y) - BUFF));

    // 撤销居中
    tc = (tc + vec2(1.0)) / 2.0;

    vec4 crt_tex = texture2D(uMainSampler, tc);

    // artifact_amplifier 在原作里恒为 1（glitch 已死），此处直接代入
    float crt_amout_adjusted = max(0.0, crt_intensity / (0.16 * 0.3));

    // 水平色散
    if (crt_amout_adjusted > 0.0000001) {
        float d = 0.0005 * 1600.0 / uScreenSize.x;
        crt_tex.r = crt_tex.r * (1.0 - crt_amout_adjusted)
                  + crt_amout_adjusted * texture2D(uMainSampler, tc + vec2( d, 0.0)).r;
        crt_tex.g = crt_tex.g * (1.0 - crt_amout_adjusted)
                  + crt_amout_adjusted * texture2D(uMainSampler, tc + vec2(-d, 0.0)).g;
    }

    vec3 rgb_result = crt_tex.rgb * (1.0 - crt_intensity);

    // 扫描线遮罩。原注释：这些像素并不真的参与成像，直接拿来渲染会太硬
    vec3 rgb_scanline = vec3(
        clamp(-0.3 + 2.0 * sin(tc.y * scanlines - 3.14 / 4.0) - 0.8 * clamp(sin(tc.x * scanlines * 4.0), 0.4, 1.0), -1.0, 2.0),
        clamp(-0.3 + 2.0 * cos(tc.y * scanlines)             - 0.8 * clamp(cos(tc.x * scanlines * 4.0), 0.0, 1.0), -1.0, 2.0),
        clamp(-0.3 + 2.0 * cos(tc.y * scanlines - 3.14 / 3.0) - 0.8 * clamp(cos(tc.x * scanlines * 4.0 - 3.14 / 4.0), 0.0, 1.0), -1.0, 2.0));

    rgb_result += crt_tex.rgb * rgb_scanline * crt_intensity;

    // 对比度与亮度校正。bloom_fac = 0 已代入
    rgb_result -= vec3(0.55 - 0.02 * (-crt_amout_adjusted * 0.0));
    rgb_result = rgb_result * (1.0 + 0.14 + crt_amout_adjusted * 0.012);
    rgb_result += vec3(0.5);

    gl_FragColor = vec4(rgb_result * mask, 1.0);
}
`;

export const CRT_VERT = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
attribute vec2 inPosition;
attribute vec2 inTexCoord;
varying vec2 outTexCoord;

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);
    outTexCoord = inTexCoord;
}
`;

/**
 * `game.lua:3293-3301` 的 uniform 取值。
 *
 * `crt` 是 `G.SETTINGS.GRAPHICS.crt`：**移动版 30，桌面版 70**
 * （`globals.lua:231`）。按 [12 号票](../../../.scratch/balatro-复刻/issues/12-外观基准是移动版还是桌面版.md)
 * 的裁定，复刻件取桌面值 70。
 */
export function crtUniforms(crt: number, screenW: number, screenH: number, timeSeconds: number) {
    return {
        distortion_fac: [1.0 + 0.07 * crt / 100, 1.0 + 0.1 * crt / 100] as [number, number],
        scale_fac: [1.0 - 0.008 * crt / 100, 1.0 - 0.008 * crt / 100] as [number, number],
        feather_fac: 0.01,
        crt_intensity: 0.16 * crt / 100,
        // game.lua:3301 是 G.CANVAS:getPixelHeight()*0.75/G.CANV_SCALE
        scanlines: screenH * 0.75,
        time: 400 + timeSeconds,
        uScreenSize: [screenW, screenH] as [number, number],
    };
}
