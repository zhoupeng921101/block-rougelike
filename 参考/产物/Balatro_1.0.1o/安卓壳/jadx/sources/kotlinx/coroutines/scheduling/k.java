package kotlinx.coroutines.scheduling;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k extends h {

    /* renamed from: g, reason: collision with root package name */
    public final Runnable f4046g;

    public k(Runnable runnable, long j4, i iVar) {
        super(j4, iVar);
        this.f4046g = runnable;
    }

    @Override // java.lang.Runnable
    public void run() {
        try {
            this.f4046g.run();
        } finally {
            this.f4044f.a();
        }
    }

    public String toString() {
        return c3.d4(891) + i3.g.a(this.f4046g) + '@' + i3.g.b(this.f4046g) + ", " + this.f4043e + ", " + this.f4044f + ']';
    }
}
