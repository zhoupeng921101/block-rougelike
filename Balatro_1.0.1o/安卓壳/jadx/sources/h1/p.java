package h1;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class p {

    /* renamed from: a, reason: collision with root package name */
    private static final l0 f3566a = new i0();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        Object a(e1.k kVar);
    }

    public static g2.h a(e1.g gVar, a aVar) {
        l0 l0Var = f3566a;
        g2.i iVar = new g2.i();
        gVar.c(new j0(gVar, iVar, aVar, l0Var));
        return iVar.a();
    }

    public static g2.h b(e1.g gVar) {
        return a(gVar, new k0());
    }
}
