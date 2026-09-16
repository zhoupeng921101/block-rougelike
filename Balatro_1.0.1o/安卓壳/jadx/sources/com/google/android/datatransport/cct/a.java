package com.google.android.datatransport.cct;

import a1.b2.c3;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;
import k0.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a implements g {

    /* renamed from: c, reason: collision with root package name */
    static final String f2479c;

    /* renamed from: d, reason: collision with root package name */
    static final String f2480d;

    /* renamed from: e, reason: collision with root package name */
    private static final String f2481e;

    /* renamed from: f, reason: collision with root package name */
    private static final Set f2482f;

    /* renamed from: g, reason: collision with root package name */
    public static final a f2483g;

    /* renamed from: h, reason: collision with root package name */
    public static final a f2484h;

    /* renamed from: a, reason: collision with root package name */
    private final String f2485a;

    /* renamed from: b, reason: collision with root package name */
    private final String f2486b;

    static {
        String a4 = e.a("hts/frbslgiggolai.o/0clgbthfra=snpoo", "tp:/ieaeogn.ogepscmvc/o/ac?omtjo_rt3");
        f2479c = a4;
        String a5 = e.a("hts/frbslgigp.ogepscmv/ieo/eaybtho", c3.d4(882));
        f2480d = a5;
        String a6 = e.a("AzSCki82AwsLzKd5O8zo", c3.d4(978));
        f2481e = a6;
        f2482f = Collections.unmodifiableSet(new HashSet(Arrays.asList(i0.b.b("proto"), i0.b.b(c3.d4(687)))));
        f2483g = new a(a4, null);
        f2484h = new a(a5, a6);
    }

    public a(String str, String str2) {
        this.f2485a = str;
        this.f2486b = str2;
    }

    public static a c(byte[] bArr) {
        String str = new String(bArr, Charset.forName("UTF-8"));
        if (!str.startsWith("1$")) {
            throw new IllegalArgumentException("Version marker missing from extras");
        }
        String[] split = str.substring(2).split(Pattern.quote("\\"), 2);
        if (split.length != 2) {
            throw new IllegalArgumentException("Extra is not a valid encoded LegacyFlgDestination");
        }
        String str2 = split[0];
        if (str2.isEmpty()) {
            throw new IllegalArgumentException(c3.d4(1222));
        }
        String str3 = split[1];
        if (str3.isEmpty()) {
            str3 = null;
        }
        return new a(str2, str3);
    }

    @Override // k0.g
    public Set a() {
        return f2482f;
    }

    public byte[] b() {
        String str = this.f2486b;
        if (str == null && this.f2485a == null) {
            return null;
        }
        String str2 = this.f2485a;
        if (str == null) {
            str = "";
        }
        return String.format("%s%s%s%s", "1$", str2, c3.d4(1071), str).getBytes(Charset.forName("UTF-8"));
    }

    public String d() {
        return this.f2486b;
    }

    public String e() {
        return this.f2485a;
    }

    @Override // k0.f
    public byte[] getExtras() {
        return b();
    }

    @Override // k0.f
    public String getName() {
        return "cct";
    }
}
