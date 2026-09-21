/**
 * 纯观感的常数，集中在这一处（12 号票的落地约定）。
 *
 * 本产物是移动版构建（`PROD_mobile`），与桌面版在观感上只差四个常数：CRT 强度、FPS 上限、
 * 卡面文字缩放、描述文字缩放（`globals.lua:231`、`main.lua:85`、`card.lua:767`、`misc_functions.lua:1747`）。
 * 12 号票裁定**默认取桌面值**。复刻件现在只用到 CRT 一项，文字那两项等画卡面文字时再加进来，
 * FPS 交给浏览器的 rAF。
 *
 * **`?look=mobile` 切到本产物的值**（21 号票）：模拟器里跑的正是这个移动版构建，
 * 要与它逐像素对照，就得用它的常数。这个开关只为对照存在，不改 12 号票的默认裁定。
 */
export type Look = {
    /** `G.SETTINGS.GRAPHICS.crt`：`F_MOBILE and 30 or 70` */
    crt: number;
};

const DESKTOP: Look = { crt: 70 };
const MOBILE: Look = { crt: 30 };

function pick(): Look {
    try {
        return new URLSearchParams(window.location.search).get('look') === 'mobile' ? MOBILE : DESKTOP;
    } catch {
        return DESKTOP;
    }
}

export const LOOK: Look = pick();
