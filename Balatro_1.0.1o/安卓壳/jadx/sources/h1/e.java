package h1;

import android.accounts.Account;
import android.view.View;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e {

    /* renamed from: a, reason: collision with root package name */
    private final Account f3469a;

    /* renamed from: b, reason: collision with root package name */
    private final Set f3470b;

    /* renamed from: c, reason: collision with root package name */
    private final Set f3471c;

    /* renamed from: d, reason: collision with root package name */
    private final Map f3472d;

    /* renamed from: e, reason: collision with root package name */
    private final int f3473e;

    /* renamed from: f, reason: collision with root package name */
    private final View f3474f;

    /* renamed from: g, reason: collision with root package name */
    private final String f3475g;

    /* renamed from: h, reason: collision with root package name */
    private final String f3476h;

    /* renamed from: i, reason: collision with root package name */
    private final e2.a f3477i;

    /* renamed from: j, reason: collision with root package name */
    private Integer f3478j;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private Account f3479a;

        /* renamed from: b, reason: collision with root package name */
        private k.b f3480b;

        /* renamed from: c, reason: collision with root package name */
        private String f3481c;

        /* renamed from: d, reason: collision with root package name */
        private String f3482d;

        /* renamed from: e, reason: collision with root package name */
        private final e2.a f3483e = e2.a.f3162n;

        public e a() {
            return new e(this.f3479a, this.f3480b, null, 0, null, this.f3481c, this.f3482d, this.f3483e, false);
        }

        public a b(String str) {
            this.f3481c = str;
            return this;
        }

        public final a c(Collection collection) {
            if (this.f3480b == null) {
                this.f3480b = new k.b();
            }
            this.f3480b.addAll(collection);
            return this;
        }

        public final a d(Account account) {
            this.f3479a = account;
            return this;
        }

        public final a e(String str) {
            this.f3482d = str;
            return this;
        }
    }

    public e(Account account, Set set, Map map, int i4, View view, String str, String str2, e2.a aVar, boolean z3) {
        this.f3469a = account;
        Set unmodifiableSet = set == null ? Collections.EMPTY_SET : Collections.unmodifiableSet(set);
        this.f3470b = unmodifiableSet;
        map = map == null ? Collections.EMPTY_MAP : map;
        this.f3472d = map;
        this.f3474f = view;
        this.f3473e = i4;
        this.f3475g = str;
        this.f3476h = str2;
        this.f3477i = aVar == null ? e2.a.f3162n : aVar;
        HashSet hashSet = new HashSet(unmodifiableSet);
        Iterator it = map.values().iterator();
        if (it.hasNext()) {
            h.d.a(it.next());
            throw null;
        }
        this.f3471c = Collections.unmodifiableSet(hashSet);
    }

    public Account a() {
        return this.f3469a;
    }

    public String b() {
        Account account = this.f3469a;
        if (account != null) {
            return account.name;
        }
        return null;
    }

    public Account c() {
        Account account = this.f3469a;
        return account != null ? account : new Account("<<default account>>", "com.google");
    }

    public Set d() {
        return this.f3471c;
    }

    public Set e(e1.a aVar) {
        h.d.a(this.f3472d.get(aVar));
        return this.f3470b;
    }

    public int f() {
        return this.f3473e;
    }

    public String g() {
        return this.f3475g;
    }

    public Set h() {
        return this.f3470b;
    }

    public View i() {
        return this.f3474f;
    }

    public final e2.a j() {
        return this.f3477i;
    }

    public final Integer k() {
        return this.f3478j;
    }

    public final String l() {
        return this.f3476h;
    }

    public final void m(Integer num) {
        this.f3478j = num;
    }
}
