package j3;

import android.os.Handler;
import android.os.Looper;
import b3.d;
import b3.f;
import i3.j;
import i3.l;
import i3.s;
import java.util.concurrent.CancellationException;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends b implements j {
    private volatile a _immediate;

    /* renamed from: f, reason: collision with root package name */
    private final Handler f3835f;

    /* renamed from: g, reason: collision with root package name */
    private final String f3836g;

    /* renamed from: h, reason: collision with root package name */
    private final boolean f3837h;

    /* renamed from: i, reason: collision with root package name */
    private final a f3838i;

    public a(Handler handler, String str) {
        this(handler, str, false);
    }

    public /* synthetic */ a(Handler handler, String str, int i4, d dVar) {
        this(handler, (i4 & 2) != 0 ? null : str);
    }

    private a(Handler handler, String str, boolean z3) {
        super(null);
        this.f3835f = handler;
        this.f3836g = str;
        this.f3837h = z3;
        this._immediate = z3 ? this : null;
        a aVar = this._immediate;
        if (aVar == null) {
            aVar = new a(handler, str, true);
            this._immediate = aVar;
        }
        this.f3838i = aVar;
    }

    private final void f(e eVar, Runnable runnable) {
        s.a(eVar, new CancellationException("The task was rejected, the handler underlying the dispatcher '" + this + "' was closed"));
        l.a().a(eVar, runnable);
    }

    @Override // i3.c
    public void a(e eVar, Runnable runnable) {
        if (this.f3835f.post(runnable)) {
            return;
        }
        f(eVar, runnable);
    }

    @Override // i3.c
    public boolean b(e eVar) {
        return (this.f3837h && f.a(Looper.myLooper(), this.f3835f.getLooper())) ? false : true;
    }

    public boolean equals(Object obj) {
        return (obj instanceof a) && ((a) obj).f3835f == this.f3835f;
    }

    @Override // i3.u
    /* renamed from: g, reason: merged with bridge method [inline-methods] */
    public a d() {
        return this.f3838i;
    }

    public int hashCode() {
        return System.identityHashCode(this.f3835f);
    }

    @Override // i3.c
    public String toString() {
        String e4 = e();
        if (e4 != null) {
            return e4;
        }
        String str = this.f3836g;
        if (str == null) {
            str = this.f3835f.toString();
        }
        return this.f3837h ? f.j(str, ".immediate") : str;
    }
}
