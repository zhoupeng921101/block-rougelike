package y;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.SystemClock;
import android.text.format.DateUtils;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a extends b {

    /* renamed from: i, reason: collision with root package name */
    private Executor f5131i;

    /* renamed from: j, reason: collision with root package name */
    private volatile RunnableC0084a f5132j;

    /* renamed from: k, reason: collision with root package name */
    private volatile RunnableC0084a f5133k;

    /* renamed from: l, reason: collision with root package name */
    private long f5134l;

    /* renamed from: m, reason: collision with root package name */
    private long f5135m;

    /* renamed from: n, reason: collision with root package name */
    private Handler f5136n;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: y.a$a, reason: collision with other inner class name */
    final class RunnableC0084a extends c implements Runnable {

        /* renamed from: j, reason: collision with root package name */
        boolean f5137j;

        RunnableC0084a() {
        }

        @Override // y.c
        protected Object b() {
            return a.this.E();
        }

        @Override // y.c
        protected void g(Object obj) {
            a.this.y(this, obj);
        }

        @Override // y.c
        protected void h(Object obj) {
            a.this.z(this, obj);
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f5137j = false;
            a.this.A();
        }
    }

    public a(Context context) {
        super(context);
        this.f5135m = -10000L;
    }

    void A() {
        if (this.f5133k != null || this.f5132j == null) {
            return;
        }
        if (this.f5132j.f5137j) {
            this.f5132j.f5137j = false;
            this.f5136n.removeCallbacks(this.f5132j);
        }
        if (this.f5134l > 0 && SystemClock.uptimeMillis() < this.f5135m + this.f5134l) {
            this.f5132j.f5137j = true;
            this.f5136n.postAtTime(this.f5132j, this.f5135m + this.f5134l);
        } else {
            if (this.f5131i == null) {
                this.f5131i = B();
            }
            this.f5132j.c(this.f5131i);
        }
    }

    protected Executor B() {
        return AsyncTask.THREAD_POOL_EXECUTOR;
    }

    public abstract Object C();

    public void D(Object obj) {
    }

    protected Object E() {
        return C();
    }

    @Override // y.b
    public void g(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        String str2;
        super.g(str, fileDescriptor, printWriter, strArr);
        if (this.f5132j != null) {
            printWriter.print(str);
            printWriter.print("mTask=");
            printWriter.print(this.f5132j);
            printWriter.print(" waiting=");
            printWriter.println(this.f5132j.f5137j);
        }
        if (this.f5133k != null) {
            printWriter.print(str);
            printWriter.print("mCancellingTask=");
            printWriter.print(this.f5133k);
            printWriter.print(" waiting=");
            printWriter.println(this.f5133k.f5137j);
        }
        if (this.f5134l != 0) {
            printWriter.print(str);
            printWriter.print("mUpdateThrottle=");
            TimeUnit timeUnit = TimeUnit.MILLISECONDS;
            printWriter.print(DateUtils.formatElapsedTime(timeUnit.toSeconds(this.f5134l)));
            printWriter.print(" mLastLoadCompleteTime=");
            if (this.f5135m == -10000) {
                str2 = "--";
            } else {
                str2 = "-" + DateUtils.formatElapsedTime(timeUnit.toSeconds(SystemClock.uptimeMillis() - this.f5135m));
            }
            printWriter.print(str2);
            printWriter.println();
        }
    }

    @Override // y.b
    protected boolean l() {
        if (this.f5132j == null) {
            return false;
        }
        if (!j()) {
            m();
        }
        if (this.f5133k != null) {
            if (this.f5132j.f5137j) {
                this.f5132j.f5137j = false;
                this.f5136n.removeCallbacks(this.f5132j);
            }
            this.f5132j = null;
            return false;
        }
        if (this.f5132j.f5137j) {
            this.f5132j.f5137j = false;
            this.f5136n.removeCallbacks(this.f5132j);
            this.f5132j = null;
            return false;
        }
        boolean a4 = this.f5132j.a(false);
        if (a4) {
            this.f5133k = this.f5132j;
            x();
        }
        this.f5132j = null;
        return a4;
    }

    @Override // y.b
    protected void n() {
        super.n();
        b();
        this.f5132j = new RunnableC0084a();
        A();
    }

    public void x() {
    }

    void y(RunnableC0084a runnableC0084a, Object obj) {
        D(obj);
        if (this.f5133k == runnableC0084a) {
            t();
            this.f5135m = SystemClock.uptimeMillis();
            this.f5133k = null;
            e();
            A();
        }
    }

    void z(RunnableC0084a runnableC0084a, Object obj) {
        if (this.f5132j != runnableC0084a) {
            y(runnableC0084a, obj);
            return;
        }
        if (i()) {
            D(obj);
            return;
        }
        c();
        this.f5135m = SystemClock.uptimeMillis();
        this.f5132j = null;
        f(obj);
    }
}
