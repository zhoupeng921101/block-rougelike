package e1;

import android.content.Context;
import android.os.Looper;
import e1.f;
import h1.d;
import h1.q;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: a, reason: collision with root package name */
    private final AbstractC0041a f3139a;

    /* renamed from: b, reason: collision with root package name */
    private final g f3140b;

    /* renamed from: c, reason: collision with root package name */
    private final String f3141c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: e1.a$a, reason: collision with other inner class name */
    public static abstract class AbstractC0041a extends e {
        public f a(Context context, Looper looper, h1.e eVar, Object obj, f.a aVar, f.b bVar) {
            return b(context, looper, eVar, obj, aVar, bVar);
        }

        public f b(Context context, Looper looper, h1.e eVar, Object obj, f1.e eVar2, f1.l lVar) {
            throw new UnsupportedOperationException("buildClient must be implemented");
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class c {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface d {

        /* renamed from: a, reason: collision with root package name */
        public static final C0042a f3142a = new C0042a(null);

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: e1.a$d$a, reason: collision with other inner class name */
        public static final class C0042a implements d {
            /* synthetic */ C0042a(m mVar) {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class e {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface f extends b {
        boolean a();

        Set b();

        void c(String str);

        boolean d();

        void e(h1.k kVar, Set set);

        int f();

        boolean g();

        d1.c[] h();

        String i();

        String j();

        void l();

        boolean m();

        void n(d.e eVar);

        void p(d.c cVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class g extends c {
    }

    public a(String str, AbstractC0041a abstractC0041a, g gVar) {
        q.j(abstractC0041a, "Cannot construct an Api with a null ClientBuilder");
        q.j(gVar, "Cannot construct an Api with a null ClientKey");
        this.f3141c = str;
        this.f3139a = abstractC0041a;
        this.f3140b = gVar;
    }

    public final AbstractC0041a a() {
        return this.f3139a;
    }

    public final c b() {
        return this.f3140b;
    }

    public final String c() {
        return this.f3141c;
    }
}
