package o2;

import a1.b2.c3;
import o2.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class i0 extends h0 {
    protected i0() {
        double p3 = l0.p();
        if (p3 != 0.0d) {
            l0.g();
            put("asid_timeinterval", String.valueOf(p3));
            put("asid_scope", String.valueOf(l0.o()));
        }
    }

    private static boolean g(e0 e0Var, boolean z3, o.a aVar) {
        if (aVar == null || l0.V(aVar.b())) {
            return false;
        }
        return z3 || o.c().a(e0Var.l());
    }

    private void h(r rVar, n2.b bVar) {
        if (!l0.V(rVar.f4454b) && !bVar.f4272t.booleanValue()) {
            put(c3.d4(1507), rVar.f4454b);
        } else {
            if (l0.V(rVar.f4457e)) {
                return;
            }
            put("asid", rVar.f4457e);
        }
    }

    protected i0 i(e0 e0Var) {
        return j(e0Var, false);
    }

    protected i0 j(e0 e0Var, boolean z3) {
        String str;
        r n3 = e0Var.n();
        n2.b z4 = e0Var.z();
        put(c3.d4(1240), n3.f4468p);
        put("p", n3.f4472t);
        if (z4.f4272t.booleanValue()) {
            put("lim", "1");
        }
        o.a b4 = o.c().b(m.c(), e0Var.l());
        if (o.c().j() && !m.c().h()) {
            put("cs", "0");
        }
        boolean g4 = g(e0Var, z3, b4);
        String d4 = c3.d4(1424);
        if (g4) {
            put("k", "SDID");
            put(d4, b4.b());
            h(n3, z4);
            if (o.c().j() && b4.a() == o.a.EnumC0069a.custom) {
                put("cs", "1");
            }
        } else if (!l0.V(n3.f4461i)) {
            put("amid", n3.f4461i);
            put("k", "AMID");
            put(d4, n3.f4461i);
            h(n3, z4);
        } else if (!l0.V(n3.f4454b) && !z4.f4272t.booleanValue()) {
            put(c3.d4(1241), n3.f4454b);
            put("k", c3.d4(1467));
            put(d4, n3.f4454b);
        } else if (!l0.V(n3.f4456d)) {
            put("k", "OAID");
            put(d4, n3.f4456d);
            put("oaid", n3.f4456d);
            if (!l0.V(n3.f4457e)) {
                put("asid", n3.f4457e);
            }
        } else if (!l0.V(n3.f4455c) && !z4.f4272t.booleanValue()) {
            put("imei", n3.f4455c);
            put("k", "IMEI");
            put(d4, n3.f4455c);
        } else if (!l0.V(n3.f4457e)) {
            put("k", "ASID");
            put(d4, n3.f4457e);
            put("asid", n3.f4457e);
        } else if (!l0.V(n3.f4453a) && !z4.f4272t.booleanValue()) {
            put("k", c3.d4(841));
            put(d4, n3.f4453a);
            put(c3.d4(126), n3.f4453a);
        }
        String str2 = n3.f4458f;
        if (str2 != null && !l0.V(str2) && (str = n3.f4457e) != null && !n3.f4458f.equalsIgnoreCase(str)) {
            put(c3.d4(1386), n3.f4458f);
        }
        put("is_asid_singular_id", l0.e(e0Var.l()) ? "true" : "false");
        return this;
    }

    protected i0 k(n2.b bVar) {
        put("a", bVar.f4253a);
        return this;
    }
}
