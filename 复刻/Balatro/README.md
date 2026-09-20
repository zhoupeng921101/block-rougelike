# Balatro 1.0.1o web 复刻件

> **只跑 localhost。不部署、不分发。**
>
> 游戏的机制与数值不受版权保护，重新实现是合法的；但美术、音频、文案受保护，
> 而本工程直接引用 `参考/产物/Balatro_1.0.1o/` 里的原素材。
> 一旦做成可公开访问的站点即构成侵权。这条是整个工程成立的前提，不要绕过它。

设计地图与决策台账在 [`.scratch/balatro-复刻/`](../../.scratch/balatro-复刻/map.md)。
动手前先读那份地图的 `## 已知的坑`。

## 现在有什么

骨架 + RNG 核心。**还没有任何 gameplay。**

```
src/
├── main.ts              入口
├── game/
│   ├── main.ts          Phaser 配置
│   └── scenes/Boot.ts   占位场景
└── core/rng/            ← 目前唯一有实质内容的部分
    ├── fmt13.ts             Lua %.13f 的精确复刻（BigInt，round-half-to-even）
    ├── luajit-random.ts     LuaJIT TW223 Tausworthe
    ├── pseudorandom.ts      Balatro 的 pseudohash / pseudoseed / pseudorandom
    └── rng.test.ts          16 条外部真值 + 8 条回归锚点
```

## 命令

```bash
npm run dev         # localhost:8080
npm test            # 24 个测试，必须全绿
npm run typecheck   # tsc --noEmit
npm run build       # 先 typecheck 再 vite build
```

**用 npm，不要用 pnpm。** pnpm 在本机装 `esbuild` 时稳定复现 `ERR_PNPM_EPERM`
（硬链接 rename 被拒），换 npm 即可。

## 已经定下来的口径

| 项 | 裁定 | 出处 |
|---|---|---|
| 翻译策略 | **直译，含事件队列**。不要中途重构成判别联合 | [03 号票](../../.scratch/balatro-复刻/issues/03-Lua到TS的翻译策略.md) |
| Phaser | **4.2.1**。Pipeline 体系已移除，自定义 shader 走 `Shader` GameObject | [11 号票](../../.scratch/balatro-复刻/issues/11-Phaser版本选型与渲染API复核.md) |
| 卡牌的渲染对象 | `Shader` 而非 `Sprite`。`setAlpha` 是 NOOP，alpha 走 shader uniform | 同上 |
| RNG | 逐位复刻可行，16/16 外部真值已通过 | [02 号票](../../.scratch/balatro-复刻/issues/02-LuaJIT-RNG-复刻口径.md) |

## 关于那 16 条测试向量

它们**不依赖实机、不依赖素材**，是目前唯一拿得到的外部 ground truth——
来自 balatrowiki、balatrohq、Blueprint fixture、balatro4j 四个互不相干的渠道。

改动 `src/core/rng/` 下任何一个文件之前，先确认这 24 个测试是绿的；
改完再跑一遍。它是后面每一步直译的底座。

其中 `randomseed(0.0)` 那条尤其硬：它比对的四个常量原样出现在
`参考/产物/Balatro_1.0.1o/原生库/arm64-v8a/liblove.so` 里
（字节偏移 1159408 / 1159416 / 1156768 / 1156776），
即这里复刻的算法与游戏实际链接的那份 LuaJIT 是同一份代码。

## 几条容易踩的

- **`%.13f` 不能用 `toFixed`**（half-away，LuaJIT 是 half-even），
  也不能用 Immolate 系的 `round(x*1e13)/1e13`（实测 0.05% 分叉率）。
- **`math.random` 不要加参数校验**。LuaJIT 对 `math.random(0)` 返回 1 而不报错，
  加了校验会在空池场景与原版分叉。
- **`a % 1` 在 Lua 里对负数返回非负**，JS 的 `%` 是截断取余。统一用 `a - Math.floor(a)`。
- **本产物是移动版构建**（`PROD_mobile`）。CRT 强度 30 而非桌面的 70，卡牌 3D 倾斜恒关。
  外观基准还没裁定，见 [12 号票](../../.scratch/balatro-复刻/issues/12-外观基准是移动版还是桌面版.md)。
- 模版自带的 `log.js` 会在每次 dev/build 时向 `gryzor.co` 上报项目名与 Phaser 版本，**已删除**。
