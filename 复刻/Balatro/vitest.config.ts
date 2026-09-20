import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // RNG 核心是纯 TS，与 Phaser 无关，跑在 node 上即可
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
