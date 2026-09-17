package com.google.android.gms.internal.play_billing;

import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class m8 extends i8 {

    /* renamed from: l, reason: collision with root package name */
    final /* synthetic */ n8 f2867l;

    m8(n8 n8Var) {
        Objects.requireNonNull(n8Var);
        this.f2867l = n8Var;
    }

    @Override // com.google.android.gms.internal.play_billing.i8
    protected final String b() {
        j8 j8Var = (j8) this.f2867l.f2958e.get();
        if (j8Var == null) {
            return "Completer object has been garbage collected, future will fail soon";
        }
        return a1.b2.c3.d4(524) + String.valueOf(j8Var.f2821a) + "]";
    }
}
