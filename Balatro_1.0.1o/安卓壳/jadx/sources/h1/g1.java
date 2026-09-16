package h1;

import android.content.ComponentName;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g1 {

    /* renamed from: a, reason: collision with root package name */
    private final String f3510a;

    /* renamed from: b, reason: collision with root package name */
    private final String f3511b;

    /* renamed from: c, reason: collision with root package name */
    private final ComponentName f3512c;

    /* renamed from: d, reason: collision with root package name */
    private final int f3513d;

    /* renamed from: e, reason: collision with root package name */
    private final boolean f3514e;

    public g1(String str, String str2, int i4, boolean z3) {
        q.f(str);
        this.f3510a = str;
        q.f(str2);
        this.f3511b = str2;
        this.f3512c = null;
        this.f3513d = 4225;
        this.f3514e = z3;
    }

    public final String a() {
        return this.f3510a;
    }

    public final String b() {
        return this.f3511b;
    }

    public final ComponentName c() {
        return this.f3512c;
    }

    public final boolean d() {
        return this.f3514e;
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof g1)) {
            return false;
        }
        g1 g1Var = (g1) obj;
        return o.a(this.f3510a, g1Var.f3510a) && o.a(this.f3511b, g1Var.f3511b) && o.a(this.f3512c, g1Var.f3512c) && this.f3514e == g1Var.f3514e;
    }

    public final int hashCode() {
        return o.b(this.f3510a, this.f3511b, this.f3512c, 4225, Boolean.valueOf(this.f3514e));
    }

    public final String toString() {
        String str = this.f3510a;
        if (str != null) {
            return str;
        }
        ComponentName componentName = this.f3512c;
        q.i(componentName);
        return componentName.flattenToString();
    }
}
