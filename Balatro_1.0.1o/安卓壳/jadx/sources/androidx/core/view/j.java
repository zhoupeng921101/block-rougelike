package androidx.core.view;

import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class j {

    /* renamed from: a, reason: collision with root package name */
    private final Runnable f1073a;

    /* renamed from: b, reason: collision with root package name */
    private final CopyOnWriteArrayList f1074b = new CopyOnWriteArrayList();

    /* renamed from: c, reason: collision with root package name */
    private final Map f1075c = new HashMap();

    public j(Runnable runnable) {
        this.f1073a = runnable;
    }

    public void a(l lVar) {
        this.f1074b.add(lVar);
        this.f1073a.run();
    }

    public void b(Menu menu, MenuInflater menuInflater) {
        Iterator it = this.f1074b.iterator();
        while (it.hasNext()) {
            ((l) it.next()).c(menu, menuInflater);
        }
    }

    public void c(Menu menu) {
        Iterator it = this.f1074b.iterator();
        while (it.hasNext()) {
            ((l) it.next()).b(menu);
        }
    }

    public boolean d(MenuItem menuItem) {
        Iterator it = this.f1074b.iterator();
        while (it.hasNext()) {
            if (((l) it.next()).a(menuItem)) {
                return true;
            }
        }
        return false;
    }

    public void e(Menu menu) {
        Iterator it = this.f1074b.iterator();
        while (it.hasNext()) {
            ((l) it.next()).d(menu);
        }
    }

    public void f(l lVar) {
        this.f1074b.remove(lVar);
        h.d.a(this.f1075c.remove(lVar));
        this.f1073a.run();
    }
}
