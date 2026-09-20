/**
 * 事件队列的测试。
 *
 * 09 号票把语义查清楚了，这里逐条钉住——尤其是那些直译时容易走样的：
 * 移除要 `completed && timeDone` 两者成立、`before` 每轮都跑 func、
 * blocking 默认为 true、嵌套入队进队尾。
 */

import { describe, expect, it } from 'vitest';

import { EventManager, GameEvent } from './event-queue';

const tick = (m: EventManager, n = 1) => {
    for (let i = 0; i < n; i++) m.update(1 / 60);
};

describe('trigger 的五种语义', () => {
    it('immediate：立刻跑，立刻移除', () => {
        const m = new EventManager();
        const log: string[] = [];
        m.add(new GameEvent({ func: () => (log.push('ran'), true) }));

        tick(m);
        expect(log).toEqual(['ran']);
        expect(m.pending).toBe(0);
    });

    it('after：delay 没到就不跑 func', () => {
        const m = new EventManager();
        const log: string[] = [];
        m.add(new GameEvent({ trigger: 'after', delay: 0.5, func: () => (log.push('ran'), true) }));

        tick(m, 10); // 约 0.167 秒
        expect(log).toEqual([]);
        tick(m, 30); // 累计约 0.67 秒
        expect(log).toEqual(['ran']);
    });

    it('before：每轮都跑 func，但要等 delay 才算完', () => {
        const m = new EventManager();
        let calls = 0;
        // func 返回 true 表示"完成"，但 timeDone 还没到，所以事件留在队列里
        m.add(new GameEvent({ trigger: 'before', delay: 0.2, func: () => (calls++, true) }));

        tick(m, 3);
        expect(calls).toBeGreaterThan(0);
        expect(m.pending).toBe(1); // 还没到时间，没被移除

        tick(m, 20);
        expect(m.pending).toBe(0);
    });

    it('condition：func 返回 false 就一直留着', () => {
        const m = new EventManager();
        let ready = false;
        m.add(new GameEvent({ trigger: 'condition', func: () => ready }));

        tick(m, 10);
        expect(m.pending).toBe(1);
        ready = true;
        tick(m);
        expect(m.pending).toBe(0);
    });

    it('ease：把 refTable[refValue] 插值到 easeTo', () => {
        const m = new EventManager();
        const box = { v: 0 };
        m.add(new GameEvent({
            trigger: 'ease', delay: 0.5, refTable: box, refValue: 'v', easeTo: 100,
        }));

        tick(m, 2);
        expect(box.v).toBeGreaterThan(0);
        expect(box.v).toBeLessThan(100);

        tick(m, 40);
        expect(box.v).toBe(100);
        expect(m.pending).toBe(0);
    });
});

describe('阻塞语义', () => {
    it('blocking 默认为 true——前面没跑完，后面不动', () => {
        const m = new EventManager();
        const log: string[] = [];

        m.add(new GameEvent({ trigger: 'after', delay: 0.3, func: () => (log.push('first'), true) }));
        m.add(new GameEvent({ func: () => (log.push('second'), true) }));

        tick(m, 5);
        expect(log).toEqual([]); // 第二个被第一个挡住了

        tick(m, 25);
        expect(log).toEqual(['first', 'second']);
    });

    it('blockable = false 的事件穿透阻塞', () => {
        const m = new EventManager();
        const log: string[] = [];

        m.add(new GameEvent({ trigger: 'after', delay: 0.3, func: () => (log.push('slow'), true) }));
        m.add(new GameEvent({ blockable: false, func: () => (log.push('jumped'), true) }));

        tick(m, 2);
        expect(log).toEqual(['jumped']); // 抢在慢的前面跑了
    });

    it('blocking = false 的事件不挡后面', () => {
        const m = new EventManager();
        const log: string[] = [];

        m.add(new GameEvent({
            trigger: 'after', delay: 0.3, blocking: false, func: () => (log.push('slow'), true),
        }));
        m.add(new GameEvent({ func: () => (log.push('after'), true) }));

        tick(m, 2);
        expect(log).toEqual(['after']);
    });
});

describe('队列结构', () => {
    it('嵌套入队进队尾，不插队', () => {
        const m = new EventManager();
        const log: string[] = [];

        m.add(new GameEvent({
            func: () => {
                log.push('outer');
                m.add(new GameEvent({ func: () => (log.push('nested'), true) }));
                return true;
            },
        }));
        m.add(new GameEvent({ func: () => (log.push('sibling'), true) }));

        m.flush();
        // nested 是在 outer 执行时入队的，排在 sibling 之后
        expect(log).toEqual(['outer', 'sibling', 'nested']);
    });

    it('front = true 才插队首', () => {
        const m = new EventManager();
        const log: string[] = [];
        m.add(new GameEvent({ func: () => (log.push('a'), true) }));
        m.add(new GameEvent({ func: () => (log.push('b'), true) }), 'base', true);

        m.flush();
        expect(log).toEqual(['b', 'a']);
    });

    it('队列之间互不阻塞', () => {
        const m = new EventManager();
        const log: string[] = [];

        m.add(new GameEvent({ trigger: 'after', delay: 1, func: () => (log.push('base'), true) }));
        m.add(new GameEvent({ func: () => (log.push('other'), true) }), 'other');

        tick(m, 2);
        expect(log).toEqual(['other']);
    });

    it('固定步长：不足 1/60 秒不处理', () => {
        const m = new EventManager();
        const log: string[] = [];
        m.add(new GameEvent({ func: () => (log.push('ran'), true) }));

        m.update(1 / 600); // 只走了 1/10 个步长
        expect(log).toEqual([]);

        m.update(1 / 60);
        expect(log).toEqual(['ran']);
    });

    it('flush 把队列跑干净', () => {
        const m = new EventManager();
        const log: number[] = [];
        for (let i = 0; i < 5; i++) {
            m.add(new GameEvent({ trigger: 'after', delay: 0.2, func: () => (log.push(i), true) }));
        }
        m.flush();
        expect(log).toEqual([0, 1, 2, 3, 4]); // FIFO
        expect(m.pending).toBe(0);
    });
});
