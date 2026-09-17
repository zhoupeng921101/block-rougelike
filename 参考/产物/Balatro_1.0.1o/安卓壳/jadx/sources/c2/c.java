package c2;

import android.os.Bundle;
import android.os.IBinder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: b, reason: collision with root package name */
    public final int f2086b;

    /* renamed from: c, reason: collision with root package name */
    public int f2087c = -1;

    /* renamed from: d, reason: collision with root package name */
    public int f2088d = 0;

    /* renamed from: e, reason: collision with root package name */
    public int f2089e = 0;

    /* renamed from: f, reason: collision with root package name */
    public int f2090f = 0;

    /* renamed from: g, reason: collision with root package name */
    public int f2091g = 0;

    /* renamed from: a, reason: collision with root package name */
    public IBinder f2085a = null;

    public c(int i4, IBinder iBinder) {
        this.f2086b = i4;
    }

    public final Bundle a() {
        Bundle bundle = new Bundle();
        bundle.putInt("popupLocationInfo.gravity", this.f2086b);
        bundle.putInt("popupLocationInfo.displayId", this.f2087c);
        bundle.putInt("popupLocationInfo.left", this.f2088d);
        bundle.putInt("popupLocationInfo.top", this.f2089e);
        bundle.putInt("popupLocationInfo.right", this.f2090f);
        bundle.putInt("popupLocationInfo.bottom", this.f2091g);
        return bundle;
    }
}
