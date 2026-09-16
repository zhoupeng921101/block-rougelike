package androidx.fragment.app;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MenuItem;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class n {

    /* renamed from: a, reason: collision with root package name */
    private final p f1553a;

    private n(p pVar) {
        this.f1553a = pVar;
    }

    public static n b(p pVar) {
        return new n((p) androidx.core.util.c.e(pVar, "callbacks == null"));
    }

    public void a(Fragment fragment) {
        p pVar = this.f1553a;
        pVar.f1559e.m(pVar, pVar, fragment);
    }

    public void c() {
        this.f1553a.f1559e.x();
    }

    public boolean d(MenuItem menuItem) {
        return this.f1553a.f1559e.A(menuItem);
    }

    public void e() {
        this.f1553a.f1559e.B();
    }

    public void f() {
        this.f1553a.f1559e.D();
    }

    public void g() {
        this.f1553a.f1559e.M();
    }

    public void h() {
        this.f1553a.f1559e.Q();
    }

    public void i() {
        this.f1553a.f1559e.R();
    }

    public void j() {
        this.f1553a.f1559e.T();
    }

    public boolean k() {
        return this.f1553a.f1559e.a0(true);
    }

    public x l() {
        return this.f1553a.f1559e;
    }

    public void m() {
        this.f1553a.f1559e.Q0();
    }

    public View n(View view, String str, Context context, AttributeSet attributeSet) {
        return this.f1553a.f1559e.u0().onCreateView(view, str, context, attributeSet);
    }
}
