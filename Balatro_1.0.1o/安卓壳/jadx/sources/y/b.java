package y;

import a1.b2.c3;
import android.content.Context;
import java.io.FileDescriptor;
import java.io.PrintWriter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {

    /* renamed from: a, reason: collision with root package name */
    private int f5139a;

    /* renamed from: b, reason: collision with root package name */
    private a f5140b;

    /* renamed from: c, reason: collision with root package name */
    private Context f5141c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f5142d = false;

    /* renamed from: e, reason: collision with root package name */
    private boolean f5143e = false;

    /* renamed from: f, reason: collision with root package name */
    private boolean f5144f = true;

    /* renamed from: g, reason: collision with root package name */
    private boolean f5145g = false;

    /* renamed from: h, reason: collision with root package name */
    private boolean f5146h = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        void a(b bVar, Object obj);
    }

    public b(Context context) {
        this.f5141c = context.getApplicationContext();
    }

    public void a() {
        this.f5143e = true;
        k();
    }

    public boolean b() {
        return l();
    }

    public void c() {
        this.f5146h = false;
    }

    public String d(Object obj) {
        StringBuilder sb = new StringBuilder(64);
        if (obj == null) {
            sb.append("null");
        } else {
            Class<?> cls = obj.getClass();
            sb.append(cls.getSimpleName());
            sb.append("{");
            sb.append(Integer.toHexString(System.identityHashCode(cls)));
            sb.append("}");
        }
        return sb.toString();
    }

    public void e() {
    }

    public void f(Object obj) {
        a aVar = this.f5140b;
        if (aVar != null) {
            aVar.a(this, obj);
        }
    }

    public void g(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        printWriter.print(str);
        printWriter.print(c3.d4(1262));
        printWriter.print(this.f5139a);
        printWriter.print(c3.d4(545));
        printWriter.println(this.f5140b);
        if (this.f5142d || this.f5145g || this.f5146h) {
            printWriter.print(str);
            printWriter.print(c3.d4(862));
            printWriter.print(this.f5142d);
            printWriter.print(c3.d4(1398));
            printWriter.print(this.f5145g);
            printWriter.print(c3.d4(1302));
            printWriter.println(this.f5146h);
        }
        if (this.f5143e || this.f5144f) {
            printWriter.print(str);
            printWriter.print("mAbandoned=");
            printWriter.print(this.f5143e);
            printWriter.print(" mReset=");
            printWriter.println(this.f5144f);
        }
    }

    public void h() {
        n();
    }

    public boolean i() {
        return this.f5143e;
    }

    public boolean j() {
        return this.f5142d;
    }

    protected void k() {
    }

    protected abstract boolean l();

    public void m() {
        if (this.f5142d) {
            h();
        } else {
            this.f5145g = true;
        }
    }

    protected void n() {
    }

    protected void o() {
    }

    protected abstract void p();

    protected void q() {
    }

    public void r(int i4, a aVar) {
        if (this.f5140b != null) {
            throw new IllegalStateException("There is already a listener registered");
        }
        this.f5140b = aVar;
        this.f5139a = i4;
    }

    public void s() {
        o();
        this.f5144f = true;
        this.f5142d = false;
        this.f5143e = false;
        this.f5145g = false;
        this.f5146h = false;
    }

    public void t() {
        if (this.f5146h) {
            m();
        }
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(64);
        Class<?> cls = getClass();
        sb.append(cls.getSimpleName());
        sb.append("{");
        sb.append(Integer.toHexString(System.identityHashCode(cls)));
        sb.append(" id=");
        sb.append(this.f5139a);
        sb.append("}");
        return sb.toString();
    }

    public final void u() {
        this.f5142d = true;
        this.f5144f = false;
        this.f5143e = false;
        p();
    }

    public void v() {
        this.f5142d = false;
        q();
    }

    public void w(a aVar) {
        a aVar2 = this.f5140b;
        if (aVar2 == null) {
            throw new IllegalStateException("No listener register");
        }
        if (aVar2 != aVar) {
            throw new IllegalArgumentException("Attempting to unregister the wrong listener");
        }
        this.f5140b = null;
    }
}
