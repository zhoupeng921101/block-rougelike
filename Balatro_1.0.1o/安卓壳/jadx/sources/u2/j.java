package u2;

import java.util.Collection;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class j extends i {
    public static int f(Iterable iterable, int i4) {
        b3.f.e(iterable, "<this>");
        return iterable instanceof Collection ? ((Collection) iterable).size() : i4;
    }
}
