package androidx.emoji2.text;

import a1.b2.c3;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Typeface;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g {

    /* renamed from: d, reason: collision with root package name */
    private static final ThreadLocal f1214d = new ThreadLocal();

    /* renamed from: a, reason: collision with root package name */
    private final int f1215a;

    /* renamed from: b, reason: collision with root package name */
    private final m f1216b;

    /* renamed from: c, reason: collision with root package name */
    private volatile int f1217c = 0;

    g(m mVar, int i4) {
        this.f1216b = mVar;
        this.f1215a = i4;
    }

    private s.a g() {
        ThreadLocal threadLocal = f1214d;
        s.a aVar = (s.a) threadLocal.get();
        if (aVar == null) {
            aVar = new s.a();
            threadLocal.set(aVar);
        }
        this.f1216b.d().j(aVar, this.f1215a);
        return aVar;
    }

    public void a(Canvas canvas, float f4, float f5, Paint paint) {
        Typeface g4 = this.f1216b.g();
        Typeface typeface = paint.getTypeface();
        paint.setTypeface(g4);
        canvas.drawText(this.f1216b.c(), this.f1215a * 2, 2, f4, f5, paint);
        paint.setTypeface(typeface);
    }

    public int b(int i4) {
        return g().h(i4);
    }

    public int c() {
        return g().i();
    }

    public int d() {
        return this.f1217c;
    }

    public short e() {
        return g().k();
    }

    public int f() {
        return g().l();
    }

    public short h() {
        return g().m();
    }

    public short i() {
        return g().n();
    }

    public boolean j() {
        return g().j();
    }

    public void k(boolean z3) {
        this.f1217c = z3 ? 2 : 1;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString());
        sb.append(c3.d4(504));
        sb.append(Integer.toHexString(f()));
        sb.append(", codepoints:");
        int c4 = c();
        for (int i4 = 0; i4 < c4; i4++) {
            sb.append(Integer.toHexString(b(i4)));
            sb.append(" ");
        }
        return sb.toString();
    }
}
