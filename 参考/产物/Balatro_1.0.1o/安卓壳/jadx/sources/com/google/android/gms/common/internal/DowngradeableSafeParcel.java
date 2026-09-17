package com.google.android.gms.common.internal;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class DowngradeableSafeParcel extends i1.a implements ReflectedParcelable {

    /* renamed from: f, reason: collision with root package name */
    private static final Object f2607f = new Object();

    /* renamed from: e, reason: collision with root package name */
    private boolean f2608e = false;

    protected static boolean h0(String str) {
        synchronized (f2607f) {
        }
        return true;
    }

    protected static Integer i0() {
        synchronized (f2607f) {
        }
        return null;
    }

    protected boolean j0() {
        return this.f2608e;
    }
}
