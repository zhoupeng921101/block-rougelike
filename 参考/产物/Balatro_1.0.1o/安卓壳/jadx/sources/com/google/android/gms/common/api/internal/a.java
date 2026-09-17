package com.google.android.gms.common.api.internal;

import a1.b2.c3;
import android.app.PendingIntent;
import android.os.DeadObjectException;
import android.os.RemoteException;
import com.google.android.gms.common.api.Status;
import e1.a;
import e1.f;
import e1.k;
import f1.d;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a extends BasePendingResult implements d {

    /* renamed from: n, reason: collision with root package name */
    private final a.c f2583n;

    /* renamed from: o, reason: collision with root package name */
    private final e1.a f2584o;

    protected a(e1.a aVar, f fVar) {
        super((f) q.j(fVar, c3.d4(197)));
        q.j(aVar, "Api must not be null");
        this.f2583n = aVar.b();
        this.f2584o = aVar;
    }

    private void q(RemoteException remoteException) {
        b(new Status(8, remoteException.getLocalizedMessage(), (PendingIntent) null));
    }

    @Override // f1.d
    public final void b(Status status) {
        q.b(!status.m0(), "Failed result must not be success");
        k e4 = e(status);
        h(e4);
        o(e4);
    }

    protected abstract void n(a.b bVar);

    protected void o(k kVar) {
    }

    public final void p(a.b bVar) {
        try {
            n(bVar);
        } catch (DeadObjectException e4) {
            q(e4);
            throw e4;
        } catch (RemoteException e5) {
            q(e5);
        }
    }
}
