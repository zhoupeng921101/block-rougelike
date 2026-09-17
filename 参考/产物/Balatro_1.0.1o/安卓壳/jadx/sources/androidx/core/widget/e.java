package androidx.core.widget;

import android.widget.ListView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static boolean a(ListView listView, int i4) {
            return listView.canScrollList(i4);
        }

        static void b(ListView listView, int i4) {
            listView.scrollListBy(i4);
        }
    }

    public static void a(ListView listView, int i4) {
        a.b(listView, i4);
    }
}
