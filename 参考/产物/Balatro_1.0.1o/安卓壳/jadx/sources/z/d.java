package z;

import a1.b2.c3;
import android.os.Bundle;
import androidx.lifecycle.g;
import androidx.savedstate.Recreator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d {

    /* renamed from: d, reason: collision with root package name */
    public static final a f5192d = new a(null);

    /* renamed from: a, reason: collision with root package name */
    private final e f5193a;

    /* renamed from: b, reason: collision with root package name */
    private final c f5194b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f5195c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }

        public final d a(e eVar) {
            b3.f.e(eVar, c3.d4(813));
            return new d(eVar, null);
        }
    }

    private d(e eVar) {
        this.f5193a = eVar;
        this.f5194b = new c();
    }

    public /* synthetic */ d(e eVar, b3.d dVar) {
        this(eVar);
    }

    public static final d a(e eVar) {
        return f5192d.a(eVar);
    }

    public final c b() {
        return this.f5194b;
    }

    public final void c() {
        g q3 = this.f5193a.q();
        b3.f.d(q3, c3.d4(101));
        if (q3.b() != g.c.INITIALIZED) {
            throw new IllegalStateException("Restarter must be created only during owner's initialization stage");
        }
        q3.a(new Recreator(this.f5193a));
        this.f5194b.e(q3);
        this.f5195c = true;
    }

    public final void d(Bundle bundle) {
        if (!this.f5195c) {
            c();
        }
        g q3 = this.f5193a.q();
        b3.f.d(q3, "owner.lifecycle");
        if (!q3.b().a(g.c.STARTED)) {
            this.f5194b.f(bundle);
            return;
        }
        throw new IllegalStateException(("performRestore cannot be called when owner is " + q3.b()).toString());
    }

    public final void e(Bundle bundle) {
        b3.f.e(bundle, "outBundle");
        this.f5194b.g(bundle);
    }
}
