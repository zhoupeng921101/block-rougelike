/**
 * 存档里的「发现」（22 号票第四十五步）：`G.P_CENTERS[k].discovered` / `P_BLINDS` / `P_TAGS` 与 `discover_card`（`common_events.lua:1918`）。
 *
 * - 新档只有 `start_discovered` 的三样：`c_base`、`j_joker`、`b_red`（`game.lua:368` / `:371` / `:629`）
 * - **指定种子的局不记**（`discover_card` 第一句 `if G.GAME.seeded or G.GAME.challenge then return end`）
 * - 存在 `localStorage`（原作 `G:save_progress()` 写 `profile.jkr` 的 `discovered` 表）
 *
 * **只影响图鉴的显示**。原作里「发现」还会改标签池（Foil / Holo / Polychrome / Negative 标签要先发现对应版本），
 * 复刻件的卡池恒按新档算——指定种子的局要与原作一张不差，而原作的新档在指定种子的局里也永远不会发现任何东西。
 */
import { P_CENTERS } from '../ui/descriptions.generated';

const KEY = 'balatro-replica-profile';

const START_DISCOVERED = Object.entries(P_CENTERS).filter(([, c]) => c.discovered).map(([k]) => k);

function load(): Set<string> {
    const s = new Set(START_DISCOVERED);
    try {
        const raw = window.localStorage.getItem(KEY);
        if (raw) for (const k of (JSON.parse(raw) as { discovered?: string[] }).discovered ?? []) s.add(k);
    } catch {
        // 读不到就是新档
    }
    return s;
}

const discovered = load();

export function isDiscovered(key: string): boolean {
    return discovered.has(key);
}

/** `discover_card`：`seeded` 的局不记。返回这次是不是新发现（结算面板的 `new_collection` 读它） */
export function discover(key: string, seeded: boolean): boolean {
    if (!key || seeded || discovered.has(key)) return false;
    discovered.add(key);
    try {
        window.localStorage.setItem(KEY, JSON.stringify({ discovered: [...discovered].sort() }));
    } catch {
        // 存不了就只在这一页里有效
    }
    return true;
}

/** `set_discover_tallies`：按 set 数已发现 / 总数（牌组数的是解锁，不是发现） */
export function discoverTally(test: (key: string, set: string) => boolean): { tally: number; of: number } {
    let tally = 0;
    let of = 0;
    for (const [k, c] of Object.entries(P_CENTERS)) {
        if (!test(k, c.set)) continue;
        of++;
        if (c.set === 'Back' ? c.unlocked : discovered.has(k)) tally++;
    }
    return { tally, of };
}
