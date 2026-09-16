package androidx.core.app;

import a1.b2.c3;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Icon;
import android.os.Bundle;
import android.widget.RemoteViews;
import androidx.core.graphics.drawable.IconCompat;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        final Bundle f788a;

        /* renamed from: b, reason: collision with root package name */
        private IconCompat f789b;

        /* renamed from: c, reason: collision with root package name */
        private final a0[] f790c;

        /* renamed from: d, reason: collision with root package name */
        private final a0[] f791d;

        /* renamed from: e, reason: collision with root package name */
        private boolean f792e;

        /* renamed from: f, reason: collision with root package name */
        boolean f793f;

        /* renamed from: g, reason: collision with root package name */
        private final int f794g;

        /* renamed from: h, reason: collision with root package name */
        private final boolean f795h;

        /* renamed from: i, reason: collision with root package name */
        public int f796i;

        /* renamed from: j, reason: collision with root package name */
        public CharSequence f797j;

        /* renamed from: k, reason: collision with root package name */
        public PendingIntent f798k;

        /* renamed from: l, reason: collision with root package name */
        private boolean f799l;

        public a(int i4, CharSequence charSequence, PendingIntent pendingIntent) {
            this(i4 != 0 ? IconCompat.b(null, c3.d4(611), i4) : null, charSequence, pendingIntent);
        }

        public a(IconCompat iconCompat, CharSequence charSequence, PendingIntent pendingIntent) {
            this(iconCompat, charSequence, pendingIntent, new Bundle(), null, null, true, 0, true, false, false);
        }

        a(IconCompat iconCompat, CharSequence charSequence, PendingIntent pendingIntent, Bundle bundle, a0[] a0VarArr, a0[] a0VarArr2, boolean z3, int i4, boolean z4, boolean z5, boolean z6) {
            this.f793f = true;
            this.f789b = iconCompat;
            if (iconCompat != null && iconCompat.e() == 2) {
                this.f796i = iconCompat.c();
            }
            this.f797j = d.d(charSequence);
            this.f798k = pendingIntent;
            this.f788a = bundle == null ? new Bundle() : bundle;
            this.f790c = a0VarArr;
            this.f791d = a0VarArr2;
            this.f792e = z3;
            this.f794g = i4;
            this.f793f = z4;
            this.f795h = z5;
            this.f799l = z6;
        }

        public PendingIntent a() {
            return this.f798k;
        }

        public boolean b() {
            return this.f792e;
        }

        public Bundle c() {
            return this.f788a;
        }

        public IconCompat d() {
            int i4;
            if (this.f789b == null && (i4 = this.f796i) != 0) {
                this.f789b = IconCompat.b(null, "", i4);
            }
            return this.f789b;
        }

        public a0[] e() {
            return this.f790c;
        }

        public int f() {
            return this.f794g;
        }

        public boolean g() {
            return this.f793f;
        }

        public CharSequence h() {
            return this.f797j;
        }

        public boolean i() {
            return this.f799l;
        }

        public boolean j() {
            return this.f795h;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class b extends e {

        /* renamed from: e, reason: collision with root package name */
        private CharSequence f800e;

        @Override // androidx.core.app.f.e
        public void a(Bundle bundle) {
            super.a(bundle);
        }

        @Override // androidx.core.app.f.e
        public void b(androidx.core.app.e eVar) {
            Notification.BigTextStyle bigText = new Notification.BigTextStyle(eVar.a()).setBigContentTitle(this.f828b).bigText(this.f800e);
            if (this.f830d) {
                bigText.setSummaryText(this.f829c);
            }
        }

        @Override // androidx.core.app.f.e
        protected String c() {
            return "androidx.core.app.NotificationCompat$BigTextStyle";
        }

        public b h(CharSequence charSequence) {
            this.f800e = d.d(charSequence);
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class c {
        public static Notification.BubbleMetadata a(c cVar) {
            return null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class d {
        boolean A;
        boolean B;
        String C;
        Bundle D;
        int E;
        int F;
        Notification G;
        RemoteViews H;
        RemoteViews I;
        RemoteViews J;
        String K;
        int L;
        String M;
        long N;
        int O;
        int P;
        boolean Q;
        Notification R;
        boolean S;
        Icon T;
        public ArrayList U;

        /* renamed from: a, reason: collision with root package name */
        public Context f801a;

        /* renamed from: b, reason: collision with root package name */
        public ArrayList f802b;

        /* renamed from: c, reason: collision with root package name */
        public ArrayList f803c;

        /* renamed from: d, reason: collision with root package name */
        ArrayList f804d;

        /* renamed from: e, reason: collision with root package name */
        CharSequence f805e;

        /* renamed from: f, reason: collision with root package name */
        CharSequence f806f;

        /* renamed from: g, reason: collision with root package name */
        PendingIntent f807g;

        /* renamed from: h, reason: collision with root package name */
        PendingIntent f808h;

        /* renamed from: i, reason: collision with root package name */
        RemoteViews f809i;

        /* renamed from: j, reason: collision with root package name */
        Bitmap f810j;

        /* renamed from: k, reason: collision with root package name */
        CharSequence f811k;

        /* renamed from: l, reason: collision with root package name */
        int f812l;

        /* renamed from: m, reason: collision with root package name */
        int f813m;

        /* renamed from: n, reason: collision with root package name */
        boolean f814n;

        /* renamed from: o, reason: collision with root package name */
        boolean f815o;

        /* renamed from: p, reason: collision with root package name */
        e f816p;

        /* renamed from: q, reason: collision with root package name */
        CharSequence f817q;

        /* renamed from: r, reason: collision with root package name */
        CharSequence f818r;

        /* renamed from: s, reason: collision with root package name */
        CharSequence[] f819s;

        /* renamed from: t, reason: collision with root package name */
        int f820t;

        /* renamed from: u, reason: collision with root package name */
        int f821u;

        /* renamed from: v, reason: collision with root package name */
        boolean f822v;

        /* renamed from: w, reason: collision with root package name */
        String f823w;

        /* renamed from: x, reason: collision with root package name */
        boolean f824x;

        /* renamed from: y, reason: collision with root package name */
        String f825y;

        /* renamed from: z, reason: collision with root package name */
        boolean f826z;

        public d(Context context) {
            this(context, null);
        }

        public d(Context context, String str) {
            this.f802b = new ArrayList();
            this.f803c = new ArrayList();
            this.f804d = new ArrayList();
            this.f814n = true;
            this.f826z = false;
            this.E = 0;
            this.F = 0;
            this.L = 0;
            this.O = 0;
            this.P = 0;
            Notification notification = new Notification();
            this.R = notification;
            this.f801a = context;
            this.K = str;
            notification.when = System.currentTimeMillis();
            this.R.audioStreamType = -1;
            this.f813m = 0;
            this.U = new ArrayList();
            this.Q = true;
        }

        protected static CharSequence d(CharSequence charSequence) {
            return (charSequence != null && charSequence.length() > 5120) ? charSequence.subSequence(0, 5120) : charSequence;
        }

        private void j(int i4, boolean z3) {
            if (z3) {
                Notification notification = this.R;
                notification.flags = i4 | notification.flags;
            } else {
                Notification notification2 = this.R;
                notification2.flags = (~i4) & notification2.flags;
            }
        }

        public d a(int i4, CharSequence charSequence, PendingIntent pendingIntent) {
            this.f802b.add(new a(i4, charSequence, pendingIntent));
            return this;
        }

        public Notification b() {
            return new u(this).c();
        }

        public Bundle c() {
            if (this.D == null) {
                this.D = new Bundle();
            }
            return this.D;
        }

        public d e(boolean z3) {
            j(16, z3);
            return this;
        }

        public d f(String str) {
            this.K = str;
            return this;
        }

        public d g(PendingIntent pendingIntent) {
            this.f807g = pendingIntent;
            return this;
        }

        public d h(CharSequence charSequence) {
            this.f806f = d(charSequence);
            return this;
        }

        public d i(CharSequence charSequence) {
            this.f805e = d(charSequence);
            return this;
        }

        public d k(boolean z3) {
            this.f826z = z3;
            return this;
        }

        public d l(int i4) {
            this.f813m = i4;
            return this;
        }

        public d m(int i4) {
            this.R.icon = i4;
            return this;
        }

        public d n(e eVar) {
            if (this.f816p != eVar) {
                this.f816p = eVar;
                if (eVar != null) {
                    eVar.g(this);
                }
            }
            return this;
        }

        public d o(CharSequence charSequence) {
            this.R.tickerText = d(charSequence);
            return this;
        }

        public d p(long j4) {
            this.R.when = j4;
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class e {

        /* renamed from: a, reason: collision with root package name */
        protected d f827a;

        /* renamed from: b, reason: collision with root package name */
        CharSequence f828b;

        /* renamed from: c, reason: collision with root package name */
        CharSequence f829c;

        /* renamed from: d, reason: collision with root package name */
        boolean f830d = false;

        public void a(Bundle bundle) {
            if (this.f830d) {
                bundle.putCharSequence(c3.d4(1101), this.f829c);
            }
            CharSequence charSequence = this.f828b;
            if (charSequence != null) {
                bundle.putCharSequence("android.title.big", charSequence);
            }
            String c4 = c();
            if (c4 != null) {
                bundle.putString("androidx.core.app.extra.COMPAT_TEMPLATE", c4);
            }
        }

        public abstract void b(androidx.core.app.e eVar);

        protected abstract String c();

        public RemoteViews d(androidx.core.app.e eVar) {
            return null;
        }

        public RemoteViews e(androidx.core.app.e eVar) {
            return null;
        }

        public RemoteViews f(androidx.core.app.e eVar) {
            return null;
        }

        public void g(d dVar) {
            if (this.f827a != dVar) {
                this.f827a = dVar;
                if (dVar != null) {
                    dVar.n(this);
                }
            }
        }
    }

    public static Bundle a(Notification notification) {
        return notification.extras;
    }
}
