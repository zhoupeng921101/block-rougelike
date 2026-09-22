/**
 * `engine/text.lua` 的 `DynaText`：尺寸与逐字排布（22 号票）。**不 import Phaser**。
 *
 * 宽度是**逐字**量出来再相加的（`FONT:getWidth(c)`），所以与整串量的结果一样（这款字体没有字距），
 * 高度是 `getHeight × TEXT_HEIGHT_SCALE`。`maxw` 超了就按比例缩 `scale` 再量一遍。
 * 弹入（pop_in）的进度在这里算（`align_letters` 那一支，`popStep`），弹跳 / 漂浮 / 旋转由绘制那边按时间算。
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
    /** `text.lua:11`：弹跳的频率与幅度（缺省 2.666 / 1） */
    bump_rate?: number;
    bump_amount?: number;
    /** `text.lua:46`：整串绕自己中心转（`T.r`），弧度。SKIPPED 戳是 −0.35 */
    text_rot?: number;
    /** `text.lua:24`：建好后隔多少秒开始逐字弹入（缺省不弹，字一出现就是满的） */
    pop_in?: number;
    /** 每秒弹 `#string·pop_in_rate` 个字（缺省 3） */
    pop_in_rate?: number;
    /** 字变了也重新弹一遍（缺省只在建好时弹） */
    reset_pop_in?: boolean;
    /** 弹字音效的音高偏移 */
    pitch_shift?: number;
    /** 多串轮播：一串弹满之后停多少秒再缩回（缺省 1.5） */
    pop_delay?: number;
    /** 轮播随机挑下一串（Misprint） */
    random_element?: boolean;
    /** `min_cycle_time`：缩回的时长系数；0 表示字恒为满（Misprint） */
    min_cycle_time?: number;
    /** 绘制时整串再挪多少（字体像素，`text.lua:17` 的 `text_offset`），不进布局 */
    x_offset?: number;
    y_offset?: number;
    silent?: boolean;
};

export type DynaLetter = {
    char: string;
    /** 这个字占的宽高，**字体像素 × scale**（原作的 `letter.dims`） */
    dims: { x: number; y: number };
    partScale: number;
    /** 这一段自己的颜色（`text.lua:122` 的 `let_tab.colour`），盖过 `colours` 的轮换 */
    colour?: Colour;
    /** `letter.pop_in`：0 → 1，绘制时字按它缩放（先平方再用） */
    popIn: number;
};

/** 一串（`self.strings[k]`）：它自己的字、宽高 */
type DynaString = { text: string; letters: DynaLetter[]; W: number; H: number };

export class DynaText implements UIObject {
    readonly T: Rect = { x: 0, y: 0, w: 0, h: 0 };
    scale: number;
    readonly font: FontSpec;
    /** 当前那一串（`strings[focused_string]`）的字与逐字排布 */
    text = '';
    letters: DynaLetter[] = [];
    /** 尺寸变了，所在的 UIBox 要重排（原作的 `ui_object_updated`） */
    resized = false;

    /** `self.strings`：`config.string` 的每一项各是一串，多于一串时轮播（`pop_out` → `pop_cycle` → 下一串弹入） */
    private strings: DynaString[] = [];
    private focused = 0;

    /**
     * `self.config.pop_in`：弹入进行中时是开始前的延迟，弹完置空。
     * 原作直接改 config，这里另存一份，免得定义表被共享时互相影响
     */
    popDelay: number | undefined;
    /** `created_time`：弹入的计时起点。原作是建对象那一刻；复刻件在第一次 `popStep` 时定（同一帧） */
    createdTime: number | null = null;
    /** `start_pop_in` / `reset_pop_in`：下一次 `update` 换字时要不要重新弹 */
    private resetPopIn = false;
    /** `self.config.pop_out`（缩回的速度）与 `pop_out_time`；`pop_out_time` 为 null 时在下一次 `popStep` 定 */
    private popOut: number | undefined;
    private popOutTime: number | null = null;
    /** `self.pop_delay`：`pop_out` 的起点比现在晚多少秒 */
    private popDelayOut = 0;
    private popCycle = false;

    constructor(readonly config: DynaTextConfig) {
        this.scale = config.scale ?? 1;
        this.font = config.font ?? EN_FONT;
        this.popDelay = config.pop_in;
        this.resetPopIn = config.pop_in !== undefined;
        this.update(true);
        if (config.maxw !== undefined && this.T.w > config.maxw) {
            this.resetPopIn = config.pop_in !== undefined;
            this.scale *= config.maxw / this.T.w;
            this.update(true);
        }
        this.resized = false;
        // `text.lua:39`：多于一串，建好就开始轮播——`pop_delay`（缺省 1.5）秒后第一串缩回去
        if (this.strings.length > 1) {
            this.popDelayOut = config.pop_delay ?? 1.5;
            this.startPopOut(4);
        }
    }

    /** 字的颜色按 `colours[k % #colours + 1]` 轮（1 起的下标，所以单色时恒是第一个） */
    get colours(): Colour[] {
        return this.config.colours ?? [[0.996, 0.373, 0.333, 1]];
    }

