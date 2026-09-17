package b1;

import a1.b2.c3;
import android.content.Context;
import android.util.Log;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g extends y.a implements f1.n {

    /* renamed from: o, reason: collision with root package name */
    private final Semaphore f1788o;

    /* renamed from: p, reason: collision with root package name */
    private final Set f1789p;

    public g(Context context, Set set) {
        super(context);
        this.f1788o = new Semaphore(0);
        this.f1789p = set;
    }

    @Override // y.a
    public final /* bridge */ /* synthetic */ Object C() {
        Iterator it = this.f1789p.iterator();
        int i4 = 0;
        while (it.hasNext()) {
            if (((e1.f) it.next()).d(this)) {
                i4++;
            }
        }
        try {
            this.f1788o.tryAcquire(i4, 5L, TimeUnit.SECONDS);
            return null;
        } catch (InterruptedException e4) {
            Log.i("GACSignInLoader", c3.d4(876), e4);
            Thread.currentThread().interrupt();
            return null;
        }
    }

    @Override // y.b
    protected final void p() {
        this.f1788o.drainPermits();
        h();
    }
}
