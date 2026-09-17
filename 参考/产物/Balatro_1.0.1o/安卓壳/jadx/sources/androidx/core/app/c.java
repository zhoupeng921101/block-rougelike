package androidx.core.app;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import androidx.core.view.f;
import androidx.lifecycle.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c extends Activity implements androidx.lifecycle.k, f.a {

    /* renamed from: a, reason: collision with root package name */
    private k.g f784a = new k.g();

    /* renamed from: b, reason: collision with root package name */
    private androidx.lifecycle.l f785b = new androidx.lifecycle.l(this);

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    private static boolean t(String[] strArr) {
        if (strArr != null && strArr.length > 0) {
            String str = strArr[0];
            str.getClass();
            switch (str) {
                case "--translation":
                    if (Build.VERSION.SDK_INT >= 31) {
                        return true;
                    }
                    break;
                case "--dump-dumpable":
                case "--list-dumpables":
                    return androidx.core.os.a.c();
                case "--contentcapture":
                    return Build.VERSION.SDK_INT >= 29;
                case "--autofill":
                    return Build.VERSION.SDK_INT >= 26;
            }
        }
        return false;
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public boolean dispatchKeyEvent(KeyEvent keyEvent) {
        View decorView = getWindow().getDecorView();
        if (decorView == null || !androidx.core.view.f.d(decorView, keyEvent)) {
            return androidx.core.view.f.e(this, decorView, this, keyEvent);
        }
        return true;
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public boolean dispatchKeyShortcutEvent(KeyEvent keyEvent) {
        View decorView = getWindow().getDecorView();
        if (decorView == null || !androidx.core.view.f.d(decorView, keyEvent)) {
            return super.dispatchKeyShortcutEvent(keyEvent);
        }
        return true;
    }

    @Override // androidx.core.view.f.a
    public boolean e(KeyEvent keyEvent) {
        return super.dispatchKeyEvent(keyEvent);
    }

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        androidx.lifecycle.t.g(this);
    }

    @Override // android.app.Activity
    protected void onSaveInstanceState(Bundle bundle) {
        this.f785b.j(g.c.CREATED);
        super.onSaveInstanceState(bundle);
    }

    protected final boolean s(String[] strArr) {
        return !t(strArr);
    }
}
