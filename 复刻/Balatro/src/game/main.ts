import { AUTO, Game, Scale, type Types } from 'phaser';

import { CANVAS_H, CANVAS_W } from './coords';
import { RunScene } from './scenes/RunScene';

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: CANVAS_W,
    height: CANVAS_H,
    parent: 'game-container',
    backgroundColor: '#2b3a2f',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [RunScene],
};

export default function StartGame(parent: string): Game {
    return new Game({ ...config, parent });
}
