package androidx.core.view;

import android.view.View;
import android.view.ViewParent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class n {

    /* renamed from: a, reason: collision with root package name */
    private ViewParent f1076a;

    /* renamed from: b, reason: collision with root package name */
    private ViewParent f1077b;

    /* renamed from: c, reason: collision with root package name */
    private final View f1078c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f1079d;

    /* renamed from: e, reason: collision with root package name */
    private int[] f1080e;

    public n(View view) {
        this.f1078c = view;
    }

    private boolean f(int i4, int i5, int i6, int i7, int[] iArr, int i8, int[] iArr2) {
        ViewParent g4;
        int i9;
        int i10;
        int[] iArr3;
        if (!j() || (g4 = g(i8)) == null) {
            return false;
        }
        if (i4 == 0 && i5 == 0 && i6 == 0 && i7 == 0) {
            if (iArr != null) {
                iArr[0] = 0;
                iArr[1] = 0;
            }
            return false;
        }
        if (iArr != null) {
            this.f1078c.getLocationInWindow(iArr);
            i9 = iArr[0];
            i10 = iArr[1];
        } else {
            i9 = 0;
            i10 = 0;
        }
        if (iArr2 == null) {
            int[] h4 = h();
            h4[0] = 0;
            h4[1] = 0;
            iArr3 = h4;
        } else {
            iArr3 = iArr2;
        }
        z.d(g4, this.f1078c, i4, i5, i6, i7, i8, iArr3);
        if (iArr != null) {
            this.f1078c.getLocationInWindow(iArr);
            iArr[0] = iArr[0] - i9;
            iArr[1] = iArr[1] - i10;
        }
        return true;
    }

    private ViewParent g(int i4) {
        if (i4 == 0) {
            return this.f1076a;
        }
        if (i4 != 1) {
            return null;
        }
        return this.f1077b;
    }

    private int[] h() {
        if (this.f1080e == null) {
            this.f1080e = new int[2];
        }
        return this.f1080e;
    }

    private void l(int i4, ViewParent viewParent) {
        if (i4 == 0) {
            this.f1076a = viewParent;
        } else {
            if (i4 != 1) {
                return;
            }
            this.f1077b = viewParent;
        }
    }

    public boolean a(float f4, float f5, boolean z3) {
        ViewParent g4;
        if (!j() || (g4 = g(0)) == null) {
            return false;
        }
        return z.a(g4, this.f1078c, f4, f5, z3);
    }

    public boolean b(float f4, float f5) {
        ViewParent g4;
        if (!j() || (g4 = g(0)) == null) {
            return false;
        }
        return z.b(g4, this.f1078c, f4, f5);
    }

    public boolean c(int i4, int i5, int[] iArr, int[] iArr2, int i6) {
        ViewParent g4;
        int i7;
        int i8;
        if (!j() || (g4 = g(i6)) == null) {
            return false;
        }
        if (i4 == 0 && i5 == 0) {
            if (iArr2 != null) {
                iArr2[0] = 0;
                iArr2[1] = 0;
            }
            return false;
        }
        if (iArr2 != null) {
            this.f1078c.getLocationInWindow(iArr2);
            i7 = iArr2[0];
            i8 = iArr2[1];
        } else {
            i7 = 0;
            i8 = 0;
        }
        if (iArr == null) {
            iArr = h();
        }
        int[] iArr3 = iArr;
        iArr3[0] = 0;
        iArr3[1] = 0;
        z.c(g4, this.f1078c, i4, i5, iArr3, i6);
        if (iArr2 != null) {
            this.f1078c.getLocationInWindow(iArr2);
            iArr2[0] = iArr2[0] - i7;
            iArr2[1] = iArr2[1] - i8;
        }
        return (iArr3[0] == 0 && iArr3[1] == 0) ? false : true;
    }

    public void d(int i4, int i5, int i6, int i7, int[] iArr, int i8, int[] iArr2) {
        f(i4, i5, i6, i7, iArr, i8, iArr2);
    }

    public boolean e(int i4, int i5, int i6, int i7, int[] iArr) {
        return f(i4, i5, i6, i7, iArr, 0, null);
    }

    public boolean i(int i4) {
        return g(i4) != null;
    }

    public boolean j() {
        return this.f1079d;
    }

    public void k(boolean z3) {
        if (this.f1079d) {
            v.Q(this.f1078c);
        }
        this.f1079d = z3;
    }

    public boolean m(int i4, int i5) {
        if (i(i5)) {
            return true;
        }
        if (!j()) {
            return false;
        }
        View view = this.f1078c;
        for (ViewParent parent = this.f1078c.getParent(); parent != null; parent = parent.getParent()) {
            if (z.f(parent, view, this.f1078c, i4, i5)) {
                l(i5, parent);
                z.e(parent, view, this.f1078c, i4, i5);
                return true;
            }
            if (parent instanceof View) {
                view = (View) parent;
            }
        }
        return false;
    }

    public void n(int i4) {
        ViewParent g4 = g(i4);
        if (g4 != null) {
            z.g(g4, this.f1078c, i4);
            l(i4, null);
        }
    }
}
