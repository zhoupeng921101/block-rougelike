package androidx.core.view.accessibility;

import android.view.accessibility.AccessibilityRecord;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class v {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static int a(AccessibilityRecord accessibilityRecord) {
            return accessibilityRecord.getMaxScrollX();
        }

        static int b(AccessibilityRecord accessibilityRecord) {
            return accessibilityRecord.getMaxScrollY();
        }

        static void c(AccessibilityRecord accessibilityRecord, int i4) {
            accessibilityRecord.setMaxScrollX(i4);
        }

        static void d(AccessibilityRecord accessibilityRecord, int i4) {
            accessibilityRecord.setMaxScrollY(i4);
        }
    }

    public static void a(AccessibilityRecord accessibilityRecord, int i4) {
        a.c(accessibilityRecord, i4);
    }

    public static void b(AccessibilityRecord accessibilityRecord, int i4) {
        a.d(accessibilityRecord, i4);
    }
}
