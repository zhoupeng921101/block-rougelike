package q;

import a1.b2.c3;
import android.content.Context;
import android.database.ContentObserver;
import android.database.Cursor;
import android.database.DataSetObserver;
import android.os.Handler;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import q.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a extends BaseAdapter implements Filterable, b.a {

    /* renamed from: a, reason: collision with root package name */
    protected boolean f4683a;

    /* renamed from: b, reason: collision with root package name */
    protected boolean f4684b;

    /* renamed from: c, reason: collision with root package name */
    protected Cursor f4685c;

    /* renamed from: d, reason: collision with root package name */
    protected Context f4686d;

    /* renamed from: e, reason: collision with root package name */
    protected int f4687e;

    /* renamed from: f, reason: collision with root package name */
    protected C0074a f4688f;

    /* renamed from: g, reason: collision with root package name */
    protected DataSetObserver f4689g;

    /* renamed from: h, reason: collision with root package name */
    protected q.b f4690h;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: q.a$a, reason: collision with other inner class name */
    private class C0074a extends ContentObserver {
        C0074a() {
            super(new Handler());
        }

        @Override // android.database.ContentObserver
        public boolean deliverSelfNotifications() {
            return true;
        }

        @Override // android.database.ContentObserver
        public void onChange(boolean z3) {
            a.this.i();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b extends DataSetObserver {
        b() {
        }

        @Override // android.database.DataSetObserver
        public void onChanged() {
            a aVar = a.this;
            aVar.f4683a = true;
            aVar.notifyDataSetChanged();
        }

        @Override // android.database.DataSetObserver
        public void onInvalidated() {
            a aVar = a.this;
            aVar.f4683a = false;
            aVar.notifyDataSetInvalidated();
        }
    }

    public a(Context context, Cursor cursor, boolean z3) {
        f(context, cursor, z3 ? 1 : 2);
    }

    public void a(Cursor cursor) {
        Cursor j4 = j(cursor);
        if (j4 != null) {
            j4.close();
        }
    }

    @Override // q.b.a
    public Cursor b() {
        return this.f4685c;
    }

    public abstract CharSequence c(Cursor cursor);

    public abstract void e(View view, Context context, Cursor cursor);

    void f(Context context, Cursor cursor, int i4) {
        if ((i4 & 1) == 1) {
            i4 |= 2;
            this.f4684b = true;
        } else {
            this.f4684b = false;
        }
        boolean z3 = cursor != null;
        this.f4685c = cursor;
        this.f4683a = z3;
        this.f4686d = context;
        this.f4687e = z3 ? cursor.getColumnIndexOrThrow(c3.d4(1053)) : -1;
        if ((i4 & 2) == 2) {
            this.f4688f = new C0074a();
            this.f4689g = new b();
        } else {
            this.f4688f = null;
            this.f4689g = null;
        }
        if (z3) {
            C0074a c0074a = this.f4688f;
            if (c0074a != null) {
                cursor.registerContentObserver(c0074a);
            }
            DataSetObserver dataSetObserver = this.f4689g;
            if (dataSetObserver != null) {
                cursor.registerDataSetObserver(dataSetObserver);
            }
        }
    }

    public abstract View g(Context context, Cursor cursor, ViewGroup viewGroup);

    @Override // android.widget.Adapter
    public int getCount() {
        Cursor cursor;
        if (!this.f4683a || (cursor = this.f4685c) == null) {
            return 0;
        }
        return cursor.getCount();
    }

    @Override // android.widget.BaseAdapter, android.widget.SpinnerAdapter
    public View getDropDownView(int i4, View view, ViewGroup viewGroup) {
        if (!this.f4683a) {
            return null;
        }
        this.f4685c.moveToPosition(i4);
        if (view == null) {
            view = g(this.f4686d, this.f4685c, viewGroup);
        }
        e(view, this.f4686d, this.f4685c);
        return view;
    }

    @Override // android.widget.Filterable
    public Filter getFilter() {
        if (this.f4690h == null) {
            this.f4690h = new q.b(this);
        }
        return this.f4690h;
    }

    @Override // android.widget.Adapter
    public Object getItem(int i4) {
        Cursor cursor;
        if (!this.f4683a || (cursor = this.f4685c) == null) {
            return null;
        }
        cursor.moveToPosition(i4);
        return this.f4685c;
    }

    @Override // android.widget.Adapter
    public long getItemId(int i4) {
        Cursor cursor;
        if (this.f4683a && (cursor = this.f4685c) != null && cursor.moveToPosition(i4)) {
            return this.f4685c.getLong(this.f4687e);
        }
        return 0L;
    }

    @Override // android.widget.Adapter
    public View getView(int i4, View view, ViewGroup viewGroup) {
        if (!this.f4683a) {
            throw new IllegalStateException("this should only be called when the cursor is valid");
        }
        if (this.f4685c.moveToPosition(i4)) {
            if (view == null) {
                view = h(this.f4686d, this.f4685c, viewGroup);
            }
            e(view, this.f4686d, this.f4685c);
            return view;
        }
        throw new IllegalStateException(c3.d4(605) + i4);
    }

    public abstract View h(Context context, Cursor cursor, ViewGroup viewGroup);

    protected void i() {
        Cursor cursor;
        if (!this.f4684b || (cursor = this.f4685c) == null || cursor.isClosed()) {
            return;
        }
        this.f4683a = this.f4685c.requery();
    }

    public Cursor j(Cursor cursor) {
        Cursor cursor2 = this.f4685c;
        if (cursor == cursor2) {
            return null;
        }
        if (cursor2 != null) {
            C0074a c0074a = this.f4688f;
            if (c0074a != null) {
                cursor2.unregisterContentObserver(c0074a);
            }
            DataSetObserver dataSetObserver = this.f4689g;
            if (dataSetObserver != null) {
                cursor2.unregisterDataSetObserver(dataSetObserver);
            }
        }
        this.f4685c = cursor;
        if (cursor == null) {
            this.f4687e = -1;
            this.f4683a = false;
            notifyDataSetInvalidated();
            return cursor2;
        }
        C0074a c0074a2 = this.f4688f;
        if (c0074a2 != null) {
            cursor.registerContentObserver(c0074a2);
        }
        DataSetObserver dataSetObserver2 = this.f4689g;
        if (dataSetObserver2 != null) {
            cursor.registerDataSetObserver(dataSetObserver2);
        }
        this.f4687e = cursor.getColumnIndexOrThrow("_id");
        this.f4683a = true;
        notifyDataSetChanged();
        return cursor2;
    }
}
