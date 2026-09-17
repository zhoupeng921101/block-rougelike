package c2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class q1 {
    q1() {
    }

    static int a(int i4, int i5) {
        if (i5 < 0) {
            throw new IllegalArgumentException("cannot store more than Integer.MAX_VALUE elements");
        }
        if (i5 <= i4) {
            return i4;
        }
        int i6 = i4 + (i4 >> 1) + 1;
        if (i6 < i5) {
            int highestOneBit = Integer.highestOneBit(i5 - 1);
            i6 = highestOneBit + highestOneBit;
        }
        if (i6 < 0) {
            return Integer.MAX_VALUE;
        }
        return i6;
    }
}
