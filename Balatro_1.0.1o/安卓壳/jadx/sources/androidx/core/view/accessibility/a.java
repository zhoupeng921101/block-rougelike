package androidx.core.view.accessibility;

import android.os.Bundle;
import android.text.style.ClickableSpan;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends ClickableSpan {

    /* renamed from: e, reason: collision with root package name */
    private final int f1034e;

    /* renamed from: f, reason: collision with root package name */
    private final t f1035f;

    /* renamed from: g, reason: collision with root package name */
    private final int f1036g;

    public a(int i4, t tVar, int i5) {
        this.f1034e = i4;
        this.f1035f = tVar;
        this.f1036g = i5;
    }

    @Override // android.text.style.ClickableSpan
    public void onClick(View view) {
        Bundle bundle = new Bundle();
        bundle.putInt("ACCESSIBILITY_CLICKABLE_SPAN_ID", this.f1034e);
        this.f1035f.F(this.f1036g, bundle);
    }
}
