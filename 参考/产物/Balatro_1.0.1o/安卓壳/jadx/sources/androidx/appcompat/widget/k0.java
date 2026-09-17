package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import java.lang.ref.WeakReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class k0 extends d0 {

    /* renamed from: b, reason: collision with root package name */
    private final WeakReference f598b;

    public k0(Context context, Resources resources) {
        super(resources);
        this.f598b = new WeakReference(context);
    }

    @Override // android.content.res.Resources
    public Drawable getDrawable(int i4) {
        Drawable a4 = a(i4);
        Context context = (Context) this.f598b.get();
        if (a4 != null && context != null) {
            c0.g().v(context, i4, a4);
        }
        return a4;
    }
}
