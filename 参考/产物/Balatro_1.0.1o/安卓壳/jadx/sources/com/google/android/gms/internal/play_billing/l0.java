package com.google.android.gms.internal.play_billing;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class l0 implements Map, Serializable {

    /* renamed from: e, reason: collision with root package name */
    private transient n0 f2858e;

    /* renamed from: f, reason: collision with root package name */
    private transient n0 f2859f;

    /* renamed from: g, reason: collision with root package name */
    private transient f0 f2860g;

    l0() {
    }

    public static l0 c(Object obj, Object obj2, Object obj3, Object obj4, Object obj5, Object obj6) {
        d0.a("com.android.vending.billing.PURCHASES_UPDATED", obj2);
        d0.a("com.android.vending.billing.LOCAL_BROADCAST_PURCHASES_UPDATED", obj4);
        d0.a("com.android.vending.billing.ALTERNATIVE_BILLING", obj6);
        return v0.g(3, new Object[]{"com.android.vending.billing.PURCHASES_UPDATED", obj2, "com.android.vending.billing.LOCAL_BROADCAST_PURCHASES_UPDATED", obj4, "com.android.vending.billing.ALTERNATIVE_BILLING", obj6}, null);
    }

    abstract f0 a();

    @Override // java.util.Map
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public final f0 values() {
        f0 f0Var = this.f2860g;
        if (f0Var != null) {
            return f0Var;
        }
        f0 a4 = a();
        this.f2860g = a4;
        return a4;
    }

    @Override // java.util.Map
    public final void clear() {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.Map
    public final boolean containsKey(Object obj) {
        return get(obj) != null;
    }

    @Override // java.util.Map
    public final boolean containsValue(Object obj) {
        return values().contains(obj);
    }

    abstract n0 d();

    abstract n0 e();

    @Override // java.util.Map
    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Map) {
            return entrySet().equals(((Map) obj).entrySet());
        }
        return false;
    }

    @Override // java.util.Map
    /* renamed from: f, reason: merged with bridge method [inline-methods] */
    public final n0 entrySet() {
        n0 n0Var = this.f2858e;
        if (n0Var != null) {
            return n0Var;
        }
        n0 d4 = d();
        this.f2858e = d4;
        return d4;
    }

    @Override // java.util.Map
    public abstract Object get(Object obj);

    @Override // java.util.Map
    public final Object getOrDefault(Object obj, Object obj2) {
        Object obj3 = get(obj);
        return obj3 != null ? obj3 : obj2;
    }

    @Override // java.util.Map
    public final int hashCode() {
        return w0.a(entrySet());
    }

    @Override // java.util.Map
    public final boolean isEmpty() {
        return size() == 0;
    }

    @Override // java.util.Map
    public final /* bridge */ /* synthetic */ Set keySet() {
        n0 n0Var = this.f2859f;
        if (n0Var != null) {
            return n0Var;
        }
        n0 e4 = e();
        this.f2859f = e4;
        return e4;
    }

    @Override // java.util.Map
    public final Object put(Object obj, Object obj2) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.Map
    public final void putAll(Map map) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.Map
    public final Object remove(Object obj) {
        throw new UnsupportedOperationException();
    }

    public final String toString() {
        int size = size();
        if (size < 0) {
            throw new IllegalArgumentException("size cannot be negative but was: " + size);
        }
        StringBuilder sb = new StringBuilder((int) Math.min(size * 8, 1073741824L));
        sb.append('{');
        boolean z3 = true;
        for (Map.Entry entry : entrySet()) {
            if (!z3) {
                sb.append(a1.b2.c3.d4(1417));
            }
            sb.append(entry.getKey());
            sb.append('=');
            sb.append(entry.getValue());
            z3 = false;
        }
        sb.append('}');
        return sb.toString();
    }
}
