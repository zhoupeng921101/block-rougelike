package g1;

import com.google.android.gms.common.data.DataHolder;
import java.util.Iterator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements b {

    /* renamed from: e, reason: collision with root package name */
    protected final DataHolder f3339e;

    protected a(DataHolder dataHolder) {
        this.f3339e = dataHolder;
    }

    @Override // e1.i
    public void a() {
        DataHolder dataHolder = this.f3339e;
        if (dataHolder != null) {
            dataHolder.close();
        }
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public final void close() {
        a();
    }

    @Override // g1.b
    public int getCount() {
        DataHolder dataHolder = this.f3339e;
        if (dataHolder == null) {
            return 0;
        }
        return dataHolder.getCount();
    }

    @Override // java.lang.Iterable
    public Iterator iterator() {
        return new c(this);
    }
}
