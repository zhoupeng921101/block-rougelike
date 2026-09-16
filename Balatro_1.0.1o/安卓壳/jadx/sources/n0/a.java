package n0;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import k0.l;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: e, reason: collision with root package name */
    private static final a f4203e = new C0060a().b();

    /* renamed from: a, reason: collision with root package name */
    private final f f4204a;

    /* renamed from: b, reason: collision with root package name */
    private final List f4205b;

    /* renamed from: c, reason: collision with root package name */
    private final b f4206c;

    /* renamed from: d, reason: collision with root package name */
    private final String f4207d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: n0.a$a, reason: collision with other inner class name */
    public static final class C0060a {

        /* renamed from: a, reason: collision with root package name */
        private f f4208a = null;

        /* renamed from: b, reason: collision with root package name */
        private List f4209b = new ArrayList();

        /* renamed from: c, reason: collision with root package name */
        private b f4210c = null;

        /* renamed from: d, reason: collision with root package name */
        private String f4211d = "";

        C0060a() {
        }

        public C0060a a(d dVar) {
            this.f4209b.add(dVar);
            return this;
        }

        public a b() {
            return new a(this.f4208a, Collections.unmodifiableList(this.f4209b), this.f4210c, this.f4211d);
        }

        public C0060a c(String str) {
            this.f4211d = str;
            return this;
        }

        public C0060a d(b bVar) {
            this.f4210c = bVar;
            return this;
        }

        public C0060a e(f fVar) {
            this.f4208a = fVar;
            return this;
        }
    }

    a(f fVar, List list, b bVar, String str) {
        this.f4204a = fVar;
        this.f4205b = list;
        this.f4206c = bVar;
        this.f4207d = str;
    }

    public static C0060a e() {
        return new C0060a();
    }

    public String a() {
        return this.f4207d;
    }

    public b b() {
        return this.f4206c;
    }

    public List c() {
        return this.f4205b;
    }

    public f d() {
        return this.f4204a;
    }

    public byte[] f() {
        return l.a(this);
    }
}