    /** 当前串在整个 DynaText 里的偏移（tile）：`W_offset = ½(W − 串宽)`、`H_offset = ½(H − 串高)` */
    get offset(): { x: number; y: number } {
        const s = this.strings[this.focused];
        return s ? { x: 0.5 * (this.T.w - s.W), y: 0.5 * (this.T.h - s.H) } : { x: 0, y: 0 };
    }

    /** `text.lua:68` 的 `update_text`：每一串按需重量，整体宽高取各串最大。返回尺寸有没有变 */
    update(firstPass = false): boolean {
        let anyChanged = false;
        this.config.string.forEach((part, k) => {
            const isRef = typeof part !== 'string' && 'ref_table' in part;
            if (!isRef && !firstPass) return;
            let str: string;
            let partScale = 1;
            let partColour: Colour | undefined;
            if (typeof part === 'string') str = part;
            else {
                const body = 'ref_table' in part ? luaToString(readRef(part.ref_table, part.ref_value)) : part.string;
                str = (part.prefix ?? '') + body + (part.suffix ?? '');
                partScale = part.scale ?? 1;
                // `text.lua:87`：段自己的颜色只在头一遍读
                partColour = firstPass ? part.colour : this.strings[k]?.letters[0]?.colour;
            }
            const prev = this.strings[k];
            if (!firstPass && prev && str === prev.text) return;
            anyChanged = true;
            // `text.lua:95`：建好时（`start_pop_in`）或配了 `reset_pop_in` 才重新弹，否则字一换就是满的
            const reset = this.resetPopIn || !!this.config.reset_pop_in;
            if (!reset) {
                this.popDelay = undefined;
                this.popOut = undefined;
            } else {
                this.popDelay ??= 0;
                this.createdTime = null;
            }
            const old = prev?.letters ?? [];
            const fs = this.font.FONTSCALE;
            const spacing = this.config.spacing ?? 0;
            let w = 0;
            let h = 0;
            const letters: DynaLetter[] = [];
            for (const char of str) {
                // tx / (FONTSCALE*TILESCALE)：字体像素 × scale，再加 spacing 那一项
                const dx = fontWidth(char, this.font) * this.scale * partScale + 2.7 * spacing;
                const dy = fontHeight(this.font) * this.scale * partScale * this.font.TEXT_HEIGHT_SCALE;
                // `text.lua:119`：头一遍沿用旧字的进度（maxw 缩过再量一遍），没有就看配没配 pop_in；之后换字恒为满。
                // 第二串起一律从 0 开始（轮到它时再弹）
                let popIn = firstPass ? (old[letters.length]?.popIn ?? (this.popDelay !== undefined ? 0 : 1)) : 1;
                if (k > 0) popIn = 0;
                letters.push({ char, dims: { x: dx, y: dy }, partScale, colour: partColour, popIn });
                w += (dx * fs) / TILESIZE;
                h = Math.max(h, (dy * fs) / TILESIZE);
            }
            this.strings[k] = { text: str, letters, W: w, H: h };
        });
        this.resetPopIn = false;
        if (!anyChanged && !firstPass) return false;
        const cur = this.strings[this.focused]!;
        this.text = cur.text;
        this.letters = cur.letters;
        const w = Math.max(...this.strings.map((s) => s.W));
        const h = Math.max(...this.strings.map((s) => s.H));
        const changed = w !== this.T.w || h !== this.T.h;
        this.T.w = w;
        this.T.h = h;
        if (changed && !firstPass) this.resized = true;
        return changed;
    }

    /** `DynaText:pop_out`：`pop_delay` 秒后开始按 `rate` 缩回去（起点在下一次 `popStep` 定） */
    startPopOut(rate: number): void {
        this.popOut = rate;
        this.popOutTime = null;
    }

