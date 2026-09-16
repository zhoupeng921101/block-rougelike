package l2;

import a1.b2.c3;
import j2.f;
import j2.g;
import java.io.Writer;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d implements k2.b {

    /* renamed from: e, reason: collision with root package name */
    private static final j2.d f4146e = new j2.d() { // from class: l2.a
        @Override // j2.d
        public final void a(Object obj, Object obj2) {
            d.c(obj, (j2.e) obj2);
        }
    };

    /* renamed from: f, reason: collision with root package name */
    private static final f f4147f = new f() { // from class: l2.b
        @Override // j2.f
        public final void a(Object obj, Object obj2) {
            ((g) obj2).a((String) obj);
        }
    };

    /* renamed from: g, reason: collision with root package name */
    private static final f f4148g = new f() { // from class: l2.c
        @Override // j2.f
        public final void a(Object obj, Object obj2) {
            ((g) obj2).c(((Boolean) obj).booleanValue());
        }
    };

    /* renamed from: h, reason: collision with root package name */
    private static final b f4149h = new b(null);

    /* renamed from: a, reason: collision with root package name */
    private final Map f4150a = new HashMap();

    /* renamed from: b, reason: collision with root package name */
    private final Map f4151b = new HashMap();

    /* renamed from: c, reason: collision with root package name */
    private j2.d f4152c = f4146e;

    /* renamed from: d, reason: collision with root package name */
    private boolean f4153d = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements j2.a {
        a() {
        }

        @Override // j2.a
        public void a(Object obj, Writer writer) {
            e eVar = new e(writer, d.this.f4150a, d.this.f4151b, d.this.f4152c, d.this.f4153d);
            eVar.f(obj, false);
            eVar.m();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class b implements f {

        /* renamed from: a, reason: collision with root package name */
        private static final DateFormat f4155a;

        static {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            f4155a = simpleDateFormat;
            simpleDateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        }

        private b() {
        }

        /* synthetic */ b(a aVar) {
            this();
        }

        @Override // j2.f
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public void a(Date date, g gVar) {
            gVar.a(f4155a.format(date));
        }
    }

    public d() {
        m(String.class, f4147f);
        m(Boolean.class, f4148g);
        m(Date.class, f4149h);
    }

    public static /* synthetic */ void c(Object obj, j2.e eVar) {
        throw new j2.b(c3.d4(262) + obj.getClass().getCanonicalName());
    }

    public j2.a i() {
        return new a();
    }

    public d j(k2.a aVar) {
        aVar.a(this);
        return this;
    }

    public d k(boolean z3) {
        this.f4153d = z3;
        return this;
    }

    @Override // k2.b
    /* renamed from: l, reason: merged with bridge method [inline-methods] */
    public d a(Class cls, j2.d dVar) {
        this.f4150a.put(cls, dVar);
        this.f4151b.remove(cls);
        return this;
    }

    public d m(Class cls, f fVar) {
        this.f4151b.put(cls, fVar);
        this.f4150a.remove(cls);
        return this;
    }
}
