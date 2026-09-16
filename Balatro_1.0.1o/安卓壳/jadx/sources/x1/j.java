package x1;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ l f5115e;

    /* synthetic */ j(l lVar, i iVar) {
        this.f5115e = lVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Context context;
        long b4 = this.f5115e.b();
        if (b4 == -1 || com.google.android.gms.common.util.e.b().a() <= b4) {
            return;
        }
        context = this.f5115e.f5117a;
        l.f(context);
    }
}
