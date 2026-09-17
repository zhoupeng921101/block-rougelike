package androidx.core.provider;

import android.content.Context;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.CancellationSignal;
import android.os.Handler;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private final int f981a;

        /* renamed from: b, reason: collision with root package name */
        private final b[] f982b;

        public a(int i4, b[] bVarArr) {
            this.f981a = i4;
            this.f982b = bVarArr;
        }

        static a a(int i4, b[] bVarArr) {
            return new a(i4, bVarArr);
        }

        public b[] b() {
            return this.f982b;
        }

        public int c() {
            return this.f981a;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class b {

        /* renamed from: a, reason: collision with root package name */
        private final Uri f983a;

        /* renamed from: b, reason: collision with root package name */
        private final int f984b;

        /* renamed from: c, reason: collision with root package name */
        private final int f985c;

        /* renamed from: d, reason: collision with root package name */
        private final boolean f986d;

        /* renamed from: e, reason: collision with root package name */
        private final int f987e;

        public b(Uri uri, int i4, int i5, boolean z3, int i6) {
            this.f983a = (Uri) androidx.core.util.c.d(uri);
            this.f984b = i4;
            this.f985c = i5;
            this.f986d = z3;
            this.f987e = i6;
        }

        static b a(Uri uri, int i4, int i5, boolean z3, int i6) {
            return new b(uri, i4, i5, z3, i6);
        }

        public int b() {
            return this.f987e;
        }

        public int c() {
            return this.f984b;
        }

        public Uri d() {
            return this.f983a;
        }

        public int e() {
            return this.f985c;
        }

        public boolean f() {
            return this.f986d;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class c {
        public abstract void a(int i4);

        public abstract void b(Typeface typeface);
    }

    public static Typeface a(Context context, CancellationSignal cancellationSignal, b[] bVarArr) {
        return androidx.core.graphics.h.b(context, cancellationSignal, bVarArr, 0);
    }

    public static a b(Context context, CancellationSignal cancellationSignal, e eVar) {
        return d.e(context, eVar, cancellationSignal);
    }

    public static Typeface c(Context context, e eVar, int i4, boolean z3, int i5, Handler handler, c cVar) {
        androidx.core.provider.a aVar = new androidx.core.provider.a(cVar, handler);
        return z3 ? f.e(context, eVar, aVar, i4, i5) : f.d(context, eVar, i4, null, aVar);
    }
}
