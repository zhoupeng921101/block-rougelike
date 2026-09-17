package androidx.core.os;

import android.os.LocaleList;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d {

    /* renamed from: b, reason: collision with root package name */
    private static final d f942b = a(new Locale[0]);

    /* renamed from: a, reason: collision with root package name */
    private final e f943a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static LocaleList a(Locale... localeArr) {
            return new LocaleList(localeArr);
        }

        static LocaleList b() {
            return LocaleList.getAdjustedDefault();
        }

        static LocaleList c() {
            return LocaleList.getDefault();
        }
    }

    private d(e eVar) {
        this.f943a = eVar;
    }

    public static d a(Locale... localeArr) {
        return c(a.a(localeArr));
    }

    public static d c(LocaleList localeList) {
        return new d(new f(localeList));
    }

    public Locale b(int i4) {
        return this.f943a.get(i4);
    }

    public boolean equals(Object obj) {
        return (obj instanceof d) && this.f943a.equals(((d) obj).f943a);
    }

    public int hashCode() {
        return this.f943a.hashCode();
    }

    public String toString() {
        return this.f943a.toString();
    }
}
