package androidx.appcompat.widget;

import android.R;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.text.InputFilter;
import android.util.AttributeSet;
import android.view.ActionMode;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.textclassifier.TextClassifier;
import android.widget.TextView;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import o.k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class p extends TextView {

    /* renamed from: a, reason: collision with root package name */
    private final e f649a;

    /* renamed from: b, reason: collision with root package name */
    private final o f650b;

    /* renamed from: c, reason: collision with root package name */
    private final n f651c;

    /* renamed from: d, reason: collision with root package name */
    private h f652d;

    /* renamed from: e, reason: collision with root package name */
    private boolean f653e;

    /* renamed from: f, reason: collision with root package name */
    private a f654f;

    /* renamed from: g, reason: collision with root package name */
    private Future f655g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private interface a {
        void a(int[] iArr, int i4);

        void b(TextClassifier textClassifier);

        int[] c();

        void d(int i4);

        TextClassifier e();

        int f();

        void g(int i4, int i5, int i6, int i7);

        int h();

        int i();

        void j(int i4);

        int k();

        void l(int i4);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements a {
        b() {
        }

        @Override // androidx.appcompat.widget.p.a
        public void a(int[] iArr, int i4) {
            p.super.setAutoSizeTextTypeUniformWithPresetSizes(iArr, i4);
        }

        @Override // androidx.appcompat.widget.p.a
        public void b(TextClassifier textClassifier) {
            p.super.setTextClassifier(textClassifier);
        }

        @Override // androidx.appcompat.widget.p.a
        public int[] c() {
            return p.super.getAutoSizeTextAvailableSizes();
        }

        @Override // androidx.appcompat.widget.p.a
        public void d(int i4) {
        }

        @Override // androidx.appcompat.widget.p.a
        public TextClassifier e() {
            return p.super.getTextClassifier();
        }

        @Override // androidx.appcompat.widget.p.a
        public int f() {
            return p.super.getAutoSizeMaxTextSize();
        }

        @Override // androidx.appcompat.widget.p.a
        public void g(int i4, int i5, int i6, int i7) {
            p.super.setAutoSizeTextTypeUniformWithConfiguration(i4, i5, i6, i7);
        }

        @Override // androidx.appcompat.widget.p.a
        public int h() {
            return p.super.getAutoSizeTextType();
        }

        @Override // androidx.appcompat.widget.p.a
        public int i() {
            return p.super.getAutoSizeMinTextSize();
        }

        @Override // androidx.appcompat.widget.p.a
        public void j(int i4) {
        }

        @Override // androidx.appcompat.widget.p.a
        public int k() {
            return p.super.getAutoSizeStepGranularity();
        }

        @Override // androidx.appcompat.widget.p.a
        public void l(int i4) {
            p.super.setAutoSizeTextTypeWithDefaults(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c extends b {
        c() {
            super();
        }

        @Override // androidx.appcompat.widget.p.b, androidx.appcompat.widget.p.a
        public void d(int i4) {
            p.super.setLastBaselineToBottomHeight(i4);
        }

        @Override // androidx.appcompat.widget.p.b, androidx.appcompat.widget.p.a
        public void j(int i4) {
            p.super.setFirstBaselineToTopHeight(i4);
        }
    }

    public p(Context context) {
        this(context, null);
    }

    public p(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, R.attr.textViewStyle);
    }

    public p(Context context, AttributeSet attributeSet, int i4) {
        super(i0.b(context), attributeSet, i4);
        this.f653e = false;
        this.f654f = null;
        h0.a(this, getContext());
        e eVar = new e(this);
        this.f649a = eVar;
        eVar.e(attributeSet, i4);
        o oVar = new o(this);
        this.f650b = oVar;
        oVar.m(attributeSet, i4);
        oVar.b();
        this.f651c = new n(this);
        getEmojiTextViewHelper().b(attributeSet, i4);
    }

    private h getEmojiTextViewHelper() {
        if (this.f652d == null) {
            this.f652d = new h(this);
        }
        return this.f652d;
    }

    private void q() {
        Future future = this.f655g;
        if (future != null) {
            try {
                this.f655g = null;
                h.d.a(future.get());
                androidx.core.widget.g.k(this, null);
            } catch (InterruptedException | ExecutionException unused) {
            }
        }
    }

    @Override // android.widget.TextView, android.view.View
    protected void drawableStateChanged() {
        super.drawableStateChanged();
        e eVar = this.f649a;
        if (eVar != null) {
            eVar.b();
        }
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.b();
        }
    }

    @Override // android.widget.TextView
    public int getAutoSizeMaxTextSize() {
        if (v0.f718b) {
            return getSuperCaller().f();
        }
        o oVar = this.f650b;
        if (oVar != null) {
            return oVar.e();
        }
        return -1;
    }

    @Override // android.widget.TextView
    public int getAutoSizeMinTextSize() {
        if (v0.f718b) {
            return getSuperCaller().i();
        }
        o oVar = this.f650b;
        if (oVar != null) {
            return oVar.f();
        }
        return -1;
    }

    @Override // android.widget.TextView
    public int getAutoSizeStepGranularity() {
        if (v0.f718b) {
            return getSuperCaller().k();
        }
        o oVar = this.f650b;
        if (oVar != null) {
            return oVar.g();
        }
        return -1;
    }

    @Override // android.widget.TextView
    public int[] getAutoSizeTextAvailableSizes() {
        if (v0.f718b) {
            return getSuperCaller().c();
        }
        o oVar = this.f650b;
        return oVar != null ? oVar.h() : new int[0];
    }

    @Override // android.widget.TextView
    public int getAutoSizeTextType() {
        if (v0.f718b) {
            return getSuperCaller().h() == 1 ? 1 : 0;
        }
        o oVar = this.f650b;
        if (oVar != null) {
            return oVar.i();
        }
        return 0;
    }

    @Override // android.widget.TextView
    public ActionMode.Callback getCustomSelectionActionModeCallback() {
        return androidx.core.widget.g.m(super.getCustomSelectionActionModeCallback());
    }

    @Override // android.widget.TextView
    public int getFirstBaselineToTopHeight() {
        return androidx.core.widget.g.a(this);
    }

    @Override // android.widget.TextView
    public int getLastBaselineToBottomHeight() {
        return androidx.core.widget.g.b(this);
    }

    a getSuperCaller() {
        if (this.f654f == null) {
            int i4 = Build.VERSION.SDK_INT;
            if (i4 >= 28) {
                this.f654f = new c();
            } else if (i4 >= 26) {
                this.f654f = new b();
            }
        }
        return this.f654f;
    }

    public ColorStateList getSupportBackgroundTintList() {
        e eVar = this.f649a;
        if (eVar != null) {
            return eVar.c();
        }
        return null;
    }

    public PorterDuff.Mode getSupportBackgroundTintMode() {
        e eVar = this.f649a;
        if (eVar != null) {
            return eVar.d();
        }
        return null;
    }

    public ColorStateList getSupportCompoundDrawablesTintList() {
        return this.f650b.j();
    }

    public PorterDuff.Mode getSupportCompoundDrawablesTintMode() {
        return this.f650b.k();
    }

    @Override // android.widget.TextView
    public CharSequence getText() {
        q();
        return super.getText();
    }

    @Override // android.widget.TextView
    public TextClassifier getTextClassifier() {
        n nVar;
        return (Build.VERSION.SDK_INT >= 28 || (nVar = this.f651c) == null) ? getSuperCaller().e() : nVar.a();
    }

    public k.a getTextMetricsParamsCompat() {
        return androidx.core.widget.g.e(this);
    }

    @Override // android.widget.TextView, android.view.View
    public InputConnection onCreateInputConnection(EditorInfo editorInfo) {
        InputConnection onCreateInputConnection = super.onCreateInputConnection(editorInfo);
        this.f650b.r(this, onCreateInputConnection, editorInfo);
        return i.a(onCreateInputConnection, editorInfo, this);
    }

    @Override // android.widget.TextView, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        super.onLayout(z3, i4, i5, i6, i7);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.o(z3, i4, i5, i6, i7);
        }
    }

    @Override // android.widget.TextView, android.view.View
    protected void onMeasure(int i4, int i5) {
        q();
        super.onMeasure(i4, i5);
    }

    @Override // android.widget.TextView
    protected void onTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
        super.onTextChanged(charSequence, i4, i5, i6);
        o oVar = this.f650b;
        if (oVar == null || v0.f718b || !oVar.l()) {
            return;
        }
        this.f650b.c();
    }

    @Override // android.widget.TextView
    public void setAllCaps(boolean z3) {
        super.setAllCaps(z3);
        getEmojiTextViewHelper().c(z3);
    }

    @Override // android.widget.TextView
    public void setAutoSizeTextTypeUniformWithConfiguration(int i4, int i5, int i6, int i7) {
        if (v0.f718b) {
            getSuperCaller().g(i4, i5, i6, i7);
            return;
        }
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.t(i4, i5, i6, i7);
        }
    }

    @Override // android.widget.TextView
    public void setAutoSizeTextTypeUniformWithPresetSizes(int[] iArr, int i4) {
        if (v0.f718b) {
            getSuperCaller().a(iArr, i4);
            return;
        }
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.u(iArr, i4);
        }
    }

    @Override // android.widget.TextView
    public void setAutoSizeTextTypeWithDefaults(int i4) {
        if (v0.f718b) {
            getSuperCaller().l(i4);
            return;
        }
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.v(i4);
        }
    }

    @Override // android.view.View
    public void setBackgroundDrawable(Drawable drawable) {
        super.setBackgroundDrawable(drawable);
        e eVar = this.f649a;
        if (eVar != null) {
            eVar.f(drawable);
        }
    }

    @Override // android.view.View
    public void setBackgroundResource(int i4) {
        super.setBackgroundResource(i4);
        e eVar = this.f649a;
        if (eVar != null) {
            eVar.g(i4);
        }
    }

    @Override // android.widget.TextView
    public void setCompoundDrawables(Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
        super.setCompoundDrawables(drawable, drawable2, drawable3, drawable4);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.p();
        }
    }

    @Override // android.widget.TextView
    public void setCompoundDrawablesRelative(Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
        super.setCompoundDrawablesRelative(drawable, drawable2, drawable3, drawable4);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.p();
        }
    }

    @Override // android.widget.TextView
    public void setCompoundDrawablesRelativeWithIntrinsicBounds(int i4, int i5, int i6, int i7) {
        Context context = getContext();
        setCompoundDrawablesRelativeWithIntrinsicBounds(i4 != 0 ? e.a.b(context, i4) : null, i5 != 0 ? e.a.b(context, i5) : null, i6 != 0 ? e.a.b(context, i6) : null, i7 != 0 ? e.a.b(context, i7) : null);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.p();
        }
    }

    @Override // android.widget.TextView
    public void setCompoundDrawablesRelativeWithIntrinsicBounds(Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
        super.setCompoundDrawablesRelativeWithIntrinsicBounds(drawable, drawable2, drawable3, drawable4);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.p();
        }
    }

    @Override // android.widget.TextView
    public void setCompoundDrawablesWithIntrinsicBounds(int i4, int i5, int i6, int i7) {
        Context context = getContext();
        setCompoundDrawablesWithIntrinsicBounds(i4 != 0 ? e.a.b(context, i4) : null, i5 != 0 ? e.a.b(context, i5) : null, i6 != 0 ? e.a.b(context, i6) : null, i7 != 0 ? e.a.b(context, i7) : null);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.p();
        }
    }

    @Override // android.widget.TextView
    public void setCompoundDrawablesWithIntrinsicBounds(Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
        super.setCompoundDrawablesWithIntrinsicBounds(drawable, drawable2, drawable3, drawable4);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.p();
        }
    }

    @Override // android.widget.TextView
    public void setCustomSelectionActionModeCallback(ActionMode.Callback callback) {
        super.setCustomSelectionActionModeCallback(androidx.core.widget.g.n(this, callback));
    }

    public void setEmojiCompatEnabled(boolean z3) {
        getEmojiTextViewHelper().d(z3);
    }

    @Override // android.widget.TextView
    public void setFilters(InputFilter[] inputFilterArr) {
        super.setFilters(getEmojiTextViewHelper().a(inputFilterArr));
    }

    @Override // android.widget.TextView
    public void setFirstBaselineToTopHeight(int i4) {
        if (Build.VERSION.SDK_INT >= 28) {
            getSuperCaller().j(i4);
        } else {
            androidx.core.widget.g.h(this, i4);
        }
    }

    @Override // android.widget.TextView
    public void setLastBaselineToBottomHeight(int i4) {
        if (Build.VERSION.SDK_INT >= 28) {
            getSuperCaller().d(i4);
        } else {
            androidx.core.widget.g.i(this, i4);
        }
    }

    @Override // android.widget.TextView
    public void setLineHeight(int i4) {
        androidx.core.widget.g.j(this, i4);
    }

    public void setPrecomputedText(o.k kVar) {
        androidx.core.widget.g.k(this, kVar);
    }

    public void setSupportBackgroundTintList(ColorStateList colorStateList) {
        e eVar = this.f649a;
        if (eVar != null) {
            eVar.i(colorStateList);
        }
    }

    public void setSupportBackgroundTintMode(PorterDuff.Mode mode) {
        e eVar = this.f649a;
        if (eVar != null) {
            eVar.j(mode);
        }
    }

    public void setSupportCompoundDrawablesTintList(ColorStateList colorStateList) {
        this.f650b.w(colorStateList);
        this.f650b.b();
    }

    public void setSupportCompoundDrawablesTintMode(PorterDuff.Mode mode) {
        this.f650b.x(mode);
        this.f650b.b();
    }

    @Override // android.widget.TextView
    public void setTextAppearance(Context context, int i4) {
        super.setTextAppearance(context, i4);
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.q(context, i4);
        }
    }

    @Override // android.widget.TextView
    public void setTextClassifier(TextClassifier textClassifier) {
        n nVar;
        if (Build.VERSION.SDK_INT >= 28 || (nVar = this.f651c) == null) {
            getSuperCaller().b(textClassifier);
        } else {
            nVar.b(textClassifier);
        }
    }

    public void setTextFuture(Future<o.k> future) {
        this.f655g = future;
        if (future != null) {
            requestLayout();
        }
    }

    public void setTextMetricsParamsCompat(k.a aVar) {
        androidx.core.widget.g.l(this, aVar);
    }

    @Override // android.widget.TextView
    public void setTextSize(int i4, float f4) {
        if (v0.f718b) {
            super.setTextSize(i4, f4);
            return;
        }
        o oVar = this.f650b;
        if (oVar != null) {
            oVar.A(i4, f4);
        }
    }

    @Override // android.widget.TextView
    public void setTypeface(Typeface typeface, int i4) {
        if (this.f653e) {
            return;
        }
        Typeface a4 = (typeface == null || i4 <= 0) ? null : androidx.core.graphics.h.a(getContext(), typeface, i4);
        this.f653e = true;
        if (a4 != null) {
            typeface = a4;
        }
        try {
            super.setTypeface(typeface, i4);
        } finally {
            this.f653e = false;
        }
    }
}
