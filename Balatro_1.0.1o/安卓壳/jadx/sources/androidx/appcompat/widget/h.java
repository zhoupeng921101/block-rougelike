package androidx.appcompat.widget;

import android.content.res.TypedArray;
import android.text.InputFilter;
import android.util.AttributeSet;
import android.widget.TextView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class h {

    /* renamed from: a, reason: collision with root package name */
    private final TextView f570a;

    /* renamed from: b, reason: collision with root package name */
    private final t.f f571b;

    h(TextView textView) {
        this.f570a = textView;
        this.f571b = new t.f(textView, false);
    }

    InputFilter[] a(InputFilter[] inputFilterArr) {
        return this.f571b.a(inputFilterArr);
    }

    void b(AttributeSet attributeSet, int i4) {
        TypedArray obtainStyledAttributes = this.f570a.getContext().obtainStyledAttributes(attributeSet, c.i.S, i4, 0);
        try {
            boolean z3 = obtainStyledAttributes.hasValue(c.i.f1970g0) ? obtainStyledAttributes.getBoolean(c.i.f1970g0, true) : true;
            obtainStyledAttributes.recycle();
            d(z3);
        } catch (Throwable th) {
            obtainStyledAttributes.recycle();
            throw th;
        }
    }

    void c(boolean z3) {
        this.f571b.b(z3);
    }

    void d(boolean z3) {
        this.f571b.c(z3);
    }
}
