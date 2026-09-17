package h1;

import a1.b2.c3;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class o {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private final List f3559a;

        /* renamed from: b, reason: collision with root package name */
        private final Object f3560b;

        /* synthetic */ a(Object obj, byte[] bArr) {
            q.i(obj);
            this.f3560b = obj;
            this.f3559a = new ArrayList();
        }

        public a a(String str, Object obj) {
            q.i(str);
            int length = str.length();
            String valueOf = String.valueOf(obj);
            StringBuilder sb = new StringBuilder(length + 1 + valueOf.length());
            sb.append(str);
            sb.append("=");
            sb.append(valueOf);
            this.f3559a.add(sb.toString());
            return this;
        }

        public String toString() {
            StringBuilder sb = new StringBuilder(100);
            sb.append(this.f3560b.getClass().getSimpleName());
            sb.append('{');
            List list = this.f3559a;
            int size = list.size();
            for (int i4 = 0; i4 < size; i4++) {
                sb.append((String) list.get(i4));
                if (i4 < size - 1) {
                    sb.append(c3.d4(636));
                }
            }
            sb.append('}');
            return sb.toString();
        }
    }

    public static boolean a(Object obj, Object obj2) {
        if (obj != obj2) {
            return obj != null && obj.equals(obj2);
        }
        return true;
    }

    public static int b(Object... objArr) {
        return Arrays.hashCode(objArr);
    }

    public static a c(Object obj) {
        return new a(obj, null);
    }
}
