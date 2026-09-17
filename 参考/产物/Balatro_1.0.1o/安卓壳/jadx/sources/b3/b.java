package b3;

import a1.b2.c3;
import a3.j;
import a3.k;
import a3.l;
import a3.m;
import a3.n;
import a3.o;
import a3.p;
import a3.q;
import a3.r;
import a3.s;
import a3.t;
import a3.u;
import a3.v;
import a3.w;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b implements f3.a, b3.a {

    /* renamed from: b, reason: collision with root package name */
    public static final a f1818b = new a(null);

    /* renamed from: c, reason: collision with root package name */
    private static final Map f1819c;

    /* renamed from: d, reason: collision with root package name */
    private static final HashMap f1820d;

    /* renamed from: e, reason: collision with root package name */
    private static final HashMap f1821e;

    /* renamed from: f, reason: collision with root package name */
    private static final HashMap f1822f;

    /* renamed from: g, reason: collision with root package name */
    private static final Map f1823g;

    /* renamed from: a, reason: collision with root package name */
    private final Class f1824a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(d dVar) {
            this();
        }
    }

    static {
        List c4 = u2.g.c(a3.a.class, l.class, p.class, q.class, r.class, s.class, t.class, u.class, v.class, w.class, a3.b.class, a3.c.class, a3.d.class, a3.e.class, a3.f.class, a3.g.class, a3.h.class, a3.i.class, j.class, k.class, m.class, n.class, o.class);
        ArrayList arrayList = new ArrayList(u2.g.f(c4, 10));
        int i4 = 0;
        for (Object obj : c4) {
            int i5 = i4 + 1;
            if (i4 < 0) {
                u2.g.e();
            }
            arrayList.add(t2.l.a((Class) obj, Integer.valueOf(i4)));
            i4 = i5;
        }
        f1819c = u2.w.g(arrayList);
        HashMap hashMap = new HashMap();
        hashMap.put("boolean", "kotlin.Boolean");
        hashMap.put("char", "kotlin.Char");
        hashMap.put("byte", "kotlin.Byte");
        hashMap.put("short", "kotlin.Short");
        hashMap.put("int", "kotlin.Int");
        hashMap.put("float", "kotlin.Float");
        hashMap.put("long", "kotlin.Long");
        hashMap.put("double", "kotlin.Double");
        f1820d = hashMap;
        HashMap hashMap2 = new HashMap();
        hashMap2.put("java.lang.Boolean", "kotlin.Boolean");
        hashMap2.put("java.lang.Character", "kotlin.Char");
        hashMap2.put(c3.d4(282), "kotlin.Byte");
        hashMap2.put("java.lang.Short", "kotlin.Short");
        hashMap2.put("java.lang.Integer", "kotlin.Int");
        hashMap2.put("java.lang.Float", "kotlin.Float");
        hashMap2.put("java.lang.Long", "kotlin.Long");
        hashMap2.put("java.lang.Double", "kotlin.Double");
        f1821e = hashMap2;
        HashMap hashMap3 = new HashMap();
        hashMap3.put("java.lang.Object", "kotlin.Any");
        hashMap3.put("java.lang.String", "kotlin.String");
        hashMap3.put("java.lang.CharSequence", c3.d4(1066));
        hashMap3.put("java.lang.Throwable", c3.d4(191));
        hashMap3.put("java.lang.Cloneable", "kotlin.Cloneable");
        hashMap3.put("java.lang.Number", c3.d4(877));
        hashMap3.put("java.lang.Comparable", c3.d4(826));
        hashMap3.put(c3.d4(774), "kotlin.Enum");
        hashMap3.put(c3.d4(60), c3.d4(1272));
        hashMap3.put("java.lang.Iterable", "kotlin.collections.Iterable");
        hashMap3.put("java.util.Iterator", c3.d4(1443));
        hashMap3.put("java.util.Collection", "kotlin.collections.Collection");
        hashMap3.put("java.util.List", "kotlin.collections.List");
        hashMap3.put("java.util.Set", "kotlin.collections.Set");
        hashMap3.put(c3.d4(283), c3.d4(1444));
        hashMap3.put(c3.d4(330), c3.d4(371));
        hashMap3.put("java.util.Map$Entry", c3.d4(517));
        hashMap3.put("kotlin.jvm.internal.StringCompanionObject", "kotlin.String.Companion");
        hashMap3.put(c3.d4(1158), c3.d4(372));
        hashMap3.putAll(hashMap);
        hashMap3.putAll(hashMap2);
        Collection<String> values = hashMap.values();
        f.d(values, "primitiveFqNames.values");
        for (String str : values) {
            StringBuilder sb = new StringBuilder();
            sb.append("kotlin.jvm.internal.");
            f.d(str, c3.d4(916));
            sb.append(h3.c.k(str, '.', null, 2, null));
            sb.append("CompanionObject");
            t2.h a4 = t2.l.a(sb.toString(), str + ".Companion");
            hashMap3.put(a4.c(), a4.d());
        }
        for (Map.Entry entry : f1819c.entrySet()) {
            hashMap3.put(((Class) entry.getKey()).getName(), c3.d4(284) + ((Number) entry.getValue()).intValue());
        }
        f1822f = hashMap3;
        LinkedHashMap linkedHashMap = new LinkedHashMap(u2.w.a(hashMap3.size()));
        for (Map.Entry entry2 : hashMap3.entrySet()) {
            linkedHashMap.put(entry2.getKey(), h3.c.k((String) entry2.getValue(), '.', null, 2, null));
        }
        f1823g = linkedHashMap;
    }

    public b(Class cls) {
        f.e(cls, "jClass");
        this.f1824a = cls;
    }

    @Override // b3.a
    public Class a() {
        return this.f1824a;
    }

    public boolean equals(Object obj) {
        return (obj instanceof b) && f.a(z2.a.b(this), z2.a.b((f3.a) obj));
    }

    public int hashCode() {
        return z2.a.b(this).hashCode();
    }

    public String toString() {
        return a().toString() + c3.d4(111);
    }
}
