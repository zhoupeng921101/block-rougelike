import { Scene } from 'phaser';

/**
 * 骨架期的占位场景。还没有任何 Balatro 的内容——
 * 内容怎么切见 .scratch/balatro-复刻/issues/07-第一个可玩里程碑的切片边界.md。
 */
export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    create(): void {
        const { width, height } = this.scale;

        this.add
            .text(width / 2, height / 2, 'Balatro 复刻 · 骨架', {
                fontFamily: 'monospace',
                fontSize: 32,
                color: '#e8e8e8',
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, height / 2 + 48, 'RNG 核心已就位，gameplay 未开始', {
                fontFamily: 'monospace',
                fontSize: 16,
                color: '#8a8a8a',
            })
            .setOrigin(0.5);
    }
}
