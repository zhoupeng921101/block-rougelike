package h1;

import android.content.Intent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c0 extends d0 {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ Intent f3436a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ f1.i f3437b;

    c0(Intent intent, f1.i iVar, int i4) {
        this.f3436a = intent;
        this.f3437b = iVar;
    }

    @Override // h1.d0
    public final void a() {
        Intent intent = this.f3436a;
        if (intent != null) {
            this.f3437b.startActivityForResult(intent, 2);
        }
    }
}
