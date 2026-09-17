package com.google.android.gms.games.internal.v2.appshortcuts;

import android.content.Context;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.os.PersistableBundle;
import c2.b2;
import c2.h1;
import c2.s1;
import c2.v1;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e extends f {

    /* renamed from: a, reason: collision with root package name */
    public final Context f2683a;

    public e(Context context) {
        super(null);
        this.f2683a = context.getApplicationContext();
    }

    public static /* synthetic */ g d(v1 v1Var, v1 v1Var2, g2.h hVar) {
        return hVar.q() ? (g) hVar.n() : e(v1Var, v1Var2);
    }

    public static g e(v1 v1Var, v1 v1Var2) {
        return new g(f(v1Var), v1.i(), f(v1Var2), v1.i());
    }

    public static v1 f(v1 v1Var) {
        int i4 = v1.f2186g;
        s1 s1Var = new s1();
        int size = v1Var.size();
        for (int i5 = 0; i5 < size; i5++) {
            String a4 = ((i) v1Var.get(i5)).a();
            if (a4 != null) {
                s1Var.b(a4);
            }
        }
        return s1Var.c();
    }

    public static v1 g(List list) {
        boolean isImmutable;
        String id;
        String id2;
        PersistableBundle extras;
        boolean isPinned;
        boolean isEnabled;
        int i4 = v1.f2186g;
        s1 s1Var = new s1();
        Iterator it = list.iterator();
        while (it.hasNext()) {
            ShortcutInfo a4 = s1.i.a(it.next());
            isImmutable = a4.isImmutable();
            if (!isImmutable) {
                id = a4.getId();
                if (id.startsWith("PLAY_GAMES_SERVICES_")) {
                    id2 = a4.getId();
                    extras = a4.getExtras();
                    isPinned = a4.isPinned();
                    Boolean valueOf = Boolean.valueOf(isPinned);
                    isEnabled = a4.isEnabled();
                    s1Var.b(new i(id2, extras, valueOf, Boolean.valueOf(isEnabled)));
                }
            }
        }
        return s1Var.c();
    }

    @Override // com.google.android.gms.games.internal.v2.appshortcuts.f
    public final void a() {
        h1.a();
        new Thread(new Runnable() { // from class: com.google.android.gms.games.internal.v2.appshortcuts.d
            @Override // java.lang.Runnable
            public final /* synthetic */ void run() {
                e.this.c();
            }
        }, "initialize-shortcuts").start();
    }

    final /* synthetic */ void c() {
        List dynamicShortcuts;
        List pinnedShortcuts;
        g2.h b4;
        Context context = this.f2683a;
        final ShortcutManager a4 = s1.f.a(context.getSystemService(s1.e.a()));
        if (a4 == null) {
            return;
        }
        final s1.p a5 = s1.r.a(context, PlayGamesAppShortcutsActivity.class);
        dynamicShortcuts = a4.getDynamicShortcuts();
        final v1 g4 = g(dynamicShortcuts);
        pinnedShortcuts = a4.getPinnedShortcuts();
        final v1 g5 = g(pinnedShortcuts);
        if (a5 == null || a5.h0() <= 0) {
            b4 = g2.k.b(e(g4, g5));
        } else {
            final q qVar = new q(context);
            b4 = qVar.g(f1.q.a().e(6744).d(p1.t.f4634g).c(false).b(new f1.m() { // from class: com.google.android.gms.games.internal.v2.appshortcuts.p
                @Override // f1.m
                public final /* synthetic */ void accept(Object obj, Object obj2) {
                    ((s) ((r) obj).C()).m0(new l(q.this, (g2.i) obj2), a5, g4, g5);
                }
            }).a()).j(b2.a(), new g2.a() { // from class: com.google.android.gms.games.internal.v2.appshortcuts.c
                @Override // g2.a
                public final /* synthetic */ Object a(g2.h hVar) {
                    return e.d(v1.this, g5, hVar);
                }
            });
        }
        b4.h(b2.a(), new g2.f() { // from class: com.google.android.gms.games.internal.v2.appshortcuts.b
            @Override // g2.f
            public final /* synthetic */ void b(Object obj) {
                g gVar = (g) obj;
                List h02 = gVar.h0();
                ShortcutManager shortcutManager = a4;
                if (h02 != null && !h02.isEmpty()) {
                    shortcutManager.removeDynamicShortcuts(h02);
                }
                List i02 = gVar.i0();
                if (i02 != null && !i02.isEmpty()) {
                    shortcutManager.addDynamicShortcuts(i02);
                }
                List j02 = gVar.j0();
                if (j02 != null && !j02.isEmpty()) {
                    shortcutManager.disableShortcuts(j02);
                }
                List k02 = gVar.k0();
                if (k02 == null || k02.isEmpty()) {
                    return;
                }
                shortcutManager.enableShortcuts(k02);
            }
        });
    }
}
