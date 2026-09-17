package androidx.appcompat.widget;

import a1.b2.c3;
import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Resources;
import android.graphics.Rect;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.TextView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class t0 {

    /* renamed from: a, reason: collision with root package name */
    private final Context f686a;

    /* renamed from: b, reason: collision with root package name */
    private final View f687b;

    /* renamed from: c, reason: collision with root package name */
    private final TextView f688c;

    /* renamed from: d, reason: collision with root package name */
    private final WindowManager.LayoutParams f689d;

    /* renamed from: e, reason: collision with root package name */
    private final Rect f690e;

    /* renamed from: f, reason: collision with root package name */
    private final int[] f691f;

    /* renamed from: g, reason: collision with root package name */
    private final int[] f692g;

    t0(Context context) {
        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
        this.f689d = layoutParams;
        this.f690e = new Rect();
        this.f691f = new int[2];
        this.f692g = new int[2];
        this.f686a = context;
        View inflate = LayoutInflater.from(context).inflate(c.f.f1931m, (ViewGroup) null);
        this.f687b = inflate;
        this.f688c = (TextView) inflate.findViewById(c.e.f1905m);
        layoutParams.setTitle(getClass().getSimpleName());
        layoutParams.packageName = context.getPackageName();
        layoutParams.type = 1002;
        layoutParams.width = -2;
        layoutParams.height = -2;
        layoutParams.format = -3;
        layoutParams.windowAnimations = c.h.f1944a;
        layoutParams.flags = 24;
    }

    private void a(View view, int i4, int i5, boolean z3, WindowManager.LayoutParams layoutParams) {
        int height;
        int i6;
        layoutParams.token = view.getApplicationWindowToken();
        int dimensionPixelOffset = this.f686a.getResources().getDimensionPixelOffset(c.c.f1864k);
        if (view.getWidth() < dimensionPixelOffset) {
            i4 = view.getWidth() / 2;
        }
        if (view.getHeight() >= dimensionPixelOffset) {
            int dimensionPixelOffset2 = this.f686a.getResources().getDimensionPixelOffset(c.c.f1863j);
            height = i5 + dimensionPixelOffset2;
            i6 = i5 - dimensionPixelOffset2;
        } else {
            height = view.getHeight();
            i6 = 0;
        }
        layoutParams.gravity = 49;
        int dimensionPixelOffset3 = this.f686a.getResources().getDimensionPixelOffset(z3 ? c.c.f1866m : c.c.f1865l);
        View b4 = b(view);
        if (b4 == null) {
            Log.e(c3.d4(1100), "Cannot find app view");
            return;
        }
        b4.getWindowVisibleDisplayFrame(this.f690e);
        Rect rect = this.f690e;
        if (rect.left < 0 && rect.top < 0) {
            Resources resources = this.f686a.getResources();
            int identifier = resources.getIdentifier(c3.d4(467), c3.d4(716), c3.d4(866));
            int dimensionPixelSize = identifier != 0 ? resources.getDimensionPixelSize(identifier) : 0;
            DisplayMetrics displayMetrics = resources.getDisplayMetrics();
            this.f690e.set(0, dimensionPixelSize, displayMetrics.widthPixels, displayMetrics.heightPixels);
        }
        b4.getLocationOnScreen(this.f692g);
        view.getLocationOnScreen(this.f691f);
        int[] iArr = this.f691f;
        int i7 = iArr[0];
        int[] iArr2 = this.f692g;
        int i8 = i7 - iArr2[0];
        iArr[0] = i8;
        iArr[1] = iArr[1] - iArr2[1];
        layoutParams.x = (i8 + i4) - (b4.getWidth() / 2);
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, 0);
        this.f687b.measure(makeMeasureSpec, makeMeasureSpec);
        int measuredHeight = this.f687b.getMeasuredHeight();
        int i9 = this.f691f[1];
        int i10 = ((i6 + i9) - dimensionPixelOffset3) - measuredHeight;
        int i11 = i9 + height + dimensionPixelOffset3;
        if (z3) {
            if (i10 >= 0) {
                layoutParams.y = i10;
                return;
            } else {
                layoutParams.y = i11;
                return;
            }
        }
        if (measuredHeight + i11 <= this.f690e.height()) {
            layoutParams.y = i11;
        } else {
            layoutParams.y = i10;
        }
    }

    private static View b(View view) {
        View rootView = view.getRootView();
        ViewGroup.LayoutParams layoutParams = rootView.getLayoutParams();
        if (!(layoutParams instanceof WindowManager.LayoutParams) || ((WindowManager.LayoutParams) layoutParams).type != 2) {
            for (Context context = view.getContext(); context instanceof ContextWrapper; context = ((ContextWrapper) context).getBaseContext()) {
                if (context instanceof Activity) {
                    return ((Activity) context).getWindow().getDecorView();
                }
            }
        }
        return rootView;
    }

    void c() {
        if (d()) {
            ((WindowManager) this.f686a.getSystemService("window")).removeView(this.f687b);
        }
    }

    boolean d() {
        return this.f687b.getParent() != null;
    }

    void e(View view, int i4, int i5, boolean z3, CharSequence charSequence) {
        if (d()) {
            c();
        }
        this.f688c.setText(charSequence);
        a(view, i4, i5, z3, this.f689d);
        ((WindowManager) this.f686a.getSystemService("window")).addView(this.f687b, this.f689d);
    }
}
