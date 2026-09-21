/**
 * `common_events.lua:1142` 的 `update_canvas_juice`：房间的「呼吸」摆动（22 号票）。不 import Phaser。
 *
 * 按「屏幕震动」设置（缺省 50）让房间做 ±0.02 tile 量级的正弦漂移、加一点跟随光标的视差
 * 与 ±0.0015 弧度的旋转。实机截图与复刻件的 3.5 像素竖直偏差就是它（22 号票）。
 * `jiggle` 是震屏（出牌得分、买卖时）的余振，这里只保留衰减，触发点接上之前恒为 0。
 */
import { TILE_H, TILE_W } from './coords';

export type RoomJuiceState = {
    /** `G.ARGS.eased_cursor_pos.x / .y`：缓动后的光标，**屏幕 tile 坐标** */
    easedX: number;
    easedY: number;
    /** `G.ROOM.jiggle` */
    jiggle: number;
};

export function makeRoomJuice(): RoomJuiceState {
    return { easedX: TILE_W / 2, easedY: TILE_H / 2, jiggle: 0 };
}

/**
 * 推进一帧，返回房间的 `T.x / T.y / T.r`。
 * @param cursor 光标（`G.CURSOR.T`，屏幕像素 ÷ 每 tile 像素）
 * @param orig `G.ROOM_ORIG`（`love.resize` 算出的房间原点）
 * @param real `G.TIMERS.REAL`（秒）
 */
export function stepRoomJuice(
    s: RoomJuiceState,
    dt: number,
    real: number,
    screenshake: number,
    cursor: { x: number; y: number },
    orig: { x: number; y: number },
): { x: number; y: number; r: number } {
    // 光标视差只认超过 30 的那部分
    let shake = Math.max(0, screenshake - 30) / 100;
    s.easedX = s.easedX * (1 - 3 * dt) + 3 * dt * (shake * cursor.x + (1 - shake) * (TILE_W / 2));
    s.easedY = s.easedY * (1 - 3 * dt) + 3 * dt * (shake * cursor.y + (1 - shake) * (TILE_H / 2));

    shake = (screenshake / 100) * 3;
    if (shake < 0.05) shake = 0;
    s.jiggle = s.jiggle * (1 - 5 * dt) * (shake > 0.05 ? 1 : 0);
    const r = (0.001 * Math.sin(0.3 * real) + 0.002 * s.jiggle * Math.sin(39.913 * real)) * shake;
    const x = orig.x + shake * (0.015 * Math.sin(0.913 * real) + 0.01 * (s.jiggle * shake) * Math.sin(19.913 * real)
        + (s.easedX - 0.5 * (TILE_W + orig.x)) * 0.01);
    const y = orig.y + shake * (0.015 * Math.sin(0.952 * real) + 0.01 * (s.jiggle * shake) * Math.sin(21.913 * real)
        + (s.easedY - 0.5 * (TILE_H + orig.y)) * 0.01);
    return { x, y, r };
}
