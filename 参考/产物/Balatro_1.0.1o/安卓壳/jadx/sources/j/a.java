package j;

import j.b;
import java.util.HashMap;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends b {

    /* renamed from: i, reason: collision with root package name */
    private HashMap f3655i = new HashMap();

    public boolean contains(Object obj) {
        return this.f3655i.containsKey(obj);
    }

    @Override // j.b
    protected b.c e(Object obj) {
        return (b.c) this.f3655i.get(obj);
    }

    @Override // j.b
    public Object i(Object obj, Object obj2) {
        b.c e4 = e(obj);
        if (e4 != null) {
            return e4.f3661f;
        }
        this.f3655i.put(obj, h(obj, obj2));
        return null;
    }

    @Override // j.b
    public Object j(Object obj) {
        Object j4 = super.j(obj);
        this.f3655i.remove(obj);
        return j4;
    }

    public Map.Entry k(Object obj) {
        if (contains(obj)) {
            return ((b.c) this.f3655i.get(obj)).f3663h;
        }
        return null;
    }
}
