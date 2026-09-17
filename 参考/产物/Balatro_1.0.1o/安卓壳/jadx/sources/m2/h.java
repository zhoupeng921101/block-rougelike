package m2;

import a1.b2.c3;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import m2.h;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class h {

    /* renamed from: a, reason: collision with root package name */
    private final Map f4192a;

    /* renamed from: b, reason: collision with root package name */
    private final Map f4193b;

    /* renamed from: c, reason: collision with root package name */
    private final j2.d f4194c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a implements k2.b {

        /* renamed from: d, reason: collision with root package name */
        private static final j2.d f4195d = new j2.d() { // from class: m2.g
            @Override // j2.d
            public final void a(Object obj, Object obj2) {
                h.a.b(obj, (j2.e) obj2);
            }
        };

        /* renamed from: a, reason: collision with root package name */
        private final Map f4196a = new HashMap();

        /* renamed from: b, reason: collision with root package name */
        private final Map f4197b = new HashMap();

        /* renamed from: c, reason: collision with root package name */
        private j2.d f4198c = f4195d;

        public static /* synthetic */ void b(Object obj, j2.e eVar) {
            throw new j2.b(c3.d4(297) + obj.getClass().getCanonicalName());
        }

        public h c() {
            return new h(new HashMap(this.f4196a), new HashMap(this.f4197b), this.f4198c);
        }

        public a d(k2.a aVar) {
            aVar.a(this);
            return this;
        }

        @Override // k2.b
        /* renamed from: e, reason: merged with bridge method [inline-methods] */
        public a a(Class cls, j2.d dVar) {
            this.f4196a.put(cls, dVar);
            this.f4197b.remove(cls);
            return this;
        }
    }

    h(Map map, Map map2, j2.d dVar) {
        this.f4192a = map;
        this.f4193b = map2;
        this.f4194c = dVar;
    }

    public static a a() {
        return new a();
    }

    public void b(Object obj, OutputStream outputStream) {
        new f(outputStream, this.f4192a, this.f4193b, this.f4194c).p(obj);
    }

    public byte[] c(Object obj) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            b(obj, byteArrayOutputStream);
        } catch (IOException unused) {
        }
        return byteArrayOutputStream.toByteArray();
    }
}
