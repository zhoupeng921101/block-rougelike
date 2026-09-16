package t;

import android.text.InputFilter;
import android.text.Selection;
import android.text.Spannable;
import android.text.Spanned;
import android.widget.TextView;
import androidx.emoji2.text.e;
import java.lang.ref.Reference;
import java.lang.ref.WeakReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class d implements InputFilter {

    /* renamed from: a, reason: collision with root package name */
    private final TextView f4970a;

    /* renamed from: b, reason: collision with root package name */
    private e.AbstractC0017e f4971b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a extends e.AbstractC0017e {

        /* renamed from: a, reason: collision with root package name */
        private final Reference f4972a;

        /* renamed from: b, reason: collision with root package name */
        private final Reference f4973b;

        a(TextView textView, d dVar) {
            this.f4972a = new WeakReference(textView);
            this.f4973b = new WeakReference(dVar);
        }

        private boolean c(TextView textView, InputFilter inputFilter) {
            InputFilter[] filters;
            if (inputFilter == null || textView == null || (filters = textView.getFilters()) == null) {
                return false;
            }
            for (InputFilter inputFilter2 : filters) {
                if (inputFilter2 == inputFilter) {
                    return true;
                }
            }
            return false;
        }

        @Override // androidx.emoji2.text.e.AbstractC0017e
        public void b() {
            CharSequence text;
            CharSequence o3;
            super.b();
            TextView textView = (TextView) this.f4972a.get();
            if (c(textView, (InputFilter) this.f4973b.get()) && textView.isAttachedToWindow() && text != (o3 = androidx.emoji2.text.e.b().o((text = textView.getText())))) {
                int selectionStart = Selection.getSelectionStart(o3);
                int selectionEnd = Selection.getSelectionEnd(o3);
                textView.setText(o3);
                if (o3 instanceof Spannable) {
                    d.b((Spannable) o3, selectionStart, selectionEnd);
                }
            }
        }
    }

    d(TextView textView) {
        this.f4970a = textView;
    }

    private e.AbstractC0017e a() {
        if (this.f4971b == null) {
            this.f4971b = new a(this.f4970a, this);
        }
        return this.f4971b;
    }

    static void b(Spannable spannable, int i4, int i5) {
        if (i4 >= 0 && i5 >= 0) {
            Selection.setSelection(spannable, i4, i5);
        } else if (i4 >= 0) {
            Selection.setSelection(spannable, i4);
        } else if (i5 >= 0) {
            Selection.setSelection(spannable, i5);
        }
    }

    @Override // android.text.InputFilter
    public CharSequence filter(CharSequence charSequence, int i4, int i5, Spanned spanned, int i6, int i7) {
        if (this.f4970a.isInEditMode()) {
            return charSequence;
        }
        int d4 = androidx.emoji2.text.e.b().d();
        if (d4 != 0) {
            if (d4 == 1) {
                if ((i7 == 0 && i6 == 0 && spanned.length() == 0 && charSequence == this.f4970a.getText()) || charSequence == null) {
                    return charSequence;
                }
                if (i4 != 0 || i5 != charSequence.length()) {
                    charSequence = charSequence.subSequence(i4, i5);
                }
                return androidx.emoji2.text.e.b().p(charSequence, 0, charSequence.length());
            }
            if (d4 != 3) {
                return charSequence;
            }
        }
        androidx.emoji2.text.e.b().s(a());
        return charSequence;
    }
}
