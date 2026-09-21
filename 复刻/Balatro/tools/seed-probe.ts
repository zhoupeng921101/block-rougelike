// 让复刻件按一串动作跑某个 seed，打印每一步之后的局面，拿去对模拟器里的正版（`tools/emu.mjs`）。
//
//   npx vite-node tools/seed-probe.ts <SEED> [动作 ...]
//
// 动作（牌用「点数字母 + 花色字母」，如 AH、TC、9S）：
//   sel            选当前盲注（进小盲 / 大盲 / Boss）
//   d:4C,5D,5C     弃这几张
//   p:AC,QC,TC     出这几张
//   cash           结算，进商店
//   buy:<i>        买货架第 i 格（0 起）
//   pack:<i>       买下并打开第 i 个补充包（0 起）
//   take:<i>[:牌]  从开着的包里拿第 i 张；包里的塔罗当场用，对发下来的手牌里这几张
//   skip           跳过开着的包
//   reroll         重掷商店
//   next           离开商店，回到选盲注
//
// 不给动作时只打印开局：Ante 1 的 Boss、优惠券、两个跳过标签。
import { Run } from '../src/core/run';
import type { Card } from '../src/core/card';
import { cardId, pickCards } from '../src/core/fixtures/card-id';

const [seed, ...actions] = process.argv.slice(2);
if (!seed) {
    console.error('用法：npx vite-node tools/seed-probe.ts <SEED> [动作 ...]');
    process.exit(2);
}

const line = (cards: Card[]) => cards.map(cardId).join(' ');

const run = new Run(seed);
console.log(`seed     ${seed}`);
console.log(`boss     ${run.bossKey}`);
console.log(`voucher  ${run.currentVoucher}`);
console.log(`tags     Small=${run.blindTags.Small} Big=${run.blindTags.Big}`);

function printHand(): void {
    const round = run.round!;
    console.log(`  hand   ${line(round.hand)}`);
    // 牌堆从数组尾部摸，所以倒过来才是接下来的抽牌序
    console.log(`  next   ${line([...round.deck].reverse().slice(0, 10))}`);
}

function printShop(): void {
    const shop = run.shop!;
    for (const item of shop.items) {
        const name =
            item.kind === 'joker' ? item.joker.center.name + (item.joker.edition ? ` [${item.joker.edition}]` : '')
            : item.kind === 'consumable' ? item.consumable.center.name
            : cardId(item.card);
        console.log(`  item   ${name}  $${item.cost}`);
    }
    for (const pack of shop.packs) console.log(`  pack   ${pack ? pack.key : '(sold)'}`);
    for (const v of shop.vouchers) console.log(`  vouch  ${v.key}`);
}

for (const act of actions) {
    console.log(`> ${act}`);
    if (act === 'sel') {
        run.startRound();
        printHand();
    } else if (act.startsWith('d:')) {
        run.round!.discard(pickCards(run.round!.hand, act.slice(2)));
        printHand();
    } else if (act.startsWith('p:')) {
        run.round!.play(pickCards(run.round!.hand, act.slice(2)));
        console.log(`  score  ${run.round!.chips}  phase=${run.round!.phase}`);
        if (run.round!.phase === 'selecting') printHand();
    } else if (act === 'cash') {
        const { payout } = run.finishRound();
        console.log(`  $      ${run.dollars}`, JSON.stringify(payout));
        printShop();
    } else if (act.startsWith('pack:')) {
        const open = run.buyAndOpenPack(Number(act.slice(5)));
        console.log(`  $      ${run.dollars}  ${open.key}`);
        for (const c of open.cards) {
            const desc =
                c.kind === 'card'
                    ? [cardId(c.card), c.card.enhancement, c.card.edition, c.card.seal].filter(Boolean).join(' ')
                    : c.kind === 'joker'
                      ? c.joker.center.name + (c.joker.edition ? ` [${c.joker.edition}]` : '')
                      : c.consumable.center.name;
            console.log(`  card   ${desc}`);
        }
        // 奥秘 / 幽灵包从牌堆顶发的那手牌（按点数排好）
        if (run.packHand) console.log(`  hand   ${line(run.packHand)}`);
    } else if (act.startsWith('take:')) {
        // `take:1` 或 `take:1:AS,KH`（包里的塔罗对发下来的这几张手牌用）
        const [i, targets] = act.slice(5).split(':');
        run.takeFromPack(Number(i), targets ? pickCards(run.packHand ?? [], targets) : []);
        if (run.packHand) console.log(`  hand   ${line(run.packHand)}`);
    } else if (act.startsWith('buy:')) {
        const item = run.shop!.items[Number(act.slice(4))]!;
        if (item.kind === 'joker') run.buyJoker(Number(act.slice(4)));
        else if (item.kind === 'card') run.buyPlayingCard(Number(act.slice(4)));
        else run.buyConsumable(Number(act.slice(4)));
        console.log(`  $      ${run.dollars}`);
    } else if (act === 'skip') {
        run.skipPack();
    } else if (act === 'reroll') {
        run.rerollShop();
        printShop();
    } else if (act === 'next') {
        run.leaveShop();
        console.log(`  boss   ${run.bossKey}  tags Small=${run.blindTags.Small} Big=${run.blindTags.Big}`);
    } else {
        throw new Error(`不认识的动作 ${act}`);
    }
}
