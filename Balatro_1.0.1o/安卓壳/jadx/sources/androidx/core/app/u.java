package androidx.core.app;

import a1.b2.c3;
import android.app.Notification;
import android.app.RemoteInput;
import android.content.Context;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.RemoteViews;
import androidx.core.app.f;
import androidx.core.graphics.drawable.IconCompat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class u implements e {

    /* renamed from: a, reason: collision with root package name */
    private final Context f831a;

    /* renamed from: b, reason: collision with root package name */
    private final Notification.Builder f832b;

    /* renamed from: c, reason: collision with root package name */
    private final f.d f833c;

    /* renamed from: d, reason: collision with root package name */
    private RemoteViews f834d;

    /* renamed from: e, reason: collision with root package name */
    private RemoteViews f835e;

    /* renamed from: f, reason: collision with root package name */
    private final List f836f = new ArrayList();

    /* renamed from: g, reason: collision with root package name */
    private final Bundle f837g = new Bundle();

    /* renamed from: h, reason: collision with root package name */
    private int f838h;

    /* renamed from: i, reason: collision with root package name */
    private RemoteViews f839i;

    u(f.d dVar) {
        int i4;
        Notification.Builder badgeIconType;
        Notification.Builder settingsText;
        Notification.Builder shortcutId;
        Notification.Builder timeoutAfter;
        this.f833c = dVar;
        this.f831a = dVar.f801a;
        if (Build.VERSION.SDK_INT >= 26) {
            l.a();
            this.f832b = g.a(dVar.f801a, dVar.K);
        } else {
            this.f832b = new Notification.Builder(dVar.f801a);
        }
        Notification notification = dVar.R;
        this.f832b.setWhen(notification.when).setSmallIcon(notification.icon, notification.iconLevel).setContent(notification.contentView).setTicker(notification.tickerText, dVar.f809i).setVibrate(notification.vibrate).setLights(notification.ledARGB, notification.ledOnMS, notification.ledOffMS).setOngoing((notification.flags & 2) != 0).setOnlyAlertOnce((notification.flags & 8) != 0).setAutoCancel((notification.flags & 16) != 0).setDefaults(notification.defaults).setContentTitle(dVar.f805e).setContentText(dVar.f806f).setContentInfo(dVar.f811k).setContentIntent(dVar.f807g).setDeleteIntent(notification.deleteIntent).setFullScreenIntent(dVar.f808h, (notification.flags & 128) != 0).setLargeIcon(dVar.f810j).setNumber(dVar.f812l).setProgress(dVar.f820t, dVar.f821u, dVar.f822v);
        this.f832b.setSubText(dVar.f817q).setUsesChronometer(dVar.f815o).setPriority(dVar.f813m);
        ArrayList arrayList = dVar.f802b;
        int size = arrayList.size();
        int i5 = 0;
        while (i5 < size) {
            Object obj = arrayList.get(i5);
            i5++;
            b((f.a) obj);
        }
        Bundle bundle = dVar.D;
        if (bundle != null) {
            this.f837g.putAll(bundle);
        }
        int i6 = Build.VERSION.SDK_INT;
        this.f834d = dVar.H;
        this.f835e = dVar.I;
        this.f832b.setShowWhen(dVar.f814n);
        this.f832b.setLocalOnly(dVar.f826z).setGroup(dVar.f823w).setGroupSummary(dVar.f824x).setSortKey(dVar.f825y);
        this.f838h = dVar.O;
        this.f832b.setCategory(dVar.C).setColor(dVar.E).setVisibility(dVar.F).setPublicVersion(dVar.G).setSound(notification.sound, notification.audioAttributes);
        List e4 = i6 < 28 ? e(f(dVar.f803c), dVar.U) : dVar.U;
        if (e4 != null && !e4.isEmpty()) {
            Iterator it = e4.iterator();
            while (it.hasNext()) {
                this.f832b.addPerson((String) it.next());
            }
        }
        this.f839i = dVar.J;
        if (dVar.f804d.size() > 0) {
            Bundle c4 = dVar.c();
            String d4 = c3.d4(229);
            Bundle bundle2 = c4.getBundle(d4);
            bundle2 = bundle2 == null ? new Bundle() : bundle2;
            Bundle bundle3 = new Bundle(bundle2);
            Bundle bundle4 = new Bundle();
            for (int i7 = 0; i7 < dVar.f804d.size(); i7++) {
                bundle4.putBundle(Integer.toString(i7), v.a((f.a) dVar.f804d.get(i7)));
            }
            String d42 = c3.d4(817);
            bundle2.putBundle(d42, bundle4);
            bundle3.putBundle(d42, bundle4);
            dVar.c().putBundle(d4, bundle2);
            this.f837g.putBundle(d4, bundle3);
        }
        int i8 = Build.VERSION.SDK_INT;
        Icon icon = dVar.T;
        if (icon != null) {
            this.f832b.setSmallIcon(icon);
        }
        this.f832b.setExtras(dVar.D).setRemoteInputHistory(dVar.f819s);
        RemoteViews remoteViews = dVar.H;
        if (remoteViews != null) {
            this.f832b.setCustomContentView(remoteViews);
        }
        RemoteViews remoteViews2 = dVar.I;
        if (remoteViews2 != null) {
            this.f832b.setCustomBigContentView(remoteViews2);
        }
        RemoteViews remoteViews3 = dVar.J;
        if (remoteViews3 != null) {
            this.f832b.setCustomHeadsUpContentView(remoteViews3);
        }
        if (i8 >= 26) {
            badgeIconType = this.f832b.setBadgeIconType(dVar.L);
            settingsText = badgeIconType.setSettingsText(dVar.f818r);
            shortcutId = settingsText.setShortcutId(dVar.M);
            timeoutAfter = shortcutId.setTimeoutAfter(dVar.N);
            timeoutAfter.setGroupAlertBehavior(dVar.O);
            if (dVar.B) {
                this.f832b.setColorized(dVar.A);
            }
            if (!TextUtils.isEmpty(dVar.K)) {
                this.f832b.setSound(null).setDefaults(0).setLights(0, 0, 0).setVibrate(null);
            }
        }
        if (i8 >= 28) {
            Iterator it2 = dVar.f803c.iterator();
            if (it2.hasNext()) {
                h.d.a(it2.next());
                throw null;
            }
        }
        if (i8 >= 29) {
            this.f832b.setAllowSystemGeneratedContextualActions(dVar.Q);
            this.f832b.setBubbleMetadata(f.c.a(null));
        }
        if (i8 >= 31 && (i4 = dVar.P) != 0) {
            this.f832b.setForegroundServiceBehavior(i4);
        }
        if (dVar.S) {
            if (this.f833c.f824x) {
                this.f838h = 2;
            } else {
                this.f838h = 1;
            }
            this.f832b.setVibrate(null);
            this.f832b.setSound(null);
            int i9 = notification.defaults & (-4);
            notification.defaults = i9;
            this.f832b.setDefaults(i9);
            if (i8 >= 26) {
                if (TextUtils.isEmpty(this.f833c.f823w)) {
                    this.f832b.setGroup("silent");
                }
                this.f832b.setGroupAlertBehavior(this.f838h);
            }
        }
    }

    private void b(f.a aVar) {
        IconCompat d4 = aVar.d();
        Notification.Action.Builder builder = new Notification.Action.Builder(d4 != null ? d4.j() : null, aVar.h(), aVar.a());
        if (aVar.e() != null) {
            for (RemoteInput remoteInput : a0.b(aVar.e())) {
                builder.addRemoteInput(remoteInput);
            }
        }
        Bundle bundle = aVar.c() != null ? new Bundle(aVar.c()) : new Bundle();
        bundle.putBoolean("android.support.allowGeneratedReplies", aVar.b());
        int i4 = Build.VERSION.SDK_INT;
        builder.setAllowGeneratedReplies(aVar.b());
        bundle.putInt("android.support.action.semanticAction", aVar.f());
        if (i4 >= 28) {
            builder.setSemanticAction(aVar.f());
        }
        if (i4 >= 29) {
            builder.setContextual(aVar.j());
        }
        if (i4 >= 31) {
            builder.setAuthenticationRequired(aVar.i());
        }
        bundle.putBoolean("android.support.action.showsUserInterface", aVar.g());
        builder.addExtras(bundle);
        this.f832b.addAction(builder.build());
    }

    private static List e(List list, List list2) {
        if (list == null) {
            return list2;
        }
        if (list2 == null) {
            return list;
        }
        k.b bVar = new k.b(list.size() + list2.size());
        bVar.addAll(list);
        bVar.addAll(list2);
        return new ArrayList(bVar);
    }

    private static List f(List list) {
        if (list == null) {
            return null;
        }
        ArrayList arrayList = new ArrayList(list.size());
        Iterator it = list.iterator();
        if (!it.hasNext()) {
            return arrayList;
        }
        h.d.a(it.next());
        throw null;
    }

    private void g(Notification notification) {
        notification.sound = null;
        notification.vibrate = null;
        notification.defaults &= -4;
    }

    @Override // androidx.core.app.e
    public Notification.Builder a() {
        return this.f832b;
    }

    public Notification c() {
        Bundle a4;
        RemoteViews f4;
        RemoteViews d4;
        f.e eVar = this.f833c.f816p;
        if (eVar != null) {
            eVar.b(this);
        }
        RemoteViews e4 = eVar != null ? eVar.e(this) : null;
        Notification d5 = d();
        if (e4 != null) {
            d5.contentView = e4;
        } else {
            RemoteViews remoteViews = this.f833c.H;
            if (remoteViews != null) {
                d5.contentView = remoteViews;
            }
        }
        if (eVar != null && (d4 = eVar.d(this)) != null) {
            d5.bigContentView = d4;
        }
        if (eVar != null && (f4 = this.f833c.f816p.f(this)) != null) {
            d5.headsUpContentView = f4;
        }
        if (eVar != null && (a4 = f.a(d5)) != null) {
            eVar.a(a4);
        }
        return d5;
    }

    protected Notification d() {
        if (Build.VERSION.SDK_INT >= 26) {
            return this.f832b.build();
        }
        Notification build = this.f832b.build();
        if (this.f838h != 0) {
            if (build.getGroup() != null && (build.flags & 512) != 0 && this.f838h == 2) {
                g(build);
            }
            if (build.getGroup() != null && (build.flags & 512) == 0 && this.f838h == 1) {
                g(build);
            }
        }
        return build;
    }
}
