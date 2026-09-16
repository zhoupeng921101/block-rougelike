package androidx.emoji2.text;

import android.graphics.Paint;
import android.text.style.ReplacementSpan;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i extends ReplacementSpan {

    /* renamed from: f, reason: collision with root package name */
    private final g f1232f;

    /* renamed from: e, reason: collision with root package name */
    private final Paint.FontMetricsInt f1231e = new Paint.FontMetricsInt();

    /* renamed from: g, reason: collision with root package name */
    private short f1233g = -1;

    /* renamed from: h, reason: collision with root package name */
    private short f1234h = -1;

    /* renamed from: i, reason: collision with root package name */
    private float f1235i = 1.0f;

    i(g gVar) {
        androidx.core.util.c.e(gVar, "metadata cannot be null");
        this.f1232f = gVar;
    }

    public final g a() {
        return this.f1232f;
    }

    final int b() {
        return this.f1233g;
    }

    @Override // android.text.style.ReplacementSpan
    public int getSize(Paint paint, CharSequence charSequence, int i4, int i5, Paint.FontMetricsInt fontMetricsInt) {
        paint.getFontMetricsInt(this.f1231e);
        Paint.FontMetricsInt fontMetricsInt2 = this.f1231e;
        this.f1235i = (Math.abs(fontMetricsInt2.descent - fontMetricsInt2.ascent) * 1.0f) / this.f1232f.e();
        this.f1234h = (short) (this.f1232f.e() * this.f1235i);
        short i6 = (short) (this.f1232f.i() * this.f1235i);
        this.f1233g = i6;
        if (fontMetricsInt != null) {
            Paint.FontMetricsInt fontMetricsInt3 = this.f1231e;
            fontMetricsInt.ascent = fontMetricsInt3.ascent;
            fontMetricsInt.descent = fontMetricsInt3.descent;
            fontMetricsInt.top = fontMetricsInt3.top;
            fontMetricsInt.bottom = fontMetricsInt3.bottom;
        }
        return i6;
    }
}
