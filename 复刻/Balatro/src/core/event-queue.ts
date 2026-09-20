/**
 * 事件队列。直译自 `参考/产物/Balatro_1.0.1o/源码/engine/event.lua`（195 行）。
 *
 * 语义的完整调研见 09 号票。要点：
 *
 * - **五个独立队列**，队列之间互不阻塞。gameplay 只用 `base`
 *   （实测全仓零处入非 base 队列）。
 * - **队列内严格 FIFO + 阻塞**：遇到 blocking 且未完成的事件，
 *   其后所有 `blockable` 的事件本轮跳过。
 * - **固定步长 `queue_dt = 1/60`**，不是每帧一次。
 * - **移除条件是 `completed && timeDone` 两者同时成立**。
 *
 * 09 号票查明：第一个切片零处「队列驱动的 RNG 消费」，
 * 所以在那之前可以不要队列。现在要做动画了才建起来——
 * 而这套调度也正是第二个里程碑（消耗品、补充包）的前提，
 * 那边有 5 处带 delay / `blockable=false` 的 RNG 消费。
 */

export type EventTrigger = 'immediate' | 'after' | 'before' | 'ease' | 'condition';
export type QueueName = 'base' | 'unlock' | 'tutorial' | 'achievement' | 'other';

export type EaseType = 'lerp' | 'elastic' | 'quad';

export type EventConfig = {
    trigger?: EventTrigger;
    /** 秒。`after` 用它定何时跑，`before` 用它定何时算完 */
    delay?: number;
    /** 返回 `true` 表示完成 */
    func?: () => boolean;
    /** 默认 `true`：未完成时阻塞同队列后面所有 `blockable` 的事件 */
    blocking?: boolean;
    /** 默认 `true` */
    blockable?: boolean;
    /** `trigger: 'ease'` 用 */
    ease?: EaseType;
    refTable?: Record<string, number>;
    refValue?: string;
    easeTo?: number;
};

type HandleResult = {
    blocking: boolean;
    completed: boolean;
    timeDone: boolean;
};

export class GameEvent {
    readonly trigger: EventTrigger;
    readonly delay: number;
    readonly blocking: boolean;
    readonly blockable: boolean;

    private readonly func: () => boolean;
    private complete = false;
    private startTimer = false;
    private time = 0;

    private readonly easeType: EaseType;
    private readonly refTable?: Record<string, number>;
    private readonly refValue?: string;
    private readonly easeTo?: number;
    private easeStart?: number;
    private easeEnd?: number;
    private easeStartVal = 0;

    constructor(config: EventConfig) {
        this.trigger = config.trigger ?? 'immediate';
        this.delay = config.delay ?? 0;
        this.blocking = config.blocking ?? true;
        this.blockable = config.blockable ?? true;
        this.func = config.func ?? (() => true);

        this.easeType = config.ease ?? 'lerp';
        this.refTable = config.refTable;
        this.refValue = config.refValue;
        this.easeTo = config.easeTo;

        if (this.trigger === 'ease' && this.refTable && this.refValue) {
            this.easeStartVal = this.refTable[this.refValue];
        }
    }

    /** 对应 `Event:handle`。`now` 是 `G.TIMERS[self.timer]`。 */
    handle(now: number, out: HandleResult): void {
        out.blocking = this.blocking;
        out.completed = this.complete;

        if (!this.startTimer) {
            this.time = now;
            this.startTimer = true;
        }

        switch (this.trigger) {
            case 'after':
                if (this.time + this.delay <= now) {
                    out.timeDone = true;
                    out.completed = this.func();
                }
                break;

            case 'before':
                // 注意：每轮都跑 func，但 timeDone 要等 delay 走完。
                // 副作用立刻发生，事件却占住队列（从而阻塞后续）直到 delay 结束。
                if (!this.complete) out.completed = this.func();
                if (this.time + this.delay <= now) out.timeDone = true;
                break;

            case 'immediate':
                out.completed = this.func();
                out.timeDone = true;
                break;

            case 'condition':
                if (!this.complete) out.completed = this.func();
                out.timeDone = true;
                break;

            case 'ease':
                this.handleEase(now, out);
                break;
        }

        if (out.completed) this.complete = true;
    }

