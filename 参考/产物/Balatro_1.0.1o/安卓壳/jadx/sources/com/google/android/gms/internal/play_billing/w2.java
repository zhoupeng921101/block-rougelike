package com.google.android.gms.internal.play_billing;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class w2 implements a5 {
    protected transient int zza = 0;

    protected static void e(Iterable iterable, List list) {
        byte[] bArr = k4.f2839b;
        int size = ((Collection) iterable).size();
        if (list instanceof ArrayList) {
            ((ArrayList) list).ensureCapacity(list.size() + size);
        } else if (list instanceof i5) {
            ((i5) list).f(list.size() + size);
        }
        int size2 = list.size();
        List list2 = (List) iterable;
        int size3 = list2.size();
        for (int i4 = 0; i4 < size3; i4++) {
            Object obj = list2.get(i4);
            if (obj == null) {
                String str = "Element at index " + (list.size() - size2) + " is null.";
                int size4 = list.size();
                while (true) {
                    size4--;
                    if (size4 < size2) {
                        throw new NullPointerException(str);
                    }
                    list.remove(size4);
                }
            } else {
                list.add(obj);
            }
        }
    }

    public final byte[] b() {
        try {
            int g4 = g();
            byte[] bArr = new byte[g4];
            int i4 = r3.f2977c;
            n3 n3Var = new n3(bArr, 0, g4);
            h(n3Var);
            n3Var.a();
            return bArr;
        } catch (IOException e4) {
            throw new RuntimeException("Serializing " + getClass().getName() + " to a byte array threw an IOException (should never happen).", e4);
        }
    }

    abstract int c(k5 k5Var);
}
