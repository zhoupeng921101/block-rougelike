package f1;

import android.os.Bundle;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h1 implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ h f3268e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ String f3269f;

    /* renamed from: g, reason: collision with root package name */
    final /* synthetic */ i1 f3270g;

    h1(i1 i1Var, h hVar, String str) {
        this.f3268e = hVar;
        this.f3269f = str;
        Objects.requireNonNull(i1Var);
        this.f3270g = i1Var;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Bundle bundle;
        i1 i1Var = this.f3270g;
        if (i1Var.k() > 0) {
            h hVar = this.f3268e;
            if (i1Var.l() != null) {
                bundle = i1Var.l().getBundle(this.f3269f);
            } else {
                bundle = null;
            }
            hVar.f(bundle);
        }
        if (i1Var.k() >= 2) {
            this.f3268e.j();
        }
        if (i1Var.k() >= 3) {
            this.f3268e.h();
        }
        if (i1Var.k() >= 4) {
            this.f3268e.k();
        }
        if (i1Var.k() >= 5) {
            this.f3268e.g();
        }
    }
}
