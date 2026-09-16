package c2;

import android.app.Application;
import android.content.Context;
import android.os.Looper;
import e1.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class q0 extends a.AbstractC0041a {
    /* synthetic */ q0(byte[] bArr) {
    }

    @Override // e1.a.AbstractC0041a
    public final /* bridge */ /* synthetic */ a.f b(Context context, Looper looper, h1.e eVar, Object obj, f1.e eVar2, f1.l lVar) {
        p1.w wVar = (p1.w) obj;
        if (wVar == null) {
            wVar = p1.w.a().d();
        }
        p1.w wVar2 = wVar;
        q1.d dVar = new q1.d(context, looper, eVar, wVar2, eVar2, lVar, q1.l.a());
        if (wVar2.f4659s.a()) {
            int i4 = q1.q.f4732h;
            dVar.r0(q1.q.a((Application) context.getApplicationContext()));
        }
        return dVar;
    }
}
