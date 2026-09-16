package l0;

import a1.b2.c3;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.os.Bundle;
import android.util.Log;
import com.google.android.datatransport.runtime.backends.TransportBackendDiscovery;
import java.lang.reflect.InvocationTargetException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class k implements e {

    /* renamed from: a, reason: collision with root package name */
    private final a f4136a;

    /* renamed from: b, reason: collision with root package name */
    private final i f4137b;

    /* renamed from: c, reason: collision with root package name */
    private final Map f4138c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {

        /* renamed from: a, reason: collision with root package name */
        private final Context f4139a;

        /* renamed from: b, reason: collision with root package name */
        private Map f4140b = null;

        a(Context context) {
            this.f4139a = context;
        }

        private Map a(Context context) {
            Bundle d4 = d(context);
            if (d4 == null) {
                Log.w(c3.d4(125), c3.d4(27));
                return Collections.EMPTY_MAP;
            }
            HashMap hashMap = new HashMap();
            for (String str : d4.keySet()) {
                Object obj = d4.get(str);
                if ((obj instanceof String) && str.startsWith("backend:")) {
                    for (String str2 : ((String) obj).split(c3.d4(586), -1)) {
                        String trim = str2.trim();
                        if (!trim.isEmpty()) {
                            hashMap.put(trim, str.substring(8));
                        }
                    }
                }
            }
            return hashMap;
        }

        private Map c() {
            if (this.f4140b == null) {
                this.f4140b = a(this.f4139a);
            }
            return this.f4140b;
        }

        private static Bundle d(Context context) {
            try {
                PackageManager packageManager = context.getPackageManager();
                if (packageManager == null) {
                    Log.w("BackendRegistry", "Context has no PackageManager.");
                    return null;
                }
                ServiceInfo serviceInfo = packageManager.getServiceInfo(new ComponentName(context, (Class<?>) TransportBackendDiscovery.class), 128);
                if (serviceInfo != null) {
                    return serviceInfo.metaData;
                }
                Log.w("BackendRegistry", "TransportBackendDiscovery has no service info.");
                return null;
            } catch (PackageManager.NameNotFoundException unused) {
                Log.w("BackendRegistry", c3.d4(344));
                return null;
            }
        }

        d b(String str) {
            String str2 = (String) c().get(str);
            if (str2 == null) {
                return null;
            }
            try {
                return (d) Class.forName(str2).asSubclass(d.class).getDeclaredConstructor(null).newInstance(null);
            } catch (ClassNotFoundException e4) {
                Log.w("BackendRegistry", String.format("Class %s is not found.", str2), e4);
                return null;
            } catch (IllegalAccessException e5) {
                Log.w("BackendRegistry", String.format("Could not instantiate %s.", str2), e5);
                return null;
            } catch (InstantiationException e6) {
                Log.w("BackendRegistry", String.format("Could not instantiate %s.", str2), e6);
                return null;
            } catch (NoSuchMethodException e7) {
                Log.w("BackendRegistry", String.format("Could not instantiate %s", str2), e7);
                return null;
            } catch (InvocationTargetException e8) {
                Log.w("BackendRegistry", String.format("Could not instantiate %s", str2), e8);
                return null;
            }
        }
    }

    k(Context context, i iVar) {
        this(new a(context), iVar);
    }

    k(a aVar, i iVar) {
        this.f4138c = new HashMap();
        this.f4136a = aVar;
        this.f4137b = iVar;
    }

    @Override // l0.e
    public synchronized m a(String str) {
        if (this.f4138c.containsKey(str)) {
            return (m) this.f4138c.get(str);
        }
        d b4 = this.f4136a.b(str);
        if (b4 == null) {
            return null;
        }
        m create = b4.create(this.f4137b.a(str));
        this.f4138c.put(str, create);
        return create;
    }
}
