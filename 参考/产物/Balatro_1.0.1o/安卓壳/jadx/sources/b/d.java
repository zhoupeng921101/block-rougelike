package b;

import a1.b2.c3;
import android.content.Context;
import android.content.Intent;
import androidx.activity.result.e;
import b3.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends b.a {

    /* renamed from: a, reason: collision with root package name */
    public static final a f1774a = new a(null);

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
    public Intent a(Context context, e eVar) {
        f.e(context, "context");
        f.e(eVar, c3.d4(281));
        Intent putExtra = new Intent("androidx.activity.result.contract.action.INTENT_SENDER_REQUEST").putExtra("androidx.activity.result.contract.extra.INTENT_SENDER_REQUEST", eVar);
        f.d(putExtra, "Intent(ACTION_INTENT_SEN…NT_SENDER_REQUEST, input)");
        return putExtra;
    }

    @Override // b.a
    /* renamed from: e, reason: merged with bridge method [inline-methods] */
    public androidx.activity.result.a c(int i4, Intent intent) {
        return new androidx.activity.result.a(i4, intent);
    }
}
