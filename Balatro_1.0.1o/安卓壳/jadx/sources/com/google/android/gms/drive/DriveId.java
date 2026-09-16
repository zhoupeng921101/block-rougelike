package com.google.android.gms.drive;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.internal.ReflectedParcelable;
import h1.q;
import i1.a;
import n1.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
@Deprecated
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class DriveId extends a implements ReflectedParcelable {
    public static final Parcelable.Creator<DriveId> CREATOR = new c();

    /* renamed from: e, reason: collision with root package name */
    final String f2617e;

    /* renamed from: f, reason: collision with root package name */
    final long f2618f;

    /* renamed from: g, reason: collision with root package name */
    final long f2619g;

    /* renamed from: h, reason: collision with root package name */
    final int f2620h;

    /* renamed from: i, reason: collision with root package name */
    volatile String f2621i = null;

    public DriveId(String str, long j4, long j5, int i4) {
        this.f2617e = str;
        boolean z3 = true;
        q.a(!"".equals(str));
        if (str == null && j4 == -1) {
            z3 = false;
            j4 = -1;
        }
        q.a(z3);
        this.f2618f = j4;
        this.f2619g = j5;
        this.f2620h = i4;
    }

    public final boolean equals(Object obj) {
        String str;
        if (obj != null && obj.getClass() == DriveId.class) {
            DriveId driveId = (DriveId) obj;
            if (driveId.f2619g != this.f2619g) {
                return false;
            }
            long j4 = driveId.f2618f;
            if (j4 == -1) {
                if (this.f2618f == -1) {
                    return ((String) q.i(driveId.f2617e)).equals(this.f2617e);
                }
                j4 = -1;
            }
            String str2 = this.f2617e;
            if (str2 != null && (str = driveId.f2617e) != null) {
                return j4 == this.f2618f && str.equals(str2);
            }
            if (j4 == this.f2618f) {
                return true;
            }
        }
        return false;
    }

    public final int hashCode() {
        long j4 = this.f2618f;
        if (j4 == -1) {
            String str = this.f2617e;
            q.i(str);
            return str.hashCode();
        }
        long j5 = this.f2619g;
        String valueOf = String.valueOf(j4);
        StringBuilder sb = new StringBuilder(String.valueOf(j5).length() + String.valueOf(valueOf).length());
        sb.append(j5);
        sb.append(valueOf);
        return sb.toString().hashCode();
    }

    public final String toString() {
        return super.toString();
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String str = this.f2617e;
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 2, str, false);
        i1.c.l(parcel, 3, this.f2618f);
        i1.c.l(parcel, 4, this.f2619g);
        i1.c.i(parcel, 5, this.f2620h);
        i1.c.b(parcel, a4);
    }
}
