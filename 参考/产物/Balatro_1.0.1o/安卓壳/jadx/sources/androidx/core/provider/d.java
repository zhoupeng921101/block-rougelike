package androidx.core.provider;

import a1.b2.c3;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.ProviderInfo;
import android.content.pm.Signature;
import android.content.res.Resources;
import android.database.Cursor;
import android.net.Uri;
import android.os.CancellationSignal;
import androidx.core.provider.g;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class d {

    /* renamed from: a, reason: collision with root package name */
    private static final Comparator f958a = new Comparator() { // from class: androidx.core.provider.c
        @Override // java.util.Comparator
        public final int compare(Object obj, Object obj2) {
            return d.a((byte[]) obj, (byte[]) obj2);
        }
    };

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static Cursor a(ContentResolver contentResolver, Uri uri, String[] strArr, String str, String[] strArr2, String str2, Object obj) {
            return contentResolver.query(uri, strArr, str, strArr2, str2, (CancellationSignal) obj);
        }
    }

    public static /* synthetic */ int a(byte[] bArr, byte[] bArr2) {
        if (bArr.length != bArr2.length) {
            return bArr.length - bArr2.length;
        }
        for (int i4 = 0; i4 < bArr.length; i4++) {
            byte b4 = bArr[i4];
            byte b5 = bArr2[i4];
            if (b4 != b5) {
                return b4 - b5;
            }
        }
        return 0;
    }

    private static List b(Signature[] signatureArr) {
        ArrayList arrayList = new ArrayList();
        for (Signature signature : signatureArr) {
            arrayList.add(signature.toByteArray());
        }
        return arrayList;
    }

    private static boolean c(List list, List list2) {
        if (list.size() != list2.size()) {
            return false;
        }
        for (int i4 = 0; i4 < list.size(); i4++) {
            if (!Arrays.equals((byte[]) list.get(i4), (byte[]) list2.get(i4))) {
                return false;
            }
        }
        return true;
    }

    private static List d(e eVar, Resources resources) {
        return eVar.b() != null ? eVar.b() : androidx.core.content.res.d.c(resources, eVar.c());
    }

    static g.a e(Context context, e eVar, CancellationSignal cancellationSignal) {
        ProviderInfo f4 = f(context.getPackageManager(), eVar, context.getResources());
        return f4 == null ? g.a.a(1, null) : g.a.a(0, g(context, eVar, f4.authority, cancellationSignal));
    }

    static ProviderInfo f(PackageManager packageManager, e eVar, Resources resources) {
        String e4 = eVar.e();
        ProviderInfo resolveContentProvider = packageManager.resolveContentProvider(e4, 0);
        if (resolveContentProvider == null) {
            throw new PackageManager.NameNotFoundException("No package found for authority: " + e4);
        }
        if (!resolveContentProvider.packageName.equals(eVar.f())) {
            throw new PackageManager.NameNotFoundException(c3.d4(1209) + e4 + c3.d4(552) + eVar.f());
        }
        List b4 = b(packageManager.getPackageInfo(resolveContentProvider.packageName, 64).signatures);
        Collections.sort(b4, f958a);
        List d4 = d(eVar, resources);
        for (int i4 = 0; i4 < d4.size(); i4++) {
            ArrayList arrayList = new ArrayList((Collection) d4.get(i4));
            Collections.sort(arrayList, f958a);
            if (c(b4, arrayList)) {
                return resolveContentProvider;
            }
        }
        return null;
    }

    static g.b[] g(Context context, e eVar, String str, CancellationSignal cancellationSignal) {
        boolean z3;
        ArrayList arrayList = new ArrayList();
        Uri build = new Uri.Builder().scheme("content").authority(str).build();
        Uri build2 = new Uri.Builder().scheme("content").authority(str).appendPath("file").build();
        Cursor cursor = null;
        try {
            cursor = a.a(context.getContentResolver(), build, new String[]{"_id", "file_id", "font_ttc_index", "font_variation_settings", "font_weight", "font_italic", "result_code"}, "query = ?", new String[]{eVar.g()}, null, cancellationSignal);
            if (cursor != null && cursor.getCount() > 0) {
                int columnIndex = cursor.getColumnIndex("result_code");
                ArrayList arrayList2 = new ArrayList();
                int columnIndex2 = cursor.getColumnIndex("_id");
                int columnIndex3 = cursor.getColumnIndex("file_id");
                int columnIndex4 = cursor.getColumnIndex("font_ttc_index");
                int columnIndex5 = cursor.getColumnIndex("font_weight");
                int columnIndex6 = cursor.getColumnIndex("font_italic");
                while (cursor.moveToNext()) {
                    int i4 = columnIndex != -1 ? cursor.getInt(columnIndex) : 0;
                    int i5 = columnIndex4 != -1 ? cursor.getInt(columnIndex4) : 0;
                    Uri withAppendedId = columnIndex3 == -1 ? ContentUris.withAppendedId(build, cursor.getLong(columnIndex2)) : ContentUris.withAppendedId(build2, cursor.getLong(columnIndex3));
                    int i6 = columnIndex5 != -1 ? cursor.getInt(columnIndex5) : 400;
                    if (columnIndex6 != -1) {
                        z3 = true;
                        if (cursor.getInt(columnIndex6) == 1) {
                            arrayList2.add(g.b.a(withAppendedId, i5, i6, z3, i4));
                        }
                    }
                    z3 = false;
                    arrayList2.add(g.b.a(withAppendedId, i5, i6, z3, i4));
                }
                arrayList = arrayList2;
            }
            if (cursor != null) {
                cursor.close();
            }
            return (g.b[]) arrayList.toArray(new g.b[0]);
        } catch (Throwable th) {
            if (cursor != null) {
                cursor.close();
            }
            throw th;
        }
    }
}
