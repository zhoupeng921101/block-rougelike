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
    /**
     * `G.SETTINGS.screenshake`：两版缺省都是 50（`common_events.lua:1145`）。驱动房间的「呼吸」摆动
     * （`RunScene` 的 `update_canvas_juice`）。**`?shake=0`** 关掉它——与实机逐像素比对时
     * 两边都设 0，否则 ±3 像素的漂移会淹没真正的偏差（22 号票）
     */
    screenshake: number;
    /**
     * `G.F_MOBILE` 的 UI 分支（`UI_definitions.lua` 里散着的 `G.F_MOBILE and a or b`）。12 号票当时说
     * 「UI 那层本来就要重写」，现在 UI 定义是直译的，这些分支也跟着进来了，归到这里一并受 `?look=mobile` 控制
     */
    mobileUi: boolean;
};

const DESKTOP: Look = { crt: 70, screenshake: 50, mobileUi: false };
const MOBILE: Look = { crt: 30, screenshake: 50, mobileUi: true };

function pick(): Look {
    try {
        const q = new URLSearchParams(window.location.search);
        const base = q.get('look') === 'mobile' ? MOBILE : DESKTOP;
        const shake = q.get('shake');
        return shake !== null && Number.isFinite(Number(shake)) ? { ...base, screenshake: Number(shake) } : base;
    } catch {
        return DESKTOP;
    }
}

export const LOOK: Look = pick();
