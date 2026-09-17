package androidx.emoji2.text;

import android.os.Build;
import android.text.Spannable;
import android.text.SpannableString;
import java.util.stream.IntStream;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class p implements Spannable {

    /* renamed from: e, reason: collision with root package name */
    private boolean f1262e = false;

    /* renamed from: f, reason: collision with root package name */
    private Spannable f1263f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a {
        static IntStream a(CharSequence charSequence) {
            return charSequence.chars();
        }

        static IntStream b(CharSequence charSequence) {
            return charSequence.codePoints();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        b() {
        }

        boolean a(CharSequence charSequence) {
            return false;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c extends b {
        c() {
        }

        @Override // androidx.emoji2.text.p.b
        boolean a(CharSequence charSequence) {
            return q.a(charSequence);
        }
    }

    p(Spannable spannable) {
        this.f1263f = spannable;
    }

    p(CharSequence charSequence) {
        this.f1263f = new SpannableString(charSequence);
    }

    private void a() {
        Spannable spannable = this.f1263f;
        if (!this.f1262e && c().a(spannable)) {
            this.f1263f = new SpannableString(spannable);
        }
        this.f1262e = true;
    }

    static b c() {
        return Build.VERSION.SDK_INT < 28 ? new b() : new c();
    }

    Spannable b() {
        return this.f1263f;
    }

    @Override // java.lang.CharSequence
    public char charAt(int i4) {
        return this.f1263f.charAt(i4);
    }

    @Override // java.lang.CharSequence
    public IntStream chars() {
        return a.a(this.f1263f);
    }

    @Override // java.lang.CharSequence
    public IntStream codePoints() {
        return a.b(this.f1263f);
    }

    @Override // android.text.Spanned
    public int getSpanEnd(Object obj) {
        return this.f1263f.getSpanEnd(obj);
    }

    @Override // android.text.Spanned
    public int getSpanFlags(Object obj) {
        return this.f1263f.getSpanFlags(obj);
    }

    @Override // android.text.Spanned
    public int getSpanStart(Object obj) {
        return this.f1263f.getSpanStart(obj);
    }

    @Override // android.text.Spanned
    public Object[] getSpans(int i4, int i5, Class cls) {
        return this.f1263f.getSpans(i4, i5, cls);
    }

    @Override // java.lang.CharSequence
    public int length() {
        return this.f1263f.length();
    }

    @Override // android.text.Spanned
    public int nextSpanTransition(int i4, int i5, Class cls) {
        return this.f1263f.nextSpanTransition(i4, i5, cls);
    }

    @Override // android.text.Spannable
    public void removeSpan(Object obj) {
        a();
        this.f1263f.removeSpan(obj);
    }

    @Override // android.text.Spannable
    public void setSpan(Object obj, int i4, int i5, int i6) {
        a();
        this.f1263f.setSpan(obj, i4, i5, i6);
    }

    @Override // java.lang.CharSequence
    public CharSequence subSequence(int i4, int i5) {
        return this.f1263f.subSequence(i4, i5);
    }

    @Override // java.lang.CharSequence
    public String toString() {
        return this.f1263f.toString();
    }
}
