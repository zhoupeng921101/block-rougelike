package androidx.lifecycle;

import java.io.Closeable;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class x {

    /* renamed from: a, reason: collision with root package name */
    private final Map f1703a = new HashMap();

    /* renamed from: b, reason: collision with root package name */
    private final Set f1704b = new LinkedHashSet();

    /* renamed from: c, reason: collision with root package name */
    private volatile boolean f1705c = false;

    private static void b(Object obj) {
        if (obj instanceof Closeable) {
            try {
                ((Closeable) obj).close();
            } catch (IOException e4) {
                throw new RuntimeException(e4);
            }
        }
    }

    final void a() {
        this.f1705c = true;
        Map map = this.f1703a;
        if (map != null) {
            synchronized (map) {
                try {
                    Iterator it = this.f1703a.values().iterator();
                    while (it.hasNext()) {
                        b(it.next());
                    }
                } finally {
                }
            }
        }
        Set set = this.f1704b;
        if (set != null) {
            synchronized (set) {
                try {
                    Iterator it2 = this.f1704b.iterator();
                    while (it2.hasNext()) {
                        b((Closeable) it2.next());
                    }
                } finally {
                }
            }
        }
        d();
    }

    Object c(String str) {
        Object obj;
        Map map = this.f1703a;
        if (map == null) {
            return null;
        }
        synchronized (map) {
            obj = this.f1703a.get(str);
        }
        return obj;
    }

    protected void d() {
    }
}