    private handleEase(now: number, out: HandleResult): void {
        if (!this.refTable || !this.refValue || this.easeTo === undefined) return;

        if (this.easeStart === undefined) {
            this.easeStart = now;
            this.easeEnd = now + this.delay;
            this.easeStartVal = this.refTable[this.refValue];
        }
        if (this.complete) return;

        if ((this.easeEnd ?? 0) >= now) {
            // 原作的 percent_done 是**剩余比例**，不是已完成比例——别顺手改名
            let percentDone =
                ((this.easeEnd ?? 0) - now) / ((this.easeEnd ?? 0) - this.easeStart);

            if (this.easeType === 'elastic') {
                percentDone =
                    -Math.pow(2, 10 * percentDone - 10) *
                    Math.sin(((percentDone * 10 - 10.75) * 2 * Math.PI) / 3);
            } else if (this.easeType === 'quad') {
                percentDone = percentDone * percentDone;
            }

            this.refTable[this.refValue] =
                percentDone * this.easeStartVal + (1 - percentDone) * this.easeTo;
        } else {
            this.refTable[this.refValue] = this.easeTo;
            this.complete = true;
            out.completed = true;
            out.timeDone = true;
        }
    }
}

/** 对应 `EventManager`。 */
export class EventManager {
    private readonly queues: Record<QueueName, GameEvent[]> = {
        unlock: [], base: [], tutorial: [], achievement: [], other: [],
    };

    /** `G.TIMERS` 累积的时间，秒 */
    private now = 0;
    private queueTimer = 0;
    private queueLastProcessed = 0;
    /** `EventManager.queue_dt = 1/60` */
    private readonly queueDt = 1 / 60;

    /** `add_event(event, queue, front)`。默认追加到队尾。 */
    add(event: GameEvent, queue: QueueName = 'base', front = false): void {
        if (front) this.queues[queue].unshift(event);
        else this.queues[queue].push(event);
    }

    /** `clear_queue`。`no_delete` 本切片用不到，先不实现。 */
    clear(queue?: QueueName): void {
        if (queue) this.queues[queue].length = 0;
        else for (const k of Object.keys(this.queues) as QueueName[]) this.queues[k].length = 0;
    }

    get pending(): number {
        return (Object.keys(this.queues) as QueueName[])
            .reduce((n, k) => n + this.queues[k].length, 0);
    }

    /** `EventManager:update(dt, forced)`。`dt` 单位是秒。 */
    update(dt: number, forced = false): void {
        this.now += dt;
        this.queueTimer += dt;

        if (!(this.queueTimer >= this.queueLastProcessed + this.queueDt || forced)) return;
        this.queueLastProcessed += forced ? 0 : this.queueDt;

        const out: HandleResult = { blocking: false, completed: false, timeDone: false };

        for (const name of Object.keys(this.queues) as QueueName[]) {
            const q = this.queues[name];
            let blocked = false;
            let i = 0;

            while (i < q.length) {
                out.blocking = false;
                out.completed = false;
                out.timeDone = false;

                if (!blocked || !q[i].blockable) q[i].handle(this.now, out);

                if (!blocked && out.blocking) blocked = true;

                if (out.completed && out.timeDone) q.splice(i, 1);
                else i++;
            }
        }
    }

    /**
     * 把队列一次跑完。
     *
     * 09 号票：第一个切片零处队列驱动的 RNG 消费，
     * 所以压掉动画时间不改变 RNG 顺序。**这条不能带过第一个里程碑**。
     * 测试与无头环境用。
     */
    flush(maxSteps = 100000): void {
        let steps = 0;
        while (this.pending > 0 && steps++ < maxSteps) {
            this.update(this.queueDt, true);
        }
    }
}
