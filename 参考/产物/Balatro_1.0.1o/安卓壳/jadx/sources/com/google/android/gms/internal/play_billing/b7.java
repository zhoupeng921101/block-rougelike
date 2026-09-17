package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b7 extends d4 implements b5 {
    private static final b7 zzb;
    private int zzd;
    private int zzh;
    private long zzi;
    private long zzj;
    private boolean zzk;
    private int zzl;
    private int zzm;
    private long zzn;
    private int zzs;
    private String zze = "";
    private String zzf = "";
    private String zzg = "";
    private String zzo = "";
    private String zzp = "";
    private String zzq = "";
    private String zzr = "";

    static {
        b7 b7Var = new b7();
        zzb = b7Var;
        d4.j(b7.class, b7Var);
    }

    private b7() {
    }

    static /* synthetic */ void C(b7 b7Var, long j4) {
        b7Var.zzd |= 512;
        b7Var.zzn = 846465066L;
    }

    static /* synthetic */ void D(b7 b7Var, String str) {
        str.getClass();
        b7Var.zzd |= 4;
        b7Var.zzg = str;
    }

    static /* synthetic */ void E(b7 b7Var, String str) {
        str.getClass();
        b7Var.zzd |= 1024;
        b7Var.zzo = str;
    }

    static /* synthetic */ void F(b7 b7Var, String str) {
        str.getClass();
        b7Var.zzd |= 8192;
        b7Var.zzr = str;
    }

    static /* synthetic */ void G(b7 b7Var, String str) {
        str.getClass();
        b7Var.zzd |= 4096;
        b7Var.zzq = str;
    }

    static /* synthetic */ void H(b7 b7Var, String str) {
        str.getClass();
        b7Var.zzd |= 2048;
        b7Var.zzp = str;
    }

    static /* synthetic */ void I(b7 b7Var, int i4) {
        b7Var.zzd |= 16384;
        b7Var.zzs = i4;
    }

    static /* synthetic */ void J(b7 b7Var, boolean z3) {
        b7Var.zzd |= 64;
        b7Var.zzk = z3;
    }

    static /* synthetic */ void K(b7 b7Var, String str) {
        str.getClass();
        b7Var.zzd |= 1;
        b7Var.zze = str;
    }

    static /* synthetic */ void L(b7 b7Var, String str) {
        b7Var.zzd |= 2;
        b7Var.zzf = str;
    }

    public static z6 M() {
        return (z6) zzb.s();
    }

    static /* synthetic */ void O(b7 b7Var, int i4) {
        b7Var.zzd |= 128;
        b7Var.zzl = i4;
    }

    static /* synthetic */ void P(b7 b7Var, int i4) {
        b7Var.zzd |= 256;
        b7Var.zzm = i4;
    }

    static /* synthetic */ void Q(b7 b7Var, int i4) {
        b7Var.zzd |= 8;
        b7Var.zzh = i4;
    }

    static /* synthetic */ void R(b7 b7Var, long j4) {
        b7Var.zzd |= 16;
        b7Var.zzi = j4;
    }

    static /* synthetic */ void S(b7 b7Var, long j4) {
        b7Var.zzd |= 32;
        b7Var.zzj = j4;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u000f\u0000\u0001\u0001\u000f\u000f\u0000\u0000\u0000\u0001ဈ\u0000\u0002ဈ\u0002\u0003င\u0003\u0004ဂ\u0004\u0005ဈ\u0001\u0006ဂ\u0005\u0007ဇ\u0006\bင\u0007\tင\b\nဂ\t\u000bဈ\n\fဈ\u000b\rဈ\f\u000eဈ\r\u000fင\u000e", new Object[]{"zzd", "zze", "zzg", "zzh", a1.b2.c3.d4(832), "zzf", "zzj", a1.b2.c3.d4(983), "zzl", "zzm", "zzn", "zzo", "zzp", "zzq", "zzr", "zzs"});
        }
        if (i5 == 3) {
            return new b7();
        }
        a7 a7Var = null;
        if (i5 == 4) {
            return new z6(a7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
