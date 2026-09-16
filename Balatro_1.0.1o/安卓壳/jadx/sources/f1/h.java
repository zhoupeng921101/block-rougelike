package f1;

import a1.b2.c3;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import java.io.FileDescriptor;
import java.io.PrintWriter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h {

    /* renamed from: a, reason: collision with root package name */
    protected final i f3261a;

    protected h(i iVar) {
        this.f3261a = iVar;
    }

    public static i c(Activity activity) {
        return d(new g(activity));
    }

    protected static i d(g gVar) {
        if (gVar.a()) {
            return j1.B1(gVar.d());
        }
        if (gVar.b()) {
            return g1.b(gVar.c());
        }
        throw new IllegalArgumentException(c3.d4(121));
    }

    public void a(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
    }

    public Activity b() {
        Activity e4 = this.f3261a.e();
        h1.q.i(e4);
        return e4;
    }

    public void e(int i4, int i5, Intent intent) {
    }

    public void f(Bundle bundle) {
    }

    public void g() {
    }

    public void h() {
    }

    public void i(Bundle bundle) {
    }

    public void j() {
    }

    public void k() {
    }
}
