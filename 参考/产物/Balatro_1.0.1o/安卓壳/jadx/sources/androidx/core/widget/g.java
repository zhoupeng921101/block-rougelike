package androidx.core.widget;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.ColorStateList;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.icu.text.DecimalFormatSymbols;
import android.os.Build;
import android.text.Editable;
import android.text.PrecomputedText;
import android.text.TextDirectionHeuristic;
import android.text.TextDirectionHeuristics;
import android.text.TextPaint;
import android.text.method.PasswordTransformationMethod;
import android.view.ActionMode;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import o.k;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static boolean a(TextView textView) {
            return textView.getIncludeFontPadding();
        }

        static int b(TextView textView) {
            return textView.getMaxLines();
        }

        static int c(TextView textView) {
            return textView.getMinLines();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static Drawable[] a(TextView textView) {
            return textView.getCompoundDrawablesRelative();
        }

        static int b(View view) {
            return view.getLayoutDirection();
        }

        static int c(View view) {
            return view.getTextDirection();
        }

        static Locale d(TextView textView) {
            return textView.getTextLocale();
        }

        static void e(TextView textView, Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
            textView.setCompoundDrawablesRelative(drawable, drawable2, drawable3, drawable4);
        }

        static void f(TextView textView, int i4, int i5, int i6, int i7) {
            textView.setCompoundDrawablesRelativeWithIntrinsicBounds(i4, i5, i6, i7);
        }

        static void g(TextView textView, Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
            textView.setCompoundDrawablesRelativeWithIntrinsicBounds(drawable, drawable2, drawable3, drawable4);
        }

        static void h(View view, int i4) {
            view.setTextDirection(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {
        static int a(TextView textView) {
            return textView.getBreakStrategy();
        }

        static ColorStateList b(TextView textView) {
            return textView.getCompoundDrawableTintList();
        }

        static PorterDuff.Mode c(TextView textView) {
            return textView.getCompoundDrawableTintMode();
        }

        static int d(TextView textView) {
            return textView.getHyphenationFrequency();
        }

        static void e(TextView textView, int i4) {
            textView.setBreakStrategy(i4);
        }

        static void f(TextView textView, ColorStateList colorStateList) {
            textView.setCompoundDrawableTintList(colorStateList);
        }

        static void g(TextView textView, PorterDuff.Mode mode) {
            textView.setCompoundDrawableTintMode(mode);
        }

        static void h(TextView textView, int i4) {
            textView.setHyphenationFrequency(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class d {
        static DecimalFormatSymbols a(Locale locale) {
            return DecimalFormatSymbols.getInstance(locale);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class e {
        static String[] a(DecimalFormatSymbols decimalFormatSymbols) {
            return decimalFormatSymbols.getDigitStrings();
        }

        static PrecomputedText.Params b(TextView textView) {
            return textView.getTextMetricsParams();
        }

        static void c(TextView textView, int i4) {
            textView.setFirstBaselineToTopHeight(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class f implements ActionMode.Callback {

        /* renamed from: a, reason: collision with root package name */
        private final ActionMode.Callback f1163a;

        /* renamed from: b, reason: collision with root package name */
        private final TextView f1164b;

        /* renamed from: c, reason: collision with root package name */
        private Class f1165c;

        /* renamed from: d, reason: collision with root package name */
        private Method f1166d;

        /* renamed from: e, reason: collision with root package name */
        private boolean f1167e;

        /* renamed from: f, reason: collision with root package name */
        private boolean f1168f = false;

        f(ActionMode.Callback callback, TextView textView) {
            this.f1163a = callback;
            this.f1164b = textView;
        }

        private Intent a() {
            return new Intent().setAction("android.intent.action.PROCESS_TEXT").setType("text/plain");
        }

        private Intent b(ResolveInfo resolveInfo, TextView textView) {
            Intent putExtra = a().putExtra("android.intent.extra.PROCESS_TEXT_READONLY", !e(textView));
            ActivityInfo activityInfo = resolveInfo.activityInfo;
            return putExtra.setClassName(activityInfo.packageName, activityInfo.name);
        }

        private List c(Context context, PackageManager packageManager) {
            ArrayList arrayList = new ArrayList();
            if (context instanceof Activity) {
                for (ResolveInfo resolveInfo : packageManager.queryIntentActivities(a(), 0)) {
                    if (f(resolveInfo, context)) {
                        arrayList.add(resolveInfo);
                    }
                }
            }
            return arrayList;
        }

        private boolean e(TextView textView) {
            return (textView instanceof Editable) && textView.onCheckIsTextEditor() && textView.isEnabled();
        }

        private boolean f(ResolveInfo resolveInfo, Context context) {
            if (context.getPackageName().equals(resolveInfo.activityInfo.packageName)) {
                return true;
            }
            ActivityInfo activityInfo = resolveInfo.activityInfo;
            if (!activityInfo.exported) {
                return false;
            }
            String str = activityInfo.permission;
            return str == null || context.checkSelfPermission(str) == 0;
        }

        private void g(Menu menu) {
            Context context = this.f1164b.getContext();
            PackageManager packageManager = context.getPackageManager();
            boolean z3 = this.f1168f;
            Class cls = Integer.TYPE;
            if (!z3) {
                this.f1168f = true;
                try {
                    Class<?> cls2 = Class.forName("com.android.internal.view.menu.MenuBuilder");
                    this.f1165c = cls2;
                    this.f1166d = cls2.getDeclaredMethod("removeItemAt", cls);
                    this.f1167e = true;
                } catch (ClassNotFoundException | NoSuchMethodException unused) {
                    this.f1165c = null;
                    this.f1166d = null;
                    this.f1167e = false;
                }
            }
            try {
                Method declaredMethod = (this.f1167e && this.f1165c.isInstance(menu)) ? this.f1166d : menu.getClass().getDeclaredMethod("removeItemAt", cls);
                for (int size = menu.size() - 1; size >= 0; size--) {
                    MenuItem item = menu.getItem(size);
                    if (item.getIntent() != null && "android.intent.action.PROCESS_TEXT".equals(item.getIntent().getAction())) {
                        declaredMethod.invoke(menu, Integer.valueOf(size));
                    }
                }
                List c4 = c(context, packageManager);
                for (int i4 = 0; i4 < c4.size(); i4++) {
                    ResolveInfo resolveInfo = (ResolveInfo) c4.get(i4);
                    menu.add(0, 0, i4 + 100, resolveInfo.loadLabel(packageManager)).setIntent(b(resolveInfo, this.f1164b)).setShowAsAction(1);
                }
            } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException unused2) {
            }
        }

        ActionMode.Callback d() {
            return this.f1163a;
        }

        @Override // android.view.ActionMode.Callback
        public boolean onActionItemClicked(ActionMode actionMode, MenuItem menuItem) {
            return this.f1163a.onActionItemClicked(actionMode, menuItem);
        }

        @Override // android.view.ActionMode.Callback
        public boolean onCreateActionMode(ActionMode actionMode, Menu menu) {
            return this.f1163a.onCreateActionMode(actionMode, menu);
        }

        @Override // android.view.ActionMode.Callback
        public void onDestroyActionMode(ActionMode actionMode) {
            this.f1163a.onDestroyActionMode(actionMode);
        }

        @Override // android.view.ActionMode.Callback
        public boolean onPrepareActionMode(ActionMode actionMode, Menu menu) {
            g(menu);
            return this.f1163a.onPrepareActionMode(actionMode, menu);
        }
    }

    public static int a(TextView textView) {
        return textView.getPaddingTop() - textView.getPaint().getFontMetricsInt().top;
    }

    public static int b(TextView textView) {
        return textView.getPaddingBottom() + textView.getPaint().getFontMetricsInt().bottom;
    }

    private static int c(TextDirectionHeuristic textDirectionHeuristic) {
        TextDirectionHeuristic textDirectionHeuristic2;
        TextDirectionHeuristic textDirectionHeuristic3 = TextDirectionHeuristics.FIRSTSTRONG_RTL;
        if (textDirectionHeuristic == textDirectionHeuristic3 || textDirectionHeuristic == (textDirectionHeuristic2 = TextDirectionHeuristics.FIRSTSTRONG_LTR)) {
            return 1;
        }
        if (textDirectionHeuristic == TextDirectionHeuristics.ANYRTL_LTR) {
            return 2;
        }
        if (textDirectionHeuristic == TextDirectionHeuristics.LTR) {
            return 3;
        }
        if (textDirectionHeuristic == TextDirectionHeuristics.RTL) {
            return 4;
        }
        if (textDirectionHeuristic == TextDirectionHeuristics.LOCALE) {
            return 5;
        }
        if (textDirectionHeuristic == textDirectionHeuristic2) {
            return 6;
        }
        return textDirectionHeuristic == textDirectionHeuristic3 ? 7 : 1;
    }

    private static TextDirectionHeuristic d(TextView textView) {
        if (textView.getTransformationMethod() instanceof PasswordTransformationMethod) {
            return TextDirectionHeuristics.LTR;
        }
        if (Build.VERSION.SDK_INT >= 28 && (textView.getInputType() & 15) == 3) {
            byte directionality = Character.getDirectionality(e.a(d.a(b.d(textView)))[0].codePointAt(0));
            return (directionality == 1 || directionality == 2) ? TextDirectionHeuristics.RTL : TextDirectionHeuristics.LTR;
        }
        boolean z3 = b.b(textView) == 1;
        switch (b.c(textView)) {
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                break;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            default:
                if (!z3) {
                    break;
                } else {
                    break;
                }
        }
        return TextDirectionHeuristics.LTR;
    }

    public static k.a e(TextView textView) {
        if (Build.VERSION.SDK_INT >= 28) {
            return new k.a(e.b(textView));
        }
        k.a.C0061a c0061a = new k.a.C0061a(new TextPaint(textView.getPaint()));
        c0061a.b(c.a(textView));
        c0061a.c(c.d(textView));
        c0061a.d(d(textView));
        return c0061a.a();
    }

    public static void f(TextView textView, ColorStateList colorStateList) {
        androidx.core.util.c.d(textView);
        c.f(textView, colorStateList);
    }

    public static void g(TextView textView, PorterDuff.Mode mode) {
        androidx.core.util.c.d(textView);
        c.g(textView, mode);
    }

    public static void h(TextView textView, int i4) {
        androidx.core.util.c.b(i4);
        if (Build.VERSION.SDK_INT >= 28) {
            e.c(textView, i4);
            return;
        }
        Paint.FontMetricsInt fontMetricsInt = textView.getPaint().getFontMetricsInt();
        int i5 = a.a(textView) ? fontMetricsInt.top : fontMetricsInt.ascent;
        if (i4 > Math.abs(i5)) {
            textView.setPadding(textView.getPaddingLeft(), i4 + i5, textView.getPaddingRight(), textView.getPaddingBottom());
        }
    }

    public static void i(TextView textView, int i4) {
        androidx.core.util.c.b(i4);
        Paint.FontMetricsInt fontMetricsInt = textView.getPaint().getFontMetricsInt();
        int i5 = a.a(textView) ? fontMetricsInt.bottom : fontMetricsInt.descent;
        if (i4 > Math.abs(i5)) {
            textView.setPadding(textView.getPaddingLeft(), textView.getPaddingTop(), textView.getPaddingRight(), i4 - i5);
        }
    }

    public static void j(TextView textView, int i4) {
        androidx.core.util.c.b(i4);
        if (i4 != textView.getPaint().getFontMetricsInt(null)) {
            textView.setLineSpacing(i4 - r0, 1.0f);
        }
    }

    public static void k(TextView textView, k kVar) {
        if (Build.VERSION.SDK_INT >= 29) {
            throw null;
        }
        e(textView);
        throw null;
    }

    public static void l(TextView textView, k.a aVar) {
        b.h(textView, c(aVar.d()));
        textView.getPaint().set(aVar.e());
        c.e(textView, aVar.b());
        c.h(textView, aVar.c());
    }

    public static ActionMode.Callback m(ActionMode.Callback callback) {
        return (!(callback instanceof f) || Build.VERSION.SDK_INT < 26) ? callback : ((f) callback).d();
    }

    public static ActionMode.Callback n(TextView textView, ActionMode.Callback callback) {
        int i4 = Build.VERSION.SDK_INT;
        return (i4 < 26 || i4 > 27 || (callback instanceof f) || callback == null) ? callback : new f(callback, textView);
    }
}
