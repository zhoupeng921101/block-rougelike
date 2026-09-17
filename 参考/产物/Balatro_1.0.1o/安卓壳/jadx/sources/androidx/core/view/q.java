package androidx.core.view;

import android.view.View;
import android.view.ViewGroup;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class q {

    /* renamed from: a, reason: collision with root package name */
    private int f1081a;

    /* renamed from: b, reason: collision with root package name */
    private int f1082b;

    public q(ViewGroup viewGroup) {
    }

    public int a() {
        return this.f1081a | this.f1082b;
    }

    public void b(View view, View view2, int i4) {
        c(view, view2, i4, 0);
    }

    public void c(View view, View view2, int i4, int i5) {
        if (i5 == 1) {
            this.f1082b = i4;
        } else {
            this.f1081a = i4;
        }
    }

    public void d(View view, int i4) {
        if (i4 == 1) {
            this.f1082b = 0;
        } else {
            this.f1081a = 0;
        }
    }
}
