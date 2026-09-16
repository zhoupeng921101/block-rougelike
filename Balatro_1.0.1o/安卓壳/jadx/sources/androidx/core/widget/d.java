package androidx.core.widget;

import android.widget.ListView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class d extends a {

    /* renamed from: s, reason: collision with root package name */
    private final ListView f1162s;

    public d(ListView listView) {
        super(listView);
        this.f1162s = listView;
    }

    @Override // androidx.core.widget.a
    public boolean a(int i4) {
        return false;
    }

    @Override // androidx.core.widget.a
    public boolean b(int i4) {
        ListView listView = this.f1162s;
        int count = listView.getCount();
        if (count == 0) {
            return false;
        }
        int childCount = listView.getChildCount();
        int firstVisiblePosition = listView.getFirstVisiblePosition();
        int i5 = firstVisiblePosition + childCount;
        if (i4 > 0) {
            if (i5 >= count && listView.getChildAt(childCount - 1).getBottom() <= listView.getHeight()) {
                return false;
            }
        } else {
            if (i4 >= 0) {
                return false;
            }
            if (firstVisiblePosition <= 0 && listView.getChildAt(0).getTop() >= 0) {
                return false;
            }
        }
        return true;
    }

    @Override // androidx.core.widget.a
    public void j(int i4, int i5) {
        e.a(this.f1162s, i5);
    }
}
