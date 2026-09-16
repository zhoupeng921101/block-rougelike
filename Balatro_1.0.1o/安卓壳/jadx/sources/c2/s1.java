package c2;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s1 extends p1 {
    public s1() {
        super(4);
    }

    public final s1 b(Object obj) {
        obj.getClass();
        int length = this.f2157a.length;
        int a4 = q1.a(length, this.f2158b + 1);
        if (a4 > length || this.f2159c) {
            this.f2157a = Arrays.copyOf(this.f2157a, a4);
            this.f2159c = false;
        }
        Object[] objArr = this.f2157a;
        int i4 = this.f2158b;
        this.f2158b = i4 + 1;
        objArr[i4] = obj;
        return this;
    }

    public final v1 c() {
        this.f2159c = true;
        return v1.j(this.f2157a, this.f2158b);
    }
}
