package a;

import android.content.Context;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: a, reason: collision with root package name */
    private final Set f7a = new CopyOnWriteArraySet();

    /* renamed from: b, reason: collision with root package name */
    private volatile Context f8b;

    public void a(b bVar) {
        if (this.f8b != null) {
            bVar.a(this.f8b);
        }
        this.f7a.add(bVar);
    }

    public void b() {
        this.f8b = null;
    }

    public void c(Context context) {
        this.f8b = context;
        Iterator it = this.f7a.iterator();
        while (it.hasNext()) {
            ((b) it.next()).a(context);
        }
    }
}
