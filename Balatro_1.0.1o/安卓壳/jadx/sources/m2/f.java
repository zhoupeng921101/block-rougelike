package m2;

import a1.b2.c3;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.Charset;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import m2.d;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f implements j2.e {

    /* renamed from: f, reason: collision with root package name */
    private static final Charset f4182f = Charset.forName("UTF-8");

    /* renamed from: g, reason: collision with root package name */
    private static final j2.c f4183g = j2.c.a("key").b(m2.a.b().c(1).a()).a();

    /* renamed from: h, reason: collision with root package name */
    private static final j2.c f4184h = j2.c.a("value").b(m2.a.b().c(2).a()).a();

    /* renamed from: i, reason: collision with root package name */
    private static final j2.d f4185i = new j2.d() { // from class: m2.e
        @Override // j2.d
        public final void a(Object obj, Object obj2) {
            f.a((Map.Entry) obj, (j2.e) obj2);
        }
    };

    /* renamed from: a, reason: collision with root package name */
    private OutputStream f4186a;

    /* renamed from: b, reason: collision with root package name */
    private final Map f4187b;

    /* renamed from: c, reason: collision with root package name */
    private final Map f4188c;

    /* renamed from: d, reason: collision with root package name */
    private final j2.d f4189d;

    /* renamed from: e, reason: collision with root package name */
    private final i f4190e = new i(this);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class a {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f4191a;

        static {
            int[] iArr = new int[d.a.values().length];
            f4191a = iArr;
            try {
                iArr[d.a.DEFAULT.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f4191a[d.a.SIGNED.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f4191a[d.a.FIXED.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
        }
    }

    f(OutputStream outputStream, Map map, Map map2, j2.d dVar) {
        this.f4186a = outputStream;
        this.f4187b = map;
        this.f4188c = map2;
        this.f4189d = dVar;
    }

    public static /* synthetic */ void a(Map.Entry entry, j2.e eVar) {
        eVar.b(f4183g, entry.getKey());
        eVar.b(f4184h, entry.getValue());
    }

    private static ByteBuffer l(int i4) {
        return ByteBuffer.allocate(i4).order(ByteOrder.LITTLE_ENDIAN);
    }

    private long m(j2.d dVar, Object obj) {
        b bVar = new b();
        try {
            OutputStream outputStream = this.f4186a;
            this.f4186a = bVar;
            try {
                dVar.a(obj, this);
                this.f4186a = outputStream;
                long a4 = bVar.a();
                bVar.close();
                return a4;
            } catch (Throwable th) {
                this.f4186a = outputStream;
                throw th;
            }
        } catch (Throwable th2) {
            try {
                bVar.close();
            } catch (Throwable th3) {
                th2.addSuppressed(th3);
            }
            throw th2;
        }
    }

    private f n(j2.d dVar, j2.c cVar, Object obj, boolean z3) {
        long m3 = m(dVar, obj);
        if (z3 && m3 == 0) {
            return this;
        }
        s((r(cVar) << 3) | 2);
        t(m3);
        dVar.a(obj, this);
        return this;
    }

    private f o(j2.f fVar, j2.c cVar, Object obj, boolean z3) {
        this.f4190e.d(cVar, z3);
        fVar.a(obj, this.f4190e);
        return this;
    }

    private static d q(j2.c cVar) {
        d dVar = (d) cVar.c(d.class);
        if (dVar != null) {
            return dVar;
        }
        throw new j2.b("Field has no @Protobuf config");
    }

    private static int r(j2.c cVar) {
        d dVar = (d) cVar.c(d.class);
        if (dVar != null) {
            return dVar.tag();
        }
        throw new j2.b(c3.d4(80));
    }

    private void s(int i4) {
        while ((i4 & (-128)) != 0) {
            this.f4186a.write((i4 & 127) | 128);
            i4 >>>= 7;
        }
        this.f4186a.write(i4 & 127);
    }

    private void t(long j4) {
        while (((-128) & j4) != 0) {
            this.f4186a.write((((int) j4) & 127) | 128);
            j4 >>>= 7;
        }
        this.f4186a.write(((int) j4) & 127);
    }

    @Override // j2.e
    public j2.e b(j2.c cVar, Object obj) {
        return f(cVar, obj, true);
    }

    j2.e c(j2.c cVar, double d4, boolean z3) {
        if (z3 && d4 == 0.0d) {
            return this;
        }
        s((r(cVar) << 3) | 1);
        this.f4186a.write(l(8).putDouble(d4).array());
        return this;
    }

    j2.e e(j2.c cVar, float f4, boolean z3) {
        if (z3 && f4 == 0.0f) {
            return this;
        }
        s((r(cVar) << 3) | 5);
        this.f4186a.write(l(4).putFloat(f4).array());
        return this;
    }

    j2.e f(j2.c cVar, Object obj, boolean z3) {
        if (obj != null) {
            if (obj instanceof CharSequence) {
                CharSequence charSequence = (CharSequence) obj;
                if (!z3 || charSequence.length() != 0) {
                    s((r(cVar) << 3) | 2);
                    byte[] bytes = charSequence.toString().getBytes(f4182f);
                    s(bytes.length);
                    this.f4186a.write(bytes);
                    return this;
                }
            } else if (obj instanceof Collection) {
                Iterator it = ((Collection) obj).iterator();
                while (it.hasNext()) {
                    f(cVar, it.next(), false);
                }
            } else if (obj instanceof Map) {
                Iterator it2 = ((Map) obj).entrySet().iterator();
                while (it2.hasNext()) {
                    n(f4185i, cVar, (Map.Entry) it2.next(), false);
                }
            } else {
                if (obj instanceof Double) {
                    return c(cVar, ((Double) obj).doubleValue(), z3);
                }
                if (obj instanceof Float) {
                    return e(cVar, ((Float) obj).floatValue(), z3);
                }
                if (obj instanceof Number) {
                    return j(cVar, ((Number) obj).longValue(), z3);
                }
                if (obj instanceof Boolean) {
                    return k(cVar, ((Boolean) obj).booleanValue(), z3);
                }
                if (!(obj instanceof byte[])) {
                    j2.d dVar = (j2.d) this.f4187b.get(obj.getClass());
                    if (dVar != null) {
                        return n(dVar, cVar, obj, z3);
                    }
                    j2.f fVar = (j2.f) this.f4188c.get(obj.getClass());
                    return fVar != null ? o(fVar, cVar, obj, z3) : obj instanceof c ? g(cVar, ((c) obj).a()) : obj instanceof Enum ? g(cVar, ((Enum) obj).ordinal()) : n(this.f4189d, cVar, obj, z3);
                }
                byte[] bArr = (byte[]) obj;
                if (!z3 || bArr.length != 0) {
                    s((r(cVar) << 3) | 2);
                    s(bArr.length);
                    this.f4186a.write(bArr);
                    return this;
                }
            }
        }
        return this;
    }

    public f g(j2.c cVar, int i4) {
        return h(cVar, i4, true);
    }

    f h(j2.c cVar, int i4, boolean z3) {
        if (!z3 || i4 != 0) {
            d q3 = q(cVar);
            int i5 = a.f4191a[q3.intEncoding().ordinal()];
            if (i5 == 1) {
                s(q3.tag() << 3);
                s(i4);
                return this;
            }
            if (i5 == 2) {
                s(q3.tag() << 3);
                s((i4 << 1) ^ (i4 >> 31));
                return this;
            }
            if (i5 == 3) {
                s((q3.tag() << 3) | 5);
                this.f4186a.write(l(4).putInt(i4).array());
                return this;
            }
        }
        return this;
    }

    @Override // j2.e
    /* renamed from: i, reason: merged with bridge method [inline-methods] */
    public f d(j2.c cVar, long j4) {
        return j(cVar, j4, true);
    }

    f j(j2.c cVar, long j4, boolean z3) {
        if (!z3 || j4 != 0) {
            d q3 = q(cVar);
            int i4 = a.f4191a[q3.intEncoding().ordinal()];
            if (i4 == 1) {
                s(q3.tag() << 3);
                t(j4);
                return this;
            }
            if (i4 == 2) {
                s(q3.tag() << 3);
                t((j4 >> 63) ^ (j4 << 1));
                return this;
            }
            if (i4 == 3) {
                s((q3.tag() << 3) | 1);
                this.f4186a.write(l(8).putLong(j4).array());
                return this;
            }
        }
        return this;
    }

    f k(j2.c cVar, boolean z3, boolean z4) {
        return h(cVar, z3 ? 1 : 0, z4);
    }

    f p(Object obj) {
        if (obj == null) {
            return this;
        }
        j2.d dVar = (j2.d) this.f4187b.get(obj.getClass());
        if (dVar != null) {
            dVar.a(obj, this);
            return this;
        }
        throw new j2.b(c3.d4(488) + obj.getClass());
    }
}
