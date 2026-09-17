package androidx.core.view;

import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.os.Build;
import android.view.MenuItem;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class k {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static int a(MenuItem menuItem) {
            return menuItem.getAlphabeticModifiers();
        }

        static CharSequence b(MenuItem menuItem) {
            return menuItem.getContentDescription();
        }

        static ColorStateList c(MenuItem menuItem) {
            return menuItem.getIconTintList();
        }

        static PorterDuff.Mode d(MenuItem menuItem) {
            return menuItem.getIconTintMode();
        }

        static int e(MenuItem menuItem) {
            return menuItem.getNumericModifiers();
        }

        static CharSequence f(MenuItem menuItem) {
            return menuItem.getTooltipText();
        }

        static MenuItem g(MenuItem menuItem, char c4, int i4) {
            return menuItem.setAlphabeticShortcut(c4, i4);
        }

        static MenuItem h(MenuItem menuItem, CharSequence charSequence) {
            return menuItem.setContentDescription(charSequence);
        }

        static MenuItem i(MenuItem menuItem, ColorStateList colorStateList) {
            return menuItem.setIconTintList(colorStateList);
        }

        static MenuItem j(MenuItem menuItem, PorterDuff.Mode mode) {
            return menuItem.setIconTintMode(mode);
        }

        static MenuItem k(MenuItem menuItem, char c4, int i4) {
            return menuItem.setNumericShortcut(c4, i4);
        }

        static MenuItem l(MenuItem menuItem, char c4, char c5, int i4, int i5) {
            return menuItem.setShortcut(c4, c5, i4, i5);
        }

        static MenuItem m(MenuItem menuItem, CharSequence charSequence) {
            return menuItem.setTooltipText(charSequence);
        }
    }

    public static void a(MenuItem menuItem, char c4, int i4) {
        if (menuItem instanceof m.b) {
            ((m.b) menuItem).setAlphabeticShortcut(c4, i4);
        } else if (Build.VERSION.SDK_INT >= 26) {
            a.g(menuItem, c4, i4);
        }
    }

    public static void b(MenuItem menuItem, CharSequence charSequence) {
        if (menuItem instanceof m.b) {
            ((m.b) menuItem).setContentDescription(charSequence);
        } else if (Build.VERSION.SDK_INT >= 26) {
            a.h(menuItem, charSequence);
        }
    }

    public static void c(MenuItem menuItem, ColorStateList colorStateList) {
        if (menuItem instanceof m.b) {
            ((m.b) menuItem).setIconTintList(colorStateList);
        } else if (Build.VERSION.SDK_INT >= 26) {
            a.i(menuItem, colorStateList);
        }
    }

    public static void d(MenuItem menuItem, PorterDuff.Mode mode) {
        if (menuItem instanceof m.b) {
            ((m.b) menuItem).setIconTintMode(mode);
        } else if (Build.VERSION.SDK_INT >= 26) {
            a.j(menuItem, mode);
        }
    }

    public static void e(MenuItem menuItem, char c4, int i4) {
        if (menuItem instanceof m.b) {
            ((m.b) menuItem).setNumericShortcut(c4, i4);
        } else if (Build.VERSION.SDK_INT >= 26) {
            a.k(menuItem, c4, i4);
        }
    }

    public static void f(MenuItem menuItem, CharSequence charSequence) {
        if (menuItem instanceof m.b) {
            ((m.b) menuItem).setTooltipText(charSequence);
        } else if (Build.VERSION.SDK_INT >= 26) {
            a.m(menuItem, charSequence);
        }
    }
}
