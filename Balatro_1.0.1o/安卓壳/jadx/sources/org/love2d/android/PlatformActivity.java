package org.love2d.android;

import a1.b2.c3;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import androidx.appcompat.view.menu.rB.euGzLyxkGo;
import c0.XM.ileNUrAtpmaGeJ;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.c;
import com.android.billingclient.api.f;
import com.android.billingclient.api.g;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import np.dcc.protect.EntryPoint;
import org.love2d.android.r;
import p1.p;
import t2.zESy.vikGkHYSSHx;
import v1.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class PlatformActivity extends GameActivity {
    public static final String PREFS_NAME = "GameSavePrefs";
    public static final int RC_ACHIEVEMENT_UI = 9678;
    public static final long REFRESH_INTERVAL_MS = 3600000;
    public static final String TAG = "PlatformActivity";
    public p1.a _achievementsClient;
    public com.android.billingclient.api.a _billingClient;
    public p1.f _gamesSignInClient;
    public p1.o _playersClient;
    public SharedPreferences _preferences;
    public p1.p _snapshotsClient;
    public boolean _isAuthenticated = false;
    public String _playerId = null;
    public Map<String, com.android.billingclient.api.f> _productDetailsMap = new HashMap();
    public long lastRefreshTime = 0;
    public boolean nativeReady = false;
    public boolean needsInitialOwnershipCheck = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class a implements g2.f {

        /* renamed from: f, reason: collision with root package name */
        public static final /* synthetic */ boolean f4516f = true;

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ String f4517a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ byte[] f4518b;

        /* renamed from: c, reason: collision with root package name */
        public final /* synthetic */ String f4519c;

        /* renamed from: d, reason: collision with root package name */
        public final /* synthetic */ String f4520d;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: org.love2d.android.PlatformActivity$a$a, reason: collision with other inner class name */
        public class C0071a implements g2.a {

            /* renamed from: c, reason: collision with root package name */
            public static final /* synthetic */ boolean f4522c = true;

            /* renamed from: a, reason: collision with root package name */
            public final /* synthetic */ p.a f4523a;

            public C0071a(p.a aVar) {
                this.f4523a = aVar;
            }

            @Override // g2.a
            /* renamed from: b, reason: merged with bridge method [inline-methods] */
            public p.a a(g2.h hVar) {
                if (hVar.q()) {
                    boolean c4 = ((p.a) hVar.n()).c();
                    String d4 = c3.d4(808);
                    if (c4) {
                        p.b a4 = this.f4523a.a();
                        if (!f4522c && a4 == null) {
                            throw new AssertionError();
                        }
                        a4.a();
                        v1.a d5 = a4.d();
                        a4.b();
                        d5.c0().F();
                        Log.w(d4, "Conflict occurred during conflict resolution for file " + a.this.f4519c);
                    } else {
                        Log.i(d4, c3.d4(958) + a.this.f4519c);
                        SharedPreferences.Editor edit = PlatformActivity.this._preferences.edit();
                        edit.putLong(a.this.f4520d, 0L);
                        edit.apply();
                    }
                }
                return (p.a) hVar.n();
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class b implements g2.d {
            public b() {
            }

            @Override // g2.d
            public void a(g2.h hVar) {
                if (hVar.q()) {
                    SharedPreferences.Editor edit = PlatformActivity.this._preferences.edit();
                    edit.putLong(a.this.f4520d, 0L);
                    edit.apply();
                } else {
                    Exception m3 = hVar.m();
                    StringBuilder sb = new StringBuilder();
                    sb.append("Failed to save saved game data: ");
                    sb.append(m3 != null ? m3.getMessage() : "UNKNOWN");
                    Log.d(PlatformActivity.TAG, sb.toString());
                }
            }
        }

        public a(String str, byte[] bArr, String str2, String str3) {
            this.f4517a = str;
            this.f4518b = bArr;
            this.f4519c = str2;
            this.f4520d = str3;
        }

        @Override // g2.f
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void b(p.a aVar) {
            String d4 = c3.d4(959);
            try {
                if (!aVar.c()) {
                    v1.a aVar2 = (v1.a) aVar.b();
                    if (!f4516f && aVar2 == null) {
                        throw new AssertionError();
                    }
                    aVar2.c0().R(this.f4518b);
                    q.e().d(PlatformActivity.this._snapshotsClient, aVar2, new g.a().b(this.f4519c).a()).c(new b());
                    return;
                }
                p.b a4 = aVar.a();
                if (!f4516f && a4 == null) {
                    throw new AssertionError();
                }
                String a5 = a4.a();
                Log.i(d4, "Resolving conflict id " + a5 + ", resolution started with conflict id " + this.f4517a);
                v1.b c4 = a4.c();
                c4.R(this.f4518b);
                PlatformActivity.this._snapshotsClient.c(a5, a4.d().M().f0(), new g.a().a(), c4).i(new C0071a(aVar));
            } catch (Exception e4) {
                Log.e(d4, "Error while reading snapshot: ", e4);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class b implements g2.f {
        public b() {
        }

        @Override // g2.f
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void b(Intent intent) {
            PlatformActivity.this.startActivityForResult(intent, PlatformActivity.RC_ACHIEVEMENT_UI);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class c implements e0.i {
        public c() {
        }

        @Override // e0.i
        public void a(com.android.billingclient.api.d dVar, List list) {
            f.b a4;
            if (dVar.c() != 0 || list == null) {
                if (dVar.c() == 1) {
                    Log.w(PlatformActivity.TAG, "User canceled billing flow");
                    return;
                }
                Log.e(PlatformActivity.TAG, "Error during billing billing flow. Response code: " + dVar.c());
                return;
            }
            Iterator it = list.iterator();
            while (it.hasNext()) {
                Purchase purchase = (Purchase) it.next();
                if (purchase.c() == 1) {
                    for (String str : purchase.b()) {
                        com.android.billingclient.api.f fVar = (com.android.billingclient.api.f) PlatformActivity.this._productDetailsMap.get(str);
                        if (fVar != null && (a4 = fVar.a()) != null) {
                            double c4 = a4.c() / 1000000.0d;
                            String d4 = a4.d();
                            Log.d("PurchaseInfo", "User paid: " + c4 + " in " + d4);
                            n2.a.k(d4, c4, purchase);
                        }
                        PlatformActivity.this.setProductOwned(str, true);
                        PlatformActivity.this.nativeOnPurchaseFinished(str, true);
                    }
                    PlatformActivity.this.acknowledgePurchase(purchase);
                }
            }
        }
    }

    public abstract class c2020060317 extends GameActivity {
        public static void onStart(PlatformActivity platformActivity) {
            super.onStart();
        }
    }

    public abstract class c2020060318 extends GameActivity {
        public static void onPause(PlatformActivity platformActivity) {
            super.onPause();
        }
    }

    public abstract class c2020060319 extends GameActivity {
        public static void onDestroy(PlatformActivity platformActivity) {
            super.onDestroy();
            System.exit(0);
        }
    }

    public abstract class c2020060320 extends GameActivity {
        public static void onCreate(PlatformActivity platformActivity, Bundle bundle) {
            super.onCreate(bundle);
            p1.i.a(GameActivity.context);
            platformActivity._gamesSignInClient = p1.h.b(platformActivity);
            platformActivity._playersClient = p1.h.c(platformActivity);
            platformActivity._snapshotsClient = p1.h.d(platformActivity);
            platformActivity._achievementsClient = p1.h.a(platformActivity);
            platformActivity._preferences = GameActivity.context.getSharedPreferences(c3.d4(906), 0);
            platformActivity.initializeSingular();
            platformActivity._billingClient = com.android.billingclient.api.a.d(platformActivity).d(platformActivity.new c()).c(com.android.billingclient.api.e.c().b().a()).b().a();
        }
    }

    public abstract class c2020060321 extends GameActivity {
        public static void onResume(PlatformActivity platformActivity) {
            long currentTimeMillis = System.currentTimeMillis();
            if (platformActivity.nativeReady && currentTimeMillis - platformActivity.lastRefreshTime > PlatformActivity.REFRESH_INTERVAL_MS) {
                platformActivity.refreshProductOwnership("unlockgame");
                platformActivity.lastRefreshTime = currentTimeMillis;
            }
            super.onResume();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class d implements e0.d {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ Runnable f4528a;

        public d(Runnable runnable) {
            this.f4528a = runnable;
        }

        @Override // e0.d
        public void a(com.android.billingclient.api.d dVar) {
            if (dVar.c() == 0) {
                Log.d("Billing", c3.d4(1200));
                this.f4528a.run();
            } else {
                Log.e("Billing", c3.d4(1393) + dVar.c());
            }
        }

        @Override // e0.d
        public void b() {
            Log.d(c3.d4(652), "Billing client disconnected");
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class e implements e0.b {
        public e() {
        }

        @Override // e0.b
        public void a(com.android.billingclient.api.d dVar) {
            if (dVar.c() == 0) {
                Log.d("Billing", "Purchase acknowledged successfully");
                return;
            }
            Log.e("Billing", c3.d4(1435) + dVar.a());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class f implements g2.a {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ String f4531a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ boolean f4532b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements g2.a {
            public a() {
            }

            @Override // g2.a
            /* renamed from: b, reason: merged with bridge method [inline-methods] */
            public p.a a(g2.h hVar) {
                if (hVar.q()) {
                    return (p.a) hVar.n();
                }
                if (!(hVar.m() instanceof e1.b) || ((e1.b) hVar.m()).b() != 26570) {
                    Log.e(c3.d4(174), "Task exception: " + hVar.m().getMessage());
                }
                throw new r(c3.d4(849), hVar.m(), r.a.OPEN_SNAPSHOT);
            }
        }

        public f(String str, boolean z3) {
            this.f4531a = str;
            this.f4532b = z3;
        }

        @Override // g2.a
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public g2.h a(g2.h hVar) {
            if (hVar.q()) {
                return q.e().b(PlatformActivity.this._snapshotsClient, this.f4531a, this.f4532b).i(new a());
            }
            throw new r("Failed to wait for snapshot to close", hVar.m(), r.a.WAIT_FOR_CLOSED);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class g implements g2.e {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ String f4535a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ byte[] f4536b;

        public g(String str, byte[] bArr) {
            this.f4535a = str;
            this.f4536b = bArr;
        }

        @Override // g2.e
        public void e(Exception exc) {
            Log.e(PlatformActivity.TAG, "Error opening snapshot: ", exc);
            PlatformActivity.this.nativeOnSaveGameComplete(this.f4535a, 2, "Error opening snapshot: " + exc.getMessage(), this.f4536b, null, null);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class h implements g2.f {

        /* renamed from: f, reason: collision with root package name */
        public static final /* synthetic */ boolean f4538f = true;

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ String f4539a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ byte[] f4540b;

        /* renamed from: c, reason: collision with root package name */
        public final /* synthetic */ String f4541c;

        /* renamed from: d, reason: collision with root package name */
        public final /* synthetic */ String f4542d;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements g2.d {
            public a() {
            }

            @Override // g2.d
            public void a(g2.h hVar) {
                if (hVar.q()) {
                    SharedPreferences.Editor edit = PlatformActivity.this._preferences.edit();
                    edit.putLong(h.this.f4542d, 0L);
                    edit.apply();
                    h hVar2 = h.this;
                    PlatformActivity.this.nativeOnSaveGameComplete(hVar2.f4539a, 0, c3.d4(1201), hVar2.f4540b, null, null);
                    return;
                }
                Exception m3 = hVar.m();
                h hVar3 = h.this;
                PlatformActivity platformActivity = PlatformActivity.this;
                String str = hVar3.f4539a;
                StringBuilder sb = new StringBuilder();
                sb.append("Failed to save: ");
                sb.append(m3 != null ? m3.getMessage() : "UNKNOWN");
                platformActivity.nativeOnSaveGameComplete(str, 2, sb.toString(), h.this.f4540b, null, null);
                StringBuilder sb2 = new StringBuilder();
                sb2.append("Failed to save saved game data: ");
                sb2.append(m3 != null ? m3.getMessage() : "UNKNOWN");
                Log.d(PlatformActivity.TAG, sb2.toString());
            }
        }

        public h(String str, byte[] bArr, String str2, String str3) {
            this.f4539a = str;
            this.f4540b = bArr;
            this.f4541c = str2;
            this.f4542d = str3;
        }

        @Override // g2.f
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void b(p.a aVar) {
            try {
                if (!aVar.c()) {
                    v1.a aVar2 = (v1.a) aVar.b();
                    if (!f4538f && aVar2 == null) {
                        throw new AssertionError();
                    }
                    aVar2.c0().R(this.f4540b);
                    q.e().d(PlatformActivity.this._snapshotsClient, aVar2, new g.a().b(this.f4541c).a()).c(new a());
                    return;
                }
                p.b a4 = aVar.a();
                if (!f4538f && a4 == null) {
                    throw new AssertionError();
                }
                PlatformActivity.this.nativeOnSaveGameComplete(this.f4539a, 3, "Save conflict", a4.b().c0().F(), a4.d().c0().F(), a4.a());
            } catch (Exception e4) {
                Log.e(PlatformActivity.TAG, "Error while reading snapshot: ", e4);
                PlatformActivity.this.nativeOnSaveGameComplete(this.f4539a, 2, "Error writing snapshot: " + e4.getMessage(), this.f4540b, null, null);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class i implements g2.e {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ byte[] f4545a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ String f4546b;

        public i(byte[] bArr, String str) {
            this.f4545a = bArr;
            this.f4546b = str;
        }

        @Override // g2.e
        public void e(Exception exc) {
            Log.e(PlatformActivity.TAG, "Error opening snapshot: ", exc);
            byte[] bArr = this.f4545a;
            if (bArr != null) {
                PlatformActivity.this.nativeOnLoadGameComplete(this.f4546b, 4, "Loaded from local storage (cloud error)", bArr, null, null);
                return;
            }
            PlatformActivity.this.nativeOnLoadGameComplete(this.f4546b, 6, "No local file, remote error: " + exc.getMessage(), null, null, null);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class j implements g2.f {

        /* renamed from: e, reason: collision with root package name */
        public static final /* synthetic */ boolean f4548e = true;

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ long f4549a;

        /* renamed from: b, reason: collision with root package name */
        public final /* synthetic */ byte[] f4550b;

        /* renamed from: c, reason: collision with root package name */
        public final /* synthetic */ String f4551c;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements g2.e {
            public a() {
            }

            @Override // g2.e
            public void e(Exception exc) {
                Log.e(PlatformActivity.TAG, c3.d4(459), exc);
            }
        }

        public j(long j4, byte[] bArr, String str) {
            this.f4549a = j4;
            this.f4550b = bArr;
            this.f4551c = str;
        }

        @Override // g2.f
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void b(p.a aVar) {
            byte[] bArr;
            try {
                if (!aVar.c()) {
                    v1.a aVar2 = (v1.a) aVar.b();
                    if (!f4548e && aVar2 == null) {
                        throw new AssertionError();
                    }
                    byte[] F = aVar2.c0().F();
                    if (this.f4549a > 0) {
                        byte[] bArr2 = this.f4550b;
                        if (bArr2 != null) {
                            PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 3, "Local was dirty, cloud exists, conflict", bArr2, F, null);
                        } else {
                            PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 0, "Loaded from cloud", F, null, null);
                        }
                    } else {
                        byte[] bArr3 = this.f4550b;
                        if (bArr3 != null) {
                            PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 3, "Local was not dirty, cloud exists, conflicting anyway", bArr3, F, null);
                        } else {
                            PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 0, "Loaded from cloud", F, null, null);
                        }
                    }
                    q.e().c(PlatformActivity.this._snapshotsClient, aVar2).e(new a());
                    return;
                }
                p.b a4 = aVar.a();
                if (!f4548e && a4 == null) {
                    throw new AssertionError();
                }
                String a5 = a4.a();
                v1.a d4 = a4.d();
                v1.a b4 = a4.b();
                byte[] F2 = d4.c0().F();
                byte[] F3 = b4.c0().F();
                if (this.f4549a > 0) {
                    bArr = F3;
                    byte[] bArr4 = this.f4550b;
                    if (bArr4 != null) {
                        PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 3, "Load conflict", bArr4, F2, a5);
                        return;
                    }
                } else {
                    bArr = F3;
                }
                PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 3, "Load conflict", bArr, F2, a5);
            } catch (Exception e4) {
                Log.e(PlatformActivity.TAG, "Error while reading snapshot: ", e4);
                byte[] bArr5 = this.f4550b;
                if (bArr5 != null) {
                    PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 1, "Loaded from local storage (cloud read error)", bArr5, null, null);
                    return;
                }
                PlatformActivity.this.nativeOnLoadGameComplete(this.f4551c, 2, c3.d4(1476) + e4.getMessage(), null, null, null);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class k implements g2.e {
        public k() {
        }

        @Override // g2.e
        public void e(Exception exc) {
            Log.e(PlatformActivity.TAG, c3.d4(1511), exc);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface l {
        void a(boolean z3);
    }

    static {
        EntryPoint.stub(7);
    }

    public static /* synthetic */ void a(final PlatformActivity platformActivity, g2.h hVar) {
        platformActivity.getClass();
        boolean z3 = hVar.q() && ((p1.b) hVar.n()).a();
        platformActivity._isAuthenticated = z3;
        if (z3) {
            platformActivity._playersClient.a().c(new g2.d() { // from class: org.love2d.android.m
                @Override // g2.d
                public final void a(g2.h hVar2) {
                    PlatformActivity.i(PlatformActivity.this, hVar2);
                }
            });
        } else {
            Log.w(c3.d4(403), c3.d4(91));
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void acknowledgePurchase(final Purchase purchase) {
        if (purchase.f()) {
            return;
        }
        performBillingOperation(new l() { // from class: org.love2d.android.i
            @Override // org.love2d.android.PlatformActivity.l
            public final void a(boolean z3) {
                PlatformActivity.b(PlatformActivity.this, purchase, z3);
            }
        });
    }

    public static /* synthetic */ void b(PlatformActivity platformActivity, Purchase purchase, boolean z3) {
        platformActivity.getClass();
        if (!z3) {
            Log.e("Billing", "Could not acknowledge purchase!");
            return;
        }
        e eVar = platformActivity.new e();
        platformActivity._billingClient.a(e0.a.b().b(purchase.d()).a(), eVar);
    }

    public static /* synthetic */ void c(com.android.billingclient.api.d dVar, List list) {
    }

    public static /* synthetic */ void d(PlatformActivity platformActivity, l lVar) {
        if (platformActivity._billingClient.b()) {
            lVar.a(true);
        } else {
            Log.e(c3.d4(270), c3.d4(850));
            lVar.a(false);
        }
    }

    public static /* synthetic */ void e(PlatformActivity platformActivity, boolean z3) {
        if (z3) {
            platformActivity._billingClient.f(e0.j.b().b("inapp").a(), new e0.h() { // from class: org.love2d.android.o
                @Override // e0.h
                public final void a(com.android.billingclient.api.d dVar, List list) {
                    PlatformActivity.c(dVar, list);
                }
            });
        } else {
            platformActivity.getClass();
        }
    }

    public static /* synthetic */ void f(final PlatformActivity platformActivity, final String str, boolean z3) {
        if (z3) {
            platformActivity._billingClient.f(e0.j.b().b("inapp").a(), new e0.h() { // from class: org.love2d.android.g
                @Override // e0.h
                public final void a(com.android.billingclient.api.d dVar, List list) {
                    PlatformActivity.j(PlatformActivity.this, str, dVar, list);
                }
            });
        } else {
            platformActivity.nativeOnOwnershipRefreshed(str, platformActivity.getProductOwned(str));
        }
    }

    public static /* synthetic */ void g(PlatformActivity platformActivity, com.android.billingclient.api.d dVar, com.android.billingclient.api.h hVar) {
        platformActivity.getClass();
        if (dVar.c() != 0) {
            Log.e("Billing", "Error querying product details: " + dVar.a());
            return;
        }
        List a4 = hVar.a();
        if (a4.isEmpty()) {
            Log.e("Billing", "No product details found for the given product ID");
            return;
        }
        com.android.billingclient.api.f fVar = (com.android.billingclient.api.f) a4.get(0);
        f.b a5 = fVar.a();
        platformActivity._productDetailsMap.put(fVar.c(), fVar);
        if (a5 != null) {
            Log.d("PurchaseInfo", "User paid: " + a5.a() + " in " + a5.d());
        }
        platformActivity._billingClient.c(platformActivity, com.android.billingclient.api.c.b().b(i2.c.o(c.b.b().b(fVar).a())).a());
    }

    private boolean getProductOwned(String str) {
        return this._preferences.getBoolean(getPurchaseToken(str), false);
    }

    private String getPurchaseToken(String str) {
        return Base64.encodeToString((str + "_" + Settings.Secure.getString(GameActivity.context.getContentResolver(), c3.d4(1252))).getBytes(), 0);
    }

    public static /* synthetic */ void h(final PlatformActivity platformActivity, String str, boolean z3) {
        platformActivity.getClass();
        if (z3) {
            platformActivity._billingClient.e(com.android.billingclient.api.g.a().b(i2.c.o(g.b.a().b(str).c("inapp").a())).a(), new e0.g() { // from class: org.love2d.android.n
                @Override // e0.g
                public final void a(com.android.billingclient.api.d dVar, com.android.billingclient.api.h hVar) {
                    PlatformActivity.g(PlatformActivity.this, dVar, hVar);
                }
            });
        }
    }

    public static /* synthetic */ void i(PlatformActivity platformActivity, g2.h hVar) {
        platformActivity.getClass();
        if (!hVar.q()) {
            Log.w(TAG, "Could not retrieve player ID!");
            platformActivity._isAuthenticated = false;
            return;
        }
        platformActivity._playerId = ((p1.j) hVar.n()).a0();
        Log.w(TAG, "AUTHENTICATED! Player ID is " + platformActivity._playerId);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void initializeSingular() {
        if (n2.a.i(GameActivity.context, new n2.b("playstack_85cf9e52", "575ab76240560def16c4caaacc2bf1ac"))) {
            Log.w(TAG, "SINGULAR INIT SUCCESS\n");
        } else {
            Log.w(TAG, "SINGULAR INIT FAILURE\n");
        }
    }

    public static /* synthetic */ void j(PlatformActivity platformActivity, String str, com.android.billingclient.api.d dVar, List list) {
        platformActivity.getClass();
        if (dVar.c() != 0) {
            Log.e("Billing", "Error querying purchases: " + dVar.a());
            platformActivity.nativeOnOwnershipRefreshed(str, platformActivity.getProductOwned(str));
            return;
        }
        Iterator it = list.iterator();
        boolean z3 = false;
        while (it.hasNext()) {
            Purchase purchase = (Purchase) it.next();
            if (purchase.c() == 1 && purchase.b().contains(str)) {
                platformActivity.acknowledgePurchase(purchase);
                z3 = true;
            }
        }
        platformActivity.setProductOwned(str, z3);
        platformActivity.nativeOnOwnershipRefreshed(str, z3);
    }

    private byte[] loadFileFromLocalStorage(String str) {
        File file = new File(GameActivity.context.getFilesDir(), str);
        if (!file.exists()) {
            return null;
        }
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            try {
                byte[] bArr = new byte[(int) file.length()];
                fileInputStream.read(bArr);
                fileInputStream.close();
                return bArr;
            } finally {
            }
        } catch (IOException e4) {
            Log.e(TAG, c3.d4(1512) + e4.getMessage());
            return null;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public native void nativeOnLoadGameComplete(String str, int i4, String str2, byte[] bArr, byte[] bArr2, String str3);

    private native void nativeOnOwnershipRefreshed(String str, boolean z3);

    /* JADX INFO: Access modifiers changed from: private */
    public native void nativeOnPurchaseFinished(String str, boolean z3);

    /* JADX INFO: Access modifiers changed from: private */
    public native void nativeOnSaveGameComplete(String str, int i4, String str2, byte[] bArr, byte[] bArr2, String str3);

    private String normalizePath(String str) {
        return str.replace('\\', '-').replace('/', '-');
    }

    private boolean saveFileToLocalStorage(String str, byte[] bArr) {
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(new File(GameActivity.context.getFilesDir(), str));
            try {
                fileOutputStream.write(bArr);
                fileOutputStream.close();
                return true;
            } finally {
            }
        } catch (IOException e4) {
            Log.e(TAG, "Error saving file: " + e4.getMessage());
            return false;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void setProductOwned(String str, boolean z3) {
        this._preferences.edit().putBoolean(getPurchaseToken(str), z3).apply();
    }

    private g2.h waitForClosedAndOpen(String str, boolean z3) {
        return q.e().o(str).k(new f(str, z3));
    }

    public void ensureBillingConnected(Runnable runnable) {
        if (this._billingClient.b()) {
            runnable.run();
        } else {
            this._billingClient.g(new d(runnable));
        }
    }

    public boolean isInternetAvailable() {
        NetworkInfo activeNetworkInfo;
        ConnectivityManager connectivityManager = (ConnectivityManager) GameActivity.context.getSystemService(c3.d4(751));
        return (connectivityManager == null || (activeNetworkInfo = connectivityManager.getActiveNetworkInfo()) == null || !activeNetworkInfo.isConnected()) ? false : true;
    }

    public void launchBillingFlow(final String str) {
        performBillingOperation(new l() { // from class: org.love2d.android.f
            @Override // org.love2d.android.PlatformActivity.l
            public final void a(boolean z3) {
                PlatformActivity.h(PlatformActivity.this, str, z3);
            }
        });
    }

    public void loadSaveGame(String str) {
        String normalizePath = normalizePath(str);
        byte[] loadFileFromLocalStorage = loadFileFromLocalStorage(normalizePath);
        long j4 = this._preferences.getLong(normalizePath + ".dirtycount", 0L);
        if (this._snapshotsClient != null) {
            waitForClosedAndOpen(normalizePath, false).g(new j(j4, loadFileFromLocalStorage, str)).e(new i(loadFileFromLocalStorage, str));
        } else if (loadFileFromLocalStorage != null) {
            nativeOnLoadGameComplete(str, 0, "Loaded from local storage (offline)", loadFileFromLocalStorage, null, null);
        } else {
            nativeOnLoadGameComplete(str, 6, "SnapshotsClient is null and no local data", null, null, null);
        }
    }

    @Override // android.app.Activity
    protected void onActivityResult(int i4, int i5, Intent intent) {
        super.onActivityResult(i4, i5, intent);
        String d4 = c3.d4(603);
        Log.d(d4, "Request Code: " + i4);
        Log.d(d4, c3.d4(92) + i5);
        if (intent == null) {
            Log.d(d4, "Intent Data: null");
            return;
        }
        Log.d(d4, "Intent Data: " + intent.toString());
        Bundle extras = intent.getExtras();
        if (extras != null) {
            for (String str : extras.keySet()) {
                Log.d(d4, "Extra - " + str + ": " + extras.get(str));
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // org.love2d.android.GameActivity, org.libsdl.app.SDLActivity, android.app.Activity
    public native void onCreate(Bundle bundle);

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // org.love2d.android.GameActivity, org.libsdl.app.SDLActivity, android.app.Activity
    public void onDestroy() {
        ileNUrAtpmaGeJ.dmZ.invoke(null, this);
    }

    public void onNativeReady() {
        this.nativeReady = true;
        if (this.needsInitialOwnershipCheck) {
            refreshProductOwnership(c3.d4(851));
            this.needsInitialOwnershipCheck = false;
        }
    }

    @Override // org.love2d.android.GameActivity, android.app.Activity
    protected void onNewIntent(Intent intent) {
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // org.love2d.android.GameActivity, org.libsdl.app.SDLActivity, android.app.Activity
    public void onPause() {
        euGzLyxkGo.xWWGlwZw.invoke(null, this);
    }

    @Override // org.love2d.android.GameActivity, org.libsdl.app.SDLActivity, android.app.Activity
    public void onResume() {
        euGzLyxkGo.IUZyMonrVV.invoke(null, this);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // org.libsdl.app.SDLActivity, android.app.Activity
    public void onStart() {
        vikGkHYSSHx.anOwNYQQyyGfI.invoke(null, this);
    }

    public boolean ownsProduct(String str) {
        return getProductOwned(str);
    }

    public void performBillingOperation(final l lVar) {
        ensureBillingConnected(new Runnable() { // from class: org.love2d.android.h
            @Override // java.lang.Runnable
            public final void run() {
                PlatformActivity.d(PlatformActivity.this, lVar);
            }
        });
    }

    /* JADX WARN: Unreachable blocks removed: 4, instructions: 8 */
    public void platformInitialize() {
        onNativeReady();
    }

    public void queryPurchases() {
        performBillingOperation(new l() { // from class: org.love2d.android.l
            @Override // org.love2d.android.PlatformActivity.l
            public final void a(boolean z3) {
                PlatformActivity.e(PlatformActivity.this, z3);
            }
        });
    }

    public void refreshProductOwnership(final String str) {
        performBillingOperation(new l() { // from class: org.love2d.android.k
            @Override // org.love2d.android.PlatformActivity.l
            public final void a(boolean z3) {
                PlatformActivity.f(PlatformActivity.this, str, z3);
            }
        });
    }

    public void resolveSaveGame(String str, byte[] bArr, String str2) {
        String normalizePath = normalizePath(str);
        String str3 = normalizePath + ".dirtycount";
        if (saveFileToLocalStorage(normalizePath, bArr)) {
            SharedPreferences.Editor edit = this._preferences.edit();
            edit.putLong(str3, this._preferences.getLong(str3, 0L) + 1);
            edit.apply();
        }
        if (this._snapshotsClient != null) {
            waitForClosedAndOpen(normalizePath, true).g(new a(str2, bArr, str, str3)).e(new k());
        }
    }

    public void showAchievements() {
        p1.a aVar = this._achievementsClient;
        if (aVar != null) {
            aVar.a().g(new b());
        }
    }

    public void singularEventNoArgs(String str) {
        if (n2.a.e(str)) {
            return;
        }
        Log.w(TAG, "INSINGULAR  FAILED");
    }

    public void singularEventWithArgs(String str, String[] strArr, Object[] objArr) {
        HashMap hashMap = new HashMap();
        int i4 = 0;
        for (int i5 = 0; i5 < strArr.length; i5++) {
            hashMap.put(strArr[i5], objArr[i5]);
        }
        Object[] objArr2 = new Object[hashMap.size() * 2];
        for (Map.Entry entry : hashMap.entrySet()) {
            int i6 = i4 + 1;
            objArr2[i4] = entry.getKey();
            i4 += 2;
            objArr2[i6] = entry.getValue();
        }
        if (n2.a.f(str, objArr2)) {
            return;
        }
        Log.w(TAG, c3.d4(1394));
    }

    public void unlockAchievement(String str) {
        p1.a aVar = this._achievementsClient;
        if (aVar != null) {
            aVar.b(str);
        }
    }

    public void writeSaveGame(String str, byte[] bArr, String str2) {
        String normalizePath = normalizePath(str);
        String str3 = normalizePath + ".dirtycount";
        if (saveFileToLocalStorage(normalizePath, bArr)) {
            SharedPreferences.Editor edit = this._preferences.edit();
            edit.putLong(str3, this._preferences.getLong(str3, 0L) + 1);
            edit.apply();
        }
        if (this._snapshotsClient != null) {
            waitForClosedAndOpen(normalizePath, true).g(new h(str, bArr, str2, str3)).e(new g(str, bArr));
        } else {
            nativeOnSaveGameComplete(str, 4, c3.d4(1477), bArr, null, null);
        }
    }
}
