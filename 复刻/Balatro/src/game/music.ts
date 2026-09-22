/**
 * 背景音乐与管风琴氛围音：`misc_functions.lua:722` 的 `modulate_sound` 与 `engine/sound_manager.lua` 的
 * `MODULATE` / `SET_SFX` / `RESTART_MUSIC` / `AMBIENT`。
 *
 * - 五条音轨（music1..5）**同时播放**、同一时刻起步，按当前状态挑一条「想要的」：
 *   开奥秘 / 幽灵 / 标准包 music2、天体包 music3、小丑包 music2、商店 music4、Boss 盲注 music5，其余 music1。
 *   每条的音量每帧 `v ← 目标·3dt + (1 − 3dt)·v` 往 1（想要的）或 0 靠，所以换状态是交叉淡变
 * - 起步时音高 0.7、音量 0.6（`RESTART_MUSIC`）；任何一条播完就五条一起重来。
 *   音高再乘 `PITCH_MOD`：游戏结束时每帧往 0.5 靠（`PITCH_MOD ← PITCH_MOD·(1 − dt) + dt·目标`）
 * - `ambientOrgan1`：打出的这一手 `筹码 × 倍率` 相对盲注要求越高越响——
 *   `organ = clamp(0.1·log₅(earned/(required + 1)), 0, 0.4)`，音量 `v ← v·(1 − dt) + dt·0.6·organ`（音乐音量 100 时），音高 0.7
 *
 * 音量口径与复刻件的音效一致：原作两边都再乘 `volume/100`（缺省 50）与各自的分类音量（缺省都是 100），
 * 复刻件的音效直接用原文的 `vol`，所以这里也不乘。
 * 只动 Phaser 的 `WebAudioSound`；`rate` 与 LÖVE 的 `setPitch` 一样同时改音高与速度。
 */
import type { Scene, Sound } from 'phaser';

export const MUSIC_KEYS = ['music1', 'music2', 'music3', 'music4', 'music5'] as const;
export type MusicKey = (typeof MUSIC_KEYS)[number];

export type MusicState = {
    /** 想要的那一条（`desired_track`） */
    track: MusicKey;
    /** `G.STATE == GAME_OVER`（音高往 0.5 靠） */
    gameOver: boolean;
    /** `G.GAME.current_round.current_hand.chips × mult` 与 `G.GAME.blind.chips` */
    earned: number;
    required: number;
    /** `score_intensity.flames` 与两团火的 `change` 之和（`ambientFire1..3`） */
    flames: number;
    fireChange: number;
};

/** `modulate_sound` 里挑音轨那一段 */
export function desiredTrack(s: { packKind: string | null; packFading: string | null; inShop: boolean; boss: boolean }): MusicKey {
    // 粒子还没移除（关包后淡出 1 秒）也算：`G.booster_pack_sparkles and not REMOVED`
    const kind = s.packKind ?? s.packFading;
    if (kind === 'Celestial') return 'music3';
    if (kind) return 'music2';
    if (s.inShop) return 'music4';
    if (s.boss) return 'music5';
    return 'music1';
}

/** `score_intensity.organ` */
export function organIntensity(earned: number, required: number): number {
    if (required <= 0 || earned <= 0) return 0;
    return Math.max(Math.min(0.4, 0.1 * (Math.log(earned / (required + 1)) / Math.log(5))), 0);
}

type Track = { sound: Sound.WebAudioSound; volume: number };

/** `G.ARGS.ambient_sounds` 的四条：音量每帧按各自的式子走，音高固定 */
const AMBIENT: Array<{ key: string; per: number; vol: (prev: number, dt: number, s: MusicState) => number }> = [
    { key: 'ambientFire2', per: 1.05, vol: (v, dt, s) => v * (1 - dt) + dt * 0.9 * (s.flames > 0.3 ? 1 : s.flames / 0.3) },
    { key: 'ambientFire1', per: 1.1, vol: (v, dt, s) => v * (1 - dt) + dt * 0.8 * (s.flames > 0.3 ? (s.flames - 0.3) / 0.7 : 0) },
    { key: 'ambientFire3', per: 1, vol: (v, dt, s) => v * (1 - dt) + dt * 0.4 * s.fireChange },
    { key: 'ambientOrgan1', per: 0.7, vol: (v, dt, s) => v * (1 - dt) + dt * 0.6 * organIntensity(s.earned, s.required) },
];

export class Music {
    private tracks: Track[] | null = null;
    private ambient = new Map<string, { sound: Sound.WebAudioSound | null; volume: number }>();
    private pitchMod = 1;
    private lastT = -1;

    constructor(private readonly scene: Scene) {}

    /** 素材到齐了才能起（音乐 14M，在场景起来之后才加载） */
    get ready(): boolean {
        return MUSIC_KEYS.every((k) => this.scene.cache.audio.exists(k));
    }

    /** `RESTART_MUSIC`：五条全停、一起从头放，想要的那条音量 1、其余 0 */
    private restart(desired: MusicKey): void {
        for (const t of this.tracks ?? []) t.sound.destroy();
        this.tracks = MUSIC_KEYS.map((k) => {
            const sound = this.scene.sound.add(k) as Sound.WebAudioSound;
            const volume = k === desired ? 1 : 0;
            sound.play({ volume: volume * 0.6, rate: 0.7 * this.pitchMod });
            return { sound, volume };
        });
    }

    update(now: number, s: MusicState): void {
        const dt = this.lastT < 0 ? 0 : Math.min(now - this.lastT, 0.1);
        this.lastT = now;
        if (!this.ready || this.scene.sound.locked) return;
        this.pitchMod = this.pitchMod * (1 - dt) + dt * (s.gameOver ? 0.5 : 1);
        if (!this.tracks || this.tracks.some((t) => !t.sound.isPlaying && !t.sound.isPaused)) this.restart(s.track);
        const k = Math.min(1, dt * 3);
        this.tracks!.forEach((t, i) => {
            const target = MUSIC_KEYS[i] === s.track ? 1 : 0;
            t.volume = target * k + (1 - k) * t.volume;
            t.sound.setVolume(t.volume * 0.6);
            t.sound.setRate(0.7 * this.pitchMod);
        });

        // `AMBIENT`：音量起来了（> 0）才开始放，放着就只改音量，播完音量还在就再放
        for (const a of AMBIENT) {
            const cur = this.ambient.get(a.key) ?? { sound: null, volume: 0 };
            cur.volume = a.vol(cur.volume, dt, s);
            this.ambient.set(a.key, cur);
            if (!this.scene.cache.audio.exists(a.key)) continue;
            if (cur.volume > 0.001 && (!cur.sound || !cur.sound.isPlaying)) {
                cur.sound?.destroy();
                cur.sound = this.scene.sound.add(a.key) as Sound.WebAudioSound;
                cur.sound.play({ volume: cur.volume, rate: a.per });
            }
            cur.sound?.setVolume(cur.volume);
        }
    }
}
