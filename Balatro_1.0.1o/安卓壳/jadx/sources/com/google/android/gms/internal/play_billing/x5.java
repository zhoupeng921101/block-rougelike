package com.google.android.gms.internal.play_billing;

import java.lang.reflect.Field;
import java.nio.Buffer;
import java.security.AccessController;
import java.util.logging.Level;
import java.util.logging.Logger;
import sun.misc.Unsafe;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class x5 {

    /* renamed from: a, reason: collision with root package name */
    private static final Unsafe f3026a;

    /* renamed from: b, reason: collision with root package name */
    private static final Class f3027b;

    /* renamed from: c, reason: collision with root package name */
    private static final boolean f3028c;

    /* renamed from: d, reason: collision with root package name */
    private static final w5 f3029d;

    /* renamed from: e, reason: collision with root package name */
    private static final boolean f3030e;

    /* renamed from: f, reason: collision with root package name */
    private static final boolean f3031f;

    /* renamed from: g, reason: collision with root package name */
    static final long f3032g;

    /* renamed from: h, reason: collision with root package name */
    static final boolean f3033h;

    /* JADX WARN: Removed duplicated region for block: B:15:0x0104  */
    /* JADX WARN: Removed duplicated region for block: B:20:0x0116  */
    /* JADX WARN: Removed duplicated region for block: B:24:0x0069  */
    static {
        /*
            Method dump skipped, instructions count: 282
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.internal.play_billing.x5.<clinit>():void");
    }

    static boolean A(Class cls) {
        int i4 = y2.f3034a;
        try {
            Class cls2 = f3027b;
            Class cls3 = Boolean.TYPE;
            cls2.getMethod("peekLong", cls, cls3);
            cls2.getMethod("pokeLong", cls, Long.TYPE, cls3);
            Class cls4 = Integer.TYPE;
            cls2.getMethod("pokeInt", cls, cls4, cls3);
            cls2.getMethod("peekInt", cls, cls3);
            cls2.getMethod("pokeByte", cls, Byte.TYPE);
            cls2.getMethod("peekByte", cls);
            cls2.getMethod("pokeByteArray", cls, byte[].class, cls4, cls4);
            cls2.getMethod("peekByteArray", cls, byte[].class, cls4, cls4);
            return true;
        } catch (Throwable unused) {
            return false;
        }
    }

    static boolean B(Object obj, long j4) {
        return f3029d.g(obj, j4);
    }

    static boolean C() {
        return f3031f;
    }

    static boolean D() {
        return f3030e;
    }

    private static int E(Class cls) {
        if (f3031f) {
            return f3029d.f3019a.arrayBaseOffset(cls);
        }
        return -1;
    }

    private static int a(Class cls) {
        if (f3031f) {
            return f3029d.f3019a.arrayIndexScale(cls);
        }
        return -1;
    }

    private static Field b() {
        int i4 = y2.f3034a;
        Field c4 = c(Buffer.class, "effectiveDirectAddress");
        if (c4 != null) {
            return c4;
        }
        Field c5 = c(Buffer.class, "address");
        if (c5 == null || c5.getType() != Long.TYPE) {
            return null;
        }
        return c5;
    }

    private static Field c(Class cls, String str) {
        try {
            return cls.getDeclaredField(str);
        } catch (Throwable unused) {
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void d(Object obj, long j4, byte b4) {
        Unsafe unsafe = f3029d.f3019a;
        long j5 = (-4) & j4;
        int i4 = unsafe.getInt(obj, j5);
        int i5 = ((~((int) j4)) & 3) << 3;
        unsafe.putInt(obj, j5, ((255 & b4) << i5) | (i4 & (~(255 << i5))));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void e(Object obj, long j4, byte b4) {
        Unsafe unsafe = f3029d.f3019a;
        long j5 = (-4) & j4;
        int i4 = (((int) j4) & 3) << 3;
        unsafe.putInt(obj, j5, ((255 & b4) << i4) | (unsafe.getInt(obj, j5) & (~(255 << i4))));
    }

    static double f(Object obj, long j4) {
        return f3029d.a(obj, j4);
    }

    static float g(Object obj, long j4) {
        return f3029d.b(obj, j4);
    }

    static int h(Object obj, long j4) {
        return f3029d.f3019a.getInt(obj, j4);
    }

    static long i(Object obj, long j4) {
        return f3029d.f3019a.getLong(obj, j4);
    }

    static Object j(Class cls) {
        try {
            return f3026a.allocateInstance(cls);
        } catch (InstantiationException e4) {
            throw new IllegalStateException(e4);
        }
    }

    static Object k(Object obj, long j4) {
        return f3029d.f3019a.getObject(obj, j4);
    }

    static Unsafe l() {
        Unsafe unsafe;
        try {
            unsafe = (Unsafe) AccessController.doPrivileged(new t5());
        } catch (Throwable unused) {
            unsafe = null;
        }
        if (unsafe == null) {
            return null;
        }
        try {
            unsafe.arrayBaseOffset(byte[].class);
            return unsafe;
        } catch (Exception unused2) {
            Logger.getLogger(x5.class.getName()).logp(Level.WARNING, a1.b2.c3.d4(70), "getUnsafe", "As part of the planned removal, sun.misc.Unsafe is available in the current environment but configured to throw on use. Protobuf will continue without using it, but with slightly reduced performance. --sun-misc-unsafe-memory-access=allow is likely available to opt back in if desired. A later Protobuf version release will stop using sun.misc.Unsafe entirely.");
            return null;
        }
    }

    static /* bridge */ /* synthetic */ void m(Throwable th) {
        Logger.getLogger(x5.class.getName()).logp(Level.WARNING, "com.google.protobuf.UnsafeUtil", "logMissingMethod", "platform method missing - proto runtime falling back to safer methods: ".concat(th.toString()));
    }

    static void r(Object obj, long j4, boolean z3) {
        f3029d.c(obj, j4, z3);
    }

    static void s(byte[] bArr, long j4, byte b4) {
        f3029d.d(bArr, f3032g + j4, b4);
    }

    static void t(Object obj, long j4, double d4) {
        f3029d.e(obj, j4, d4);
    }

    static void u(Object obj, long j4, float f4) {
        f3029d.f(obj, j4, f4);
    }

    static void v(Object obj, long j4, int i4) {
        f3029d.f3019a.putInt(obj, j4, i4);
    }

    static void w(Object obj, long j4, long j5) {
        f3029d.f3019a.putLong(obj, j4, j5);
    }

    static void x(Object obj, long j4, Object obj2) {
        f3029d.f3019a.putObject(obj, j4, obj2);
    }

    static /* bridge */ /* synthetic */ boolean y(Object obj, long j4) {
        return ((byte) ((f3029d.f3019a.getInt(obj, (-4) & j4) >>> ((int) (((~j4) & 3) << 3))) & 255)) != 0;
    }

    static /* bridge */ /* synthetic */ boolean z(Object obj, long j4) {
        return ((byte) ((f3029d.f3019a.getInt(obj, (-4) & j4) >>> ((int) ((j4 & 3) << 3))) & 255)) != 0;
    }
}
