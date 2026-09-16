package o2;

import a1.b2.c3;
import o2.a;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c extends i {

    /* renamed from: g, reason: collision with root package name */
    private static final g0 f4303g = g0.f(c.class.getSimpleName());

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class a implements a.InterfaceC0063a {
        public a() {
        }

        @Override // o2.a.InterfaceC0063a
        public boolean a(e0 e0Var, int i4, String str) {
            if (i4 != 200) {
                return false;
            }
            try {
                return new JSONObject(str).optString("status", "").equalsIgnoreCase("ok");
            } catch (JSONException e4) {
                c.f4303g.d("error in handle()", e4);
                return false;
            }
        }
    }

    public c(long j4) {
        super(c3.d4(1183), j4);
    }

    @Override // o2.i, o2.a
    public /* bridge */ /* synthetic */ boolean a(e0 e0Var) {
        return super.a(e0Var);
    }

    @Override // o2.a
    public a.InterfaceC0063a b() {
        return new a();
    }

    @Override // o2.a
    public String c() {
        return "/set_device_for_custom_id";
    }

    @Override // o2.i, o2.a
    public /* bridge */ /* synthetic */ long e() {
        return super.e();
    }

    @Override // o2.i
    public /* bridge */ /* synthetic */ String k() {
        return super.k();
    }

    @Override // o2.i
    public /* bridge */ /* synthetic */ boolean l() {
        return super.l();
    }

    @Override // o2.i
    public /* bridge */ /* synthetic */ String n() {
        return super.n();
    }
}
