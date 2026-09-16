package com.google.android.gms.games.internal.v2.appshortcuts;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Looper;
import androidx.appcompat.view.menu.rB.euGzLyxkGo;
import c2.i1;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class PlayGamesAppShortcutsActivity extends Activity {

    /* renamed from: a, reason: collision with root package name */
    public Intent f2678a;

    public abstract class c2020060317 extends Activity {
        /* JADX WARN: Removed duplicated region for block: B:38:0x0084 A[SYNTHETIC] */
        /* JADX WARN: Removed duplicated region for block: B:42:0x0052 A[SYNTHETIC] */
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        public static final void onCreate(final com.google.android.gms.games.internal.v2.appshortcuts.PlayGamesAppShortcutsActivity r10, android.os.Bundle r11) {
            /*
                Method dump skipped, instructions count: 295
                To view this dump add '--comments-level debug' option
            */
            throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.games.internal.v2.appshortcuts.PlayGamesAppShortcutsActivity.c2020060317.onCreate(com.google.android.gms.games.internal.v2.appshortcuts.PlayGamesAppShortcutsActivity, android.os.Bundle):void");
        }
    }

    final /* synthetic */ void a() {
        startActivityForResult(this.f2678a, 1005000001);
        finish();
        System.exit(0);
    }

    @Override // android.app.Activity
    protected final void onActivityResult(int i4, int i5, Intent intent) {
        super.onActivityResult(i4, i5, intent);
        if (i4 != 1005000000) {
            return;
        }
        if (i5 != -1) {
            finish();
        } else {
            new i1(Looper.getMainLooper()).postDelayed(new Runnable() { // from class: com.google.android.gms.games.internal.v2.appshortcuts.t
                @Override // java.lang.Runnable
                public final /* synthetic */ void run() {
                    PlayGamesAppShortcutsActivity.this.a();
                }
            }, 50L);
        }
    }

    @Override // android.app.Activity
    protected final void onCreate(Bundle bundle) {
        euGzLyxkGo.AOAPqb.invoke(null, this, bundle);
    }
}
