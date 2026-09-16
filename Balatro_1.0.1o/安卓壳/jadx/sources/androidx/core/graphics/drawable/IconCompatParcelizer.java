package androidx.core.graphics.drawable;

import android.content.res.ColorStateList;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class IconCompatParcelizer {
    public static IconCompat read(androidx.versionedparcelable.a aVar) {
        IconCompat iconCompat = new IconCompat();
        iconCompat.f901a = aVar.p(iconCompat.f901a, 1);
        iconCompat.f903c = aVar.j(iconCompat.f903c, 2);
        iconCompat.f904d = aVar.r(iconCompat.f904d, 3);
        iconCompat.f905e = aVar.p(iconCompat.f905e, 4);
        iconCompat.f906f = aVar.p(iconCompat.f906f, 5);
        iconCompat.f907g = (ColorStateList) aVar.r(iconCompat.f907g, 6);
        iconCompat.f909i = aVar.t(iconCompat.f909i, 7);
        iconCompat.f910j = aVar.t(iconCompat.f910j, 8);
        iconCompat.h();
        return iconCompat;
    }

    public static void write(IconCompat iconCompat, androidx.versionedparcelable.a aVar) {
        aVar.x(true, true);
        iconCompat.i(aVar.f());
        int i4 = iconCompat.f901a;
        if (-1 != i4) {
            aVar.F(i4, 1);
        }
        byte[] bArr = iconCompat.f903c;
        if (bArr != null) {
            aVar.B(bArr, 2);
        }
        Parcelable parcelable = iconCompat.f904d;
        if (parcelable != null) {
            aVar.H(parcelable, 3);
        }
        int i5 = iconCompat.f905e;
        if (i5 != 0) {
            aVar.F(i5, 4);
        }
        int i6 = iconCompat.f906f;
        if (i6 != 0) {
            aVar.F(i6, 5);
        }
        ColorStateList colorStateList = iconCompat.f907g;
        if (colorStateList != null) {
            aVar.H(colorStateList, 6);
        }
        String str = iconCompat.f909i;
        if (str != null) {
            aVar.J(str, 7);
        }
        String str2 = iconCompat.f910j;
        if (str2 != null) {
            aVar.J(str2, 8);
        }
    }
}
