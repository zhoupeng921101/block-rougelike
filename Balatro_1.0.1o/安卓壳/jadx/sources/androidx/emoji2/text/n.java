package androidx.emoji2.text;

import a1.b2.c3;
import android.os.Build;
import android.text.Editable;
import android.text.SpanWatcher;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.TextWatcher;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n extends SpannableStringBuilder {

    /* renamed from: e, reason: collision with root package name */
    private final Class f1257e;

    /* renamed from: f, reason: collision with root package name */
    private final List f1258f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a implements TextWatcher, SpanWatcher {

        /* renamed from: a, reason: collision with root package name */
        final Object f1259a;

        /* renamed from: b, reason: collision with root package name */
        private final AtomicInteger f1260b = new AtomicInteger(0);

        a(Object obj) {
            this.f1259a = obj;
        }

        private boolean b(Object obj) {
            return obj instanceof i;
        }

        final void a() {
            this.f1260b.incrementAndGet();
        }

        @Override // android.text.TextWatcher
        public void afterTextChanged(Editable editable) {
            ((TextWatcher) this.f1259a).afterTextChanged(editable);
        }

        @Override // android.text.TextWatcher
        public void beforeTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
            ((TextWatcher) this.f1259a).beforeTextChanged(charSequence, i4, i5, i6);
        }

        final void c() {
            this.f1260b.decrementAndGet();
        }

        @Override // android.text.SpanWatcher
        public void onSpanAdded(Spannable spannable, Object obj, int i4, int i5) {
            if (this.f1260b.get() <= 0 || !b(obj)) {
                ((SpanWatcher) this.f1259a).onSpanAdded(spannable, obj, i4, i5);
            }
        }

        @Override // android.text.SpanWatcher
        public void onSpanChanged(Spannable spannable, Object obj, int i4, int i5, int i6, int i7) {
            int i8;
            int i9;
            if (this.f1260b.get() <= 0 || !b(obj)) {
                if (Build.VERSION.SDK_INT < 28) {
                    if (i4 > i5) {
                        i4 = 0;
                    }
                    if (i6 > i7) {
                        i8 = i4;
                        i9 = 0;
                        ((SpanWatcher) this.f1259a).onSpanChanged(spannable, obj, i8, i5, i9, i7);
                    }
                }
                i8 = i4;
                i9 = i6;
                ((SpanWatcher) this.f1259a).onSpanChanged(spannable, obj, i8, i5, i9, i7);
            }
        }

        @Override // android.text.SpanWatcher
        public void onSpanRemoved(Spannable spannable, Object obj, int i4, int i5) {
            if (this.f1260b.get() <= 0 || !b(obj)) {
                ((SpanWatcher) this.f1259a).onSpanRemoved(spannable, obj, i4, i5);
            }
        }

        @Override // android.text.TextWatcher
        public void onTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
            ((TextWatcher) this.f1259a).onTextChanged(charSequence, i4, i5, i6);
        }
    }

    n(Class cls, CharSequence charSequence) {
        super(charSequence);
        this.f1258f = new ArrayList();
        androidx.core.util.c.e(cls, c3.d4(360));
        this.f1257e = cls;
    }

    n(Class cls, CharSequence charSequence, int i4, int i5) {
        super(charSequence, i4, i5);
        this.f1258f = new ArrayList();
        androidx.core.util.c.e(cls, "watcherClass cannot be null");
        this.f1257e = cls;
    }

    private void b() {
        for (int i4 = 0; i4 < this.f1258f.size(); i4++) {
            ((a) this.f1258f.get(i4)).a();
        }
    }

    public static n c(Class cls, CharSequence charSequence) {
        return new n(cls, charSequence);
    }

    private void e() {
        for (int i4 = 0; i4 < this.f1258f.size(); i4++) {
            ((a) this.f1258f.get(i4)).onTextChanged(this, 0, length(), length());
        }
    }

    private a f(Object obj) {
        for (int i4 = 0; i4 < this.f1258f.size(); i4++) {
            a aVar = (a) this.f1258f.get(i4);
            if (aVar.f1259a == obj) {
                return aVar;
            }
        }
        return null;
    }

    private boolean g(Class cls) {
        return this.f1257e == cls;
    }

    private boolean h(Object obj) {
        return obj != null && g(obj.getClass());
    }

    private void i() {
        for (int i4 = 0; i4 < this.f1258f.size(); i4++) {
            ((a) this.f1258f.get(i4)).c();
        }
    }

    public void a() {
        b();
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable, java.lang.Appendable
    public SpannableStringBuilder append(char c4) {
        super.append(c4);
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable, java.lang.Appendable
    public SpannableStringBuilder append(CharSequence charSequence) {
        super.append(charSequence);
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable, java.lang.Appendable
    public SpannableStringBuilder append(CharSequence charSequence, int i4, int i5) {
        super.append(charSequence, i4, i5);
        return this;
    }

    @Override // android.text.SpannableStringBuilder
    public SpannableStringBuilder append(CharSequence charSequence, Object obj, int i4) {
        super.append(charSequence, obj, i4);
        return this;
    }

    public void d() {
        i();
        e();
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable
    public SpannableStringBuilder delete(int i4, int i5) {
        super.delete(i4, i5);
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spanned
    public int getSpanEnd(Object obj) {
        a f4;
        if (h(obj) && (f4 = f(obj)) != null) {
            obj = f4;
        }
        return super.getSpanEnd(obj);
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spanned
    public int getSpanFlags(Object obj) {
        a f4;
        if (h(obj) && (f4 = f(obj)) != null) {
            obj = f4;
        }
        return super.getSpanFlags(obj);
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spanned
    public int getSpanStart(Object obj) {
        a f4;
        if (h(obj) && (f4 = f(obj)) != null) {
            obj = f4;
        }
        return super.getSpanStart(obj);
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spanned
    public Object[] getSpans(int i4, int i5, Class cls) {
        if (!g(cls)) {
            return super.getSpans(i4, i5, cls);
        }
        a[] aVarArr = (a[]) super.getSpans(i4, i5, a.class);
        Object[] objArr = (Object[]) Array.newInstance((Class<?>) cls, aVarArr.length);
        for (int i6 = 0; i6 < aVarArr.length; i6++) {
            objArr[i6] = aVarArr[i6].f1259a;
        }
        return objArr;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable
    public SpannableStringBuilder insert(int i4, CharSequence charSequence) {
        super.insert(i4, charSequence);
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable
    public SpannableStringBuilder insert(int i4, CharSequence charSequence, int i5, int i6) {
        super.insert(i4, charSequence, i5, i6);
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spanned
    public int nextSpanTransition(int i4, int i5, Class cls) {
        if (cls == null || g(cls)) {
            cls = a.class;
        }
        return super.nextSpanTransition(i4, i5, cls);
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spannable
    public void removeSpan(Object obj) {
        a aVar;
        if (h(obj)) {
            aVar = f(obj);
            if (aVar != null) {
                obj = aVar;
            }
        } else {
            aVar = null;
        }
        super.removeSpan(obj);
        if (aVar != null) {
            this.f1258f.remove(aVar);
        }
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable
    public SpannableStringBuilder replace(int i4, int i5, CharSequence charSequence) {
        b();
        super.replace(i4, i5, charSequence);
        i();
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Editable
    public SpannableStringBuilder replace(int i4, int i5, CharSequence charSequence, int i6, int i7) {
        b();
        super.replace(i4, i5, charSequence, i6, i7);
        i();
        return this;
    }

    @Override // android.text.SpannableStringBuilder, android.text.Spannable
    public void setSpan(Object obj, int i4, int i5, int i6) {
        if (h(obj)) {
            a aVar = new a(obj);
            this.f1258f.add(aVar);
            obj = aVar;
        }
        super.setSpan(obj, i4, i5, i6);
    }

    @Override // android.text.SpannableStringBuilder, java.lang.CharSequence
    public CharSequence subSequence(int i4, int i5) {
        return new n(this.f1257e, this, i4, i5);
    }
}
