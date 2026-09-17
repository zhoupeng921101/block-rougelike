package u2;

import a1.b2.c3;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.NoSuchElementException;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e extends d {
    public static List b(Object[] objArr) {
        b3.f.e(objArr, "<this>");
        return (List) c(objArr, new ArrayList());
    }

    public static final Collection c(Object[] objArr, Collection collection) {
        b3.f.e(objArr, "<this>");
        b3.f.e(collection, "destination");
        for (Object obj : objArr) {
            if (obj != null) {
                collection.add(obj);
            }
        }
        return collection;
    }

    public static char d(char[] cArr) {
        b3.f.e(cArr, "<this>");
        int length = cArr.length;
        if (length == 0) {
            throw new NoSuchElementException("Array is empty.");
        }
        if (length == 1) {
            return cArr[0];
        }
        throw new IllegalArgumentException(c3.d4(1520));
    }

    public static Object e(Object[] objArr) {
        b3.f.e(objArr, "<this>");
        if (objArr.length == 1) {
            return objArr[0];
        }
        return null;
    }
}
