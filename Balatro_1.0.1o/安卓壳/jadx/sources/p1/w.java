package p1;

import android.text.TextUtils;
import e1.a;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class w implements a.d {

    /* renamed from: i, reason: collision with root package name */
    public final int f4649i;

    /* renamed from: k, reason: collision with root package name */
    public final ArrayList f4651k;

    /* renamed from: r, reason: collision with root package name */
    public final String f4658r;

    /* renamed from: s, reason: collision with root package name */
    public final q1.t f4659s;

    /* renamed from: e, reason: collision with root package name */
    public final boolean f4645e = false;

    /* renamed from: f, reason: collision with root package name */
    public final boolean f4646f = true;

    /* renamed from: g, reason: collision with root package name */
    public final int f4647g = 17;

    /* renamed from: h, reason: collision with root package name */
    public final boolean f4648h = false;

    /* renamed from: j, reason: collision with root package name */
    public final String f4650j = null;

    /* renamed from: l, reason: collision with root package name */
    public final boolean f4652l = false;

    /* renamed from: m, reason: collision with root package name */
    public final boolean f4653m = false;

    /* renamed from: n, reason: collision with root package name */
    public final boolean f4654n = false;

    /* renamed from: o, reason: collision with root package name */
    public final String f4655o = null;

    /* renamed from: p, reason: collision with root package name */
    private final int f4656p = 0;

    /* renamed from: q, reason: collision with root package name */
    public final int f4657q = 9;

    /* renamed from: t, reason: collision with root package name */
    public final boolean f4660t = false;

    /* synthetic */ w(boolean z3, boolean z4, int i4, boolean z5, int i5, String str, ArrayList arrayList, boolean z6, boolean z7, boolean z8, String str2, int i6, int i7, String str3, q1.t tVar, boolean z9, byte[] bArr) {
        this.f4649i = i5;
        this.f4651k = arrayList;
        this.f4658r = str3;
        this.f4659s = tVar;
    }

    public static v a() {
        return new v(null);
    }

    public final boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof w) {
            w wVar = (w) obj;
            if (this.f4649i == wVar.f4649i && this.f4651k.equals(wVar.f4651k) && TextUtils.equals(null, null) && h1.o.a(this.f4658r, wVar.f4658r)) {
                return true;
            }
        }
        return false;
    }

    public final int hashCode() {
        int hashCode = ((this.f4649i + 486741695) * 961) + this.f4651k.hashCode();
        String str = this.f4658r;
        return ((((hashCode * 887503681) + 9) * 31) + (str == null ? 0 : str.hashCode())) * 31;
    }
}
