package androidx.core.app;

import android.app.NotificationManager;
import android.content.Context;
import java.util.HashSet;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class w {

    /* renamed from: c, reason: collision with root package name */
    private static final Object f842c = new Object();

    /* renamed from: d, reason: collision with root package name */
    private static Set f843d = new HashSet();

    /* renamed from: e, reason: collision with root package name */
    private static final Object f844e = new Object();

    /* renamed from: a, reason: collision with root package name */
    private final Context f845a;

    /* renamed from: b, reason: collision with root package name */
    private final NotificationManager f846b;

    private w(Context context) {
        this.f845a = context;
        this.f846b = (NotificationManager) context.getSystemService("notification");
    }

    public static w b(Context context) {
        return new w(context);
    }

    public boolean a() {
        return this.f846b.areNotificationsEnabled();
    }
}
