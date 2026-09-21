/**
 * `engine/text.lua` 的 `DynaText`：尺寸与逐字排布（22 号票）。**不 import Phaser**。
 *
 * 宽度是**逐字**量出来再相加的（`FONT:getWidth(c)`），所以与整串量的结果一样（这款字体没有字距），
 * 高度是 `getHeight × TEXT_HEIGHT_SCALE`。`maxw` 超了就按比例缩 `scale` 再量一遍。
 * 弹入（pop_in）、弹跳（bump）、漂浮（float）、旋转（rotate）这些动画参数先只记下来，绘制那边再用。
 */
import type { Colour } from './colours';
import { EN_FONT, type FontSpec, fontHeight, fontWidth } from './font';
import { TILESIZE, type Rect, type UIObject, luaToString, readRef } from './uibox';

/** `string` 里的一段：纯文字，或者绑定到某个表的某个字段 */
export type DynaPart =
    | string
    | { ref_table: object; ref_value: string; prefix?: string; suffix?: string; scale?: number; colour?: Colour }
    | { string: string; prefix?: string; suffix?: string; scale?: number; colour?: Colour };

export type DynaTextConfig = {
    string: DynaPart[];
    colours?: Colour[];
    scale?: number;
    shadow?: boolean;
    maxw?: number;
    spacing?: number;
    font?: FontSpec;
    rotate?: boolean | 2;
    float?: boolean;
    bump?: boolean;
    pop_in?: number;
    silent?: boolean;
};

export type DynaLetter = {
    char: string;
    /** 这个字占的宽高，**字体像素 × scale**（原作的 `letter.dims`） */
    dims: { x: number; y: number };
    partScale: number;
    /** 这一段自己的颜色（`text.lua:122` 的 `let_tab.colour`），盖过 `colours` 的轮换 */
    colour?: Colour;
};

export class DynaText implements UIObject {
    readonly T: Rect = { x: 0, y: 0, w: 0, h: 0 };
    scale: number;
    readonly font: FontSpec;
    /** 当前那一串（原作的 `strings[focused_string]`；多串轮播先不做，取第一串） */
    text = '';
    letters: DynaLetter[] = [];
    /** 尺寸变了，所在的 UIBox 要重排（原作的 `ui_object_updated`） */
    resized = false;

    constructor(readonly config: DynaTextConfig) {
        this.scale = config.scale ?? 1;
        this.font = config.font ?? EN_FONT;
        this.update(true);
        if (config.maxw !== undefined && this.T.w > config.maxw) {
            this.scale *= config.maxw / this.T.w;
            this.update(true);
        }
        this.resized = false;
    }

    /** 字的颜色按 `colours[k % #colours + 1]` 轮（1 起的下标，所以单色时恒是第一个） */
    get colours(): Colour[] {
        return this.config.colours ?? [[0.996, 0.373, 0.333, 1]];
    }

    /** `text.lua:68` 的 `update_text`，只取第一串。返回尺寸有没有变 */
    update(firstPass = false): boolean {
        const part = this.config.string[0];
        let str: string;
        let partScale = 1;
        let partColour: Colour | undefined;
        if (typeof part === 'string') str = part;
        else {
            const body = 'ref_table' in part ? luaToString(readRef(part.ref_table, part.ref_value)) : part.string;
            str = (part.prefix ?? '') + body + (part.suffix ?? '');
            partScale = part.scale ?? 1;
            partColour = part.colour;
        }
        if (!firstPass && str === this.text) return false;
        this.text = str;

        const fs = this.font.FONTSCALE;
        const spacing = this.config.spacing ?? 0;
        let w = 0;
        let h = 0;
        this.letters = [];
        for (const char of str) {
            // tx / (FONTSCALE*TILESCALE)：字体像素 × scale，再加 spacing 那一项
            const dx = fontWidth(char, this.font) * this.scale * partScale + 2.7 * spacing;
            const dy = fontHeight(this.font) * this.scale * partScale * this.font.TEXT_HEIGHT_SCALE;
            this.letters.push({ char, dims: { x: dx, y: dy }, partScale, colour: partColour });
            w += (dx * fs) / TILESIZE;
            h = Math.max(h, (dy * fs) / TILESIZE);
        }
        const changed = w !== this.T.w || h !== this.T.h;
        this.T.w = w;
        this.T.h = h;
        if (changed && !firstPass) this.resized = true;
        return changed;
    }
}
