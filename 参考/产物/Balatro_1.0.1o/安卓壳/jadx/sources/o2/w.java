package o2;

import a1.b2.c3;
import android.content.Context;
import android.os.Build;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Arrays;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class w {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4498a = g0.f(w.class.getSimpleName());

    /* renamed from: b, reason: collision with root package name */
    private static final int[] f4499b = {1008610, 1008611, 1008612, 1008613, 1008614, 1008615};

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements InvocationHandler {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ BlockingQueue f4500a;

        a(BlockingQueue blockingQueue) {
            this.f4500a = blockingQueue;
        }

        @Override // java.lang.reflect.InvocationHandler
        public Object invoke(Object obj, Method method, Object[] objArr) {
            if (objArr == null || objArr.length <= 1) {
                this.f4500a.offer("");
            }
            this.f4500a.offer(w.e(objArr[1]));
            return null;
        }
    }

    private static Class b(String str) {
        try {
            return Class.forName(str);
        } catch (ClassNotFoundException e4) {
            f4498a.a("Class not found: " + str + " - " + l0.l(e4));
            return null;
        }
    }

    private static String c(Context context) {
        try {
            Class b4 = b("com.huawei.hms.ads.identifier.AdvertisingIdClient");
            if (((Boolean) b4.getMethod("isAdvertisingIdAvailable", Context.class).invoke(null, context)).booleanValue()) {
                Object invoke = b4.getMethod("getAdvertisingIdInfo", Context.class).invoke(null, context);
                return (String) invoke.getClass().getDeclaredMethod("getId", null).invoke(invoke, null);
            }
        } catch (Throwable th) {
            f4498a.a(c3.d4(1294) + l0.l(th));
        }
        return null;
    }

    private static String d(Context context) {
        if (!k()) {
            f4498a.a("getMsaOAID: MSA OAID not supported, SDK classes not found");
            return null;
        }
        try {
            LinkedBlockingQueue linkedBlockingQueue = new LinkedBlockingQueue();
            g(context);
            Class b4 = b("com.bun.miitmdid.core.IIdentifierListener");
            if (b4 == null) {
                f4498a.a("getMsaOAID: callback class is null, cannot get OAID");
                return null;
            }
            int h4 = h(context, Proxy.newProxyInstance(b4.getClassLoader(), new Class[]{b4}, new a(linkedBlockingQueue)), b4);
            if (!j(h4)) {
                String str = (String) linkedBlockingQueue.poll(1L, TimeUnit.SECONDS);
                if (l0.V(str)) {
                    return null;
                }
                return str;
            }
            f4498a.a("getMsaOAID: MSA SDK initialization failed with error code: " + h4);
            return null;
        } catch (Throwable th) {
            f4498a.a("Failed to get MSA OAID: " + l0.l(th));
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static String e(Object obj) {
        if (obj == null) {
            return "";
        }
        try {
            return (String) obj.getClass().getMethod("getOAID", null).invoke(obj, null);
        } catch (Throwable th) {
            f4498a.a("Failed to get OAID from supplier: " + l0.l(th));
            return "";
        }
    }

    static String f(Context context) {
        return i() ? c(context) : d(context);
    }

    private static void g(Context context) {
        b("com.bun.miitmdid.core.JLibrary").getMethod(c3.d4(171), Context.class).invoke(null, context);
    }

    private static int h(Context context, Object obj, Class cls) {
        try {
            return ((Integer) b("com.bun.miitmdid.core.MdidSdkHelper").getMethod("InitSdk", Context.class, Boolean.TYPE, cls).invoke(null, context, Boolean.FALSE, obj)).intValue();
        } catch (Throwable th) {
            f4498a.a("Failed to initialize MSA SDK: " + l0.l(th));
            return f4499b[0];
        }
    }

    private static boolean i() {
        return Build.MANUFACTURER.equalsIgnoreCase("huawei") && b("com.huawei.hms.ads.identifier.AdvertisingIdClient") != null;
    }

    private static boolean j(int i4) {
        return Arrays.asList(f4499b).contains(Integer.valueOf(i4));
    }

    private static boolean k() {
        return b(c3.d4(453)) != null;
    }
}
