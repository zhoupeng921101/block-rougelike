package androidx.lifecycle;

import androidx.lifecycle.g;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class FullLifecycleObserverAdapter implements i {

    /* renamed from: a, reason: collision with root package name */
    private final d f1621a;

    /* renamed from: b, reason: collision with root package name */
    private final i f1622b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class a {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f1623a;

        static {
            int[] iArr = new int[g.b.values().length];
            f1623a = iArr;
            try {
                iArr[g.b.ON_CREATE.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f1623a[g.b.ON_START.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f1623a[g.b.ON_RESUME.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                f1623a[g.b.ON_PAUSE.ordinal()] = 4;
            } catch (NoSuchFieldError unused4) {
            }
            try {
                f1623a[g.b.ON_STOP.ordinal()] = 5;
            } catch (NoSuchFieldError unused5) {
            }
            try {
                f1623a[g.b.ON_DESTROY.ordinal()] = 6;
            } catch (NoSuchFieldError unused6) {
            }
            try {
                f1623a[g.b.ON_ANY.ordinal()] = 7;
            } catch (NoSuchFieldError unused7) {
            }
        }
    }

    FullLifecycleObserverAdapter(d dVar, i iVar) {
        this.f1621a = dVar;
        this.f1622b = iVar;
    }

    @Override // androidx.lifecycle.i
    public void g(k kVar, g.b bVar) {
        switch (a.f1623a[bVar.ordinal()]) {
            case BuildConfig.VERSION_CODE /* 1 */:
                this.f1621a.b(kVar);
                break;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                this.f1621a.d(kVar);
                break;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                this.f1621a.f(kVar);
                break;
            case 4:
                this.f1621a.c(kVar);
                break;
            case 5:
                this.f1621a.e(kVar);
                break;
            case 6:
                this.f1621a.a(kVar);
                break;
            case 7:
                throw new IllegalArgumentException("ON_ANY must not been send by anybody");
        }
        i iVar = this.f1622b;
        if (iVar != null) {
            iVar.g(kVar, bVar);
        }
    }
}
