package q;

import android.database.Cursor;
import android.widget.Filter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class b extends Filter {

    /* renamed from: a, reason: collision with root package name */
    a f4693a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    interface a {
        void a(Cursor cursor);

        Cursor b();

        CharSequence c(Cursor cursor);

        Cursor d(CharSequence charSequence);
    }

    b(a aVar) {
        this.f4693a = aVar;
    }

    @Override // android.widget.Filter
    public CharSequence convertResultToString(Object obj) {
        return this.f4693a.c((Cursor) obj);
    }

    @Override // android.widget.Filter
    protected Filter.FilterResults performFiltering(CharSequence charSequence) {
        Cursor d4 = this.f4693a.d(charSequence);
        Filter.FilterResults filterResults = new Filter.FilterResults();
        if (d4 != null) {
            filterResults.count = d4.getCount();
            filterResults.values = d4;
            return filterResults;
        }
        filterResults.count = 0;
        filterResults.values = null;
        return filterResults;
    }

    @Override // android.widget.Filter
    protected void publishResults(CharSequence charSequence, Filter.FilterResults filterResults) {
        Cursor b4 = this.f4693a.b();
        Object obj = filterResults.values;
        if (obj == null || obj == b4) {
            return;
        }
        this.f4693a.a((Cursor) obj);
    }
}
