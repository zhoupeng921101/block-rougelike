package q;

import android.content.Context;
import android.database.Cursor;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c extends a {

    /* renamed from: i, reason: collision with root package name */
    private int f4694i;

    /* renamed from: j, reason: collision with root package name */
    private int f4695j;

    /* renamed from: k, reason: collision with root package name */
    private LayoutInflater f4696k;

    public c(Context context, int i4, Cursor cursor, boolean z3) {
        super(context, cursor, z3);
        this.f4695j = i4;
        this.f4694i = i4;
        this.f4696k = (LayoutInflater) context.getSystemService("layout_inflater");
    }

    @Override // q.a
    public View g(Context context, Cursor cursor, ViewGroup viewGroup) {
        return this.f4696k.inflate(this.f4695j, viewGroup, false);
    }

    @Override // q.a
    public View h(Context context, Cursor cursor, ViewGroup viewGroup) {
        return this.f4696k.inflate(this.f4694i, viewGroup, false);
    }
}
