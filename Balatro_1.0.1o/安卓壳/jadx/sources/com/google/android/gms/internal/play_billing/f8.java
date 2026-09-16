package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f8 extends z1 {
    f8() {
        super(null);
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final void a(g8 g8Var, g8 g8Var2) {
        g8Var.f2774b = g8Var2;
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final void b(g8 g8Var, Thread thread) {
        g8Var.f2773a = thread;
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final boolean c(i8 i8Var, y4 y4Var, y4 y4Var2) {
        synchronized (i8Var) {
            try {
                if (i8Var.f2801f != y4Var) {
                    return false;
                }
                i8Var.f2801f = y4Var2;
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final boolean d(i8 i8Var, Object obj, Object obj2) {
        synchronized (i8Var) {
            try {
                if (i8Var.f2800e != obj) {
                    return false;
                }
                i8Var.f2800e = obj2;
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final boolean e(i8 i8Var, g8 g8Var, g8 g8Var2) {
        synchronized (i8Var) {
            try {
                if (i8Var.f2802g != g8Var) {
                    return false;
                }
                i8Var.f2802g = g8Var2;
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
