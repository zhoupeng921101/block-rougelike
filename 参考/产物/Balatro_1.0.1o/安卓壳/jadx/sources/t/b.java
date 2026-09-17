package t;

import android.text.Editable;
import androidx.emoji2.text.n;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b extends Editable.Factory {

    /* renamed from: a, reason: collision with root package name */
    private static final Object f4965a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private static volatile Editable.Factory f4966b;

    /* renamed from: c, reason: collision with root package name */
    private static Class f4967c;

    private b() {
        try {
            f4967c = Class.forName("android.text.DynamicLayout$ChangeWatcher", false, b.class.getClassLoader());
        } catch (Throwable unused) {
        }
    }

    public static Editable.Factory getInstance() {
        if (f4966b == null) {
            synchronized (f4965a) {
                try {
                    if (f4966b == null) {
                        f4966b = new b();
                    }
                } finally {
                }
            }
        }
        return f4966b;
    }

    @Override // android.text.Editable.Factory
    public Editable newEditable(CharSequence charSequence) {
        Class cls = f4967c;
        return cls != null ? n.c(cls, charSequence) : super.newEditable(charSequence);
    }
}
