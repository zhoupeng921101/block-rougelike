package u2;

import a1.b2.c3;
import java.util.List;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i extends h {
    public static final List b() {
        return s.f5020e;
    }

    public static List c(Object... objArr) {
        b3.f.e(objArr, c3.d4(658));
        return objArr.length > 0 ? d.a(objArr) : b();
    }

    public static List d(List list) {
        b3.f.e(list, "<this>");
        int size = list.size();
        return size != 0 ? size != 1 ? list : h.a(list.get(0)) : b();
    }

    public static void e() {
        throw new ArithmeticException("Index overflow has happened.");
    }
}
