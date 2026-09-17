package androidx.emoji2.text;

import android.text.TextPaint;
import androidx.emoji2.text.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class d implements e.d {

    /* renamed from: b, reason: collision with root package name */
    private static final ThreadLocal f1177b = new ThreadLocal();

    /* renamed from: a, reason: collision with root package name */
    private final TextPaint f1178a;

    d() {
        TextPaint textPaint = new TextPaint();
        this.f1178a = textPaint;
        textPaint.setTextSize(10.0f);
    }

    private static StringBuilder b() {
        ThreadLocal threadLocal = f1177b;
        if (threadLocal.get() == null) {
            threadLocal.set(new StringBuilder());
        }
        return (StringBuilder) threadLocal.get();
    }

    @Override // androidx.emoji2.text.e.d
    public boolean a(CharSequence charSequence, int i4, int i5, int i6) {
        StringBuilder b4 = b();
        b4.setLength(0);
        while (i4 < i5) {
            b4.append(charSequence.charAt(i4));
            i4++;
        }
        return androidx.core.graphics.g.a(this.f1178a, b4.toString());
    }
}
