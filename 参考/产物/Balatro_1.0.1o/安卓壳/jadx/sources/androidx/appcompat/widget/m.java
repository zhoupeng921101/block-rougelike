package androidx.appcompat.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.PopupWindow;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class m extends PopupWindow {

    /* renamed from: b, reason: collision with root package name */
    private static final boolean f605b = false;

    /* renamed from: a, reason: collision with root package name */
    private boolean f606a;

    public m(Context context, AttributeSet attributeSet, int i4, int i5) {
        super(context, attributeSet, i4, i5);
        a(context, attributeSet, i4, i5);
    }

    private void a(Context context, AttributeSet attributeSet, int i4, int i5) {
        l0 s3 = l0.s(context, attributeSet, c.i.f2007p1, i4, i5);
        if (s3.p(c.i.f2015r1)) {
            b(s3.a(c.i.f2015r1, false));
        }
        setBackgroundDrawable(s3.f(c.i.f2011q1));
        s3.t();
    }

    private void b(boolean z3) {
        if (f605b) {
            this.f606a = z3;
        } else {
            androidx.core.widget.f.a(this, z3);
        }
    }

    @Override // android.widget.PopupWindow
    public void showAsDropDown(View view, int i4, int i5) {
        if (f605b && this.f606a) {
            i5 -= view.getHeight();
        }
        super.showAsDropDown(view, i4, i5);
    }

    @Override // android.widget.PopupWindow
    public void showAsDropDown(View view, int i4, int i5, int i6) {
        if (f605b && this.f606a) {
            i5 -= view.getHeight();
        }
        super.showAsDropDown(view, i4, i5, i6);
    }

    @Override // android.widget.PopupWindow
    public void update(View view, int i4, int i5, int i6, int i7) {
        if (f605b && this.f606a) {
            i5 -= view.getHeight();
        }
        super.update(view, i4, i5, i6, i7);
    }
}
