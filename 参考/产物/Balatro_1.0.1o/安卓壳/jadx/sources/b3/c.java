package b3;

import a1.b2.c3;
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {

    /* renamed from: a, reason: collision with root package name */
    private static final Object[] f1825a = new Object[0];

    public static final Object[] a(Collection collection) {
        f.e(collection, "collection");
        int size = collection.size();
        if (size == 0) {
            return f1825a;
        }
        Iterator it = collection.iterator();
        if (!it.hasNext()) {
            return f1825a;
        }
        Object[] objArr = new Object[size];
        int i4 = 0;
        while (true) {
            int i5 = i4 + 1;
            objArr[i4] = it.next();
            if (i5 >= objArr.length) {
                if (!it.hasNext()) {
                    return objArr;
                }
                int i6 = ((i5 * 3) + 1) >>> 1;
                if (i6 <= i5) {
                    i6 = 2147483645;
                    if (i5 >= 2147483645) {
                        throw new OutOfMemoryError();
                    }
                }
                objArr = Arrays.copyOf(objArr, i6);
                f.d(objArr, c3.d4(917));
            } else if (!it.hasNext()) {
                Object[] copyOf = Arrays.copyOf(objArr, i5);
                f.d(copyOf, "copyOf(result, size)");
                return copyOf;
            }
            i4 = i5;
        }
    }

    public static final Object[] b(Collection collection, Object[] objArr) {
        Object[] objArr2;
        f.e(collection, c3.d4(918));
        objArr.getClass();
        int size = collection.size();
        int i4 = 0;
        if (size != 0) {
            Iterator it = collection.iterator();
            if (it.hasNext()) {
                if (size <= objArr.length) {
                    objArr2 = objArr;
                } else {
                    Object newInstance = Array.newInstance(objArr.getClass().getComponentType(), size);
                    f.c(newInstance, "null cannot be cast to non-null type kotlin.Array<kotlin.Any?>");
                    objArr2 = (Object[]) newInstance;
                }
                while (true) {
                    int i5 = i4 + 1;
                    objArr2[i4] = it.next();
                    if (i5 >= objArr2.length) {
                        if (!it.hasNext()) {
                            return objArr2;
                        }
                        int i6 = ((i5 * 3) + 1) >>> 1;
                        if (i6 <= i5) {
                            i6 = 2147483645;
                            if (i5 >= 2147483645) {
                                throw new OutOfMemoryError();
                            }
                        }
                        objArr2 = Arrays.copyOf(objArr2, i6);
                        f.d(objArr2, c3.d4(1111));
                    } else if (!it.hasNext()) {
                        if (objArr2 == objArr) {
                            objArr[i5] = null;
                            return objArr;
                        }
                        Object[] copyOf = Arrays.copyOf(objArr2, i5);
                        f.d(copyOf, "copyOf(result, size)");
                        return copyOf;
                    }
                    i4 = i5;
                }
            } else if (objArr.length > 0) {
                objArr[0] = null;
            }
        } else if (objArr.length > 0) {
            objArr[0] = null;
            return objArr;
        }
        return objArr;
    }
}
