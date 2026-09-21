import { defineConfig } from 'vitest/config';

/** `npm run test:slow`：只跑 `*.slow.test.ts`（几十个 seed 跑到死的量测） */
export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.slow.test.ts'],
    },
});
