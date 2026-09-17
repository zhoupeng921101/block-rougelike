package g2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends IllegalStateException {
    private b(String str, Throwable th) {
        super(str, th);
    }

    public static IllegalStateException a(h hVar) {
        if (!hVar.p()) {
            return new IllegalStateException("DuplicateTaskCompletionException can only be created from completed Task.");
        }
        Exception m3 = hVar.m();
        return new b(c3.d4(888).concat(m3 != null ? "failure" : hVar.q() ? "result ".concat(String.valueOf(hVar.n())) : hVar.o() ? "cancellation" : "unknown issue"), m3);
    }
}
