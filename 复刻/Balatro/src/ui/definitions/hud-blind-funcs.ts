/**
 * 盲注面板里那几个 `G.FUNCS`（`button_callbacks.lua:158-220`、`:2002`），直译。
 * 它们改节点的 `minh` / `scale` / 文字再重排——面板随盲注伸缩（Boss 多两行 debuff 文字）就靠它们。
 */
import { DICTIONARY } from '../lang.generated';
import type { UIElement, UIFuncs } from '../uibox';
import { type HudBlindState, scaleNumber } from './hud-blind';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

export function hudBlindFuncs(state: HudBlindState): UIFuncs {
    return {
        // 只管 `G.GAME.blind.states.visible`（筹码画不画），不动布局；绘制层读 `blind.key`
        HUD_blind_visible: () => undefined,

        /** `:171`：有 debuff 文字就把这一行撑到 0.35、字号 0.36；这一行是空的就缩成 0.001；没有 debuff 整行收起 */
        HUD_blind_debuff: (e: UIElement) => {
            const b = state.blind;
            const parent = e.parent!;
            if (b.loc_debuff_text) {
                if (parent.config.minh === 0 || e.config.prev_loc !== b.loc_debuff_text) {
                    parent.config.minh = 0.35;
                    e.config.scale = 0.36;
                    if (b.loc_debuff_lines[e.config.ref_value as '1' | '2'] === '') {
                        e.config.scale = 0.0;
                        parent.config.minh = 0.001;
                    }
                    e.config.prev_loc = b.loc_debuff_text;
                    e.box.recalculate();
                }
            } else if ((parent.config.minh ?? 0) > 0) {
                parent.config.minh = 0;
                e.config.scale = 0;
                e.box.recalculate();
            }
        },

        /** `:193`：The Wheel 的描述前面要写几率的分子（`G.GAME.probabilities.normal`） */
        HUD_blind_debuff_prefix: (e: UIElement) => {
            const ref = e.config.ref_table as { val: string };
            if (state.blind.key === 'bl_wheel' || e.config.id === 'bl_wheel') {
                ref.val = String(state.blind.probabilities);
                e.config.scale = 0.32;
            } else {
                ref.val = '';
                e.config.scale = 0;
            }
        },

        /** `:2002`：目标分的字号随位数缩。原文 `if G.GAME.blind.chips`——Lua 里 0 也是真，开局第一帧就是 0.7 */
        blind_chip_UI_scale: (e: UIElement) => {
            if (state.blind.chips !== undefined) e.config.scale = scaleNumber(state.blind.chips, 0.7, 100000);
        },

        /** `:204`：没有「无奖励」的挑战修饰，行高 0.45、文字「Reward: 」 */
        HUD_blind_reward: (e: UIElement) => {
            if ((e.config.minh ?? 0) < 0.45) {
                e.config.minh = 0.45;
                e.children[0]!.config.text = `${loc('k_reward')}: `;
                e.box.recalculate();
            }
        },
    };
}
