package androidx.lifecycle;

import a1.b2.c3;
import android.os.Bundle;
import java.util.Iterator;
import java.util.Map;
import z.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class v implements c.InterfaceC0086c {

    /* renamed from: a, reason: collision with root package name */
    private final z.c f1697a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f1698b;

    /* renamed from: c, reason: collision with root package name */
    private Bundle f1699c;

    /* renamed from: d, reason: collision with root package name */
    private final t2.d f1700d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class a extends b3.g implements a3.a {

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ b0 f1701f;

        /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
        a(b0 b0Var) {
            super(0);
            this.f1701f = b0Var;
        }

        @Override // a3.a
        /* renamed from: d, reason: merged with bridge method [inline-methods] */
        public final w a() {
            return u.b(this.f1701f);
        }
    }

    public v(z.c cVar, b0 b0Var) {
        b3.f.e(cVar, "savedStateRegistry");
        b3.f.e(b0Var, c3.d4(1315));
        this.f1697a = cVar;
        this.f1700d = t2.e.a(new a(b0Var));
    }

    private final w b() {
        return (w) this.f1700d.getValue();
    }

    @Override // z.c.InterfaceC0086c
    public Bundle a() {
        Bundle bundle = new Bundle();
        Bundle bundle2 = this.f1699c;
        if (bundle2 != null) {
            bundle.putAll(bundle2);
        }
        Iterator it = b().e().entrySet().iterator();
        if (!it.hasNext()) {
            this.f1698b = false;
            return bundle;
        }
        Map.Entry entry = (Map.Entry) it.next();
        h.d.a(entry.getValue());
        throw null;
    }

    public final void c() {
        if (this.f1698b) {
            return;
        }
        this.f1699c = this.f1697a.b("androidx.lifecycle.internal.SavedStateHandlesProvider");
        this.f1698b = true;
        b();
    }
}
