/**
 * `dissolve.fs` 从 LÖVE 移植到 Phaser 4 的 `Shader` GameObject。
 *
 * 原文件：`参考/产物/Balatro_1.0.1o/资源/shaders/dissolve.fs`
 *
 * 方言对照（本次移植实际用到的）：
 *
 * | LÖVE | Phaser 4 / 原生 GLSL |
 * |---|---|
 * | `extern` | `uniform` |
 * | `number` | `float` |
 * | `Image` | `sampler2D` |
 * | `Texel(tex, uv)` | `texture2D(tex, uv)` |
 * | `effect(colour, tex, texture_coords, screen_coords)` | `fragmentProcess` 钩子，写 `fragColor` |
 * | `position(transform_projection, vertex_position)` | `vertexProcess` 钩子，改 `gl_Position` |
 * | `love_ScreenSize` | 自己传的 `uScreenSize` uniform |
 * | `MY_HIGHP_OR_MEDIUMP` | 模板已声明 precision，整段去掉 |
 *
 * **关于 `#pragma phaserTemplate`（本次 spike 实测纠正的一条）**：
 * 它不是给用户着色器分节用的。`ShaderQuad._completeConfig` 里
 * `config.vertexSource` 是**整体替换**默认模板，那些 pragma 属于
 * 「shader additions」的组合机制。所以自定义着色器要自己写完整程序，
 * 只需遵守默认模板的接口契约：
 * `uniform mat4 uProjectionMatrix` / `attribute vec2 inPosition` /
 * `attribute vec2 inTexCoord` / `varying vec2 outTexCoord`。
 *
 * 纹理 sampler 名字随便取，但要在 `setupUniforms` 里
 * `setUniform('uMainSampler', 0)` 绑到纹理单元。
 */

/** 逐字保留原作的 `dissolve_mask`，只做方言替换。 */
const DISSOLVE_MASK = /* glsl */ `
vec4 dissolve_mask(vec4 tex, vec2 texture_coords, vec2 uv)
{
    if (dissolve < 0.001) {
        return vec4(shadow ? vec3(0.0, 0.0, 0.0) : tex.xyz, shadow ? tex.a * 0.3 : tex.a);
    }

    float adjusted_dissolve = (dissolve * dissolve * (3.0 - 2.0 * dissolve)) * 1.02 - 0.01;

    float t = time * 10.0 + 2003.0;
    vec2 floored_uv = (floor((uv * texture_details.ba))) / max(texture_details.b, texture_details.a);
    vec2 uv_scaled_centered = (floored_uv - 0.5) * 2.3 * max(texture_details.b, texture_details.a);

    vec2 field_part1 = uv_scaled_centered + 50.0 * vec2(sin(-t / 143.6340), cos(-t / 99.4324));
    vec2 field_part2 = uv_scaled_centered + 50.0 * vec2(cos( t / 53.1532),  cos( t / 61.4532));
    vec2 field_part3 = uv_scaled_centered + 50.0 * vec2(sin(-t / 87.53218), sin(-t / 49.0000));

    float field = (1.0 + (
        cos(length(field_part1) / 19.483) + sin(length(field_part2) / 33.155) * cos(field_part2.y / 15.73) +
        cos(length(field_part3) / 27.193) * sin(field_part3.x / 21.92) )) / 2.0;
    vec2 borders = vec2(0.2, 0.8);

    float res = (0.5 + 0.5 * cos((adjusted_dissolve) / 82.612 + (field + -0.5) * 3.14))
    - (floored_uv.x > borders.y ? (floored_uv.x - borders.y) * (5.0 + 5.0 * dissolve) : 0.0) * (dissolve)
    - (floored_uv.y > borders.y ? (floored_uv.y - borders.y) * (5.0 + 5.0 * dissolve) : 0.0) * (dissolve)
    - (floored_uv.x < borders.x ? (borders.x - floored_uv.x) * (5.0 + 5.0 * dissolve) : 0.0) * (dissolve)
    - (floored_uv.y < borders.x ? (borders.x - floored_uv.y) * (5.0 + 5.0 * dissolve) : 0.0) * (dissolve);

    if (tex.a > 0.01 && burn_colour_1.a > 0.01 && !shadow && res < adjusted_dissolve + 0.8 * (0.5 - abs(adjusted_dissolve - 0.5)) && res > adjusted_dissolve) {
        if (!shadow && res < adjusted_dissolve + 0.5 * (0.5 - abs(adjusted_dissolve - 0.5)) && res > adjusted_dissolve) {
            tex.rgba = burn_colour_1.rgba;
        } else if (burn_colour_2.a > 0.01) {
            tex.rgba = burn_colour_2.rgba;
        }
    }

    return vec4(shadow ? vec3(0.0, 0.0, 0.0) : tex.xyz, res > adjusted_dissolve ? (shadow ? tex.a * 0.3 : tex.a) : 0.0);
}
`;

