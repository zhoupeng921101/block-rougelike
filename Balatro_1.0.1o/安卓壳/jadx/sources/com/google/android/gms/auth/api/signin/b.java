package com.google.android.gms.auth.api.signin;

import android.content.Context;
import b1.o;
import com.google.android.gms.dynamite.DynamiteModule;
import d1.i;
import d1.l;
import e1.e;
import g2.h;
import h1.p;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b extends e1.e {

    /* renamed from: k, reason: collision with root package name */
    public static final f f2546k = new f(null);

    /* renamed from: l, reason: collision with root package name */
    public static int f2547l = 1;

    public b(Context context, GoogleSignInOptions googleSignInOptions) {
        super(context, y0.a.f5162b, googleSignInOptions, new e.a.C0043a().b(new f1.a()).a());
    }

    private final synchronized int w() {
        int i4;
        try {
            i4 = f2547l;
            if (i4 == 1) {
                Context m3 = m();
                i l3 = i.l();
                int g4 = l3.g(m3, l.f3114a);
                if (g4 == 0) {
                    i4 = 4;
                    f2547l = 4;
                } else if (l3.a(m3, g4, null) != null || DynamiteModule.a(m3, "com.google.android.gms.auth.api.fallback") == 0) {
                    i4 = 2;
                    f2547l = 2;
                } else {
                    i4 = 3;
                    f2547l = 3;
                }
            }
        } catch (Throwable th) {
            throw th;
        }
        return i4;
    }

    public h u() {
        return p.b(o.a(d(), m(), w() == 3));
    }

    public h v() {
        return p.b(o.b(d(), m(), w() == 3));
    }
}
