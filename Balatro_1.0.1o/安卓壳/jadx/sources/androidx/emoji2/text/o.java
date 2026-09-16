package androidx.emoji2.text;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.text.TextPaint;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class o extends i {

    /* renamed from: j, reason: collision with root package name */
    private static Paint f1261j;

    public o(g gVar) {
        super(gVar);
    }

    private static Paint c() {
        if (f1261j == null) {
            TextPaint textPaint = new TextPaint();
            f1261j = textPaint;
            textPaint.setColor(e.b().c());
            f1261j.setStyle(Paint.Style.FILL);
        }
        return f1261j;
    }

    @Override // android.text.style.ReplacementSpan
    public void draw(Canvas canvas, CharSequence charSequence, int i4, int i5, float f4, int i6, int i7, int i8, Paint paint) {
        Canvas canvas2;
        float f5;
        if (e.b().i()) {
            canvas2 = canvas;
            f5 = f4;
            canvas2.drawRect(f5, i6, f4 + b(), i8, c());
        } else {
            canvas2 = canvas;
            f5 = f4;
        }
        a().a(canvas2, f5, i7, paint);
    }
}
