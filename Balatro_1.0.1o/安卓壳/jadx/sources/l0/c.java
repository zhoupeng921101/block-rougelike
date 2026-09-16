package l0;

import a1.b2.c3;
import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends h {

    /* renamed from: a, reason: collision with root package name */
    private final Context f4121a;

    /* renamed from: b, reason: collision with root package name */
    private final u0.a f4122b;

    /* renamed from: c, reason: collision with root package name */
    private final u0.a f4123c;

    /* renamed from: d, reason: collision with root package name */
    private final String f4124d;

    c(Context context, u0.a aVar, u0.a aVar2, String str) {
        if (context == null) {
            throw new NullPointerException(c3.d4(702));
        }
        this.f4121a = context;
        if (aVar == null) {
            throw new NullPointerException("Null wallClock");
        }
        this.f4122b = aVar;
        if (aVar2 == null) {
            throw new NullPointerException("Null monotonicClock");
        }
        this.f4123c = aVar2;
        if (str == null) {
            throw new NullPointerException(c3.d4(26));
        }
        this.f4124d = str;
    }

    @Override // l0.h
    public Context b() {
        return this.f4121a;
    }

    @Override // l0.h
    public String c() {
        return this.f4124d;
    }

    @Override // l0.h
    public u0.a d() {
        return this.f4123c;
    }

    @Override // l0.h
    public u0.a e() {
        return this.f4122b;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof h) {
            h hVar = (h) obj;
            if (this.f4121a.equals(hVar.b()) && this.f4122b.equals(hVar.e()) && this.f4123c.equals(hVar.d()) && this.f4124d.equals(hVar.c())) {
                return true;
            }
        }
        return false;
    }

    public int hashCode() {
        return ((((((this.f4121a.hashCode() ^ 1000003) * 1000003) ^ this.f4122b.hashCode()) * 1000003) ^ this.f4123c.hashCode()) * 1000003) ^ this.f4124d.hashCode();
    }

    public String toString() {
        return "CreationContext{applicationContext=" + this.f4121a + ", wallClock=" + this.f4122b + ", monotonicClock=" + this.f4123c + c3.d4(296) + this.f4124d + "}";
    }
}
