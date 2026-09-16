package e1;

import a1.b2.c3;
import android.accounts.Account;
import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import com.google.android.gms.common.api.GoogleApiActivity;
import e1.a;
import f1.d0;
import f1.i0;
import f1.s0;
import f1.v;
import h1.e;
import h1.q;
import java.util.Collections;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e {

    /* renamed from: a, reason: collision with root package name */
    private final Context f3144a;

    /* renamed from: b, reason: collision with root package name */
    private final String f3145b;

    /* renamed from: c, reason: collision with root package name */
    private final e1.a f3146c;

    /* renamed from: d, reason: collision with root package name */
    private final a.d f3147d;

    /* renamed from: e, reason: collision with root package name */
    private final f1.b f3148e;

    /* renamed from: f, reason: collision with root package name */
    private final Looper f3149f;

    /* renamed from: g, reason: collision with root package name */
    private final int f3150g;

    /* renamed from: h, reason: collision with root package name */
    private final f f3151h;

    /* renamed from: i, reason: collision with root package name */
    private final f1.o f3152i;

    /* renamed from: j, reason: collision with root package name */
    protected final f1.f f3153j;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: c, reason: collision with root package name */
        public static final a f3154c = new C0043a().a();

        /* renamed from: a, reason: collision with root package name */
        public final f1.o f3155a;

        /* renamed from: b, reason: collision with root package name */
        public final Looper f3156b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: e1.e$a$a, reason: collision with other inner class name */
        public static class C0043a {

            /* renamed from: a, reason: collision with root package name */
            private f1.o f3157a;

            /* renamed from: b, reason: collision with root package name */
            private Looper f3158b;

            /* JADX WARN: Multi-variable type inference failed */
            public a a() {
                if (this.f3157a == null) {
                    this.f3157a = new f1.a();
                }
                if (this.f3158b == null) {
                    this.f3158b = Looper.getMainLooper();
                }
                return new a(this.f3157a, this.f3158b);
            }

            public C0043a b(f1.o oVar) {
                q.j(oVar, "StatusExceptionMapper must not be null.");
                this.f3157a = oVar;
                return this;
            }
        }

        private a(f1.o oVar, Account account, Looper looper) {
            this.f3155a = oVar;
            this.f3156b = looper;
        }
    }

    public e(Activity activity, e1.a aVar, a.d dVar, a aVar2) {
        this(activity, activity, aVar, dVar, aVar2);
    }

    private e(Context context, Activity activity, e1.a aVar, a.d dVar, a aVar2) {
        q.j(context, "Null context is not permitted.");
        q.j(aVar, "Api must not be null.");
        q.j(aVar2, c3.d4(935));
        Context context2 = (Context) q.j(context.getApplicationContext(), "The provided context did not have an application context.");
        this.f3144a = context2;
        String attributionTag = Build.VERSION.SDK_INT >= 30 ? context.getAttributionTag() : j(context);
        this.f3145b = attributionTag;
        this.f3146c = aVar;
        this.f3147d = dVar;
        this.f3149f = aVar2.f3156b;
        f1.b a4 = f1.b.a(aVar, dVar, attributionTag);
        this.f3148e = a4;
        this.f3151h = new i0(this);
        f1.f u3 = f1.f.u(context2);
        this.f3153j = u3;
        this.f3150g = u3.l();
        this.f3152i = aVar2.f3155a;
        if (activity != null && !(activity instanceof GoogleApiActivity) && Looper.myLooper() == Looper.getMainLooper()) {
            v.u(activity, u3, a4);
        }
        u3.F(this);
    }

    public e(Context context, e1.a aVar, a.d dVar, a aVar2) {
        this(context, null, aVar, dVar, aVar2);
    }

    private final com.google.android.gms.common.api.internal.a s(int i4, com.google.android.gms.common.api.internal.a aVar) {
        aVar.l();
        this.f3153j.A(this, i4, aVar);
        return aVar;
    }

    private final g2.h t(int i4, f1.q qVar) {
        g2.i iVar = new g2.i();
        this.f3153j.B(this, i4, qVar, iVar, this.f3152i);
        return iVar.a();
    }

    public f d() {
        return this.f3151h;
    }

    protected e.a e() {
        e.a aVar = new e.a();
        aVar.d(null);
        aVar.c(Collections.EMPTY_SET);
        aVar.e(this.f3144a.getClass().getName());
        aVar.b(this.f3144a.getPackageName());
        return aVar;
    }

    public g2.h f(f1.q qVar) {
        return t(2, qVar);
    }

    public g2.h g(f1.q qVar) {
        return t(0, qVar);
    }

    public com.google.android.gms.common.api.internal.a h(com.google.android.gms.common.api.internal.a aVar) {
        s(1, aVar);
        return aVar;
    }

    public g2.h i(f1.q qVar) {
        return t(1, qVar);
    }

    protected String j(Context context) {
        return null;
    }

    public final f1.b k() {
        return this.f3148e;
    }

    public a.d l() {
        return this.f3147d;
    }

    public Context m() {
        return this.f3144a;
    }

    protected String n() {
        return this.f3145b;
    }

    public Looper o() {
        return this.f3149f;
    }

    public final int p() {
        return this.f3150g;
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final a.f q(Looper looper, d0 d0Var) {
        h1.e a4 = e().a();
        a.f a5 = ((a.AbstractC0041a) q.i(this.f3146c.a())).a(this.f3144a, looper, a4, this.f3147d, d0Var, d0Var);
        String n3 = n();
        if (n3 != null && (a5 instanceof h1.d)) {
            ((h1.d) a5).O(n3);
        }
        if (n3 == null || !(a5 instanceof f1.k)) {
            return a5;
        }
        h.d.a(a5);
        throw null;
    }

    public final s0 r(Context context, Handler handler) {
        return new s0(context, handler, e().a());
    }
}
