import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // RNG 核心是纯 TS，与 Phaser 无关，跑在 node 上即可
        environment: 'node',
        include: ['src/**/*.test.ts'],
        // `*.slow.test.ts` 是几十个 seed 跑到死的量测，单独用 `npm run test:slow` 跑
        exclude: ['src/**/*.slow.test.ts', 'node_modules/**'],
    },
});
