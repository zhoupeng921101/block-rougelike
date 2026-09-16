package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.RectF;
import android.os.Build;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextDirectionHeuristic;
import android.text.TextDirectionHeuristics;
import android.text.TextPaint;
import android.text.method.TransformationMethod;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.widget.TextView;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.ConcurrentHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class q {

    /* renamed from: l, reason: collision with root package name */
    private static final RectF f658l = new RectF();

    /* renamed from: m, reason: collision with root package name */
    private static ConcurrentHashMap f659m = new ConcurrentHashMap();

    /* renamed from: n, reason: collision with root package name */
    private static ConcurrentHashMap f660n = new ConcurrentHashMap();

    /* renamed from: a, reason: collision with root package name */
    private int f661a = 0;

    /* renamed from: b, reason: collision with root package name */
    private boolean f662b = false;

    /* renamed from: c, reason: collision with root package name */
    private float f663c = -1.0f;

    /* renamed from: d, reason: collision with root package name */
    private float f664d = -1.0f;

    /* renamed from: e, reason: collision with root package name */
    private float f665e = -1.0f;

    /* renamed from: f, reason: collision with root package name */
    private int[] f666f = new int[0];

    /* renamed from: g, reason: collision with root package name */
    private boolean f667g = false;

    /* renamed from: h, reason: collision with root package name */
    private TextPaint f668h;

    /* renamed from: i, reason: collision with root package name */
    private final TextView f669i;

    /* renamed from: j, reason: collision with root package name */
    private final Context f670j;

    /* renamed from: k, reason: collision with root package name */
    private final f f671k;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class a {
        static StaticLayout a(CharSequence charSequence, Layout.Alignment alignment, int i4, TextView textView, TextPaint textPaint) {
            return new StaticLayout(charSequence, textPaint, i4, alignment, textView.getLineSpacingMultiplier(), textView.getLineSpacingExtra(), textView.getIncludeFontPadding());
        }

        static int b(TextView textView) {
            return textView.getMaxLines();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class b {
        static boolean a(View view) {
            return view.isInLayout();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class c {
        static StaticLayout a(CharSequence charSequence, Layout.Alignment alignment, int i4, int i5, TextView textView, TextPaint textPaint, f fVar) {
            StaticLayout.Builder obtain = StaticLayout.Builder.obtain(charSequence, 0, charSequence.length(), textPaint, i4);
            StaticLayout.Builder hyphenationFrequency = obtain.setAlignment(alignment).setLineSpacing(textView.getLineSpacingExtra(), textView.getLineSpacingMultiplier()).setIncludePad(textView.getIncludeFontPadding()).setBreakStrategy(textView.getBreakStrategy()).setHyphenationFrequency(textView.getHyphenationFrequency());
            if (i5 == -1) {
                i5 = Integer.MAX_VALUE;
            }
            hyphenationFrequency.setMaxLines(i5);
            try {
                fVar.a(obtain, textView);
            } catch (ClassCastException unused) {
                Log.w("ACTVAutoSizeHelper", "Failed to obtain TextDirectionHeuristic, auto size may be incorrect");
            }
            return obtain.build();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class d extends f {
        d() {
        }

        @Override // androidx.appcompat.widget.q.f
        void a(StaticLayout.Builder builder, TextView textView) {
            builder.setTextDirection((TextDirectionHeuristic) q.m(textView, "getTextDirectionHeuristic", TextDirectionHeuristics.FIRSTSTRONG_LTR));
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class e extends d {
        e() {
        }

        @Override // androidx.appcompat.widget.q.d, androidx.appcompat.widget.q.f
        void a(StaticLayout.Builder builder, TextView textView) {
            TextDirectionHeuristic textDirectionHeuristic;
            textDirectionHeuristic = textView.getTextDirectionHeuristic();
            builder.setTextDirection(textDirectionHeuristic);
        }

        @Override // androidx.appcompat.widget.q.f
        boolean b(TextView textView) {
            boolean isHorizontallyScrollable;
            isHorizontallyScrollable = textView.isHorizontallyScrollable();
            return isHorizontallyScrollable;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class f {
        f() {
        }

        abstract void a(StaticLayout.Builder builder, TextView textView);

        boolean b(TextView textView) {
            return ((Boolean) q.m(textView, c3.d4(1099), Boolean.FALSE)).booleanValue();
        }
    }

    q(TextView textView) {
        this.f669i = textView;
        this.f670j = textView.getContext();
        if (Build.VERSION.SDK_INT >= 29) {
            this.f671k = new e();
        } else {
            this.f671k = new d();
        }
    }

    private int[] b(int[] iArr) {
        int length = iArr.length;
        if (length != 0) {
            Arrays.sort(iArr);
            ArrayList arrayList = new ArrayList();
            for (int i4 : iArr) {
                if (i4 > 0 && Collections.binarySearch(arrayList, Integer.valueOf(i4)) < 0) {
                    arrayList.add(Integer.valueOf(i4));
                }
            }
            if (length != arrayList.size()) {
                int size = arrayList.size();
                int[] iArr2 = new int[size];
                for (int i5 = 0; i5 < size; i5++) {
                    iArr2[i5] = ((Integer) arrayList.get(i5)).intValue();
                }
                return iArr2;
            }
        }
        return iArr;
    }

    private void c() {
        this.f661a = 0;
        this.f664d = -1.0f;
        this.f665e = -1.0f;
        this.f663c = -1.0f;
        this.f666f = new int[0];
        this.f662b = false;
    }

    private int e(RectF rectF) {
        int length = this.f666f.length;
        if (length == 0) {
            throw new IllegalStateException("No available text sizes to choose from.");
        }
        int i4 = 1;
        int i5 = length - 1;
        int i6 = 0;
        while (i4 <= i5) {
            int i7 = (i4 + i5) / 2;
            if (x(this.f666f[i7], rectF)) {
                int i8 = i7 + 1;
                i6 = i4;
                i4 = i8;
            } else {
                i6 = i7 - 1;
                i5 = i6;
            }
        }
        return this.f666f[i6];
    }

    private static Method k(String str) {
        try {
            Method method = (Method) f659m.get(str);
            if (method != null || (method = TextView.class.getDeclaredMethod(str, null)) == null) {
                return method;
            }
            method.setAccessible(true);
            f659m.put(str, method);
            return method;
        } catch (Exception e4) {
            Log.w("ACTVAutoSizeHelper", "Failed to retrieve TextView#" + str + "() method", e4);
            return null;
        }
    }

    static Object m(Object obj, String str, Object obj2) {
        try {
            return k(str).invoke(obj, null);
        } catch (Exception e4) {
            Log.w("ACTVAutoSizeHelper", c3.d4(277) + str + "() method", e4);
            return obj2;
        }
    }

    private void s(float f4) {
        if (f4 != this.f669i.getPaint().getTextSize()) {
            this.f669i.getPaint().setTextSize(f4);
            boolean a4 = b.a(this.f669i);
            if (this.f669i.getLayout() != null) {
                this.f662b = false;
                try {
                    Method k4 = k("nullLayouts");
                    if (k4 != null) {
                        k4.invoke(this.f669i, null);
                    }
                } catch (Exception e4) {
                    Log.w("ACTVAutoSizeHelper", "Failed to invoke TextView#nullLayouts() method", e4);
                }
                if (a4) {
                    this.f669i.forceLayout();
                } else {
                    this.f669i.requestLayout();
                }
                this.f669i.invalidate();
            }
        }
    }

    private boolean u() {
        if (y() && this.f661a == 1) {
            if (!this.f667g || this.f666f.length == 0) {
                int floor = ((int) Math.floor((this.f665e - this.f664d) / this.f663c)) + 1;
                int[] iArr = new int[floor];
                for (int i4 = 0; i4 < floor; i4++) {
                    iArr[i4] = Math.round(this.f664d + (i4 * this.f663c));
                }
                this.f666f = b(iArr);
            }
            this.f662b = true;
        } else {
            this.f662b = false;
        }
        return this.f662b;
    }

    private void v(TypedArray typedArray) {
        int length = typedArray.length();
        int[] iArr = new int[length];
        if (length > 0) {
            for (int i4 = 0; i4 < length; i4++) {
                iArr[i4] = typedArray.getDimensionPixelSize(i4, -1);
            }
            this.f666f = b(iArr);
            w();
        }
    }

    private boolean w() {
        boolean z3 = this.f666f.length > 0;
        this.f667g = z3;
        if (z3) {
            this.f661a = 1;
            this.f664d = r0[0];
            this.f665e = r0[r1 - 1];
            this.f663c = -1.0f;
        }
        return z3;
    }

    private boolean x(int i4, RectF rectF) {
        CharSequence transformation;
        CharSequence text = this.f669i.getText();
        TransformationMethod transformationMethod = this.f669i.getTransformationMethod();
        if (transformationMethod != null && (transformation = transformationMethod.getTransformation(text, this.f669i)) != null) {
            text = transformation;
        }
        int b4 = a.b(this.f669i);
        l(i4);
        StaticLayout d4 = d(text, (Layout.Alignment) m(this.f669i, "getLayoutAlignment", Layout.Alignment.ALIGN_NORMAL), Math.round(rectF.right), b4);
        return (b4 == -1 || (d4.getLineCount() <= b4 && d4.getLineEnd(d4.getLineCount() - 1) == text.length())) && ((float) d4.getHeight()) <= rectF.bottom;
    }

    private boolean y() {
        return true;
    }

    private void z(float f4, float f5, float f6) {
        String d4 = c3.d4(413);
        if (f4 <= 0.0f) {
            throw new IllegalArgumentException("Minimum auto-size text size (" + f4 + d4);
        }
        if (f5 <= f4) {
            throw new IllegalArgumentException("Maximum auto-size text size (" + f5 + "px) is less or equal to minimum auto-size text size (" + f4 + "px)");
        }
        if (f6 <= 0.0f) {
            throw new IllegalArgumentException(c3.d4(466) + f6 + d4);
        }
        this.f661a = 1;
        this.f664d = f4;
        this.f665e = f5;
        this.f663c = f6;
        this.f667g = false;
    }

    void a() {
        if (n()) {
            if (this.f662b) {
                if (this.f669i.getMeasuredHeight() <= 0 || this.f669i.getMeasuredWidth() <= 0) {
                    return;
                }
                int measuredWidth = this.f671k.b(this.f669i) ? 1048576 : (this.f669i.getMeasuredWidth() - this.f669i.getTotalPaddingLeft()) - this.f669i.getTotalPaddingRight();
                int height = (this.f669i.getHeight() - this.f669i.getCompoundPaddingBottom()) - this.f669i.getCompoundPaddingTop();
                if (measuredWidth <= 0 || height <= 0) {
                    return;
                }
                RectF rectF = f658l;
                synchronized (rectF) {
                    try {
                        rectF.setEmpty();
                        rectF.right = measuredWidth;
                        rectF.bottom = height;
                        float e4 = e(rectF);
                        if (e4 != this.f669i.getTextSize()) {
                            t(0, e4);
                        }
                    } finally {
                    }
                }
            }
            this.f662b = true;
        }
    }

    StaticLayout d(CharSequence charSequence, Layout.Alignment alignment, int i4, int i5) {
        return c.a(charSequence, alignment, i4, i5, this.f669i, this.f668h, this.f671k);
    }

    int f() {
        return Math.round(this.f665e);
    }

    int g() {
        return Math.round(this.f664d);
    }

    int h() {
        return Math.round(this.f663c);
    }

    int[] i() {
        return this.f666f;
    }

    int j() {
        return this.f661a;
    }

    void l(int i4) {
        TextPaint textPaint = this.f668h;
        if (textPaint == null) {
            this.f668h = new TextPaint();
        } else {
            textPaint.reset();
        }
        this.f668h.set(this.f669i.getPaint());
        this.f668h.setTextSize(i4);
    }

    boolean n() {
        return y() && this.f661a != 0;
    }

    void o(AttributeSet attributeSet, int i4) {
        int resourceId;
        TypedArray obtainStyledAttributes = this.f670j.obtainStyledAttributes(attributeSet, c.i.S, i4, 0);
        TextView textView = this.f669i;
        androidx.core.view.v.F(textView, textView.getContext(), c.i.S, attributeSet, obtainStyledAttributes, i4, 0);
        if (obtainStyledAttributes.hasValue(c.i.X)) {
            this.f661a = obtainStyledAttributes.getInt(c.i.X, 0);
        }
        float dimension = obtainStyledAttributes.hasValue(c.i.W) ? obtainStyledAttributes.getDimension(c.i.W, -1.0f) : -1.0f;
        float dimension2 = obtainStyledAttributes.hasValue(c.i.U) ? obtainStyledAttributes.getDimension(c.i.U, -1.0f) : -1.0f;
        float dimension3 = obtainStyledAttributes.hasValue(c.i.T) ? obtainStyledAttributes.getDimension(c.i.T, -1.0f) : -1.0f;
        if (obtainStyledAttributes.hasValue(c.i.V) && (resourceId = obtainStyledAttributes.getResourceId(c.i.V, 0)) > 0) {
            TypedArray obtainTypedArray = obtainStyledAttributes.getResources().obtainTypedArray(resourceId);
            v(obtainTypedArray);
            obtainTypedArray.recycle();
        }
        obtainStyledAttributes.recycle();
        if (!y()) {
            this.f661a = 0;
            return;
        }
        if (this.f661a == 1) {
            if (!this.f667g) {
                DisplayMetrics displayMetrics = this.f670j.getResources().getDisplayMetrics();
                if (dimension2 == -1.0f) {
                    dimension2 = TypedValue.applyDimension(2, 12.0f, displayMetrics);
                }
                if (dimension3 == -1.0f) {
                    dimension3 = TypedValue.applyDimension(2, 112.0f, displayMetrics);
                }
                if (dimension == -1.0f) {
                    dimension = 1.0f;
                }
                z(dimension2, dimension3, dimension);
            }
            u();
        }
    }

    void p(int i4, int i5, int i6, int i7) {
        if (y()) {
            DisplayMetrics displayMetrics = this.f670j.getResources().getDisplayMetrics();
            z(TypedValue.applyDimension(i7, i4, displayMetrics), TypedValue.applyDimension(i7, i5, displayMetrics), TypedValue.applyDimension(i7, i6, displayMetrics));
            if (u()) {
                a();
            }
        }
    }

    void q(int[] iArr, int i4) {
        if (y()) {
            int length = iArr.length;
            if (length > 0) {
                int[] iArr2 = new int[length];
                if (i4 == 0) {
                    iArr2 = Arrays.copyOf(iArr, length);
                } else {
                    DisplayMetrics displayMetrics = this.f670j.getResources().getDisplayMetrics();
                    for (int i5 = 0; i5 < length; i5++) {
                        iArr2[i5] = Math.round(TypedValue.applyDimension(i4, iArr[i5], displayMetrics));
                    }
                }
                this.f666f = b(iArr2);
                if (!w()) {
                    throw new IllegalArgumentException(c3.d4(1017) + Arrays.toString(iArr));
                }
            } else {
                this.f667g = false;
            }
            if (u()) {
                a();
            }
        }
    }

    void r(int i4) {
        if (y()) {
            if (i4 == 0) {
                c();
                return;
            }
            if (i4 != 1) {
                throw new IllegalArgumentException("Unknown auto-size text type: " + i4);
            }
            DisplayMetrics displayMetrics = this.f670j.getResources().getDisplayMetrics();
            z(TypedValue.applyDimension(2, 12.0f, displayMetrics), TypedValue.applyDimension(2, 112.0f, displayMetrics), 1.0f);
            if (u()) {
                a();
            }
        }
    }

    void t(int i4, float f4) {
        Context context = this.f670j;
        s(TypedValue.applyDimension(i4, f4, (context == null ? Resources.getSystem() : context.getResources()).getDisplayMetrics()));
    }
}