export const DISSOLVE_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;
uniform float dissolve;
uniform float time;
uniform vec4 texture_details;
uniform vec2 image_details;
uniform bool shadow;
uniform vec4 burn_colour_1;
uniform vec4 burn_colour_2;
// 调试用：每个实例一个可辨识的颜色，用来断言 uniform 真的逐实例独立。
// 不属于原作，spike 专用。
uniform vec3 uProbe;
uniform float uProbePatch;

${DISSOLVE_MASK}

void main ()
{
    vec4 fragColor;
    vec2 texture_coords = outTexCoord;
    // Phaser 的纹理是预乘 alpha：还原成非预乘按原文算，出口再乘回去（见 editions 生成器的同一段）
    vec4 tex = texture2D(uMainSampler, texture_coords);
    if (tex.a > 0.0) tex.rgb /= tex.a;
    vec2 uv = (((texture_coords) * (image_details)) - texture_details.xy * texture_details.ba) / texture_details.ba;

    if (!shadow && dissolve > 0.01) {
        if (burn_colour_2.a > 0.01) {
            tex.rgb = tex.rgb * (1.0 - 0.6 * dissolve) + 0.6 * burn_colour_2.rgb * dissolve;
        } else if (burn_colour_1.a > 0.01) {
            tex.rgb = tex.rgb * (1.0 - 0.6 * dissolve) + 0.6 * burn_colour_1.rgb * dissolve;
        }
    }

    fragColor = dissolve_mask(tex, texture_coords, uv);

    // 左上角一小块画成 uProbe，供 readPixels 断言逐实例隔离
    if (uProbePatch > 0.5 && texture_coords.x < 0.25 && texture_coords.y < 0.25) {
        fragColor = vec4(uProbe, 1.0);
    }

    gl_FragColor = vec4(fragColor.rgb * fragColor.a, fragColor.a);
}
`;

export const DISSOLVE_VERT = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
attribute vec2 inPosition;
attribute vec2 inTexCoord;
varying vec2 outTexCoord;

uniform vec2 mouse_screen_pos;
uniform float hovering;
uniform float screen_scale;
uniform vec2 uScreenSize;

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);
    outTexCoord = inTexCoord;

    // 原作 position() 的移植。原文：
    //   return transform_projection * vertex_position + vec4(0,0,0,scale);
    // 这里就地加到 w 上，等价。
    //
    // 坐标空间：原作把 vertex_position.xy 直接与 love_ScreenSize、mouse_screen_pos
    // 相减——那是屏幕尺度的量，而 vertex_position 是局部量，本身不自洽，
    // 是手调出来的。Phaser 的 inPosition 是经相机变换前的世界坐标，
    // 量纲与原作的 vertex_position 不同，所以 scale 的绝对值必然要重新标定；
    // 这里先原样搬，看跑出来什么样，再决定标定系数。
    if (hovering > 0.0) {
        float mid_dist = length(inPosition.xy - 0.5 * uScreenSize.xy) / length(uScreenSize.xy);
        vec2 mouse_offset = (inPosition.xy - mouse_screen_pos.xy) / screen_scale;
        float scale = 0.2 * (-0.03 - 0.3 * max(0.0, 0.3 - mid_dist))
            * hovering * (length(mouse_offset) * length(mouse_offset)) / (2.0 - mid_dist);

        gl_Position.w += scale;
    }
}
`;
