import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    // spike 页是第二个入口，见 spike/index.html
    // 主工程不依赖它，删掉 spike/ 目录即可移除
    appType: 'mpa',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080
    }
});
