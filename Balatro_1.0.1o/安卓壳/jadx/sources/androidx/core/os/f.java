package androidx.core.os;

import android.os.LocaleList;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f implements e {

    /* renamed from: a, reason: collision with root package name */
    private final LocaleList f944a;

    f(Object obj) {
        this.f944a = (LocaleList) obj;
    }

    @Override // androidx.core.os.e
    public Object a() {
        return this.f944a;
    }

    public boolean equals(Object obj) {
        return this.f944a.equals(((e) obj).a());
    }

    @Override // androidx.core.os.e
    public Locale get(int i4) {
        return this.f944a.get(i4);
    }

    public int hashCode() {
        return this.f944a.hashCode();
    }

    public String toString() {
        return this.f944a.toString();
    }
}
