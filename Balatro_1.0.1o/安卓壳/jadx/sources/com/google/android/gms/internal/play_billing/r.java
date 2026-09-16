package com.google.android.gms.internal.play_billing;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r {

    /* renamed from: a, reason: collision with root package name */
    private final String f2970a;

    /* renamed from: b, reason: collision with root package name */
    private final q f2971b;

    /* renamed from: c, reason: collision with root package name */
    private q f2972c;

    /* synthetic */ r(String str, s sVar) {
        q qVar = new q();
        this.f2971b = qVar;
        this.f2972c = qVar;
        str.getClass();
        this.f2970a = str;
    }

    public final r a(Object obj) {
        q qVar = new q();
        this.f2972c.f2966b = qVar;
        this.f2972c = qVar;
        qVar.f2965a = obj;
        return this;
    }

    public final String toString() {
        StringBuilder sb = new StringBuilder(32);
        sb.append(this.f2970a);
        sb.append('{');
        q qVar = this.f2971b.f2966b;
        String str = "";
        while (qVar != null) {
            Object obj = qVar.f2965a;
            sb.append(str);
            if (obj == null || !obj.getClass().isArray()) {
                sb.append(obj);
            } else {
                sb.append((CharSequence) Arrays.deepToString(new Object[]{obj}), 1, r2.length() - 1);
            }
            qVar = qVar.f2966b;
            str = a1.b2.c3.d4(790);
        }
        sb.append('}');
        return sb.toString();
    }
}
