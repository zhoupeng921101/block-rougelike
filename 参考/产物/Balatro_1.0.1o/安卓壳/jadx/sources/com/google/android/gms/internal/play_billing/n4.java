package com.google.android.gms.internal.play_billing;

/* JADX WARN: Enum visitor error
jadx.core.utils.exceptions.JadxRuntimeException: Init of enum field 'g' uses external variables
	at jadx.core.dex.visitors.EnumVisitor.createEnumFieldByConstructor(EnumVisitor.java:451)
	at jadx.core.dex.visitors.EnumVisitor.processEnumFieldByRegister(EnumVisitor.java:395)
	at jadx.core.dex.visitors.EnumVisitor.extractEnumFieldsFromFilledArray(EnumVisitor.java:324)
	at jadx.core.dex.visitors.EnumVisitor.extractEnumFieldsFromInsn(EnumVisitor.java:262)
	at jadx.core.dex.visitors.EnumVisitor.convertToEnum(EnumVisitor.java:151)
	at jadx.core.dex.visitors.EnumVisitor.visit(EnumVisitor.java:100)
 */
/* JADX WARN: Failed to restore enum class, 'enum' modifier and super class removed */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n4 {

    /* renamed from: f, reason: collision with root package name */
    public static final n4 f2872f;

    /* renamed from: g, reason: collision with root package name */
    public static final n4 f2873g;

    /* renamed from: h, reason: collision with root package name */
    public static final n4 f2874h;

    /* renamed from: i, reason: collision with root package name */
    public static final n4 f2875i;

    /* renamed from: j, reason: collision with root package name */
    public static final n4 f2876j;

    /* renamed from: k, reason: collision with root package name */
    public static final n4 f2877k;

    /* renamed from: l, reason: collision with root package name */
    public static final n4 f2878l;

    /* renamed from: m, reason: collision with root package name */
    public static final n4 f2879m;

    /* renamed from: n, reason: collision with root package name */
    public static final n4 f2880n;

    /* renamed from: o, reason: collision with root package name */
    public static final n4 f2881o;

    /* renamed from: p, reason: collision with root package name */
    private static final /* synthetic */ n4[] f2882p;

    /* renamed from: e, reason: collision with root package name */
    private final Class f2883e;

    static {
        n4 n4Var = new n4("VOID", 0, Void.class, Void.class, null);
        f2872f = n4Var;
        Class cls = Integer.TYPE;
        n4 n4Var2 = new n4("INT", 1, cls, Integer.class, 0);
        f2873g = n4Var2;
        n4 n4Var3 = new n4(a1.b2.c3.d4(690), 2, Long.TYPE, Long.class, 0L);
        f2874h = n4Var3;
        n4 n4Var4 = new n4("FLOAT", 3, Float.TYPE, Float.class, Float.valueOf(0.0f));
        f2875i = n4Var4;
        n4 n4Var5 = new n4(a1.b2.c3.d4(733), 4, Double.TYPE, Double.class, Double.valueOf(0.0d));
        f2876j = n4Var5;
        n4 n4Var6 = new n4("BOOLEAN", 5, Boolean.TYPE, Boolean.class, Boolean.FALSE);
        f2877k = n4Var6;
        n4 n4Var7 = new n4("STRING", 6, String.class, String.class, "");
        f2878l = n4Var7;
        n4 n4Var8 = new n4(a1.b2.c3.d4(734), 7, j3.class, j3.class, j3.f2809f);
        f2879m = n4Var8;
        n4 n4Var9 = new n4("ENUM", 8, cls, Integer.class, null);
        f2880n = n4Var9;
        n4 n4Var10 = new n4("MESSAGE", 9, Object.class, Object.class, null);
        f2881o = n4Var10;
        f2882p = new n4[]{n4Var, n4Var2, n4Var3, n4Var4, n4Var5, n4Var6, n4Var7, n4Var8, n4Var9, n4Var10};
    }

    private n4(String str, int i4, Class cls, Class cls2, Object obj) {
        this.f2883e = cls2;
    }

    public static n4[] values() {
        return (n4[]) f2882p.clone();
    }

    public final Class a() {
        return this.f2883e;
    }
}
