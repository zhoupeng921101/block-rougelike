package com.google.android.gms.auth.api.signin.internal;

import android.content.Intent;
import android.os.Bundle;
import androidx.loader.app.a;
import b1.g;
import b1.x;
import e1.f;
import y.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a implements a.InterfaceC0024a {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ SignInHubActivity f2553a;

    /* synthetic */ a(SignInHubActivity signInHubActivity, x xVar) {
        this.f2553a = signInHubActivity;
    }

    @Override // androidx.loader.app.a.InterfaceC0024a
    public final void a(b bVar) {
    }

    @Override // androidx.loader.app.a.InterfaceC0024a
    public final /* bridge */ /* synthetic */ void b(b bVar, Object obj) {
        int i4;
        Intent intent;
        SignInHubActivity signInHubActivity = this.f2553a;
        i4 = signInHubActivity.A;
        intent = signInHubActivity.B;
        signInHubActivity.setResult(i4, intent);
        this.f2553a.finish();
    }

    @Override // androidx.loader.app.a.InterfaceC0024a
    public final b c(int i4, Bundle bundle) {
        return new g(this.f2553a, f.b());
    }
}
