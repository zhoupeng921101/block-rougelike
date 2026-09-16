package androidx.appcompat.view.menu;

import android.R;
import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import androidx.appcompat.view.menu.e;
import androidx.appcompat.widget.l0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class ExpandedMenuView extends ListView implements e.b, j, AdapterView.OnItemClickListener {

    /* renamed from: c, reason: collision with root package name */
    private static final int[] f123c = {R.attr.background, R.attr.divider};

    /* renamed from: a, reason: collision with root package name */
    private e f124a;

    /* renamed from: b, reason: collision with root package name */
    private int f125b;

    public ExpandedMenuView(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, R.attr.listViewStyle);
    }

    public ExpandedMenuView(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet);
        setOnItemClickListener(this);
        l0 s3 = l0.s(context, attributeSet, f123c, i4, 0);
        if (s3.p(0)) {
            setBackgroundDrawable(s3.f(0));
        }
        if (s3.p(1)) {
            setDivider(s3.f(1));
        }
        s3.t();
    }

    @Override // androidx.appcompat.view.menu.e.b
    public boolean a(f fVar) {
        return this.f124a.H(fVar, 0);
    }

    public int getWindowAnimations() {
        return this.f125b;
    }

    @Override // android.widget.ListView, android.widget.AbsListView, android.widget.AdapterView, android.view.ViewGroup, android.view.View
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        setChildrenDrawingCacheEnabled(false);
    }

    @Override // android.widget.AdapterView.OnItemClickListener
    public void onItemClick(AdapterView adapterView, View view, int i4, long j4) {
        a((f) getAdapter().getItem(i4));
    }
}
