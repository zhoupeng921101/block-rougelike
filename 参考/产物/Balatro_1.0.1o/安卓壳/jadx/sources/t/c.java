package t;

import android.text.Editable;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputConnectionWrapper;
import android.widget.TextView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends InputConnectionWrapper {

    /* renamed from: a, reason: collision with root package name */
    private final TextView f4968a;

    /* renamed from: b, reason: collision with root package name */
    private final a f4969b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {
        public boolean a(InputConnection inputConnection, Editable editable, int i4, int i5, boolean z3) {
            return androidx.emoji2.text.e.e(inputConnection, editable, i4, i5, z3);
        }

        public void b(EditorInfo editorInfo) {
            if (androidx.emoji2.text.e.h()) {
                androidx.emoji2.text.e.b().u(editorInfo);
            }
        }
    }

    c(TextView textView, InputConnection inputConnection, EditorInfo editorInfo) {
        this(textView, inputConnection, editorInfo, new a());
    }

    c(TextView textView, InputConnection inputConnection, EditorInfo editorInfo, a aVar) {
        super(inputConnection, false);
        this.f4968a = textView;
        this.f4969b = aVar;
        aVar.b(editorInfo);
    }

    private Editable a() {
        return this.f4968a.getEditableText();
    }

    @Override // android.view.inputmethod.InputConnectionWrapper, android.view.inputmethod.InputConnection
    public boolean deleteSurroundingText(int i4, int i5) {
        return this.f4969b.a(this, a(), i4, i5, false) || super.deleteSurroundingText(i4, i5);
    }

    @Override // android.view.inputmethod.InputConnectionWrapper, android.view.inputmethod.InputConnection
    public boolean deleteSurroundingTextInCodePoints(int i4, int i5) {
        return this.f4969b.a(this, a(), i4, i5, true) || super.deleteSurroundingTextInCodePoints(i4, i5);
    }
}