    /**
     * `text.lua:174` 的 `align_letters` 里 pop 那几支：
     * - 轮播到下一串（`pop_cycle`）：那一串的字清零，0.1 秒后开始弹入
     * - 缩回（`pop_out`）：`(min_cycle − (now − pop_out_time)·pop_out/min_cycle)²`，最后一个字缩没了就轮到下一串
     * - 弹入：第 k 个字 `((now − pop_in − created)·#string·rate − k + 1)²`，夹 [0, 1]；最后一个字满了——
     *   单串就停（`config.pop_in = nil`），多串则隔 `pop_delay` 秒再缩回去
     * 返回这一帧**刚冒头**的字要放的 `paper1` 音高（`silent` 时为空；超过 10 个字的只有偶数位出声）
     */
    popStep(now: number, random: () => number = Math.random): number[] {
        this.createdTime ??= now;
        if (this.popOut !== undefined && this.popOutTime === null) this.popOutTime = now + this.popDelayOut;
        if (this.popCycle) {
            this.focused = this.config.random_element
                ? Math.floor(random() * this.strings.length)
                : (this.focused + 1) % this.strings.length;
            this.popCycle = false;
            const cur = this.strings[this.focused]!;
            for (const l of cur.letters) l.popIn = 0;
            this.text = cur.text;
            this.letters = cur.letters;
            this.popDelay = 0.1;
            this.popOut = undefined;
            this.createdTime = now;
        }
        const n = this.text.length;
        const letters = this.letters;
        const sounds: number[] = [];
        const mct = this.config.min_cycle_time ?? 1;
        if (this.popOut !== undefined) {
            const out = this.popOut;
            const t0 = this.popOutTime!;
            letters.forEach((letter, k0) => {
                const p = Math.min(1, Math.max(mct - ((now - t0) * out) / mct, 0));
                letter.popIn = p * p;
                if (k0 === letters.length - 1 && letter.popIn <= 0 && this.strings.length > 1) this.popCycle = true;
            });
            return sounds;
        }
        const delay = this.popDelay;
        if (delay === undefined) return sounds;
        const rate = this.config.pop_in_rate ?? 3;
        const floor = this.config.min_cycle_time === 0 ? 1 : 0;
        const created = this.createdTime;
        let finished = letters.length === 0;
        letters.forEach((letter, k0) => {
            const k = k0 + 1;
            const prev = letter.popIn;
            const p = Math.min(1, Math.max((now - delay - created) * n * rate - k + 1, floor));
            letter.popIn = p * p;
            if (prev <= 0 && letter.popIn > 0 && !this.config.silent && (n < 10 || k % 2 === 0)) {
                sounds.push(0.45 + 0.05 * random() + (0.3 / n) * k + (this.config.pitch_shift ?? 0));
            }
            if (k === letters.length && letter.popIn >= 1) finished = true;
        });
        if (finished) {
            if (this.strings.length > 1) {
                // `text.lua:209`：`pop_delay = now − pop_in − created + (config.pop_delay or 1.5)`，再 `pop_out(4)`
                this.popDelayOut = now - delay - created + (this.config.pop_delay ?? 1.5);
                this.popOut = 4;
                this.popOutTime = now + this.popDelayOut;
            } else this.popDelay = undefined;
        }
        return sounds;
    }

    /** `DynaText:pop_in`：从头再弹一遍 */
    popIn(delay = 0): void {
        this.popDelay = delay;
        this.popOut = undefined;
        this.createdTime = null;
        for (const l of this.letters) l.popIn = 0;
    }

    /**
     * 复刻件会把同一块界面整个重建（买卖、重掷之后的商店），原作那个 DynaText 是同一个对象、不会再弹一遍。
     * 新建的这个接过旧的进度（字一样才接）
     */
    inheritPop(from: DynaText): void {
        if (from.text !== this.text || from.strings.length !== this.strings.length) return;
        this.popDelay = from.popDelay;
        this.createdTime = from.createdTime;
        this.popOut = from.popOut;
        this.popOutTime = from.popOutTime;
        this.popDelayOut = from.popDelayOut;
        this.popCycle = from.popCycle;
        this.focused = from.focused;
        this.strings.forEach((s, k) => s.letters.forEach((l, i) => { l.popIn = from.strings[k]?.letters[i]?.popIn ?? 1; }));
        this.text = this.strings[this.focused]!.text;
        this.letters = this.strings[this.focused]!.letters;
    }

    /** `DynaText:pulse`：一道从左往右扫过去的放大（`speed 40`、`width 2.5`），起点在下一次 `letterFx` 定 */
    private pulseCfg: { speed: number; width: number; start: number | null; amount: number } | null = null;
    /** `DynaText:set_quiver`：每个字一直细细地抖（数字上了两位数之后的 HUD） */
    private quiverCfg: { speed: number; amount: number } | null = null;

    pulse(amount = 0.2): void {
        this.pulseCfg = { speed: 40, width: 2.5, start: null, amount };
    }

    setQuiver(amount = 0.7): void {
        this.quiverCfg = { speed: 0.5, amount };
    }

    /**
     * `text.lua:214` 起：第 k 个字（0 起）因 pulse / quiver 额外的缩放与转角。
     * `render_scale/(TILESIZE·10)` 在默认字体下是 1
     */
    letterFx(k0: number, now: number): { scale: number; r: number } {
        let scale = 1;
        let r = 0;
        const n = this.letters.length;
        const k = k0 + 1;
        const p = this.pulseCfg;
        if (p) {
            p.start ??= now;
            const f = (this.font.renderScale / (TILESIZE * 10));
            scale += (1 / p.width) * p.amount * Math.max(Math.min((p.start - now) * p.speed + k + p.width, (now - p.start) * p.speed - k + p.width + 2), 0) * f;
            r += (scale - 1) * (0.02 * (-n / 2 - 0.5 + k));
        }
        const q = this.quiverCfg;
        if (q) {
            const t = now * q.speed;
            scale += 0.1 * q.amount;
            r += 0.3 * q.amount * (Math.sin(41.12342 * t + k * 1223.2)
                + Math.cos(63.21231 * t + k * 1112.2) * Math.sin(36.1231 * t)
                + Math.cos(95.123 * t + k * 1233.2)
                - Math.sin(30.133421 * t + k * 123.2));
        }
        return { scale, r };
    }
}
