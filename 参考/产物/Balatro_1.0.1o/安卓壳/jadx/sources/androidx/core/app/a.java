package androidx.core.app;

import android.app.Activity;
import android.app.SharedElementCallback;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.text.TextUtils;
import java.util.Arrays;
import java.util.HashSet;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a extends androidx.core.content.a {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.app.a$a, reason: collision with other inner class name */
    static class C0005a {
        static void a(Activity activity) {
            activity.finishAffinity();
        }

        static void b(Activity activity, Intent intent, int i4, Bundle bundle) {
            activity.startActivityForResult(intent, i4, bundle);
        }

        static void c(Activity activity, IntentSender intentSender, int i4, Intent intent, int i5, int i6, int i7, Bundle bundle) {
            activity.startIntentSenderForResult(intentSender, i4, intent, i5, i6, i7, bundle);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static void a(Object obj) {
            ((SharedElementCallback.OnSharedElementsReadyListener) obj).onSharedElementsReady();
        }

        static void b(Activity activity, String[] strArr, int i4) {
            activity.requestPermissions(strArr, i4);
        }

        static boolean c(Activity activity, String str) {
            return activity.shouldShowRequestPermissionRationale(str);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface c {
        void a(int i4);
    }

    /* JADX WARN: Multi-variable type inference failed */
    public static void e(Activity activity, String[] strArr, int i4) {
        HashSet hashSet = new HashSet();
        for (int i5 = 0; i5 < strArr.length; i5++) {
            if (TextUtils.isEmpty(strArr[i5])) {
                throw new IllegalArgumentException("Permission request for permissions " + Arrays.toString(strArr) + " must not contain null or empty values");
            }
            if (!androidx.core.os.a.c() && TextUtils.equals(strArr[i5], "android.permission.POST_NOTIFICATIONS")) {
                hashSet.add(Integer.valueOf(i5));
            }
        }
        int size = hashSet.size();
        String[] strArr2 = size > 0 ? new String[strArr.length - size] : strArr;
        if (size > 0) {
            if (size == strArr.length) {
                return;
            }
            int i6 = 0;
            for (int i7 = 0; i7 < strArr.length; i7++) {
                if (!hashSet.contains(Integer.valueOf(i7))) {
                    strArr2[i6] = strArr[i7];
                    i6++;
                }
            }
        }
        if (activity instanceof c) {
            ((c) activity).a(i4);
        }
        b.b(activity, strArr, i4);
    }

    public static boolean f(Activity activity, String str) {
        if (androidx.core.os.a.c() || !TextUtils.equals("android.permission.POST_NOTIFICATIONS", str)) {
            return b.c(activity, str);
        }
        return false;
    }

    public static void g(Activity activity, Intent intent, int i4, Bundle bundle) {
        C0005a.b(activity, intent, i4, bundle);
    }

    public static void h(Activity activity, IntentSender intentSender, int i4, Intent intent, int i5, int i6, int i7, Bundle bundle) {
        C0005a.c(activity, intentSender, i4, intent, i5, i6, i7, bundle);
    }
}
