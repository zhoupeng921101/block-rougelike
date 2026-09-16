package androidx.appcompat.widget;

import android.content.res.TypedArray;
import android.text.method.KeyListener;
import android.text.method.NumberKeyListener;
import android.util.AttributeSet;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.widget.EditText;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class g {

    /* renamed from: a, reason: collision with root package name */
    private final EditText f549a;

    /* renamed from: b, reason: collision with root package name */
    private final t.a f550b;

    g(EditText editText) {
        this.f549a = editText;
        this.f550b = new t.a(editText, false);
    }

    KeyListener a(KeyListener keyListener) {
        return b(keyListener) ? this.f550b.a(keyListener) : keyListener;
    }

    boolean b(KeyListener keyListener) {
        return !(keyListener instanceof NumberKeyListener);
    }

    void c(AttributeSet attributeSet, int i4) {
        TypedArray obtainStyledAttributes = this.f549a.getContext().obtainStyledAttributes(attributeSet, c.i.S, i4, 0);
        try {
            boolean z3 = obtainStyledAttributes.hasValue(c.i.f1970g0) ? obtainStyledAttributes.getBoolean(c.i.f1970g0, true) : true;
            obtainStyledAttributes.recycle();
            e(z3);
        } catch (Throwable th) {
            obtainStyledAttributes.recycle();
            throw th;
        }
    }

    InputConnection d(InputConnection inputConnection, EditorInfo editorInfo) {
        return this.f550b.b(inputConnection, editorInfo);
    }

    void e(boolean z3) {
        this.f550b.c(z3);
    }
}
