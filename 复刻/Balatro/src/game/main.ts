import { AUTO, Game, Scale, type Types } from 'phaser';

import { RunScene } from './scenes/RunScene';

/**
 * 画布按**物理像素**开、铺满窗口（22 号票）。原作的画布就是屏幕分辨率，
 * 房间在窗口里怎么摆由 `love.resize` 决定（`coords.ts` 的 `roomMapping`，场景的相机照它设）。
 *
 * `zoom = 1 / dpr` 让画布的 CSS 尺寸回到窗口大小；Phaser 的输入按 CSS 尺寸与画布尺寸之比换算，不受影响。
 *
 * **`?win=2560x1440`** 把逻辑窗口钉死成这个尺寸（CSS 等比塞进视口）：与模拟器里的正版逐像素对照时，
 * 两边的「窗口」得一样大，而浏览器的地址栏会吃掉一截高度。配 `tools/cdp.mjs snap` 取回画布原图。
 */
function fixedWindow(): { w: number; h: number } | null {
    const m = new URLSearchParams(window.location.search).get('win')?.match(/^(\d+)x(\d+)$/);
    return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
}

function windowPx(): { w: number; h: number; dpr: number } {
    const dpr = window.devicePixelRatio || 1;
    return { w: Math.round(window.innerWidth * dpr), h: Math.round(window.innerHeight * dpr), dpr };
}

export default function StartGame(parent: string): Game {
    const fixed = fixedWindow();
    const { w, h, dpr } = windowPx();
    const config: Types.Core.GameConfig = {
        type: AUTO,
        width: fixed?.w ?? w,
        height: fixed?.h ?? h,
        parent,
        backgroundColor: '#000000',
        scale: fixed ? { mode: Scale.FIT, autoCenter: Scale.CENTER_BOTH } : { mode: Scale.NONE, zoom: 1 / dpr },
        scene: [RunScene],
    };
    const game = new Game(config);
    if (!fixed) {
        window.addEventListener('resize', () => {
            const next = windowPx();
            game.scale.resize(next.w, next.h);
            game.scale.setZoom(1 / next.dpr);
        });
    }
    return game;
}
