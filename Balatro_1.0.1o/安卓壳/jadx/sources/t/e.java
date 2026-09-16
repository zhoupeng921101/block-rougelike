package t;

import android.text.Editable;
import android.text.method.KeyListener;
import android.view.KeyEvent;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e implements KeyListener {

    /* renamed from: a, reason: collision with root package name */
    private final KeyListener f4974a;

    /* renamed from: b, reason: collision with root package name */
    private final a f4975b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {
        public boolean a(Editable editable, int i4, KeyEvent keyEvent) {
            return androidx.emoji2.text.e.f(editable, i4, keyEvent);
        }
    }

    e(KeyListener keyListener) {
        this(keyListener, new a());
    }

    e(KeyListener keyListener, a aVar) {
        this.f4974a = keyListener;
        this.f4975b = aVar;
    }

    @Override // android.text.method.KeyListener
    public void clearMetaKeyState(View view, Editable editable, int i4) {
        this.f4974a.clearMetaKeyState(view, editable, i4);
    }

    @Override // android.text.method.KeyListener
    public int getInputType() {
        return this.f4974a.getInputType();
    }

    @Override // android.text.method.KeyListener
    public boolean onKeyDown(View view, Editable editable, int i4, KeyEvent keyEvent) {
        return this.f4975b.a(editable, i4, keyEvent) || this.f4974a.onKeyDown(view, editable, i4, keyEvent);
    }

    @Override // android.text.method.KeyListener
    public boolean onKeyOther(View view, Editable editable, KeyEvent keyEvent) {
        return this.f4974a.onKeyOther(view, editable, keyEvent);
    }

    @Override // android.text.method.KeyListener
    public boolean onKeyUp(View view, Editable editable, int i4, KeyEvent keyEvent) {
        return this.f4974a.onKeyUp(view, editable, i4, keyEvent);
    }
}
