package com.android.billingclient.api;

import a1.b2.c3;
import android.app.Activity;
import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: com.android.billingclient.api.a$a, reason: collision with other inner class name */
    public static final class C0032a {

        /* renamed from: a, reason: collision with root package name */
        private volatile e f2230a;

        /* renamed from: b, reason: collision with root package name */
        private final Context f2231b;

        /* renamed from: c, reason: collision with root package name */
        private volatile e0.i f2232c;

        /* renamed from: d, reason: collision with root package name */
        private volatile boolean f2233d;

        /* renamed from: e, reason: collision with root package name */
        private volatile boolean f2234e;

        /* renamed from: f, reason: collision with root package name */
        private volatile boolean f2235f;

        /* renamed from: g, reason: collision with root package name */
        private volatile boolean f2236g;

        /* renamed from: h, reason: collision with root package name */
        private volatile boolean f2237h;

        /* renamed from: i, reason: collision with root package name */
        volatile boolean f2238i;

        /* synthetic */ C0032a(Context context, e0.o oVar) {
            this.f2231b = context;
        }

        private final boolean e() {
            try {
                Context context = this.f2231b;
                return context.getPackageManager().getApplicationInfo(context.getPackageName(), 128).metaData.getBoolean("com.google.android.play.billingclient.enableBillingOverridesTesting", false);
            } catch (Exception e4) {
                com.google.android.gms.internal.play_billing.m0.n(c3.d4(1361), "Unable to retrieve metadata value for enableBillingOverridesTesting.", e4);
                return false;
            }
        }

        public a a() {
            Context context = this.f2231b;
            if (context == null) {
                throw new IllegalArgumentException("Please provide a valid Context.");
            }
            if (this.f2232c == null) {
                if (this.f2233d || this.f2234e || this.f2235f || this.f2236g || this.f2237h) {
                    return e() ? new m0(null, context, null, null, this) : new b(null, context, null, null, this);
                }
                throw new IllegalArgumentException("Please provide a valid listener for purchases updates.");
            }
            if (this.f2230a == null || !this.f2230a.a()) {
                throw new IllegalArgumentException("Pending purchases for one-time products must be supported.");
            }
            if (this.f2232c == null) {
                e eVar = this.f2230a;
                return e() ? new m0(null, eVar, context, null, null, null, this) : new b(null, eVar, context, null, null, null, this);
            }
            e eVar2 = this.f2230a;
            e0.i iVar = this.f2232c;
            return e() ? new m0(null, eVar2, context, iVar, null, null, null, this) : new b(null, eVar2, context, iVar, null, null, null, this);
        }

        public C0032a b() {
            this.f2238i = true;
            return this;
        }

        public C0032a c(e eVar) {
            this.f2230a = eVar;
            return this;
        }

        public C0032a d(e0.i iVar) {
            this.f2232c = iVar;
            return this;
        }
    }

    public static C0032a d(Context context) {
        return new C0032a(context, null);
    }

    public abstract void a(e0.a aVar, e0.b bVar);

    public abstract boolean b();

    public abstract d c(Activity activity, c cVar);

    public abstract void e(g gVar, e0.g gVar2);

    public abstract void f(e0.j jVar, e0.h hVar);

    public abstract void g(e0.d dVar);
}
