package androidx.core.view;

import a1.b2.c3;
import android.util.Log;
import android.view.View;
import android.view.ViewParent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class z {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static boolean a(ViewParent viewParent, View view, float f4, float f5, boolean z3) {
            return viewParent.onNestedFling(view, f4, f5, z3);
        }

        static boolean b(ViewParent viewParent, View view, float f4, float f5) {
            return viewParent.onNestedPreFling(view, f4, f5);
        }

        static void c(ViewParent viewParent, View view, int i4, int i5, int[] iArr) {
            viewParent.onNestedPreScroll(view, i4, i5, iArr);
        }

        static void d(ViewParent viewParent, View view, int i4, int i5, int i6, int i7) {
            viewParent.onNestedScroll(view, i4, i5, i6, i7);
        }

        static void e(ViewParent viewParent, View view, View view2, int i4) {
            viewParent.onNestedScrollAccepted(view, view2, i4);
        }

        static boolean f(ViewParent viewParent, View view, View view2, int i4) {
            return viewParent.onStartNestedScroll(view, view2, i4);
        }

        static void g(ViewParent viewParent, View view) {
            viewParent.onStopNestedScroll(view);
        }
    }

    public static boolean a(ViewParent viewParent, View view, float f4, float f5, boolean z3) {
        try {
            return a.a(viewParent, view, f4, f5, z3);
        } catch (AbstractMethodError e4) {
            Log.e("ViewParentCompat", c3.d4(1305) + viewParent + " does not implement interface method onNestedFling", e4);
            return false;
        }
    }

    public static boolean b(ViewParent viewParent, View view, float f4, float f5) {
        try {
            return a.b(viewParent, view, f4, f5);
        } catch (AbstractMethodError e4) {
            Log.e("ViewParentCompat", "ViewParent " + viewParent + " does not implement interface method onNestedPreFling", e4);
            return false;
        }
    }

    public static void c(ViewParent viewParent, View view, int i4, int i5, int[] iArr, int i6) {
        if (viewParent instanceof o) {
            ((o) viewParent).c(view, i4, i5, iArr, i6);
            return;
        }
        if (i6 == 0) {
            try {
                a.c(viewParent, view, i4, i5, iArr);
            } catch (AbstractMethodError e4) {
                Log.e("ViewParentCompat", "ViewParent " + viewParent + " does not implement interface method onNestedPreScroll", e4);
            }
        }
    }

    public static void d(ViewParent viewParent, View view, int i4, int i5, int i6, int i7, int i8, int[] iArr) {
        if (viewParent instanceof p) {
            ((p) viewParent).d(view, i4, i5, i6, i7, i8, iArr);
            return;
        }
        iArr[0] = iArr[0] + i6;
        iArr[1] = iArr[1] + i7;
        if (viewParent instanceof o) {
            ((o) viewParent).e(view, i4, i5, i6, i7, i8);
            return;
        }
        if (i8 == 0) {
            try {
                a.d(viewParent, view, i4, i5, i6, i7);
            } catch (AbstractMethodError e4) {
                Log.e("ViewParentCompat", "ViewParent " + viewParent + c3.d4(1061), e4);
            }
        }
    }

    public static void e(ViewParent viewParent, View view, View view2, int i4, int i5) {
        if (viewParent instanceof o) {
            ((o) viewParent).a(view, view2, i4, i5);
            return;
        }
        if (i5 == 0) {
            try {
                a.e(viewParent, view, view2, i4);
            } catch (AbstractMethodError e4) {
                Log.e("ViewParentCompat", "ViewParent " + viewParent + c3.d4(230), e4);
            }
        }
    }

    public static boolean f(ViewParent viewParent, View view, View view2, int i4, int i5) {
        if (viewParent instanceof o) {
            return ((o) viewParent).f(view, view2, i4, i5);
        }
        if (i5 != 0) {
            return false;
        }
        try {
            return a.f(viewParent, view, view2, i4);
        } catch (AbstractMethodError e4) {
            Log.e("ViewParentCompat", "ViewParent " + viewParent + " does not implement interface method onStartNestedScroll", e4);
            return false;
        }
    }

    public static void g(ViewParent viewParent, View view, int i4) {
        if (viewParent instanceof o) {
            ((o) viewParent).b(view, i4);
            return;
        }
        if (i4 == 0) {
            try {
                a.g(viewParent, view);
            } catch (AbstractMethodError e4) {
                Log.e("ViewParentCompat", "ViewParent " + viewParent + " does not implement interface method onStopNestedScroll", e4);
            }
        }
    }
}
