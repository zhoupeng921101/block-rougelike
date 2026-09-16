package com.google.android.gms.internal.play_billing;

import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class n0 extends f0 implements Set {

    /* renamed from: f, reason: collision with root package name */
    private transient i0 f2868f;

    n0() {
    }

    @Override // java.util.Collection, java.util.Set
    public final boolean equals(Object obj) {
        if (obj == this || obj == this) {
            return true;
        }
        if (obj instanceof Set) {
            Set set = (Set) obj;
            try {
                if (size() == set.size()) {
                    return containsAll(set);
                }
            } catch (ClassCastException | NullPointerException unused) {
            }
        }
        return false;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    public i0 g() {
        i0 i0Var = this.f2868f;
        if (i0Var != null) {
            return i0Var;
        }
        i0 j4 = j();
        this.f2868f = j4;
        return j4;
    }

    @Override // java.util.Collection, java.util.Set
    public final int hashCode() {
        return w0.a(this);
    }

    i0 j() {
        Object[] array = toArray();
        int i4 = i0.f2785g;
        return i0.k(array, array.length);
    }
}
