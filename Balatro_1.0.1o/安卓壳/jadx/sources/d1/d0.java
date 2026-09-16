package d1;

import java.lang.ref.WeakReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class d0 extends b0 {

    /* renamed from: c, reason: collision with root package name */
    private static final WeakReference f3094c = new WeakReference(null);

    /* renamed from: b, reason: collision with root package name */
    private WeakReference f3095b;

    d0(byte[] bArr) {
        super(bArr);
        this.f3095b = f3094c;
    }

    @Override // d1.b0
    final byte[] h() {
        byte[] bArr;
        synchronized (this) {
            try {
                bArr = (byte[]) this.f3095b.get();
                if (bArr == null) {
                    bArr = m0();
                    this.f3095b = new WeakReference(bArr);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return bArr;
    }

    protected abstract byte[] m0();
}
