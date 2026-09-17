package kotlinx.coroutines.scheduling;

import java.util.concurrent.atomic.AtomicReferenceArray;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract /* synthetic */ class n {
    public static /* synthetic */ boolean a(AtomicReferenceArray atomicReferenceArray, int i4, Object obj, Object obj2) {
        while (!atomicReferenceArray.compareAndSet(i4, obj, obj2)) {
            if (atomicReferenceArray.get(i4) != obj) {
                return false;
            }
        }
        return true;
    }
}
