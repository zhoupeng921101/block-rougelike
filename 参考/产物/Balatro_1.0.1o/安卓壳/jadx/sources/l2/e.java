package l2;

import android.util.Base64;
import android.util.JsonWriter;
import j2.f;
import j2.g;
import java.io.Writer;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e implements j2.e, g {

    /* renamed from: a, reason: collision with root package name */
    private e f4156a = null;

    /* renamed from: b, reason: collision with root package name */
    private boolean f4157b = true;

    /* renamed from: c, reason: collision with root package name */
    private final JsonWriter f4158c;

    /* renamed from: d, reason: collision with root package name */
    private final Map f4159d;

    /* renamed from: e, reason: collision with root package name */
    private final Map f4160e;

    /* renamed from: f, reason: collision with root package name */
    private final j2.d f4161f;

    /* renamed from: g, reason: collision with root package name */
    private final boolean f4162g;

    e(Writer writer, Map map, Map map2, j2.d dVar, boolean z3) {
        this.f4158c = new JsonWriter(writer);
        this.f4159d = map;
        this.f4160e = map2;
        this.f4161f = dVar;
        this.f4162g = z3;
    }

    private boolean l(Object obj) {
        return obj == null || obj.getClass().isArray() || (obj instanceof Collection) || (obj instanceof Date) || (obj instanceof Enum) || (obj instanceof Number);
    }

    private e o(String str, Object obj) {
        q();
        this.f4158c.name(str);
        if (obj != null) {
            return f(obj, false);
        }
        this.f4158c.nullValue();
        return this;
    }

    private e p(String str, Object obj) {
        if (obj == null) {
            return this;
        }
        q();
        this.f4158c.name(str);
        return f(obj, false);
    }

    private void q() {
        if (!this.f4157b) {
            throw new IllegalStateException("Parent context used since this context was created. Cannot use this context anymore.");
        }
        e eVar = this.f4156a;
        if (eVar != null) {
            eVar.q();
            this.f4156a.f4157b = false;
            this.f4156a = null;
            this.f4158c.endObject();
        }
    }

    @Override // j2.e
    public j2.e b(j2.c cVar, Object obj) {
        return i(cVar.b(), obj);
    }

    @Override // j2.e
    public j2.e d(j2.c cVar, long j4) {
        return h(cVar.b(), j4);
    }

    public e e(long j4) {
        q();
        this.f4158c.value(j4);
        return this;
    }

    e f(Object obj, boolean z3) {
        if (z3 && l(obj)) {
            throw new j2.b(String.format("%s cannot be encoded inline", obj == null ? null : obj.getClass()));
        }
        if (obj == null) {
            this.f4158c.nullValue();
            return this;
        }
        if (obj instanceof Number) {
            this.f4158c.value((Number) obj);
            return this;
        }
        int i4 = 0;
        if (!obj.getClass().isArray()) {
            if (obj instanceof Collection) {
                this.f4158c.beginArray();
                Iterator it = ((Collection) obj).iterator();
                while (it.hasNext()) {
                    f(it.next(), false);
                }
                this.f4158c.endArray();
                return this;
            }
            if (obj instanceof Map) {
                this.f4158c.beginObject();
                for (Map.Entry entry : ((Map) obj).entrySet()) {
                    Object key = entry.getKey();
                    try {
                        i((String) key, entry.getValue());
                    } catch (ClassCastException e4) {
                        throw new j2.b(String.format("Only String keys are currently supported in maps, got %s of type %s instead.", key, key.getClass()), e4);
                    }
                }
                this.f4158c.endObject();
                return this;
            }
            j2.d dVar = (j2.d) this.f4159d.get(obj.getClass());
            if (dVar != null) {
                return n(dVar, obj, z3);
            }
            f fVar = (f) this.f4160e.get(obj.getClass());
            if (fVar != null) {
                fVar.a(obj, this);
                return this;
            }
            if (!(obj instanceof Enum)) {
                return n(this.f4161f, obj, z3);
            }
            a(((Enum) obj).name());
            return this;
        }
        if (obj instanceof byte[]) {
            return k((byte[]) obj);
        }
        this.f4158c.beginArray();
        if (obj instanceof int[]) {
            int length = ((int[]) obj).length;
            while (i4 < length) {
                this.f4158c.value(r6[i4]);
                i4++;
            }
        } else if (obj instanceof long[]) {
            long[] jArr = (long[]) obj;
            int length2 = jArr.length;
            while (i4 < length2) {
                e(jArr[i4]);
                i4++;
            }
        } else if (obj instanceof double[]) {
            double[] dArr = (double[]) obj;
            int length3 = dArr.length;
            while (i4 < length3) {
                this.f4158c.value(dArr[i4]);
                i4++;
            }
        } else if (obj instanceof boolean[]) {
            boolean[] zArr = (boolean[]) obj;
            int length4 = zArr.length;
            while (i4 < length4) {
                this.f4158c.value(zArr[i4]);
                i4++;
            }
        } else if (obj instanceof Number[]) {
            for (Number number : (Number[]) obj) {
                f(number, false);
            }
        } else {
            for (Object obj2 : (Object[]) obj) {
                f(obj2, false);
            }
        }
        this.f4158c.endArray();
        return this;
    }

    @Override // j2.g
    /* renamed from: g, reason: merged with bridge method [inline-methods] */
    public e a(String str) {
        q();
        this.f4158c.value(str);
        return this;
    }

    public e h(String str, long j4) {
        q();
        this.f4158c.name(str);
        return e(j4);
    }

    public e i(String str, Object obj) {
        return this.f4162g ? p(str, obj) : o(str, obj);
    }

    @Override // j2.g
    /* renamed from: j, reason: merged with bridge method [inline-methods] */
    public e c(boolean z3) {
        q();
        this.f4158c.value(z3);
        return this;
    }

    public e k(byte[] bArr) {
        q();
        if (bArr == null) {
            this.f4158c.nullValue();
            return this;
        }
        this.f4158c.value(Base64.encodeToString(bArr, 2));
        return this;
    }

    void m() {
        q();
        this.f4158c.flush();
    }

    e n(j2.d dVar, Object obj, boolean z3) {
        if (!z3) {
            this.f4158c.beginObject();
        }
        dVar.a(obj, this);
        if (!z3) {
            this.f4158c.endObject();
        }
        return this;
    }
}
