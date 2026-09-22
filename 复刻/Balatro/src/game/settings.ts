/**
 * `G.SETTINGS`（`globals.lua:193` 起）里 Options → Settings 三页改得到的那些（22 号票第四十步）。
 *
 * 原作存在 `settings.jkr`，复刻件存在 `localStorage`，同样是关掉 overlay（`exit_overlay_menu` 的 `save_settings`）
 * 与改某几项时写一次。读不到（隐私模式、被禁）就用缺省值，不影响游戏。
 *
 * 缺省值照原文；CRT 与屏幕摇晃的缺省取 `LOOK`（移动版 30 / 桌面版 70，`?shake=` 对照开关）。
 * **URL 上的对照开关优先于存下来的值**——与实机逐像素比对时不能被以前拖过的滑条带偏。
 */
import { LOOK } from './look';

export type Settings = {
    /** `GAMESPEED`：0.5 / 1 / 2 / 4，乘到事件队列的时间上（`game.lua:2730` 的 `SPEEDFACTOR`） */
    GAMESPEED: number;
    /** `play_button_pos`：1 = 出牌在右（Discard/Play），2 = 出牌在左（Play/Discard） */
    play_button_pos: 1 | 2;
    /** 0..100 */
    screenshake: number;
    run_stake_stickers: boolean;
    colourblind_option: boolean;
    reduced_motion: boolean;
    GRAPHICS: {
        shadows: 'On' | 'Off';
        /** 1 = Off（最近邻），2 = On（线性） */
        texture_scaling: 1 | 2;
        crt: number;
    };
    SOUND: {
        volume: number;
        music_volume: number;
        game_sounds_volume: number;
    };
};

const KEY = 'balatro-replica-settings';

function defaults(): Settings {
    return {
        GAMESPEED: 1,
        play_button_pos: 2,
        screenshake: 50,
        run_stake_stickers: false,
        colourblind_option: false,
        reduced_motion: false,
        GRAPHICS: { shadows: 'On', texture_scaling: 2, crt: LOOK.crt },
        SOUND: { volume: 50, music_volume: 100, game_sounds_volume: 100 },
    };
}

function load(): Settings {
    const s = defaults();
    try {
        const raw = window.localStorage.getItem(KEY);
        if (raw) {
            const saved = JSON.parse(raw) as Partial<Settings>;
            Object.assign(s, saved, {
                GRAPHICS: { ...s.GRAPHICS, ...saved.GRAPHICS },
                SOUND: { ...s.SOUND, ...saved.SOUND },
            });
        }
    } catch {
        // 读不到就用缺省
    }
    // 对照开关优先
    try {
        const q = new URLSearchParams(window.location.search);
        if (q.get('look') === 'mobile') s.GRAPHICS.crt = LOOK.crt;
        if (q.has('shake')) s.screenshake = LOOK.screenshake;
    } catch {
        // 非浏览器环境
    }
    return s;
}

export const SETTINGS: Settings = load();

/** `G:save_settings()` */
export function saveSettings(): void {
    try {
        window.localStorage.setItem(KEY, JSON.stringify(SETTINGS));
    } catch {
        // 存不了就算了
    }
}

/**
 * 音量口径：原作是 `vol × volume/100 × 分类/100`（主音量缺省 50）。复刻件的音效一直按原文的 `vol` 直接放，
 * 等于把缺省的 50 当成了 1 倍——所以主音量按 `volume/50` 换算，缺省听感不变，比例与原作一致
 */
export function masterGain(): number {
    return SETTINGS.SOUND.volume / 50;
}

/** 扑克牌正面的图集：高对比度用 `8BitDeck_opt2`（`cards_2`，`misc_functions.lua:1829`） */
export function cardsTexture(): string {
    return SETTINGS.colourblind_option ? 'cards_2' : 'cards';
}

/** 卡的投影（`card.lua:4368` 的 `G.SETTINGS.GRAPHICS.shadows == 'On'`） */
export function shadowsOn(): boolean {
    return SETTINGS.GRAPHICS.shadows === 'On';
}

/** `(G.SETTINGS.reduced_motion and 0 or 1)`：卡在区里的微晃（`align_cards` 的正弦项）乘它 */
export function wobble(): number {
    return SETTINGS.reduced_motion ? 0 : 1;
}
