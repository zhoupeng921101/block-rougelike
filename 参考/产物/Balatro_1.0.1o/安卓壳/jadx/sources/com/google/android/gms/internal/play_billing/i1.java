package com.google.android.gms.internal.play_billing;

import java.lang.reflect.Field;
import java.security.AccessController;
import java.security.PrivilegedActionException;
import java.security.PrivilegedExceptionAction;
import sun.misc.Unsafe;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i1 extends f1 {

    /* renamed from: a, reason: collision with root package name */
    static final Unsafe f2786a;

    /* renamed from: b, reason: collision with root package name */
    static final long f2787b;

    /* renamed from: c, reason: collision with root package name */
    static final long f2788c;

    /* renamed from: d, reason: collision with root package name */
    static final long f2789d;

    /* renamed from: e, reason: collision with root package name */
    static final long f2790e;

    /* renamed from: f, reason: collision with root package name */
    static final long f2791f;

    static {
        Unsafe unsafe;
        try {
            try {
                unsafe = Unsafe.getUnsafe();
            } catch (SecurityException unused) {
                unsafe = (Unsafe) AccessController.doPrivileged(new PrivilegedExceptionAction() { // from class: com.google.android.gms.internal.play_billing.p1
                    @Override // java.security.PrivilegedExceptionAction
                    public final Object run() {
                        Unsafe unsafe2 = i1.f2786a;
                        for (Field field : Unsafe.class.getDeclaredFields()) {
                            field.setAccessible(true);
                            Object obj = field.get(null);
                            if (Unsafe.class.isInstance(obj)) {
                                return (Unsafe) Unsafe.class.cast(obj);
                            }
                        }
                        throw new NoSuchFieldError("the Unsafe");
                    }
                });
            }
            try {
                f2788c = unsafe.objectFieldOffset(k1.class.getDeclaredField("g"));
                f2787b = unsafe.objectFieldOffset(k1.class.getDeclaredField("f"));
                f2789d = unsafe.objectFieldOffset(k1.class.getDeclaredField("e"));
                f2790e = unsafe.objectFieldOffset(j1.class.getDeclaredField("a"));
                f2791f = unsafe.objectFieldOffset(j1.class.getDeclaredField("b"));
                f2786a = unsafe;
            } catch (NoSuchFieldException e4) {
                throw new RuntimeException(e4);
            }
        } catch (PrivilegedActionException e5) {
            throw new RuntimeException("Could not initialize intrinsics", e5.getCause());
        }
    }

    /* synthetic */ i1(q1 q1Var) {
        super(null);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final c1 a(k1 k1Var, c1 c1Var) {
        c1 c1Var2;
        do {
            c1Var2 = k1Var.f2833f;
            if (c1Var == c1Var2) {
                break;
            }
        } while (!e(k1Var, c1Var2, c1Var));
        return c1Var2;
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final j1 b(k1 k1Var, j1 j1Var) {
        j1 j1Var2;
        do {
            j1Var2 = k1Var.f2834g;
            if (j1Var == j1Var2) {
                break;
            }
        } while (!g(k1Var, j1Var2, j1Var));
        return j1Var2;
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final void c(j1 j1Var, j1 j1Var2) {
        f2786a.putObject(j1Var, f2791f, j1Var2);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @Override // com.google.android.gms.internal.play_billing.f1
    public final void d(j1 j1Var, Thread thread) {
        f2786a.putObject(j1Var, f2790e, thread);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean e(k1 k1Var, c1 c1Var, c1 c1Var2) {
        return o1.a(f2786a, k1Var, f2787b, c1Var, c1Var2);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean f(k1 k1Var, Object obj, Object obj2) {
        return o1.a(f2786a, k1Var, f2789d, obj, obj2);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean g(k1 k1Var, j1 j1Var, j1 j1Var2) {
        return o1.a(f2786a, k1Var, f2788c, j1Var, j1Var2);
    }
}
