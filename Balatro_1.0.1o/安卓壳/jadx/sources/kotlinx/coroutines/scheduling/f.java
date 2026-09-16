package kotlinx.coroutines.scheduling;

import i3.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f extends q {

    /* renamed from: g, reason: collision with root package name */
    private final int f4038g;

    /* renamed from: h, reason: collision with root package name */
    private final int f4039h;

    /* renamed from: i, reason: collision with root package name */
    private final long f4040i;

    /* renamed from: j, reason: collision with root package name */
    private final String f4041j;

    /* renamed from: k, reason: collision with root package name */
    private a f4042k = d();

    public f(int i4, int i5, long j4, String str) {
        this.f4038g = i4;
        this.f4039h = i5;
        this.f4040i = j4;
        this.f4041j = str;
    }

    private final a d() {
        return new a(this.f4038g, this.f4039h, this.f4040i, this.f4041j);
    }

    @Override // i3.c
    public void a(v2.e eVar, Runnable runnable) {
        a.f(this.f4042k, runnable, null, false, 6, null);
    }

    public final void e(Runnable runnable, i iVar, boolean z3) {
        this.f4042k.e(runnable, iVar, z3);
    }
}
