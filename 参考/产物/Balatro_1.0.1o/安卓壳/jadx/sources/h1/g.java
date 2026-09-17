package h1;

import android.accounts.Account;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.api.Scope;
import h1.k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g extends i1.a {
    public static final Parcelable.Creator<g> CREATOR = new f1();

    /* renamed from: s, reason: collision with root package name */
    static final Scope[] f3492s = new Scope[0];

    /* renamed from: t, reason: collision with root package name */
    static final d1.c[] f3493t = new d1.c[0];

    /* renamed from: e, reason: collision with root package name */
    final int f3494e;

    /* renamed from: f, reason: collision with root package name */
    final int f3495f;

    /* renamed from: g, reason: collision with root package name */
    final int f3496g;

    /* renamed from: h, reason: collision with root package name */
    String f3497h;

    /* renamed from: i, reason: collision with root package name */
    IBinder f3498i;

    /* renamed from: j, reason: collision with root package name */
    Scope[] f3499j;

    /* renamed from: k, reason: collision with root package name */
    Bundle f3500k;

    /* renamed from: l, reason: collision with root package name */
    Account f3501l;

    /* renamed from: m, reason: collision with root package name */
    d1.c[] f3502m;

    /* renamed from: n, reason: collision with root package name */
    d1.c[] f3503n;

    /* renamed from: o, reason: collision with root package name */
    final boolean f3504o;

    /* renamed from: p, reason: collision with root package name */
    final int f3505p;

    /* renamed from: q, reason: collision with root package name */
    boolean f3506q;

    /* renamed from: r, reason: collision with root package name */
    private final String f3507r;

    g(int i4, int i5, int i6, String str, IBinder iBinder, Scope[] scopeArr, Bundle bundle, Account account, d1.c[] cVarArr, d1.c[] cVarArr2, boolean z3, int i7, boolean z4, String str2) {
        scopeArr = scopeArr == null ? f3492s : scopeArr;
        bundle = bundle == null ? new Bundle() : bundle;
        cVarArr = cVarArr == null ? f3493t : cVarArr;
        cVarArr2 = cVarArr2 == null ? f3493t : cVarArr2;
        this.f3494e = i4;
        this.f3495f = i5;
        this.f3496g = i6;
        if ("com.google.android.gms".equals(str)) {
            this.f3497h = "com.google.android.gms";
        } else {
            this.f3497h = str;
        }
        if (i4 < 2) {
            this.f3501l = iBinder != null ? a.i(k.a.h(iBinder)) : null;
        } else {
            this.f3498i = iBinder;
            this.f3501l = account;
        }
        this.f3499j = scopeArr;
        this.f3500k = bundle;
        this.f3502m = cVarArr;
        this.f3503n = cVarArr2;
        this.f3504o = z3;
        this.f3505p = i7;
        this.f3506q = z4;
        this.f3507r = str2;
    }

    public String h0() {
        return this.f3507r;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        f1.a(this, parcel, i4);
    }
}
