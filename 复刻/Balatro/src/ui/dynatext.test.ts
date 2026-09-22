import { describe, expect, it } from 'vitest';
import { DynaText } from './dynatext';

describe('DynaText 弹入（text.lua:191）', () => {
    it('没配 pop_in：字一出现就是满的，也不出声', () => {
        const d = new DynaText({ string: ['Hi'] });
        expect(d.letters.map((l) => l.popIn)).toEqual([1, 1]);
        expect(d.popStep(0)).toEqual([]);
    });

    it('pop_in 0.5：延迟之后每秒弹 #string·3 个字，进度平方，最后一个满了就停', () => {
        const d = new DynaText({ string: ['ABCD'], pop_in: 0.5 });
        expect(d.letters.every((l) => l.popIn === 0)).toBe(true);
        d.popStep(10); // 定下 created_time
        d.popStep(10.5);
        expect(d.letters.map((l) => l.popIn)).toEqual([0, 0, 0, 0]);
        // 过了 1/24 秒：(1/24)·4·3 = 0.5 → 第一个字 0.25
        const sounds = d.popStep(10.5 + 1 / 24, () => 0);
        expect(d.letters[0]!.popIn).toBeCloseTo(0.25);
        expect(d.letters[1]!.popIn).toBe(0);
        // 第一个字冒头：0.45 + 0.3/4·1
        expect(sounds).toEqual([0.45 + 0.075]);
        d.popStep(11);
        expect(d.letters.map((l) => l.popIn)).toEqual([1, 1, 1, 1]);
        expect(d.popDelay).toBeUndefined();
    });

    it('silent 不出声；超过 10 个字只有偶数位出声', () => {
        const s = new DynaText({ string: ['AB'], pop_in: 0, silent: true });
        s.popStep(0);
        expect(s.popStep(1)).toEqual([]);
        const long = new DynaText({ string: ['ABCDEFGHIJKL'], pop_in: 0 });
        long.popStep(0);
        expect(long.popStep(1, () => 0)).toHaveLength(6);
    });

    it('建好之后换字不再弹（没配 reset_pop_in）', () => {
        const game = { n: 1 };
        const d = new DynaText({ string: [{ ref_table: game, ref_value: 'n' }], pop_in: 0 });
        d.popStep(0);
        d.popStep(5);
        game.n = 23;
        d.update();
        expect(d.letters.map((l) => l.popIn)).toEqual([1, 1]);
        expect(d.popStep(6)).toEqual([]);
    });

    it('reset_pop_in：换字从头再弹', () => {
        const game = { n: 1 };
        const d = new DynaText({ string: [{ ref_table: game, ref_value: 'n' }], pop_in: 0, reset_pop_in: true });
        d.popStep(0);
        d.popStep(5);
        game.n = 23;
        d.update();
        expect(d.letters.map((l) => l.popIn)).toEqual([1, 1]);
        // 换字时 update_text 不是 first_pass，字恒为满；但计时重开，下一帧 align_letters 从 0 算起
        d.popStep(6);
        expect(d.letters[0]!.popIn).toBe(0);
    });

    it('inheritPop：字一样才接过进度', () => {
        const a = new DynaText({ string: ['Shop'], pop_in: 1.5 });
        a.popStep(0);
        a.popStep(10);
        const b = new DynaText({ string: ['Shop'], pop_in: 1.5 });
        b.inheritPop(a);
        expect(b.letters.every((l) => l.popIn === 1)).toBe(true);
        expect(b.popStep(10.1)).toEqual([]);
        const c = new DynaText({ string: ['Other'], pop_in: 1.5 });
        c.inheritPop(a);
        expect(c.letters[0]!.popIn).toBe(0);
    });

    it('多串轮播：pop_delay 秒后缩回、轮到下一串弹入，再缩回、轮回第一串', () => {
        const d = new DynaText({ string: [{ string: '12' }, { string: '9' }], pop_in_rate: 10, pop_delay: 4, silent: true });
        // 头一串一出来就是满的（没配 pop_in），第二串先清零；宽度取两串最大
        expect(d.text).toBe('12');
        expect(d.letters.map((l) => l.popIn)).toEqual([1, 1]);
        d.popStep(0);
        d.popStep(3.9);
        expect(d.letters.map((l) => l.popIn)).toEqual([1, 1]);
        // 4 秒起按 pop_out = 4 缩：(1 − 4·t)²，0.25 秒缩没
        d.popStep(4.125);
        expect(d.letters[0]!.popIn).toBeCloseTo(0.25);
        d.popStep(4.3);
        expect(d.letters[0]!.popIn).toBe(0);
        // 下一帧轮到第二串，0.1 秒后弹入：(t·1·10 − k + 1)²
        d.popStep(4.31);
        expect(d.text).toBe('9');
        expect(d.offset.x).toBeGreaterThan(0);
        d.popStep(4.31 + 0.1 + 0.05);
        expect(d.letters[0]!.popIn).toBeCloseTo(0.25);
        d.popStep(4.6);
        expect(d.letters[0]!.popIn).toBe(1);
        // 满了之后隔 (now − 0.1 − created + 4) 秒再缩回，缩没了回到第一串
        d.popStep(20);
        d.popStep(20.01);
        expect(d.text).toBe('12');
    });
});
