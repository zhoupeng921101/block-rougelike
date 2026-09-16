package y1;

import android.os.IBinder;
import android.os.IInterface;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements IInterface {

    /* renamed from: a, reason: collision with root package name */
    private final IBinder f5181a;

    /* renamed from: b, reason: collision with root package name */
    private final String f5182b;

    protected a(IBinder iBinder, String str) {
        this.f5181a = iBinder;
        this.f5182b = str;
    }

    @Override // android.os.IInterface
    public final IBinder asBinder() {
        return this.f5181a;
    }
}
