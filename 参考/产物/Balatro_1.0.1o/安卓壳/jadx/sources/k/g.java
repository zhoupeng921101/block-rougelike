package k;

import java.util.ConcurrentModificationException;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g {

    /* renamed from: h, reason: collision with root package name */
    static Object[] f3884h;

    /* renamed from: i, reason: collision with root package name */
    static int f3885i;

    /* renamed from: j, reason: collision with root package name */
    static Object[] f3886j;

    /* renamed from: k, reason: collision with root package name */
    static int f3887k;

    /* renamed from: e, reason: collision with root package name */
    int[] f3888e;

    /* renamed from: f, reason: collision with root package name */
    Object[] f3889f;

    /* renamed from: g, reason: collision with root package name */
    int f3890g;

    public g() {
        this.f3888e = c.f3853a;
        this.f3889f = c.f3855c;
        this.f3890g = 0;
    }

    public g(int i4) {
        if (i4 == 0) {
            this.f3888e = c.f3853a;
            this.f3889f = c.f3855c;
        } else {
            a(i4);
        }
        this.f3890g = 0;
    }

    private void a(int i4) {
        if (i4 == 8) {
            synchronized (g.class) {
                try {
                    Object[] objArr = f3886j;
                    if (objArr != null) {
                        this.f3889f = objArr;
                        f3886j = (Object[]) objArr[0];
                        this.f3888e = (int[]) objArr[1];
                        objArr[1] = null;
                        objArr[0] = null;
                        f3887k--;
                        return;
                    }
                } finally {
                }
            }
        } else if (i4 == 4) {
            synchronized (g.class) {
                try {
                    Object[] objArr2 = f3884h;
                    if (objArr2 != null) {
                        this.f3889f = objArr2;
                        f3884h = (Object[]) objArr2[0];
                        this.f3888e = (int[]) objArr2[1];
                        objArr2[1] = null;
                        objArr2[0] = null;
                        f3885i--;
                        return;
                    }
                } finally {
                }
            }
        }
        this.f3888e = new int[i4];
        this.f3889f = new Object[i4 << 1];
    }

    private static int b(int[] iArr, int i4, int i5) {
        try {
            return c.a(iArr, i4, i5);
        } catch (ArrayIndexOutOfBoundsException unused) {
            throw new ConcurrentModificationException();
        }
    }

    private static void d(int[] iArr, Object[] objArr, int i4) {
        if (iArr.length == 8) {
            synchronized (g.class) {
                try {
                    if (f3887k < 10) {
                        objArr[0] = f3886j;
                        objArr[1] = iArr;
                        for (int i5 = (i4 << 1) - 1; i5 >= 2; i5--) {
                            objArr[i5] = null;
                        }
                        f3886j = objArr;
                        f3887k++;
                    }
                } finally {
                }
            }
            return;
        }
        if (iArr.length == 4) {
            synchronized (g.class) {
                try {
                    if (f3885i < 10) {
                        objArr[0] = f3884h;
                        objArr[1] = iArr;
                        for (int i6 = (i4 << 1) - 1; i6 >= 2; i6--) {
                            objArr[i6] = null;
                        }
                        f3884h = objArr;
                        f3885i++;
                    }
                } finally {
                }
            }
        }
    }

    public void c(int i4) {
        int i5 = this.f3890g;
        int[] iArr = this.f3888e;
        if (iArr.length < i4) {
            Object[] objArr = this.f3889f;
            a(i4);
            if (this.f3890g > 0) {
                System.arraycopy(iArr, 0, this.f3888e, 0, i5);
                System.arraycopy(objArr, 0, this.f3889f, 0, i5 << 1);
            }
            d(iArr, objArr, i5);
        }
        if (this.f3890g != i5) {
            throw new ConcurrentModificationException();
        }
    }

    public void clear() {
        int i4 = this.f3890g;
        if (i4 > 0) {
            int[] iArr = this.f3888e;
            Object[] objArr = this.f3889f;
            this.f3888e = c.f3853a;
            this.f3889f = c.f3855c;
            this.f3890g = 0;
            d(iArr, objArr, i4);
        }
        if (this.f3890g > 0) {
            throw new ConcurrentModificationException();
        }
    }

    public boolean containsKey(Object obj) {
        return f(obj) >= 0;
    }

    public boolean containsValue(Object obj) {
        return h(obj) >= 0;
    }

    int e(Object obj, int i4) {
        int i5 = this.f3890g;
        if (i5 == 0) {
            return -1;
        }
        int b4 = b(this.f3888e, i5, i4);
        if (b4 < 0 || obj.equals(this.f3889f[b4 << 1])) {
            return b4;
        }
        int i6 = b4 + 1;
        while (i6 < i5 && this.f3888e[i6] == i4) {
            if (obj.equals(this.f3889f[i6 << 1])) {
                return i6;
            }
            i6++;
        }
        for (int i7 = b4 - 1; i7 >= 0 && this.f3888e[i7] == i4; i7--) {
            if (obj.equals(this.f3889f[i7 << 1])) {
                return i7;
            }
        }
        return ~i6;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof g) {
            g gVar = (g) obj;
            if (size() != gVar.size()) {
                return false;
            }
            for (int i4 = 0; i4 < this.f3890g; i4++) {
                try {
                    Object i5 = i(i4);
                    Object l3 = l(i4);
                    Object obj2 = gVar.get(i5);
                    if (l3 == null) {
                        if (obj2 != null || !gVar.containsKey(i5)) {
                            return false;
                        }
                    } else if (!l3.equals(obj2)) {
                        return false;
                    }
                } catch (ClassCastException | NullPointerException unused) {
                    return false;
                }
            }
            return true;
        }
        if (obj instanceof Map) {
            Map map = (Map) obj;
            if (size() != map.size()) {
                return false;
            }
            for (int i6 = 0; i6 < this.f3890g; i6++) {
                try {
                    Object i7 = i(i6);
                    Object l4 = l(i6);
                    Object obj3 = map.get(i7);
                    if (l4 == null) {
                        if (obj3 != null || !map.containsKey(i7)) {
                            return false;
                        }
                    } else if (!l4.equals(obj3)) {
                        return false;
                    }
                } catch (ClassCastException | NullPointerException unused2) {
                }
            }
            return true;
        }
        return false;
    }

    public int f(Object obj) {
        return obj == null ? g() : e(obj, obj.hashCode());
    }

    int g() {
        int i4 = this.f3890g;
        if (i4 == 0) {
            return -1;
        }
        int b4 = b(this.f3888e, i4, 0);
        if (b4 < 0 || this.f3889f[b4 << 1] == null) {
            return b4;
        }
        int i5 = b4 + 1;
        while (i5 < i4 && this.f3888e[i5] == 0) {
            if (this.f3889f[i5 << 1] == null) {
                return i5;
            }
            i5++;
        }
        for (int i6 = b4 - 1; i6 >= 0 && this.f3888e[i6] == 0; i6--) {
            if (this.f3889f[i6 << 1] == null) {
                return i6;
            }
        }
        return ~i5;
    }

    public Object get(Object obj) {
        return getOrDefault(obj, null);
    }

    public Object getOrDefault(Object obj, Object obj2) {
        int f4 = f(obj);
        return f4 >= 0 ? this.f3889f[(f4 << 1) + 1] : obj2;
    }

    int h(Object obj) {
        int i4 = this.f3890g * 2;
        Object[] objArr = this.f3889f;
        if (obj == null) {
            for (int i5 = 1; i5 < i4; i5 += 2) {
                if (objArr[i5] == null) {
                    return i5 >> 1;
                }
            }
            return -1;
        }
        for (int i6 = 1; i6 < i4; i6 += 2) {
            if (obj.equals(objArr[i6])) {
                return i6 >> 1;
            }
        }
        return -1;
    }

    public int hashCode() {
        int[] iArr = this.f3888e;
        Object[] objArr = this.f3889f;
        int i4 = this.f3890g;
        int i5 = 1;
        int i6 = 0;
        int i7 = 0;
        while (i6 < i4) {
            Object obj = objArr[i5];
            i7 += (obj == null ? 0 : obj.hashCode()) ^ iArr[i6];
            i6++;
            i5 += 2;
        }
        return i7;
    }

    public Object i(int i4) {
        return this.f3889f[i4 << 1];
    }

    public boolean isEmpty() {
        return this.f3890g <= 0;
    }

    public Object j(int i4) {
        Object[] objArr = this.f3889f;
        int i5 = i4 << 1;
        Object obj = objArr[i5 + 1];
        int i6 = this.f3890g;
        int i7 = 0;
        if (i6 <= 1) {
            d(this.f3888e, objArr, i6);
            this.f3888e = c.f3853a;
            this.f3889f = c.f3855c;
        } else {
            int i8 = i6 - 1;
            int[] iArr = this.f3888e;
            if (iArr.length <= 8 || i6 >= iArr.length / 3) {
                if (i4 < i8) {
                    int i9 = i4 + 1;
                    int i10 = i8 - i4;
                    System.arraycopy(iArr, i9, iArr, i4, i10);
                    Object[] objArr2 = this.f3889f;
                    System.arraycopy(objArr2, i9 << 1, objArr2, i5, i10 << 1);
                }
                Object[] objArr3 = this.f3889f;
                int i11 = i8 << 1;
                objArr3[i11] = null;
                objArr3[i11 + 1] = null;
            } else {
                a(i6 > 8 ? i6 + (i6 >> 1) : 8);
                if (i6 != this.f3890g) {
                    throw new ConcurrentModificationException();
                }
                if (i4 > 0) {
                    System.arraycopy(iArr, 0, this.f3888e, 0, i4);
                    System.arraycopy(objArr, 0, this.f3889f, 0, i5);
                }
                if (i4 < i8) {
                    int i12 = i4 + 1;
                    int i13 = i8 - i4;
                    System.arraycopy(iArr, i12, this.f3888e, i4, i13);
                    System.arraycopy(objArr, i12 << 1, this.f3889f, i5, i13 << 1);
                }
            }
            i7 = i8;
        }
        if (i6 != this.f3890g) {
            throw new ConcurrentModificationException();
        }
        this.f3890g = i7;
        return obj;
    }

    public Object k(int i4, Object obj) {
        int i5 = (i4 << 1) + 1;
        Object[] objArr = this.f3889f;
        Object obj2 = objArr[i5];
        objArr[i5] = obj;
        return obj2;
    }

    public Object l(int i4) {
        return this.f3889f[(i4 << 1) + 1];
    }

    public Object put(Object obj, Object obj2) {
        int i4;
        int e4;
        int i5 = this.f3890g;
        if (obj == null) {
            e4 = g();
            i4 = 0;
        } else {
            int hashCode = obj.hashCode();
            i4 = hashCode;
            e4 = e(obj, hashCode);
        }
        if (e4 >= 0) {
            int i6 = (e4 << 1) + 1;
            Object[] objArr = this.f3889f;
            Object obj3 = objArr[i6];
            objArr[i6] = obj2;
            return obj3;
        }
        int i7 = ~e4;
        int[] iArr = this.f3888e;
        if (i5 >= iArr.length) {
            int i8 = 8;
            if (i5 >= 8) {
                i8 = (i5 >> 1) + i5;
            } else if (i5 < 4) {
                i8 = 4;
            }
            Object[] objArr2 = this.f3889f;
            a(i8);
            if (i5 != this.f3890g) {
                throw new ConcurrentModificationException();
            }
            int[] iArr2 = this.f3888e;
            if (iArr2.length > 0) {
                System.arraycopy(iArr, 0, iArr2, 0, iArr.length);
                System.arraycopy(objArr2, 0, this.f3889f, 0, objArr2.length);
            }
            d(iArr, objArr2, i5);
        }
        if (i7 < i5) {
            int[] iArr3 = this.f3888e;
            int i9 = i7 + 1;
            System.arraycopy(iArr3, i7, iArr3, i9, i5 - i7);
            Object[] objArr3 = this.f3889f;
            System.arraycopy(objArr3, i7 << 1, objArr3, i9 << 1, (this.f3890g - i7) << 1);
        }
        int i10 = this.f3890g;
        if (i5 == i10) {
            int[] iArr4 = this.f3888e;
            if (i7 < iArr4.length) {
                iArr4[i7] = i4;
                Object[] objArr4 = this.f3889f;
                int i11 = i7 << 1;
                objArr4[i11] = obj;
                objArr4[i11 + 1] = obj2;
                this.f3890g = i10 + 1;
                return null;
            }
        }
        throw new ConcurrentModificationException();
    }

    public Object putIfAbsent(Object obj, Object obj2) {
        Object obj3 = get(obj);
        return obj3 == null ? put(obj, obj2) : obj3;
    }

    public Object remove(Object obj) {
        int f4 = f(obj);
        if (f4 >= 0) {
            return j(f4);
        }
        return null;
    }

    public boolean remove(Object obj, Object obj2) {
        int f4 = f(obj);
        if (f4 < 0) {
            return false;
        }
        Object l3 = l(f4);
        if (obj2 != l3 && (obj2 == null || !obj2.equals(l3))) {
            return false;
        }
        j(f4);
        return true;
    }

    public Object replace(Object obj, Object obj2) {
        int f4 = f(obj);
        if (f4 >= 0) {
            return k(f4, obj2);
        }
        return null;
    }

    public boolean replace(Object obj, Object obj2, Object obj3) {
        int f4 = f(obj);
        if (f4 < 0) {
            return false;
        }
        Object l3 = l(f4);
        if (l3 != obj2 && (obj2 == null || !obj2.equals(l3))) {
            return false;
        }
        k(f4, obj3);
        return true;
    }

    public int size() {
        return this.f3890g;
    }

    public String toString() {
        if (isEmpty()) {
            return "{}";
        }
        StringBuilder sb = new StringBuilder(this.f3890g * 28);
        sb.append('{');
        for (int i4 = 0; i4 < this.f3890g; i4++) {
            if (i4 > 0) {
                sb.append(", ");
            }
            Object i5 = i(i4);
            if (i5 != this) {
                sb.append(i5);
            } else {
                sb.append("(this Map)");
            }
            sb.append('=');
            Object l3 = l(i4);
            if (l3 != this) {
                sb.append(l3);
            } else {
                sb.append("(this Map)");
            }
        }
        sb.append('}');
        return sb.toString();
    }
}
