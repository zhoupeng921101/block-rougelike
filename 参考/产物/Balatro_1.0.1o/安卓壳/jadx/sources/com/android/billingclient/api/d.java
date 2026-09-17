package com.android.billingclient.api;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d {

    /* renamed from: a, reason: collision with root package name */
    private int f2299a;

    /* renamed from: b, reason: collision with root package name */
    private int f2300b;

    /* renamed from: c, reason: collision with root package name */
    private String f2301c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private int f2302a;

        /* renamed from: b, reason: collision with root package name */
        private int f2303b = 0;

        /* renamed from: c, reason: collision with root package name */
        private String f2304c = "";

        /* synthetic */ a(e0.v vVar) {
        }

        public d a() {
            d dVar = new d();
            dVar.f2299a = this.f2302a;
            dVar.f2300b = this.f2303b;
            dVar.f2301c = this.f2304c;
            return dVar;
        }

        public a b(String str) {
            this.f2304c = str;
            return this;
        }

        public a c(int i4) {
            this.f2303b = i4;
            return this;
        }

        public a d(int i4) {
            this.f2302a = i4;
            return this;
        }
    }

    public static a d() {
        return new a(null);
    }

    public String a() {
        return this.f2301c;
    }

    public int b() {
        return this.f2300b;
    }

    public int c() {
        return this.f2299a;
    }

    public String toString() {
        return c3.d4(1069) + com.google.android.gms.internal.play_billing.m0.j(this.f2299a) + ", Debug Message: " + this.f2301c;
    }
}
