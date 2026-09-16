package androidx.core.content;

import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Process;
import android.text.TextUtils;
import androidx.core.app.w;
import androidx.core.content.res.f;
import java.io.File;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: a, reason: collision with root package name */
    private static final Object f849a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private static final Object f850b = new Object();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.content.a$a, reason: collision with other inner class name */
    static class C0006a {
        static void a(Context context, Intent[] intentArr, Bundle bundle) {
            context.startActivities(intentArr, bundle);
        }

        static void b(Context context, Intent intent, Bundle bundle) {
            context.startActivity(intent, bundle);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static File a(Context context) {
            return context.getCodeCacheDir();
        }

        static Drawable b(Context context, int i4) {
            return context.getDrawable(i4);
        }

        static File c(Context context) {
            return context.getNoBackupFilesDir();
        }
    }

    public static int a(Context context, String str) {
        androidx.core.util.b.d(str, "permission must be non-null");
        return (androidx.core.os.a.c() || !TextUtils.equals("android.permission.POST_NOTIFICATIONS", str)) ? context.checkPermission(str, Process.myPid(), Process.myUid()) : w.b(context).a() ? 0 : -1;
    }

    public static ColorStateList b(Context context, int i4) {
        return f.c(context.getResources(), i4, context.getTheme());
    }

    public static Drawable c(Context context, int i4) {
        return b.b(context, i4);
    }

    public static void d(Context context, Intent intent, Bundle bundle) {
        C0006a.b(context, intent, bundle);
    }
}
