package androidx.appcompat.widget;

import a1.b2.c3;
import android.graphics.Rect;
import android.os.Build;
import android.util.Log;
import android.view.View;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class v0 {

    /* renamed from: a, reason: collision with root package name */
    private static Method f717a;

    /* renamed from: b, reason: collision with root package name */
    static final boolean f718b;

    static {
        f718b = Build.VERSION.SDK_INT >= 27;
        try {
            Method declaredMethod = View.class.getDeclaredMethod("computeFitSystemWindows", Rect.class, Rect.class);
            f717a = declaredMethod;
            if (declaredMethod.isAccessible()) {
                return;
            }
            f717a.setAccessible(true);
        } catch (NoSuchMethodException unused) {
            Log.d("ViewUtils", c3.d4(228));
        }
    }

    public static boolean a(View view) {
        return androidx.core.view.v.o(view) == 1;
    }
}
