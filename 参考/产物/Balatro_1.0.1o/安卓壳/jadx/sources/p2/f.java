package p2;

import a1.b2.c3;
import android.content.Context;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import o2.a0;
import o2.g0;
import o2.l0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class f implements InvocationHandler {

    /* renamed from: e, reason: collision with root package name */
    private static final g0 f4670e = g0.f(f.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private Context f4671a;

    /* renamed from: b, reason: collision with root package name */
    private Object f4672b;

    /* renamed from: c, reason: collision with root package name */
    private String f4673c;

    /* renamed from: d, reason: collision with root package name */
    private final e f4674d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class a {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f4675a;

        static {
            int[] iArr = new int[b.values().length];
            f4675a = iArr;
            try {
                iArr[b.STATUS_OK.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f4675a[b.f4677g.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f4675a[b.STATUS_SERVICE_UNAVAILABLE.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    enum b {
        STATUS_OK(0),
        f4677g(1),
        STATUS_SERVICE_UNAVAILABLE(2);


        /* renamed from: e, reason: collision with root package name */
        private int f4680e;

        b(int i4) {
            this.f4680e = i4;
        }
    }

    public f(Context context, String str, e eVar) {
        this.f4671a = context;
        this.f4674d = eVar;
        this.f4673c = str;
    }

    private void a() {
        Object obj = this.f4672b;
        if (obj == null) {
            f4670e.a(c3.d4(541));
            return;
        }
        try {
            a0.f(obj, "endConnection", null, new Object[0]);
        } catch (Exception e4) {
            f4670e.c("closeReferrerClient error: " + l0.l(e4));
        }
        this.f4672b = null;
    }

    private Object b(Context context) {
        try {
            return a0.f(a0.h(this.f4673c + ".InstallReferrerClient", "newBuilder", new Class[]{Context.class}, context), "build", null, new Object[0]);
        } catch (Throwable th) {
            g0 g0Var = f4670e;
            g0Var.e("could not create install referrer client %s", th.getMessage());
            g0Var.c("createInstallReferrerClient: returning null, failed to create install referrer client for package: " + this.f4673c);
            return null;
        }
    }

    private Object c(Class cls) {
        try {
            return Proxy.newProxyInstance(cls.getClassLoader(), new Class[]{cls}, this);
        } catch (Exception e4) {
            f4670e.e("InstallReferrer proxy exception %s", e4.getMessage());
            return null;
        }
    }

    private long d(Object obj) {
        if (obj == null) {
            f4670e.a("getInstallBeginTimestampSeconds: referrer details is null, returning default");
            return -1L;
        }
        try {
            return ((Long) a0.f(obj, "getInstallBeginTimestampSeconds", null, new Object[0])).longValue();
        } catch (Exception e4) {
            f4670e.c("getInstallBeginTimestampSeconds error: " + l0.l(e4));
            return -1L;
        }
    }

    private Object e() {
        Object obj = this.f4672b;
        if (obj == null) {
            f4670e.c("getInstallReferrer: referrer client is null");
            return null;
        }
        try {
            return a0.f(obj, "getInstallReferrer", null, new Object[0]);
        } catch (Exception e4) {
            g0 g0Var = f4670e;
            g0Var.c("getInstallReferrer error: " + l0.l(e4));
            g0Var.c("getInstallReferrer: returning null, failed to get install referrer details");
            return null;
        }
    }

    private Class f() {
        try {
            return Class.forName(this.f4673c + ".InstallReferrerStateListener");
        } catch (Exception e4) {
            g0 g0Var = f4670e;
            g0Var.e("getInstallReferrerStateListenerClass %s", e4.getMessage());
            g0Var.c("getInstallReferrerStateListenerClass: returning null, failed to get listener class for package: " + this.f4673c);
            return null;
        }
    }

    private long g(Object obj) {
        if (obj == null) {
            f4670e.a("getReferrerClickTimestampSeconds: referrer details is null, returning default");
            return -1L;
        }
        try {
            return ((Long) a0.f(obj, "getReferrerClickTimestampSeconds", null, new Object[0])).longValue();
        } catch (Exception e4) {
            f4670e.c("getReferrerClickTimestampSeconds error: " + l0.l(e4));
            return -1L;
        }
    }

    private String h(Object obj) {
        if (obj == null) {
            f4670e.a("getStringInstallReferrer: referrer details is null");
            return null;
        }
        try {
            return (String) a0.f(obj, "getInstallReferrer", null, new Object[0]);
        } catch (Exception e4) {
            g0 g0Var = f4670e;
            g0Var.c("getStringInstallReferrer error: " + l0.l(e4));
            g0Var.c("getStringInstallReferrer: returning null, failed to extract install referrer string from referrer details");
            return null;
        }
    }

    private void i(int i4) {
        int i5 = a.f4675a[b.values()[i4].ordinal()];
        if (i5 == 1) {
            try {
                Object e4 = e();
                HashMap hashMap = new HashMap();
                hashMap.put("referral_url", h(e4));
                hashMap.put("click_time", Long.valueOf(g(e4)));
                hashMap.put("install_time", Long.valueOf(d(e4)));
                this.f4674d.a(hashMap);
                return;
            } catch (Exception e5) {
                f4670e.e("Couldn't get install referrer %s", e5.getMessage());
                return;
            }
        }
        if (i5 == 2) {
            f4670e.a("STATUS_FEATURE_NOT_SUPPORTED");
            this.f4674d.a(null);
        } else if (i5 == 3) {
            f4670e.a("STATUS_SERVICE_UNAVAILABLE");
            this.f4674d.a(null);
        } else {
            f4670e.b(c3.d4(711), Integer.valueOf(i4));
            this.f4674d.a(null);
        }
    }

    private void k(Class cls, Object obj) {
        try {
            a0.f(this.f4672b, "startConnection", new Class[]{cls}, obj);
        } catch (Exception e4) {
            f4670e.e("startConnection error %s", e4.getMessage());
        }
    }

    @Override // java.lang.reflect.InvocationHandler
    public Object invoke(Object obj, Method method, Object[] objArr) {
        try {
        } catch (Throwable th) {
            f4670e.e(c3.d4(353), th.getMessage());
        }
        if (method == null) {
            f4670e.c("InstallReferrer invoke method null");
            return null;
        }
        String name = method.getName();
        if (name == null) {
            f4670e.c("InstallReferrer invoke method name null");
            return null;
        }
        if (name.equals("onInstallReferrerSetupFinished")) {
            if (objArr != null && objArr.length == 1) {
                Object obj2 = objArr[0];
                if (!(obj2 instanceof Integer)) {
                    f4670e.c("onInstallReferrerSetupFinished invalid arg");
                    return null;
                }
                i(((Integer) obj2).intValue());
            }
            f4670e.c("onInstallReferrerSetupFinished invalid args");
            return null;
        }
        if (name.equals("onInstallReferrerServiceDisconnected")) {
            f4670e.a("onInstallReferrerServiceDisconnected");
            a();
        }
        return null;
    }

    public void j() {
        Context context = this.f4671a;
        if (context == null) {
            f4670e.c(c3.d4(1479));
            this.f4674d.a(null);
            return;
        }
        Object b4 = b(context);
        this.f4672b = b4;
        if (b4 == null) {
            f4670e.c("startConnection: referrer client is null, cannot start connection");
            this.f4674d.a(null);
            return;
        }
        Class f4 = f();
        if (f4 == null) {
            f4670e.c("startConnection: listener class is null, cannot create listener proxy");
            this.f4674d.a(null);
            return;
        }
        Object c4 = c(f4);
        if (c4 != null) {
            k(f4, c4);
        } else {
            f4670e.c("startConnection: listener proxy is null, cannot start connection");
            this.f4674d.a(null);
        }
    }
}
