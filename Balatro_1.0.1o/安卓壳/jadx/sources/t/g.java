package t;

import android.text.Editable;
import android.text.Selection;
import android.text.Spannable;
import android.text.TextWatcher;
import android.widget.EditText;
import androidx.emoji2.text.e;
import java.lang.ref.Reference;
import java.lang.ref.WeakReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g implements TextWatcher {

    /* renamed from: a, reason: collision with root package name */
    private final EditText f4981a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f4982b;

    /* renamed from: c, reason: collision with root package name */
    private e.AbstractC0017e f4983c;

    /* renamed from: d, reason: collision with root package name */
    private int f4984d = Integer.MAX_VALUE;

    /* renamed from: e, reason: collision with root package name */
    private int f4985e = 0;

    /* renamed from: f, reason: collision with root package name */
    private boolean f4986f = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a extends e.AbstractC0017e {

        /* renamed from: a, reason: collision with root package name */
        private final Reference f4987a;

        a(EditText editText) {
            this.f4987a = new WeakReference(editText);
        }

        @Override // androidx.emoji2.text.e.AbstractC0017e
        public void b() {
            super.b();
            g.b((EditText) this.f4987a.get(), 1);
        }
    }

    g(EditText editText, boolean z3) {
        this.f4981a = editText;
        this.f4982b = z3;
    }

    private e.AbstractC0017e a() {
        if (this.f4983c == null) {
            this.f4983c = new a(this.f4981a);
        }
        return this.f4983c;
    }

    static void b(EditText editText, int i4) {
        if (i4 == 1 && editText != null && editText.isAttachedToWindow()) {
            Editable editableText = editText.getEditableText();
            int selectionStart = Selection.getSelectionStart(editableText);
            int selectionEnd = Selection.getSelectionEnd(editableText);
            androidx.emoji2.text.e.b().o(editableText);
            d.b(editableText, selectionStart, selectionEnd);
        }
    }

    private boolean d() {
        if (this.f4986f) {
            return (this.f4982b || androidx.emoji2.text.e.h()) ? false : true;
        }
        return true;
    }

    @Override // android.text.TextWatcher
    public void afterTextChanged(Editable editable) {
    }

    @Override // android.text.TextWatcher
    public void beforeTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
    }

    public void c(boolean z3) {
        if (this.f4986f != z3) {
            if (this.f4983c != null) {
                androidx.emoji2.text.e.b().t(this.f4983c);
            }
            this.f4986f = z3;
            if (z3) {
                b(this.f4981a, androidx.emoji2.text.e.b().d());
            }
        }
    }

    @Override // android.text.TextWatcher
    public void onTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
        if (this.f4981a.isInEditMode() || d() || i5 > i6 || !(charSequence instanceof Spannable)) {
            return;
        }
        int d4 = androidx.emoji2.text.e.b().d();
        if (d4 != 0) {
            if (d4 == 1) {
                androidx.emoji2.text.e.b().r((Spannable) charSequence, i4, i4 + i6, this.f4984d, this.f4985e);
                return;
            } else if (d4 != 3) {
                return;
            }
        }
        androidx.emoji2.text.e.b().s(a());
    }
}
