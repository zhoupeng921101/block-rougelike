import StartGame from './game/main';

const game = StartGame('game-container');

// 开发时留一个句柄，给 `tools/cdp.mjs eval` 在模拟器浏览器里查场景状态（22 号票）
if (import.meta.env.DEV) (window as unknown as { __game: typeof game }).__game = game;
