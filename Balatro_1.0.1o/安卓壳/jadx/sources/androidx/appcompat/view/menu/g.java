package androidx.appcompat.view.menu;

import android.content.Context;
import android.graphics.Rect;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.FrameLayout;
import android.widget.HeaderViewListAdapter;
import android.widget.ListAdapter;
import android.widget.PopupWindow;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g implements k, i, AdapterView.OnItemClickListener {

    /* renamed from: a, reason: collision with root package name */
    private Rect f265a;

    g() {
    }

    protected static int o(ListAdapter listAdapter, ViewGroup viewGroup, Context context, int i4) {
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, 0);
        int makeMeasureSpec2 = View.MeasureSpec.makeMeasureSpec(0, 0);
        int count = listAdapter.getCount();
        int i5 = 0;
        int i6 = 0;
        View view = null;
        for (int i7 = 0; i7 < count; i7++) {
            int itemViewType = listAdapter.getItemViewType(i7);
            if (itemViewType != i6) {
                view = null;
                i6 = itemViewType;
            }
            if (viewGroup == null) {
                viewGroup = new FrameLayout(context);
            }
            view = listAdapter.getView(i7, view, viewGroup);
            view.measure(makeMeasureSpec, makeMeasureSpec2);
            int measuredWidth = view.getMeasuredWidth();
            if (measuredWidth >= i4) {
                return i4;
            }
            if (measuredWidth > i5) {
                i5 = measuredWidth;
            }
        }
        return i5;
    }

    protected static boolean x(e eVar) {
        int size = eVar.size();
        for (int i4 = 0; i4 < size; i4++) {
            MenuItem item = eVar.getItem(i4);
            if (item.isVisible() && item.getIcon() != null) {
                return true;
            }
        }
        return false;
    }

    protected static d y(ListAdapter listAdapter) {
        return listAdapter instanceof HeaderViewListAdapter ? (d) ((HeaderViewListAdapter) listAdapter).getWrappedAdapter() : (d) listAdapter;
    }

    @Override // androidx.appcompat.view.menu.i
    public void c(Context context, e eVar) {
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean h(e eVar, f fVar) {
        return false;
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean j(e eVar, f fVar) {
        return false;
    }

    public abstract void l(e eVar);

    protected boolean m() {
        return true;
    }

    public Rect n() {
        return this.f265a;
    }

    @Override // android.widget.AdapterView.OnItemClickListener
    public void onItemClick(AdapterView adapterView, View view, int i4, long j4) {
        ListAdapter listAdapter = (ListAdapter) adapterView.getAdapter();
        y(listAdapter).f207a.I((MenuItem) listAdapter.getItem(i4), this, m() ? 0 : 4);
    }

    public abstract void p(View view);

    public void q(Rect rect) {
        this.f265a = rect;
    }

    public abstract void r(boolean z3);

    public abstract void s(int i4);

    public abstract void t(int i4);

    public abstract void u(PopupWindow.OnDismissListener onDismissListener);

    public abstract void v(boolean z3);

    public abstract void w(int i4);
}
