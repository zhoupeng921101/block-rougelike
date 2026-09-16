package com.google.android.gms.internal.play_billing;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class d4 extends w2 {
    private static final Map zzb = new ConcurrentHashMap();
    private int zzd = -1;
    protected r5 zzc = r5.c();

    protected static Object A(a5 a5Var, String str, Object[] objArr) {
        return new j5(a5Var, str, objArr);
    }

    protected static void j(Class cls, d4 d4Var) {
        d4Var.i();
        zzb.put(cls, d4Var);
    }

    private final int m(k5 k5Var) {
        return h5.a().b(getClass()).i(this);
    }

    private static d4 n(d4 d4Var, byte[] bArr, int i4, int i5, v3 v3Var) {
        if (i5 == 0) {
            return d4Var;
        }
        d4 v3 = d4Var.v();
        try {
            k5 b4 = h5.a().b(v3.getClass());
            b4.f(v3, bArr, 0, i5, new z2(v3Var));
            b4.g(v3);
            return v3;
        } catch (m4 e4) {
            throw e4;
        } catch (p5 e5) {
            throw e5.a();
        } catch (IOException e6) {
            if (e6.getCause() instanceof m4) {
                throw ((m4) e6.getCause());
            }
            throw new m4(e6);
        } catch (IndexOutOfBoundsException unused) {
            throw new m4("While parsing a protocol message, the input ended unexpectedly in the middle of a field.  This could mean either that the input has been truncated or that an embedded message misreported its own length.");
        }
    }

    private static final boolean o(d4 d4Var, boolean z3) {
        byte byteValue = ((Byte) d4Var.p(1, null, null)).byteValue();
        if (byteValue == 1) {
            return true;
        }
        if (byteValue == 0) {
            return false;
        }
        boolean l3 = h5.a().b(d4Var.getClass()).l(d4Var);
        if (z3) {
            d4Var.p(2, true != l3 ? null : d4Var, null);
        }
        return l3;
    }

    static d4 u(Class cls) {
        Map map = zzb;
        d4 d4Var = (d4) map.get(cls);
        if (d4Var == null) {
            try {
                Class.forName(cls.getName(), true, cls.getClassLoader());
                d4Var = (d4) map.get(cls);
            } catch (ClassNotFoundException e4) {
                throw new IllegalStateException("Class initialization cannot fail.", e4);
            }
        }
        if (d4Var != null) {
            return d4Var;
        }
        d4 d4Var2 = (d4) ((d4) x5.j(cls)).p(6, null, null);
        if (d4Var2 == null) {
            throw new IllegalStateException();
        }
        map.put(cls, d4Var2);
        return d4Var2;
    }

    protected static d4 w(d4 d4Var, byte[] bArr) {
        int length = bArr.length;
        v3 v3Var = v3.f3015b;
        int i4 = y2.f3034a;
        d4 n3 = n(d4Var, bArr, 0, length, v3.f3015b);
        if (n3 == null || o(n3, true)) {
            return n3;
        }
        throw new p5(n3).a();
    }

    protected static h4 x() {
        return e4.f();
    }

    protected static i4 y() {
        return i5.e();
    }

    static Object z(Method method, Object obj, Object... objArr) {
        try {
            return method.invoke(obj, objArr);
        } catch (IllegalAccessException e4) {
            throw new RuntimeException("Couldn't use Java reflection to implement protocol message reflection.", e4);
        } catch (InvocationTargetException e5) {
            Throwable cause = e5.getCause();
            if (cause instanceof RuntimeException) {
                throw ((RuntimeException) cause);
            }
            if (cause instanceof Error) {
                throw ((Error) cause);
            }
            throw new RuntimeException("Unexpected exception thrown by generated accessor method.", cause);
        }
    }

    protected final void B() {
        h5.a().b(getClass()).g(this);
        i();
    }

    @Override // com.google.android.gms.internal.play_billing.b5
    public final /* synthetic */ a5 a() {
        return (d4) p(6, null, null);
    }

    @Override // com.google.android.gms.internal.play_billing.w2
    final int c(k5 k5Var) {
        if (l()) {
            int i4 = k5Var.i(this);
            if (i4 >= 0) {
                return i4;
            }
            throw new IllegalStateException("serialized size must be non-negative, was " + i4);
        }
        int i5 = this.zzd & Integer.MAX_VALUE;
        if (i5 != Integer.MAX_VALUE) {
            return i5;
        }
        int i6 = k5Var.i(this);
        if (i6 >= 0) {
            this.zzd = (this.zzd & Integer.MIN_VALUE) | i6;
            return i6;
        }
        throw new IllegalStateException("serialized size must be non-negative, was " + i6);
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        return h5.a().b(getClass()).k(this, (d4) obj);
    }

    @Override // com.google.android.gms.internal.play_billing.a5
    public final /* synthetic */ z4 f() {
        return (b4) p(5, null, null);
    }

    @Override // com.google.android.gms.internal.play_billing.a5
    public final int g() {
        if (l()) {
            int m3 = m(null);
            if (m3 >= 0) {
                return m3;
            }
            throw new IllegalStateException("serialized size must be non-negative, was " + m3);
        }
        int i4 = this.zzd & Integer.MAX_VALUE;
        if (i4 != Integer.MAX_VALUE) {
            return i4;
        }
        int m4 = m(null);
        if (m4 >= 0) {
            this.zzd = (this.zzd & Integer.MIN_VALUE) | m4;
            return m4;
        }
        throw new IllegalStateException("serialized size must be non-negative, was " + m4);
    }

    @Override // com.google.android.gms.internal.play_billing.a5
    public final void h(r3 r3Var) {
        h5.a().b(getClass()).h(this, s3.K(r3Var));
    }

    public final int hashCode() {
        if (l()) {
            return q();
        }
        int i4 = this.zza;
        if (i4 != 0) {
            return i4;
        }
        int q3 = q();
        this.zza = q3;
        return q3;
    }

    final void i() {
        this.zzd &= Integer.MAX_VALUE;
    }

    final void k(int i4) {
        this.zzd = (this.zzd & Integer.MIN_VALUE) | Integer.MAX_VALUE;
    }

    final boolean l() {
        return (this.zzd & Integer.MIN_VALUE) != 0;
    }

    protected abstract Object p(int i4, Object obj, Object obj2);

    final int q() {
        return h5.a().b(getClass()).a(this);
    }

    public final boolean r() {
        return o(this, true);
    }

    protected final b4 s() {
        return (b4) p(5, null, null);
    }

    public final b4 t() {
        b4 b4Var = (b4) p(5, null, null);
        b4Var.e(this);
        return b4Var;
    }

    public final String toString() {
        return c5.a(this, super.toString());
    }

    final d4 v() {
        return (d4) p(4, null, null);
    }
}
