package androidx.fragment.app;

import android.graphics.Rect;
import android.graphics.RectF;
import android.view.View;
import android.view.ViewGroup;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i0 {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ int f1494e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ ArrayList f1495f;

        /* renamed from: g, reason: collision with root package name */
        final /* synthetic */ ArrayList f1496g;

        /* renamed from: h, reason: collision with root package name */
        final /* synthetic */ ArrayList f1497h;

        /* renamed from: i, reason: collision with root package name */
        final /* synthetic */ ArrayList f1498i;

        a(int i4, ArrayList arrayList, ArrayList arrayList2, ArrayList arrayList3, ArrayList arrayList4) {
            this.f1494e = i4;
            this.f1495f = arrayList;
            this.f1496g = arrayList2;
            this.f1497h = arrayList3;
            this.f1498i = arrayList4;
        }

        @Override // java.lang.Runnable
        public void run() {
            for (int i4 = 0; i4 < this.f1494e; i4++) {
                androidx.core.view.v.N((View) this.f1495f.get(i4), (String) this.f1496g.get(i4));
                androidx.core.view.v.N((View) this.f1497h.get(i4), (String) this.f1498i.get(i4));
            }
        }
    }

    protected static void d(List list, View view) {
        int size = list.size();
        if (g(list, view, size)) {
            return;
        }
        if (androidx.core.view.v.s(view) != null) {
            list.add(view);
        }
        for (int i4 = size; i4 < list.size(); i4++) {
            View view2 = (View) list.get(i4);
            if (view2 instanceof ViewGroup) {
                ViewGroup viewGroup = (ViewGroup) view2;
                int childCount = viewGroup.getChildCount();
                for (int i5 = 0; i5 < childCount; i5++) {
                    View childAt = viewGroup.getChildAt(i5);
                    if (!g(list, childAt, size) && androidx.core.view.v.s(childAt) != null) {
                        list.add(childAt);
                    }
                }
            }
        }
    }

    private static boolean g(List list, View view, int i4) {
        for (int i5 = 0; i5 < i4; i5++) {
            if (list.get(i5) == view) {
                return true;
            }
        }
        return false;
    }

    protected static boolean i(List list) {
        return list == null || list.isEmpty();
    }

    public abstract void a(Object obj, View view);

    public abstract void b(Object obj, ArrayList arrayList);

    public abstract void c(ViewGroup viewGroup, Object obj);

    public abstract boolean e(Object obj);

    public abstract Object f(Object obj);

    protected void h(View view, Rect rect) {
        if (androidx.core.view.v.v(view)) {
            RectF rectF = new RectF();
            rectF.set(0.0f, 0.0f, view.getWidth(), view.getHeight());
            view.getMatrix().mapRect(rectF);
            rectF.offset(view.getLeft(), view.getTop());
            Object parent = view.getParent();
            while (parent instanceof View) {
                View view2 = (View) parent;
                rectF.offset(-view2.getScrollX(), -view2.getScrollY());
                view2.getMatrix().mapRect(rectF);
                rectF.offset(view2.getLeft(), view2.getTop());
                parent = view2.getParent();
            }
            view.getRootView().getLocationOnScreen(new int[2]);
            rectF.offset(r1[0], r1[1]);
            rect.set(Math.round(rectF.left), Math.round(rectF.top), Math.round(rectF.right), Math.round(rectF.bottom));
        }
    }

    public abstract Object j(Object obj, Object obj2, Object obj3);

    public abstract Object k(Object obj, Object obj2, Object obj3);

    ArrayList l(ArrayList arrayList) {
        ArrayList arrayList2 = new ArrayList();
        int size = arrayList.size();
        for (int i4 = 0; i4 < size; i4++) {
            View view = (View) arrayList.get(i4);
            arrayList2.add(androidx.core.view.v.s(view));
            androidx.core.view.v.N(view, null);
        }
        return arrayList2;
    }

    public abstract void m(Object obj, View view, ArrayList arrayList);

    public abstract void n(Object obj, Object obj2, ArrayList arrayList, Object obj3, ArrayList arrayList2, Object obj4, ArrayList arrayList3);

    public abstract void o(Object obj, Rect rect);

    public abstract void p(Object obj, View view);

    public abstract void q(Fragment fragment, Object obj, androidx.core.os.b bVar, Runnable runnable);

    void r(View view, ArrayList arrayList, ArrayList arrayList2, ArrayList arrayList3, Map map) {
        int size = arrayList2.size();
        ArrayList arrayList4 = new ArrayList();
        for (int i4 = 0; i4 < size; i4++) {
            View view2 = (View) arrayList.get(i4);
            String s3 = androidx.core.view.v.s(view2);
            arrayList4.add(s3);
            if (s3 != null) {
                androidx.core.view.v.N(view2, null);
                String str = (String) map.get(s3);
                int i5 = 0;
                while (true) {
                    if (i5 >= size) {
                        break;
                    }
                    if (str.equals(arrayList3.get(i5))) {
                        androidx.core.view.v.N((View) arrayList2.get(i5), s3);
                        break;
                    }
                    i5++;
                }
            }
        }
        androidx.core.view.t.a(view, new a(size, arrayList2, arrayList3, arrayList, arrayList4));
    }

    public abstract void s(Object obj, View view, ArrayList arrayList);

    public abstract void t(Object obj, ArrayList arrayList, ArrayList arrayList2);

    public abstract Object u(Object obj);
}
