/**
 * 开机 splash 的两个 shader（22 号票第四十八步）。
 *
 * **`vortex.fs`**（`资源/shaders/vortex.fs`）只有顶点段：按离屏幕中心的距离把顶点绕中心转一个角，
 * `vortex_amt = G.TIMERS.REAL − G.vortex_time`（`sprite.lua:89`），越往后转得越狠、半径越小。
 * LÖVE 画精灵也只有 4 个顶点，所以效果就是四个角被拧——Phaser 的 quad 同样 4 个顶点，逐字照搬即可。
 * 片元段没写，LÖVE 用缺省的「纹理 × 颜色」，这里就是直接采样（纹理是预乘的，照原样输出）。
 * `inPosition` 是相机变换之后的屏幕像素（同 `dissolve` 的倾斜），`DPI` 恒 1（画布就是物理像素）。
 *
 * **`flash.fs`**：盖在最上面的白。`t > 2.5` 起屏幕中心冒一个白点慢慢长（`√(t−2.5) − 60·|uv|`），
 * `t > 11` 起按 `(t−11)² − 5·|uv|` 迅速铺满全屏。`mid_flash = 1`。
 */

export const VORTEX_VERT = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
uniform float vortex_amt;
uniform vec2 uScreenSize;
attribute vec2 inPosition;
attribute vec2 inTexCoord;
varying vec2 outTexCoord;

void main ()
{
    vec2 uv = (inPosition.xy - 0.5 * uScreenSize.xy) / length(uScreenSize.xy);

    float effectRadius = 1.6 - 0.05 * vortex_amt;
    float effectAngle = 0.5 + 0.15 * vortex_amt;

    float len = length(uv * vec2(uScreenSize.x / uScreenSize.y, 1.0));
    float angle = atan(uv.y, uv.x) + effectAngle * smoothstep(effectRadius, 0.0, len);
    float radius = length(uv);

    vec2 center = 0.5 * uScreenSize.xy / length(uScreenSize.xy);
    vec2 pos = vec2((radius * cos(angle) + center.x), (radius * sin(angle) + center.y)) * length(uScreenSize.xy);

    gl_Position = uProjectionMatrix * vec4(pos, 1.0, 1.0);
    outTexCoord = inTexCoord;
}
`;

export const VORTEX_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main ()
{
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
}
`;

export const FLASH_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 outTexCoord;

uniform float time;
uniform float mid_flash;
uniform vec2 uScreenSize;

#define PIXEL_SIZE_FAC 700.0

void main ()
{
    vec2 screen_coords = outTexCoord * uScreenSize;
    float pixel_size = length(uScreenSize.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * uScreenSize.xy) / length(uScreenSize.xy);

    float mid_white = min(1.0, (time > 2.5 ? max(0.0, sqrt(time - 2.5) - 60.0 * length(uv)) : 0.0)
        + (time > 11.0 ? max(0.0, (time - 11.0) * (time - 11.0) - 5.0 * length(uv)) : 0.0));

    float a = mid_flash * mid_white;
    gl_FragColor = vec4(a, a, a, a);
}
`;
