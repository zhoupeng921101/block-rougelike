package d1;

import a1.b2.c3;
import android.app.PendingIntent;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import h1.o;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends i1.a {

    /* renamed from: e, reason: collision with root package name */
    final int f3080e;

    /* renamed from: f, reason: collision with root package name */
    private final int f3081f;

    /* renamed from: g, reason: collision with root package name */
    private final PendingIntent f3082g;

    /* renamed from: h, reason: collision with root package name */
    private final String f3083h;

    /* renamed from: i, reason: collision with root package name */
    private final Integer f3084i;

    /* renamed from: j, reason: collision with root package name */
    public static final a f3079j = new a(0);
    public static final Parcelable.Creator<a> CREATOR = new t();

    public a(int i4) {
        this(i4, null, null);
    }

    a(int i4, int i5, PendingIntent pendingIntent, String str, Integer num) {
        this.f3080e = i4;
        this.f3081f = i5;
        this.f3082g = pendingIntent;
        this.f3083h = str;
        this.f3084i = num;
    }

    public a(int i4, PendingIntent pendingIntent) {
        this(i4, pendingIntent, null);
    }

    public a(int i4, PendingIntent pendingIntent, String str) {
        this(1, i4, pendingIntent, str, null);
    }

    static String n0(int i4) {
        if (i4 == 99) {
            return "UNFINISHED";
        }
        if (i4 == 1500) {
            return "DRIVE_EXTERNAL_STORAGE_REQUIRED";
        }
        switch (i4) {
            case -1:
                return "UNKNOWN";
            case 0:
                return c3.d4(579);
            case BuildConfig.VERSION_CODE /* 1 */:
                return c3.d4(254);
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                return "SERVICE_VERSION_UPDATE_REQUIRED";
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                return "SERVICE_DISABLED";
            case 4:
                return "SIGN_IN_REQUIRED";
            case 5:
                return "INVALID_ACCOUNT";
            case 6:
                return "RESOLUTION_REQUIRED";
            case 7:
                return "NETWORK_ERROR";
            case 8:
                return "INTERNAL_ERROR";
            case 9:
                return "SERVICE_INVALID";
            case 10:
                return "DEVELOPER_ERROR";
            case 11:
                return "LICENSE_CHECK_FAILED";
            default:
                switch (i4) {
                    case 13:
                        return c3.d4(1374);
                    case 14:
                        return "TIMEOUT";
                    case 15:
                        return "INTERRUPTED";
                    case 16:
                        return "API_UNAVAILABLE";
                    case 17:
                        return "SIGN_IN_FAILED";
                    case 18:
                        return "SERVICE_UPDATING";
                    case 19:
                        return "SERVICE_MISSING_PERMISSION";
                    case 20:
                        return "RESTRICTED_PROFILE";
                    case 21:
                        return "API_VERSION_UPDATE_REQUIRED";
                    case 22:
                        return "RESOLUTION_ACTIVITY_NOT_FOUND";
                    case 23:
                        return "API_DISABLED";
                    case 24:
                        return c3.d4(1459);
                    case 25:
                        return c3.d4(291);
                    default:
                        StringBuilder sb = new StringBuilder(String.valueOf(i4).length() + 20);
                        sb.append("UNKNOWN_ERROR_CODE(");
                        sb.append(i4);
                        sb.append(")");
                        return sb.toString();
                }
        }
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof a)) {
            return false;
        }
        a aVar = (a) obj;
        return this.f3081f == aVar.f3081f && h1.o.a(this.f3082g, aVar.f3082g) && h1.o.a(this.f3083h, aVar.f3083h) && h1.o.a(this.f3084i, aVar.f3084i);
    }

    public Integer h0() {
        return this.f3084i;
    }

    public int hashCode() {
        return h1.o.b(Integer.valueOf(this.f3081f), this.f3082g, this.f3083h, this.f3084i);
    }

    public int i0() {
        return this.f3081f;
    }

    public String j0() {
        return this.f3083h;
    }

    public PendingIntent k0() {
        return this.f3082g;
    }

    public boolean l0() {
        return (this.f3081f == 0 || this.f3082g == null) ? false : true;
    }

    public boolean m0() {
        return this.f3081f == 0;
    }

    public String toString() {
        o.a c4 = h1.o.c(this);
        c4.a(c3.d4(1460), n0(this.f3081f));
        c4.a("resolution", this.f3082g);
        c4.a(c3.d4(630), this.f3083h);
        c4.a("clientMethodKey", this.f3084i);
        return c4.toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int i5 = this.f3080e;
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, i5);
        i1.c.i(parcel, 2, i0());
        i1.c.n(parcel, 3, k0(), i4, false);
        i1.c.o(parcel, 4, j0(), false);
        i1.c.k(parcel, 5, h0(), false);
        i1.c.b(parcel, a4);
    }
}
