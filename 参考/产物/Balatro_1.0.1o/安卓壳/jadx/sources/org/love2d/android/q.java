package org.love2d.android;

import a1.b2.c3;
import android.os.AsyncTask;
import android.util.Log;
import com.google.android.gms.common.api.Status;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import p1.p;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class q {

    /* renamed from: c, reason: collision with root package name */
    public static final q f4570c = new q();

    /* renamed from: a, reason: collision with root package name */
    public final Map f4571a = new HashMap();

    /* renamed from: b, reason: collision with root package name */
    public final Set f4572b = new HashSet();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class a extends AsyncTask {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ CountDownLatch f4573a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ g2.i f4574b;

        public a(CountDownLatch countDownLatch, g2.i iVar) {
            this.f4573a = countDownLatch;
            this.f4574b = iVar;
        }

        /* JADX INFO: Access modifiers changed from: protected */
        @Override // android.os.AsyncTask
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public Void doInBackground(Void... voidArr) {
            this.f4574b.c(q.this.new f(this.f4573a).b());
            return null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class b implements g2.a {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ p1.p f4576a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ v1.a f4577b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements g2.d {
            public a() {
            }

            @Override // g2.d
            public void a(g2.h hVar) {
                Log.d("SnapshotCoordinator", "Closed " + b.this.f4577b.M().b0());
                b bVar = b.this;
                q.this.j(bVar.f4577b.M().b0());
            }
        }

        public b(p1.p pVar, v1.a aVar) {
            this.f4576a = pVar;
            this.f4577b = aVar;
        }

        @Override // g2.a
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public g2.h a(g2.h hVar) {
            return this.f4576a.a(this.f4577b).c(new a());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class c implements g2.d {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ String f4580a;

        public c(String str) {
            this.f4580a = str;
        }

        @Override // g2.d
        public void a(g2.h hVar) {
            if (!hVar.q()) {
                Log.e("SnapshotCoordinator", "Open was not a success for filename " + this.f4580a, hVar.m());
                q.this.j(this.f4580a);
                return;
            }
            if (!((p.a) hVar.n()).c()) {
                Log.d("SnapshotCoordinator", "Open successful: " + this.f4580a);
                return;
            }
            Log.d("SnapshotCoordinator", "Open successful: " + this.f4580a + ", but with a conflict. Setting back to closed so it gets re-opened for resolution");
            q.this.j(this.f4580a);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class d implements g2.a {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ p1.p f4582a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ String f4583b;

        /* renamed from: c, reason: collision with root package name */
        public final /* synthetic */ boolean f4584c;

        public d(p1.p pVar, String str, boolean z3) {
            this.f4582a = pVar;
            this.f4583b = str;
            this.f4584c = z3;
        }

        @Override // g2.a
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public g2.h a(g2.h hVar) {
            return this.f4582a.d(this.f4583b, this.f4584c, -1).c(q.this.a(this.f4583b));
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class e implements g2.a {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ p1.p f4586a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ v1.a f4587b;

        /* renamed from: c, reason: collision with root package name */
        public final /* synthetic */ v1.g f4588c;

        /* renamed from: d, reason: collision with root package name */
        public final /* synthetic */ String f4589d;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements g2.d {
            public a() {
            }

            @Override // g2.d
            public void a(g2.h hVar) {
                Log.d("SnapshotCoordinator", "CommitAndClose complete, closing " + e.this.f4589d);
                e eVar = e.this;
                q.this.j(eVar.f4589d);
            }
        }

        public e(p1.p pVar, v1.a aVar, v1.g gVar, String str) {
            this.f4586a = pVar;
            this.f4587b = aVar;
            this.f4588c = gVar;
            this.f4589d = str;
        }

        @Override // g2.a
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public g2.h a(g2.h hVar) {
            return this.f4586a.b(this.f4587b, this.f4588c).c(new a());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class f {

        /* renamed from: a, reason: collision with root package name */
        public final CountDownLatch f4592a;

        /* renamed from: c, reason: collision with root package name */
        public final Status f4594c = new Status(0);

        /* renamed from: d, reason: collision with root package name */
        public final Status f4595d = new Status(16);

        /* renamed from: b, reason: collision with root package name */
        public boolean f4593b = false;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements e1.k {
            public a() {
            }

            @Override // e1.k
            public Status H() {
                return f.this.f4595d;
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class b implements e1.k {
            public b() {
            }

            @Override // e1.k
            public Status H() {
                return f.this.f4593b ? f.this.f4595d : f.this.f4594c;
            }
        }

        public f(CountDownLatch countDownLatch) {
            this.f4592a = countDownLatch;
        }

        public e1.k b() {
            CountDownLatch countDownLatch;
            if (!this.f4593b && (countDownLatch = this.f4592a) != null) {
                try {
                    countDownLatch.await();
                } catch (InterruptedException unused) {
                    return new a();
                }
            }
            return new b();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public g2.d a(String str) {
        return new c(str);
    }

    public static q e() {
        return f4570c;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public synchronized void j(String str) {
        this.f4572b.remove(str);
        CountDownLatch countDownLatch = (CountDownLatch) this.f4571a.remove(str);
        if (countDownLatch != null) {
            countDownLatch.countDown();
        }
    }

    private synchronized void k(String str) {
        this.f4572b.add(str);
    }

    private g2.h l(String str) {
        g2.i iVar = new g2.i();
        if (!i(str)) {
            iVar.b(new IllegalStateException(str + " is already closed!"));
        } else if (h(str)) {
            iVar.b(new IllegalStateException(str + c3.d4(752)));
        } else {
            k(str);
            iVar.c(null);
        }
        return iVar.a();
    }

    private synchronized void m(String str) {
        this.f4571a.put(str, new CountDownLatch(1));
    }

    private g2.h n(String str) {
        g2.i iVar = new g2.i();
        if (i(str)) {
            iVar.b(new IllegalStateException(str + " is already open!"));
        } else if (h(str)) {
            iVar.b(new IllegalStateException(str + " is current closing!"));
        } else {
            m(str);
            iVar.c(null);
        }
        return iVar.a();
    }

    public g2.h b(p1.p pVar, String str, boolean z3) {
        return n(str).k(new d(pVar, str, z3));
    }

    public g2.h c(p1.p pVar, v1.a aVar) {
        return l(aVar.M().b0()).k(new b(pVar, aVar));
    }

    public g2.h d(p1.p pVar, v1.a aVar, v1.g gVar) {
        String b02 = aVar.M().b0();
        return l(b02).k(new e(pVar, aVar, gVar, b02));
    }

    public synchronized boolean h(String str) {
        return this.f4572b.contains(str);
    }

    public synchronized boolean i(String str) {
        return this.f4571a.containsKey(str);
    }

    public g2.h o(String str) {
        CountDownLatch countDownLatch;
        g2.i iVar = new g2.i();
        synchronized (this) {
            countDownLatch = (CountDownLatch) this.f4571a.get(str);
        }
        if (countDownLatch == null) {
            iVar.c(null);
            return iVar.a();
        }
        new a(countDownLatch, iVar).execute(new Void[0]);
        return iVar.a();
    }
}
