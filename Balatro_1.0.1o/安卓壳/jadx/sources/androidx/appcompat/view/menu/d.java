package androidx.appcompat.view.menu;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import androidx.appcompat.view.menu.j;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class d extends BaseAdapter {

    /* renamed from: a, reason: collision with root package name */
    e f207a;

    /* renamed from: b, reason: collision with root package name */
    private int f208b = -1;

    /* renamed from: c, reason: collision with root package name */
    private boolean f209c;

    /* renamed from: d, reason: collision with root package name */
    private final boolean f210d;

    /* renamed from: e, reason: collision with root package name */
    private final LayoutInflater f211e;

    /* renamed from: f, reason: collision with root package name */
    private final int f212f;

    public d(e eVar, LayoutInflater layoutInflater, boolean z3, int i4) {
        this.f210d = z3;
        this.f211e = layoutInflater;
        this.f207a = eVar;
        this.f212f = i4;
        a();
    }

    void a() {
        f t3 = this.f207a.t();
        if (t3 != null) {
            ArrayList v3 = this.f207a.v();
            int size = v3.size();
            for (int i4 = 0; i4 < size; i4++) {
                if (((f) v3.get(i4)) == t3) {
                    this.f208b = i4;
                    return;
                }
            }
        }
        this.f208b = -1;
    }

    public e b() {
        return this.f207a;
    }

    @Override // android.widget.Adapter
    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public f getItem(int i4) {
        ArrayList v3 = this.f210d ? this.f207a.v() : this.f207a.A();
        int i5 = this.f208b;
        if (i5 >= 0 && i4 >= i5) {
            i4++;
        }
        return (f) v3.get(i4);
    }

    public void d(boolean z3) {
        this.f209c = z3;
    }

    @Override // android.widget.Adapter
    public int getCount() {
        return this.f208b < 0 ? (this.f210d ? this.f207a.v() : this.f207a.A()).size() : r0.size() - 1;
    }

    @Override // android.widget.Adapter
    public long getItemId(int i4) {
        return i4;
    }

    @Override // android.widget.Adapter
    public View getView(int i4, View view, ViewGroup viewGroup) {
        if (view == null) {
            view = this.f211e.inflate(this.f212f, viewGroup, false);
        }
        int groupId = getItem(i4).getGroupId();
        int i5 = i4 - 1;
        ListMenuItemView listMenuItemView = (ListMenuItemView) view;
        listMenuItemView.setGroupDividerEnabled(this.f207a.B() && groupId != (i5 >= 0 ? getItem(i5).getGroupId() : groupId));
        j.a aVar = (j.a) view;
        if (this.f209c) {
            listMenuItemView.setForceShowIcon(true);
        }
        aVar.d(getItem(i4), 0);
        return view;
    }

    @Override // android.widget.BaseAdapter
    public void notifyDataSetChanged() {
        a();
        super.notifyDataSetChanged();
    }
}
