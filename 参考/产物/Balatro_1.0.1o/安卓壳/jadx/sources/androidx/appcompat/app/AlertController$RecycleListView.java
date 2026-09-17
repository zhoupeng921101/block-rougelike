package androidx.appcompat.app;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.widget.ListView;
import c.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class AlertController$RecycleListView extends ListView {

    /* renamed from: a, reason: collision with root package name */
    private final int f109a;

    /* renamed from: b, reason: collision with root package name */
    private final int f110b;

    public AlertController$RecycleListView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, i.f2023t1);
        this.f110b = obtainStyledAttributes.getDimensionPixelOffset(i.f2027u1, -1);
        this.f109a = obtainStyledAttributes.getDimensionPixelOffset(i.f2031v1, -1);
    }
}
