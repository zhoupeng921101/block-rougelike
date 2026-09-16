package n2;

import a1.b2.c3;
import android.content.Intent;
import android.net.Uri;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import o2.l0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b {

    /* renamed from: a, reason: collision with root package name */
    public final String f4253a;

    /* renamed from: b, reason: collision with root package name */
    public final String f4254b;

    /* renamed from: c, reason: collision with root package name */
    public String f4255c;

    /* renamed from: d, reason: collision with root package name */
    public Uri f4256d;

    /* renamed from: e, reason: collision with root package name */
    public String f4257e;

    /* renamed from: f, reason: collision with root package name */
    public String f4258f;

    /* renamed from: l, reason: collision with root package name */
    public Uri f4264l;

    /* renamed from: m, reason: collision with root package name */
    public long f4265m;

    /* renamed from: r, reason: collision with root package name */
    public String f4270r;

    /* renamed from: u, reason: collision with root package name */
    public String f4273u;

    /* renamed from: v, reason: collision with root package name */
    public Intent f4274v;

    /* renamed from: w, reason: collision with root package name */
    public String[][] f4275w;

    /* renamed from: g, reason: collision with root package name */
    public boolean f4259g = false;

    /* renamed from: h, reason: collision with root package name */
    public Map f4260h = new HashMap();

    /* renamed from: i, reason: collision with root package name */
    public long f4261i = 60;

    /* renamed from: j, reason: collision with root package name */
    public boolean f4262j = false;

    /* renamed from: k, reason: collision with root package name */
    public int f4263k = 6;

    /* renamed from: n, reason: collision with root package name */
    public boolean f4266n = false;

    /* renamed from: o, reason: collision with root package name */
    public List f4267o = new ArrayList();

    /* renamed from: p, reason: collision with root package name */
    public List f4268p = new ArrayList();

    /* renamed from: q, reason: collision with root package name */
    public List f4269q = new ArrayList();

    /* renamed from: s, reason: collision with root package name */
    public Boolean f4271s = null;

    /* renamed from: t, reason: collision with root package name */
    public Boolean f4272t = Boolean.FALSE;

    public b(String str, String str2) {
        if (l0.V(str)) {
            throw new IllegalArgumentException("apiKey can not be null or empty");
        }
        if (l0.V(str2)) {
            throw new IllegalArgumentException(c3.d4(588));
        }
        this.f4253a = str;
        this.f4254b = str2;
    }

    static b a(b bVar) {
        String str = bVar.f4253a;
        String d4 = c3.d4(345);
        if (!str.endsWith(d4) && !bVar.f4254b.endsWith(d4)) {
            return bVar;
        }
        b bVar2 = new b(bVar.f4253a.endsWith(d4) ? l0.r0(l0.k(bVar.f4253a, d4)) : bVar.f4253a, bVar.f4254b.endsWith(d4) ? l0.r0(l0.k(bVar.f4254b, d4)) : bVar.f4254b);
        bVar2.f4255c = bVar.f4255c;
        bVar2.f4256d = bVar.f4256d;
        bVar2.f4257e = bVar.f4257e;
        bVar2.f4258f = bVar.f4258f;
        bVar2.f4259g = bVar.f4259g;
        bVar2.f4260h = bVar.f4260h;
        bVar2.f4261i = bVar.f4261i;
        bVar2.f4262j = bVar.f4262j;
        bVar2.f4263k = bVar.f4263k;
        bVar2.f4264l = bVar.f4264l;
        bVar2.f4265m = bVar.f4265m;
        bVar2.f4266n = bVar.f4266n;
        bVar2.f4267o = bVar.f4267o;
        bVar2.f4268p = bVar.f4268p;
        bVar2.f4270r = bVar.f4270r;
        bVar2.f4271s = bVar.f4271s;
        bVar2.f4272t = bVar.f4272t;
        bVar2.f4273u = bVar.f4273u;
        bVar2.f4275w = bVar.f4275w;
        bVar2.f4274v = bVar.f4274v;
        bVar2.f4269q = bVar.f4269q;
        return bVar2;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("apiKey='");
        sb.append(this.f4253a);
        sb.append('\'');
        sb.append(", secret='");
        sb.append(this.f4254b);
        sb.append('\'');
        if (this.f4256d != null) {
            sb.append(", openUri=");
            sb.append(this.f4256d);
        }
        sb.append(", logging='");
        sb.append(this.f4262j);
        sb.append('\'');
        sb.append(", logLevel='");
        sb.append(this.f4263k);
        sb.append('\'');
        return sb.toString();
    }
}
