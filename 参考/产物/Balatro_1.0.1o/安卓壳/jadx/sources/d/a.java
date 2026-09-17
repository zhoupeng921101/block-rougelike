package d;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.ViewGroup;
import c.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a extends ViewGroup.MarginLayoutParams {

    /* renamed from: a, reason: collision with root package name */
    public int f3078a;

    public a(int i4, int i5) {
        super(i4, i5);
        this.f3078a = 8388627;
    }

    public a(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        this.f3078a = 0;
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, i.f2013r);
        this.f3078a = obtainStyledAttributes.getInt(i.f2017s, 0);
        obtainStyledAttributes.recycle();
    }

    public a(ViewGroup.LayoutParams layoutParams) {
        super(layoutParams);
        this.f3078a = 0;
    }

    public a(a aVar) {
        super((ViewGroup.MarginLayoutParams) aVar);
        this.f3078a = 0;
        this.f3078a = aVar.f3078a;
    }
}
