package g1;

import android.net.Uri;
import com.google.android.gms.common.data.DataHolder;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class d {

    /* renamed from: e, reason: collision with root package name */
    protected final DataHolder f3342e;

    /* renamed from: f, reason: collision with root package name */
    protected int f3343f;

    /* renamed from: g, reason: collision with root package name */
    private int f3344g;

    public d(DataHolder dataHolder, int i4) {
        this.f3342e = (DataHolder) q.i(dataHolder);
        S(i4);
    }

    protected String H(String str) {
        return this.f3342e.m0(str, this.f3343f, this.f3344g);
    }

    public boolean I(String str) {
        return this.f3342e.o0(str);
    }

    protected boolean O(String str) {
        return this.f3342e.p0(str, this.f3343f, this.f3344g);
    }

    protected Uri Q(String str) {
        String m02 = this.f3342e.m0(str, this.f3343f, this.f3344g);
        if (m02 == null) {
            return null;
        }
        return Uri.parse(m02);
    }

    protected final void S(int i4) {
        boolean z3 = false;
        if (i4 >= 0 && i4 < this.f3342e.getCount()) {
            z3 = true;
        }
        q.k(z3);
        this.f3343f = i4;
        this.f3344g = this.f3342e.n0(i4);
    }

    protected boolean o(String str) {
        return this.f3342e.h0(str, this.f3343f, this.f3344g);
    }

    protected float q(String str) {
        return this.f3342e.q0(str, this.f3343f, this.f3344g);
    }

    protected int v(String str) {
        return this.f3342e.i0(str, this.f3343f, this.f3344g);
    }

    protected long y(String str) {
        return this.f3342e.j0(str, this.f3343f, this.f3344g);
    }
}
