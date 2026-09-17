package androidx.appcompat.widget;

import android.R;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h0 {

    /* renamed from: a, reason: collision with root package name */
    private static final ThreadLocal f572a = new ThreadLocal();

    /* renamed from: b, reason: collision with root package name */
    static final int[] f573b = {-16842910};

    /* renamed from: c, reason: collision with root package name */
    static final int[] f574c = {R.attr.state_focused};

    /* renamed from: d, reason: collision with root package name */
    static final int[] f575d = {R.attr.state_activated};

    /* renamed from: e, reason: collision with root package name */
    static final int[] f576e = {R.attr.state_pressed};

    /* renamed from: f, reason: collision with root package name */
    static final int[] f577f = {R.attr.state_checked};

    /* renamed from: g, reason: collision with root package name */
    static final int[] f578g = {R.attr.state_selected};

    /* renamed from: h, reason: collision with root package name */
    static final int[] f579h = {-16842919, -16842908};

    /* renamed from: i, reason: collision with root package name */
    static final int[] f580i = new int[0];

    /* renamed from: j, reason: collision with root package name */
    private static final int[] f581j = new int[1];

    public static void a(View view, Context context) {
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(c.i.f1986k0);
        try {
            if (!obtainStyledAttributes.hasValue(c.i.f1990l0)) {
                Log.e("ThemeUtils", "View " + view.getClass() + " is an AppCompat widget that can only be used with a Theme.AppCompat theme (or descendant).");
            }
        } finally {
            obtainStyledAttributes.recycle();
        }
    }

    public static int b(Context context, int i4) {
        ColorStateList e4 = e(context, i4);
        if (e4 != null && e4.isStateful()) {
            return e4.getColorForState(f573b, e4.getDefaultColor());
        }
        TypedValue f4 = f();
        context.getTheme().resolveAttribute(R.attr.disabledAlpha, f4, true);
        return d(context, i4, f4.getFloat());
    }

    public static int c(Context context, int i4) {
        int[] iArr = f581j;
        iArr[0] = i4;
        l0 r3 = l0.r(context, null, iArr);
        try {
            return r3.b(0, 0);
        } finally {
            r3.t();
        }
    }

    static int d(Context context, int i4, float f4) {
        return androidx.core.graphics.a.f(c(context, i4), Math.round(Color.alpha(r0) * f4));
    }

    public static ColorStateList e(Context context, int i4) {
        int[] iArr = f581j;
        iArr[0] = i4;
        l0 r3 = l0.r(context, null, iArr);
        try {
            return r3.c(0);
        } finally {
            r3.t();
        }
    }

    private static TypedValue f() {
        ThreadLocal threadLocal = f572a;
        TypedValue typedValue = (TypedValue) threadLocal.get();
        if (typedValue != null) {
            return typedValue;
        }
        TypedValue typedValue2 = new TypedValue();
        threadLocal.set(typedValue2);
        return typedValue2;
    }
}
