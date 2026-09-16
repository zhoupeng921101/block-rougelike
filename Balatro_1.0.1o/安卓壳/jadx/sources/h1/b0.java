package h1;

import android.app.Activity;
import android.content.Intent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b0 extends d0 {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ Intent f3432a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ Activity f3433b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ int f3434c;

    b0(Intent intent, Activity activity, int i4) {
        this.f3432a = intent;
        this.f3433b = activity;
        this.f3434c = i4;
    }

    @Override // h1.d0
    public final void a() {
        Intent intent = this.f3432a;
        if (intent != null) {
            this.f3433b.startActivityForResult(intent, this.f3434c);
        }
    }
}
