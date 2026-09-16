package t;

import android.text.method.KeyListener;
import android.text.method.NumberKeyListener;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.widget.EditText;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: a, reason: collision with root package name */
    private final b f4960a;

    /* renamed from: b, reason: collision with root package name */
    private int f4961b = Integer.MAX_VALUE;

    /* renamed from: c, reason: collision with root package name */
    private int f4962c = 0;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: t.a$a, reason: collision with other inner class name */
    private static class C0077a extends b {

        /* renamed from: a, reason: collision with root package name */
        private final EditText f4963a;

        /* renamed from: b, reason: collision with root package name */
        private final g f4964b;

        C0077a(EditText editText, boolean z3) {
            this.f4963a = editText;
            g gVar = new g(editText, z3);
            this.f4964b = gVar;
            editText.addTextChangedListener(gVar);
            editText.setEditableFactory(t.b.getInstance());
        }

        @Override // t.a.b
        KeyListener a(KeyListener keyListener) {
            if (keyListener instanceof e) {
                return keyListener;
            }
            if (keyListener == null) {
                return null;
            }
            return keyListener instanceof NumberKeyListener ? keyListener : new e(keyListener);
        }

        @Override // t.a.b
        InputConnection b(InputConnection inputConnection, EditorInfo editorInfo) {
            return inputConnection instanceof c ? inputConnection : new c(this.f4963a, inputConnection, editorInfo);
        }

        @Override // t.a.b
        void c(boolean z3) {
            this.f4964b.c(z3);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        b() {
        }

        abstract KeyListener a(KeyListener keyListener);

        abstract InputConnection b(InputConnection inputConnection, EditorInfo editorInfo);

        abstract void c(boolean z3);
    }

    public a(EditText editText, boolean z3) {
        androidx.core.util.c.e(editText, "editText cannot be null");
        this.f4960a = new C0077a(editText, z3);
    }

    public KeyListener a(KeyListener keyListener) {
        return this.f4960a.a(keyListener);
    }

    public InputConnection b(InputConnection inputConnection, EditorInfo editorInfo) {
        if (inputConnection == null) {
            return null;
        }
        return this.f4960a.b(inputConnection, editorInfo);
    }

    public void c(boolean z3) {
        this.f4960a.c(z3);
    }
}
