package androidx.core.view;

import android.graphics.Rect;
import android.os.Build;
import android.view.DisplayCutout;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d {

    /* renamed from: a, reason: collision with root package name */
    private final DisplayCutout f1068a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static DisplayCutout a(Rect rect, List<Rect> list) {
            return new DisplayCutout(rect, list);
        }

        static List<Rect> b(DisplayCutout displayCutout) {
            return displayCutout.getBoundingRects();
        }

        static int c(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetBottom();
        }

        static int d(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetLeft();
        }

        static int e(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetRight();
        }

        static int f(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetTop();
        }
    }

    private d(DisplayCutout displayCutout) {
        this.f1068a = displayCutout;
    }

    static d e(DisplayCutout displayCutout) {
        if (displayCutout == null) {
            return null;
        }
        return new d(displayCutout);
    }

    public int a() {
        if (Build.VERSION.SDK_INT >= 28) {
            return a.c(this.f1068a);
        }
        return 0;
    }

    public int b() {
        if (Build.VERSION.SDK_INT >= 28) {
            return a.d(this.f1068a);
        }
        return 0;
    }

    public int c() {
        if (Build.VERSION.SDK_INT >= 28) {
            return a.e(this.f1068a);
        }
        return 0;
    }

    public int d() {
        if (Build.VERSION.SDK_INT >= 28) {
            return a.f(this.f1068a);
        }
        return 0;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || d.class != obj.getClass()) {
            return false;
        }
        return androidx.core.util.b.a(this.f1068a, ((d) obj).f1068a);
    }

    public int hashCode() {
        int hashCode;
        DisplayCutout displayCutout = this.f1068a;
        if (displayCutout == null) {
            return 0;
        }
        hashCode = displayCutout.hashCode();
        return hashCode;
    }

    public String toString() {
        return "DisplayCutoutCompat{" + this.f1068a + "}";
    }
}
