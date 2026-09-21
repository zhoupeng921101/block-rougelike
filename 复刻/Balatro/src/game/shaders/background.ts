/**
 * `background.fs` 从 LÖVE 移植到 Phaser 4 的全屏 `Shader` GameObject。
 *
 * 原文件：`参考/产物/Balatro_1.0.1o/资源/shaders/background.fs`（51 行）
 * uniform 绑定：`源码/game.lua:2499-2509`
 *
 * **这不只是好看。** `CRT.fs` 的亮度校正（`-0.55` 再 `+0.5`）是按这张
 * 明亮的动态背景调的；没有它，CRT 会把纯色底上的白卡推成一片死白。
 * 14 号票里记过这条，这里把根治办法做掉。
 */

export const BACKGROUND_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 outTexCoord;

uniform float time;
uniform float spin_time;
uniform vec4 colour_1;
uniform vec4 colour_2;
uniform vec4 colour_3;
uniform float contrast;
uniform float spin_amount;
/** 原作的 love_ScreenSize */
uniform vec2 uScreenSize;

#define PIXEL_SIZE_FAC 700.0
#define SPIN_EASE 0.5

void main ()
{
    // 原作用的是 screen_coords（像素），Phaser 只给归一化的 outTexCoord，
    // 乘回屏幕尺寸即等价
    vec2 screen_coords = outTexCoord * uScreenSize;

    float pixel_size = length(uScreenSize.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * uScreenSize.xy)
            / length(uScreenSize.xy) - vec2(0.12, 0.0);
    float uv_len = length(uv);

    float speed = (spin_time * SPIN_EASE * 0.2) + 302.2;
    float new_pixel_angle = atan(uv.y, uv.x) + speed
        - SPIN_EASE * 20.0 * (1.0 * spin_amount * uv_len + (1.0 - 1.0 * spin_amount));
    vec2 mid = (uScreenSize.xy / length(uScreenSize.xy)) / 2.0;
    uv = vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid;

    uv *= 30.0;
    speed = time * 2.0;
    vec2 uv2 = vec2(uv.x + uv.y);

    for (int i = 0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    float contrast_mod = (0.25 * contrast + 0.5 * spin_amount + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);

    gl_FragColor = (0.3 / contrast) * colour_1
        + (1.0 - 0.3 / contrast) * (colour_1 * c1p + colour_2 * c2p + vec4(c3p * colour_3.rgb, c3p * colour_1.a));
}
`;

export const BACKGROUND_VERT = /* glsl */ `
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

// 背景的三个颜色与对比度不是常量：盲注、Boss、开包各不相同，
// 由 `ui/blind-colour.ts` 的 `backgroundFor`（`ease_background_colour_blind` 直译）算，场景每帧喂进来。
// shader 的绑定顺序见 `game.lua:2504-2506`：`colour_1 = C`、`colour_2 = L`、`colour_3 = D`。
