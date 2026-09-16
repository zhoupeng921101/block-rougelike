package androidx.activity;

import android.app.Activity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import androidx.lifecycle.g;
import java.lang.reflect.Field;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class ImmLeaksCleaner implements androidx.lifecycle.i {

    /* renamed from: b, reason: collision with root package name */
    private static int f47b;

    /* renamed from: c, reason: collision with root package name */
    private static Field f48c;

    /* renamed from: d, reason: collision with root package name */
    private static Field f49d;

    /* renamed from: e, reason: collision with root package name */
    private static Field f50e;

    /* renamed from: a, reason: collision with root package name */
    private Activity f51a;

    private static void h() {
        try {
            f47b = 2;
            Field declaredField = InputMethodManager.class.getDeclaredField("mServedView");
            f49d = declaredField;
            declaredField.setAccessible(true);
            Field declaredField2 = InputMethodManager.class.getDeclaredField("mNextServedView");
            f50e = declaredField2;
            declaredField2.setAccessible(true);
            Field declaredField3 = InputMethodManager.class.getDeclaredField("mH");
            f48c = declaredField3;
            declaredField3.setAccessible(true);
            f47b = 1;
        } catch (NoSuchFieldException unused) {
        }
    }

    @Override // androidx.lifecycle.i
    public void g(androidx.lifecycle.k kVar, g.b bVar) {
        if (bVar != g.b.ON_DESTROY) {
            return;
        }
        if (f47b == 0) {
            h();
        }
        if (f47b == 1) {
            InputMethodManager inputMethodManager = (InputMethodManager) this.f51a.getSystemService("input_method");
            try {
                Object obj = f48c.get(inputMethodManager);
                if (obj == null) {
                    return;
                }
                synchronized (obj) {
                    try {
                        try {
                            try {
                                View view = (View) f49d.get(inputMethodManager);
                                if (view == null) {
                                    return;
                                }
                                if (view.isAttachedToWindow()) {
                                    return;
                                }
                                try {
                                    f50e.set(inputMethodManager, null);
                                    inputMethodManager.isActive();
                                } catch (IllegalAccessException unused) {
                                }
                            } catch (ClassCastException unused2) {
                            }
                        } catch (IllegalAccessException unused3) {
                        }
                    } catch (Throwable th) {
                        throw th;
                    }
                }
            } catch (IllegalAccessException unused4) {
            }
        }
    }
}
