/**
 * `splash.fs` 从 LÖVE 移植：主菜单（与开机 splash）背后那团旋涡烟（22 号票第四十七步）。
 *
 * 原文件：`参考/产物/Balatro_1.0.1o/资源/shaders/splash.fs`（52 行）
 * uniform 绑定：`源码/game.lua:1720`（主菜单：`vort_speed = 0.4`、`colour_1 = RED`、`colour_2 = BLUE`、`vort_offset = 0`，
 * `time` 读 `G.TIMERS.REAL_SHADER`，`mid_flash` 从 splash 进来时 1.6 → 0、4 秒缓完）。
 *
 * 原作画在一张 `Sprite(-30, -13, ROOM.w+60, ROOM.h+22)` 上，远大于屏幕，所以就是全屏；
 * 片元只用 `screen_coords` 与 `love_ScreenSize`，与 `background.ts` 一样拿 `outTexCoord·屏幕尺寸` 还原。
 */

export const SPLASH_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 outTexCoord;

uniform float time;
uniform float vort_speed;
uniform vec4 colour_1;
uniform vec4 colour_2;
uniform float mid_flash;
uniform float vort_offset;
uniform vec2 uScreenSize;

#define PIXEL_SIZE_FAC 700.0
#define BLACK 0.6*vec4(79./255.,99./255., 103./255., 1./0.6)

void main ()
{
    vec2 screen_coords = outTexCoord * uScreenSize;
    float pixel_size = length(uScreenSize.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * uScreenSize.xy) / length(uScreenSize.xy);
    float uv_len = length(uv);

    float speed = time * vort_speed;
    float new_pixel_angle = atan(uv.y, uv.x) + (2.2 + 0.4 * min(6.0, speed)) * uv_len - 1.0 - speed * 0.05 - min(6.0, speed) * speed * 0.02 + vort_offset;
    vec2 mid = (uScreenSize.xy / length(uScreenSize.xy)) / 2.0;
    vec2 sv = vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid;

    sv *= 30.0;
    speed = time * 6.0 * vort_speed + vort_offset + 1033.0;
    vec2 uv2 = vec2(sv.x + sv.y);

    for (int i = 0; i < 5; i++) {
        uv2 += sin(max(sv.x, sv.y)) + sv;
        sv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        sv -= 1.0 * cos(sv.x + sv.y) - 1.0 * sin(sv.x * 0.711 - sv.y);
    }

    float smoke_res = min(2.0, max(-2.0, 1.5 + length(sv) * 0.12 - 0.17 * (min(10.0, time * 1.2 - 4.0))));
    if (smoke_res < 0.2) {
        smoke_res = (smoke_res - 0.2) * 0.6 + 0.2;
    }

    float c1p = max(0.0, 1.0 - 2.0 * abs(1.0 - smoke_res));
    float c2p = max(0.0, 1.0 - 2.0 * (smoke_res));
    float cb = 1.0 - min(1.0, c1p + c2p);

    vec4 ret_col = colour_1 * c1p + colour_2 * c2p + vec4(cb * BLACK.rgb, cb * colour_1.a);
    float mod_flash = max(mid_flash * 0.8, max(c1p, c2p) * 5.0 - 4.4) + mid_flash * max(c1p, c2p);

    gl_FragColor = ret_col * (1.0 - mod_flash) + mod_flash * vec4(1.0, 1.0, 1.0, 1.0);
}
`;
