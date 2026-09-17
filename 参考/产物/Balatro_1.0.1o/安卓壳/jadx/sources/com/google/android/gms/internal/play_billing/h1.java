package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h1 extends f1 {
    /* synthetic */ h1(q1 q1Var) {
        super(null);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final c1 a(k1 k1Var, c1 c1Var) {
        c1 c1Var2;
        synchronized (k1Var) {
            try {
                c1Var2 = k1Var.f2833f;
                if (c1Var2 != c1Var) {
                    k1Var.f2833f = c1Var;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return c1Var2;
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final j1 b(k1 k1Var, j1 j1Var) {
        j1 j1Var2;
        synchronized (k1Var) {
            try {
                j1Var2 = k1Var.f2834g;
                if (j1Var2 != j1Var) {
                    k1Var.f2834g = j1Var;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return j1Var2;
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final void c(j1 j1Var, j1 j1Var2) {
        j1Var.f2808b = j1Var2;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @Override // com.google.android.gms.internal.play_billing.f1
    public final void d(j1 j1Var, Thread thread) {
        j1Var.f2807a = thread;
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean e(k1 k1Var, c1 c1Var, c1 c1Var2) {
        synchronized (k1Var) {
            try {
                if (k1Var.f2833f != c1Var) {
                    return false;
                }
                k1Var.f2833f = c1Var2;
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean f(k1 k1Var, Object obj, Object obj2) {
        synchronized (k1Var) {
            try {
                if (k1Var.f2832e != obj) {
                    return false;
                }
                k1Var.f2832e = obj2;
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean g(k1 k1Var, j1 j1Var, j1 j1Var2) {
        synchronized (k1Var) {
            try {
                if (k1Var.f2834g != j1Var) {
                    return false;
                }
                k1Var.f2834g = j1Var2;
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
