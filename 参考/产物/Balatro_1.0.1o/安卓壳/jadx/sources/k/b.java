package k;

import a1.b2.c3;
import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b implements Collection, Set {

    /* renamed from: i, reason: collision with root package name */
    private static final int[] f3842i = new int[0];

    /* renamed from: j, reason: collision with root package name */
    private static final Object[] f3843j = new Object[0];

    /* renamed from: k, reason: collision with root package name */
    private static Object[] f3844k;

    /* renamed from: l, reason: collision with root package name */
    private static int f3845l;

    /* renamed from: m, reason: collision with root package name */
    private static Object[] f3846m;

    /* renamed from: n, reason: collision with root package name */
    private static int f3847n;

    /* renamed from: e, reason: collision with root package name */
    private int[] f3848e;

    /* renamed from: f, reason: collision with root package name */
    Object[] f3849f;

    /* renamed from: g, reason: collision with root package name */
    int f3850g;

    /* renamed from: h, reason: collision with root package name */
    private f f3851h;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends f {
        a() {
        }

        @Override // k.f
        protected void a() {
            b.this.clear();
        }

        @Override // k.f
        protected Object b(int i4, int i5) {
            return b.this.f3849f[i4];
        }

        @Override // k.f
        protected Map c() {
            throw new UnsupportedOperationException(c3.d4(529));
        }

        @Override // k.f
        protected int d() {
            return b.this.f3850g;
        }

        @Override // k.f
        protected int e(Object obj) {
            return b.this.indexOf(obj);
        }

        @Override // k.f
        protected int f(Object obj) {
            return b.this.indexOf(obj);
        }

        @Override // k.f
        protected void g(Object obj, Object obj2) {
            b.this.add(obj);
        }

        @Override // k.f
        protected void h(int i4) {
            b.this.j(i4);
        }

        @Override // k.f
        protected Object i(int i4, Object obj) {
            throw new UnsupportedOperationException("not a map");
        }
    }

    public b() {
        this(0);
    }

    public b(int i4) {
        if (i4 == 0) {
            this.f3848e = f3842i;
            this.f3849f = f3843j;
        } else {
            a(i4);
        }
        this.f3850g = 0;
    }

    private void a(int i4) {
        if (i4 == 8) {
            synchronized (b.class) {
                try {
                    Object[] objArr = f3846m;
                    if (objArr != null) {
                        this.f3849f = objArr;
                        f3846m = (Object[]) objArr[0];
                        this.f3848e = (int[]) objArr[1];
                        objArr[1] = null;
                        objArr[0] = null;
                        f3847n--;
                        return;
                    }
                } finally {
                }
            }
        } else if (i4 == 4) {
            synchronized (b.class) {
                try {
                    Object[] objArr2 = f3844k;
                    if (objArr2 != null) {
                        this.f3849f = objArr2;
                        f3844k = (Object[]) objArr2[0];
                        this.f3848e = (int[]) objArr2[1];
                        objArr2[1] = null;
                        objArr2[0] = null;
                        f3845l--;
                        return;
                    }
                } finally {
                }
            }
        }
        this.f3848e = new int[i4];
        this.f3849f = new Object[i4];
    }

    private static void f(int[] iArr, Object[] objArr, int i4) {
        if (iArr.length == 8) {
            synchronized (b.class) {
                try {
                    if (f3847n < 10) {
                        objArr[0] = f3846m;
                        objArr[1] = iArr;
                        for (int i5 = i4 - 1; i5 >= 2; i5--) {
                            objArr[i5] = null;
                        }
                        f3846m = objArr;
                        f3847n++;
                    }
                } finally {
                }
            }
            return;
        }
        if (iArr.length == 4) {
            synchronized (b.class) {
                try {
                    if (f3845l < 10) {
                        objArr[0] = f3844k;
                        objArr[1] = iArr;
                        for (int i6 = i4 - 1; i6 >= 2; i6--) {
                            objArr[i6] = null;
                        }
                        f3844k = objArr;
                        f3845l++;
                    }
                } finally {
                }
            }
        }
    }

    private f g() {
        if (this.f3851h == null) {
            this.f3851h = new a();
        }
        return this.f3851h;
    }

    private int h(Object obj, int i4) {
        int i5 = this.f3850g;
        if (i5 == 0) {
            return -1;
        }
        int a4 = c.a(this.f3848e, i5, i4);
        if (a4 < 0 || obj.equals(this.f3849f[a4])) {
            return a4;
        }
        int i6 = a4 + 1;
        while (i6 < i5 && this.f3848e[i6] == i4) {
            if (obj.equals(this.f3849f[i6])) {
                return i6;
            }
            i6++;
        }
        for (int i7 = a4 - 1; i7 >= 0 && this.f3848e[i7] == i4; i7--) {
            if (obj.equals(this.f3849f[i7])) {
                return i7;
            }
        }
        return ~i6;
    }

    private int i() {
        int i4 = this.f3850g;
        if (i4 == 0) {
            return -1;
        }
        int a4 = c.a(this.f3848e, i4, 0);
        if (a4 < 0 || this.f3849f[a4] == null) {
            return a4;
        }
        int i5 = a4 + 1;
        while (i5 < i4 && this.f3848e[i5] == 0) {
            if (this.f3849f[i5] == null) {
                return i5;
            }
            i5++;
        }
        for (int i6 = a4 - 1; i6 >= 0 && this.f3848e[i6] == 0; i6--) {
            if (this.f3849f[i6] == null) {
                return i6;
            }
        }
        return ~i5;
    }

    @Override // java.util.Collection, java.util.Set
    public boolean add(Object obj) {
        int i4;
        int h4;
        if (obj == null) {
            h4 = i();
            i4 = 0;
        } else {
            int hashCode = obj.hashCode();
            i4 = hashCode;
            h4 = h(obj, hashCode);
        }
        if (h4 >= 0) {
            return false;
        }
        int i5 = ~h4;
        int i6 = this.f3850g;
        int[] iArr = this.f3848e;
        if (i6 >= iArr.length) {
            int i7 = 8;
            if (i6 >= 8) {
                i7 = (i6 >> 1) + i6;
            } else if (i6 < 4) {
                i7 = 4;
            }
            Object[] objArr = this.f3849f;
            a(i7);
            int[] iArr2 = this.f3848e;
            if (iArr2.length > 0) {
                System.arraycopy(iArr, 0, iArr2, 0, iArr.length);
                System.arraycopy(objArr, 0, this.f3849f, 0, objArr.length);
            }
            f(iArr, objArr, this.f3850g);
        }
        int i8 = this.f3850g;
        if (i5 < i8) {
            int[] iArr3 = this.f3848e;
            int i9 = i5 + 1;
            System.arraycopy(iArr3, i5, iArr3, i9, i8 - i5);
            Object[] objArr2 = this.f3849f;
            System.arraycopy(objArr2, i5, objArr2, i9, this.f3850g - i5);
        }
        this.f3848e[i5] = i4;
        this.f3849f[i5] = obj;
        this.f3850g++;
        return true;
    }

    @Override // java.util.Collection, java.util.Set
    public boolean addAll(Collection collection) {
        e(this.f3850g + collection.size());
        Iterator it = collection.iterator();
        boolean z3 = false;
        while (it.hasNext()) {
            z3 |= add(it.next());
        }
        return z3;
    }

    @Override // java.util.Collection, java.util.Set
    public void clear() {
        int i4 = this.f3850g;
        if (i4 != 0) {
            f(this.f3848e, this.f3849f, i4);
            this.f3848e = f3842i;
            this.f3849f = f3843j;
            this.f3850g = 0;
        }
    }

    @Override // java.util.Collection, java.util.Set
    public boolean contains(Object obj) {
        return indexOf(obj) >= 0;
    }

    @Override // java.util.Collection, java.util.Set
    public boolean containsAll(Collection collection) {
        Iterator it = collection.iterator();
        while (it.hasNext()) {
            if (!contains(it.next())) {
                return false;
            }
        }
        return true;
    }

    public void e(int i4) {
        int[] iArr = this.f3848e;
        if (iArr.length < i4) {
            Object[] objArr = this.f3849f;
            a(i4);
            int i5 = this.f3850g;
            if (i5 > 0) {
                System.arraycopy(iArr, 0, this.f3848e, 0, i5);
                System.arraycopy(objArr, 0, this.f3849f, 0, this.f3850g);
            }
            f(iArr, objArr, this.f3850g);
        }
    }

    @Override // java.util.Collection, java.util.Set
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Set) {
            Set set = (Set) obj;
            if (size() != set.size()) {
                return false;
            }
            for (int i4 = 0; i4 < this.f3850g; i4++) {
                try {
                    if (!set.contains(k(i4))) {
                        return false;
                    }
                } catch (ClassCastException | NullPointerException unused) {
                }
            }
            return true;
        }
        return false;
    }

    @Override // java.util.Collection, java.util.Set
    public int hashCode() {
        int[] iArr = this.f3848e;
        int i4 = this.f3850g;
        int i5 = 0;
        for (int i6 = 0; i6 < i4; i6++) {
            i5 += iArr[i6];
        }
        return i5;
    }

    public int indexOf(Object obj) {
        return obj == null ? i() : h(obj, obj.hashCode());
    }

    @Override // java.util.Collection, java.util.Set
    public boolean isEmpty() {
        return this.f3850g <= 0;
    }

    @Override // java.util.Collection, java.lang.Iterable, java.util.Set
    public Iterator iterator() {
        return g().m().iterator();
    }

    public Object j(int i4) {
        Object[] objArr = this.f3849f;
        Object obj = objArr[i4];
        int i5 = this.f3850g;
        if (i5 <= 1) {
            f(this.f3848e, objArr, i5);
            this.f3848e = f3842i;
            this.f3849f = f3843j;
            this.f3850g = 0;
            return obj;
        }
        int[] iArr = this.f3848e;
        if (iArr.length <= 8 || i5 >= iArr.length / 3) {
            int i6 = i5 - 1;
            this.f3850g = i6;
            if (i4 < i6) {
                int i7 = i4 + 1;
                System.arraycopy(iArr, i7, iArr, i4, i6 - i4);
                Object[] objArr2 = this.f3849f;
                System.arraycopy(objArr2, i7, objArr2, i4, this.f3850g - i4);
            }
            this.f3849f[this.f3850g] = null;
            return obj;
        }
        a(i5 > 8 ? i5 + (i5 >> 1) : 8);
        this.f3850g--;
        if (i4 > 0) {
            System.arraycopy(iArr, 0, this.f3848e, 0, i4);
            System.arraycopy(objArr, 0, this.f3849f, 0, i4);
        }
        int i8 = this.f3850g;
        if (i4 < i8) {
            int i9 = i4 + 1;
            System.arraycopy(iArr, i9, this.f3848e, i4, i8 - i4);
            System.arraycopy(objArr, i9, this.f3849f, i4, this.f3850g - i4);
        }
        return obj;
    }

    public Object k(int i4) {
        return this.f3849f[i4];
    }

    @Override // java.util.Collection, java.util.Set
    public boolean remove(Object obj) {
        int indexOf = indexOf(obj);
        if (indexOf < 0) {
            return false;
        }
        j(indexOf);
        return true;
    }

    @Override // java.util.Collection, java.util.Set
    public boolean removeAll(Collection collection) {
        Iterator it = collection.iterator();
        boolean z3 = false;
        while (it.hasNext()) {
            z3 |= remove(it.next());
        }
        return z3;
    }

    @Override // java.util.Collection, java.util.Set
    public boolean retainAll(Collection collection) {
        boolean z3 = false;
        for (int i4 = this.f3850g - 1; i4 >= 0; i4--) {
            if (!collection.contains(this.f3849f[i4])) {
                j(i4);
                z3 = true;
            }
        }
        return z3;
    }

    @Override // java.util.Collection, java.util.Set
    public int size() {
        return this.f3850g;
    }

    @Override // java.util.Collection, java.util.Set
    public Object[] toArray() {
        int i4 = this.f3850g;
        Object[] objArr = new Object[i4];
        System.arraycopy(this.f3849f, 0, objArr, 0, i4);
        return objArr;
    }

    @Override // java.util.Collection, java.util.Set
    public Object[] toArray(Object[] objArr) {
        if (objArr.length < this.f3850g) {
            objArr = (Object[]) Array.newInstance(objArr.getClass().getComponentType(), this.f3850g);
        }
        System.arraycopy(this.f3849f, 0, objArr, 0, this.f3850g);
        int length = objArr.length;
        int i4 = this.f3850g;
        if (length > i4) {
            objArr[i4] = null;
        }
        return objArr;
    }

    public String toString() {
        if (isEmpty()) {
            return "{}";
        }
        StringBuilder sb = new StringBuilder(this.f3850g * 14);
        sb.append('{');
        for (int i4 = 0; i4 < this.f3850g; i4++) {
            if (i4 > 0) {
                sb.append(", ");
            }
            Object k4 = k(i4);
            if (k4 != this) {
                sb.append(k4);
            } else {
                sb.append("(this Set)");
            }
        }
        sb.append('}');
        return sb.toString();
    }
}
