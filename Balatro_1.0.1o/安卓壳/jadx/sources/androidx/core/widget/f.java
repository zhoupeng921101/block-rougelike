package androidx.core.widget;

import android.view.View;
import android.widget.PopupWindow;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static void a(PopupWindow popupWindow, View view, int i4, int i5, int i6) {
            popupWindow.showAsDropDown(view, i4, i5, i6);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static boolean a(PopupWindow popupWindow) {
            return popupWindow.getOverlapAnchor();
        }

        static int b(PopupWindow popupWindow) {
            return popupWindow.getWindowLayoutType();
        }

        static void c(PopupWindow popupWindow, boolean z3) {
            popupWindow.setOverlapAnchor(z3);
        }

        static void d(PopupWindow popupWindow, int i4) {
            popupWindow.setWindowLayoutType(i4);
        }
    }

    public static void a(PopupWindow popupWindow, boolean z3) {
        b.c(popupWindow, z3);
    }

    public static void b(PopupWindow popupWindow, int i4) {
        b.d(popupWindow, i4);
    }

    public static void c(PopupWindow popupWindow, View view, int i4, int i5, int i6) {
        a.a(popupWindow, view, i4, i5, i6);
    }
}
