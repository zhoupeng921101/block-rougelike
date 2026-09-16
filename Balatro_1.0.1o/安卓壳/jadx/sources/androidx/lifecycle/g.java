package androidx.lifecycle;

import com.android.support.BuildConfig;
import java.util.concurrent.atomic.AtomicReference;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g {

    /* renamed from: a, reason: collision with root package name */
    AtomicReference f1658a = new AtomicReference();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class a {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f1659a;

        /* renamed from: b, reason: collision with root package name */
        static final /* synthetic */ int[] f1660b;

        static {
            int[] iArr = new int[b.values().length];
            f1660b = iArr;
            try {
                iArr[b.ON_CREATE.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f1660b[b.ON_STOP.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f1660b[b.ON_START.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                f1660b[b.ON_PAUSE.ordinal()] = 4;
            } catch (NoSuchFieldError unused4) {
            }
            try {
                f1660b[b.ON_RESUME.ordinal()] = 5;
            } catch (NoSuchFieldError unused5) {
            }
            try {
                f1660b[b.ON_DESTROY.ordinal()] = 6;
            } catch (NoSuchFieldError unused6) {
            }
            try {
                f1660b[b.ON_ANY.ordinal()] = 7;
            } catch (NoSuchFieldError unused7) {
            }
            int[] iArr2 = new int[c.values().length];
            f1659a = iArr2;
            try {
                iArr2[c.CREATED.ordinal()] = 1;
            } catch (NoSuchFieldError unused8) {
            }
            try {
                f1659a[c.STARTED.ordinal()] = 2;
            } catch (NoSuchFieldError unused9) {
            }
            try {
                f1659a[c.RESUMED.ordinal()] = 3;
            } catch (NoSuchFieldError unused10) {
            }
            try {
                f1659a[c.f1661e.ordinal()] = 4;
            } catch (NoSuchFieldError unused11) {
            }
            try {
                f1659a[c.INITIALIZED.ordinal()] = 5;
            } catch (NoSuchFieldError unused12) {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum b {
        ON_CREATE,
        ON_START,
        ON_RESUME,
        ON_PAUSE,
        ON_STOP,
        ON_DESTROY,
        ON_ANY;

        public static b a(c cVar) {
            int i4 = a.f1659a[cVar.ordinal()];
            if (i4 == 1) {
                return ON_DESTROY;
            }
            if (i4 == 2) {
                return ON_STOP;
            }
            if (i4 != 3) {
                return null;
            }
            return ON_PAUSE;
        }

        public static b c(c cVar) {
            int i4 = a.f1659a[cVar.ordinal()];
            if (i4 == 1) {
                return ON_START;
            }
            if (i4 == 2) {
                return ON_RESUME;
            }
            if (i4 != 5) {
                return null;
            }
            return ON_CREATE;
        }

        public c b() {
            switch (a.f1660b[ordinal()]) {
                case BuildConfig.VERSION_CODE /* 1 */:
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    return c.CREATED;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                case 4:
                    return c.STARTED;
                case 5:
                    return c.RESUMED;
                case 6:
                    return c.f1661e;
                default:
                    throw new IllegalArgumentException(this + " has no target state");
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum c {
        f1661e,
        INITIALIZED,
        CREATED,
        STARTED,
        RESUMED;

        public boolean a(c cVar) {
            return compareTo(cVar) >= 0;
        }
    }

    public abstract void a(j jVar);

    public abstract c b();

    public abstract void c(j jVar);
}
