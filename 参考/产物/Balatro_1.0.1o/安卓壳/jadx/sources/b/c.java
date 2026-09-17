package b;

import android.content.Context;
import android.content.Intent;
import b3.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c extends b.a {

    /* renamed from: a, reason: collision with root package name */
    public static final a f1773a = new a(null);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }
    }

    @Override // b.a
    /* renamed from: d, reason: merged with bridge method [inline-methods] */
    public Intent a(Context context, Intent intent) {
        f.e(context, "context");
        f.e(intent, "input");
        return intent;
    }

    @Override // b.a
    /* renamed from: e, reason: merged with bridge method [inline-methods] */
    public androidx.activity.result.a c(int i4, Intent intent) {
        return new androidx.activity.result.a(i4, intent);
    }
}
