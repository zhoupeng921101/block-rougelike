package m1;

import android.app.AppOpsManager;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c {

    /* renamed from: a, reason: collision with root package name */
    protected final Context f4170a;

    public c(Context context) {
        this.f4170a = context;
    }

    public ApplicationInfo a(String str, int i4) {
        return this.f4170a.getPackageManager().getApplicationInfo(str, i4);
    }

    public CharSequence b(String str) {
        Context context = this.f4170a;
        return context.getPackageManager().getApplicationLabel(context.getPackageManager().getApplicationInfo(str, 0));
    }

    public PackageInfo c(String str, int i4) {
        return this.f4170a.getPackageManager().getPackageInfo(str, i4);
    }

    public final boolean d(int i4, String str) {
        try {
            AppOpsManager appOpsManager = (AppOpsManager) this.f4170a.getSystemService("appops");
            if (appOpsManager == null) {
                throw new NullPointerException("context.getSystemService(Context.APP_OPS_SERVICE) is null");
            }
            appOpsManager.checkPackage(i4, str);
            return true;
        } catch (SecurityException unused) {
            return false;
        }
    }
}
