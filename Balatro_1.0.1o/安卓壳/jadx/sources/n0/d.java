package n0;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d {

    /* renamed from: c, reason: collision with root package name */
    private static final d f4229c = new a().a();

    /* renamed from: a, reason: collision with root package name */
    private final String f4230a;

    /* renamed from: b, reason: collision with root package name */
    private final List f4231b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private String f4232a = "";

        /* renamed from: b, reason: collision with root package name */
        private List f4233b = new ArrayList();

        a() {
        }

        public d a() {
            return new d(this.f4232a, Collections.unmodifiableList(this.f4233b));
        }

        public a b(List list) {
            this.f4233b = list;
            return this;
        }

        public a c(String str) {
            this.f4232a = str;
            return this;
        }
    }

    d(String str, List list) {
        this.f4230a = str;
        this.f4231b = list;
    }

    public static a c() {
        return new a();
    }

    public List a() {
        return this.f4231b;
    }

    public String b() {
        return this.f4230a;
    }
}
