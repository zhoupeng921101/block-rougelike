import { AUTO, Game, Scale, type Types } from 'phaser';

import { Boot } from './scenes/Boot';

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#20232b',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [Boot],
};

export default function StartGame(parent: string): Game {
    return new Game({ ...config, parent });
}
