package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import java.lang.ref.WeakReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class ViewStubCompat extends View {

    /* renamed from: a, reason: collision with root package name */
    private int f467a;

    /* renamed from: b, reason: collision with root package name */
    private int f468b;

    /* renamed from: c, reason: collision with root package name */
    private WeakReference f469c;

    /* renamed from: d, reason: collision with root package name */
    private LayoutInflater f470d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
    }

    public ViewStubCompat(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, 0);
    }

    public ViewStubCompat(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f467a = 0;
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, c.i.J2, i4, 0);
        this.f468b = obtainStyledAttributes.getResourceId(c.i.M2, -1);
        this.f467a = obtainStyledAttributes.getResourceId(c.i.L2, 0);
        setId(obtainStyledAttributes.getResourceId(c.i.K2, -1));
        obtainStyledAttributes.recycle();
        setVisibility(8);
        setWillNotDraw(true);
    }

    public View a() {
        ViewParent parent = getParent();
        if (!(parent instanceof ViewGroup)) {
            throw new IllegalStateException(c3.d4(276));
        }
        if (this.f467a == 0) {
            throw new IllegalArgumentException(c3.d4(610));
        }
        ViewGroup viewGroup = (ViewGroup) parent;
        LayoutInflater layoutInflater = this.f470d;
        if (layoutInflater == null) {
            layoutInflater = LayoutInflater.from(getContext());
        }
        View inflate = layoutInflater.inflate(this.f467a, viewGroup, false);
        int i4 = this.f468b;
        if (i4 != -1) {
            inflate.setId(i4);
        }
        int indexOfChild = viewGroup.indexOfChild(this);
        viewGroup.removeViewInLayout(this);
        ViewGroup.LayoutParams layoutParams = getLayoutParams();
        if (layoutParams != null) {
            viewGroup.addView(inflate, indexOfChild, layoutParams);
        } else {
            viewGroup.addView(inflate, indexOfChild);
        }
        this.f469c = new WeakReference(inflate);
        return inflate;
    }

    @Override // android.view.View
    protected void dispatchDraw(Canvas canvas) {
    }

    @Override // android.view.View
    public void draw(Canvas canvas) {
    }

    public int getInflatedId() {
        return this.f468b;
    }

    public LayoutInflater getLayoutInflater() {
        return this.f470d;
    }

    public int getLayoutResource() {
        return this.f467a;
    }

    @Override // android.view.View
    protected void onMeasure(int i4, int i5) {
        setMeasuredDimension(0, 0);
    }

    public void setInflatedId(int i4) {
        this.f468b = i4;
    }

    public void setLayoutInflater(LayoutInflater layoutInflater) {
        this.f470d = layoutInflater;
    }

    public void setLayoutResource(int i4) {
        this.f467a = i4;
    }

    public void setOnInflateListener(a aVar) {
    }

    @Override // android.view.View
    public void setVisibility(int i4) {
        WeakReference weakReference = this.f469c;
        if (weakReference != null) {
            View view = (View) weakReference.get();
            if (view == null) {
                throw new IllegalStateException("setVisibility called on un-referenced view");
            }
            view.setVisibility(i4);
            return;
        }
        super.setVisibility(i4);
        if (i4 == 0 || i4 == 4) {
            a();
        }
    }
}
