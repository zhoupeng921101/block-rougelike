package p;

import android.os.Build;
import android.os.Bundle;
import android.text.SpannableStringBuilder;
import android.text.TextUtils;
import android.view.inputmethod.EditorInfo;
import androidx.core.util.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: a, reason: collision with root package name */
    private static final String[] f4603a = new String[0];

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: p.a$a, reason: collision with other inner class name */
    private static class C0072a {
        static void a(EditorInfo editorInfo, CharSequence charSequence, int i4) {
            editorInfo.setInitialSurroundingSubText(charSequence, i4);
        }
    }

    private static boolean a(CharSequence charSequence, int i4, int i5) {
        if (i5 == 0) {
            return Character.isLowSurrogate(charSequence.charAt(i4));
        }
        if (i5 != 1) {
            return false;
        }
        return Character.isHighSurrogate(charSequence.charAt(i4));
    }

    private static boolean b(int i4) {
        int i5 = i4 & 4095;
        return i5 == 129 || i5 == 225 || i5 == 18;
    }

    public static void c(EditorInfo editorInfo, CharSequence charSequence, int i4) {
        c.d(charSequence);
        if (Build.VERSION.SDK_INT >= 30) {
            C0072a.a(editorInfo, charSequence, i4);
            return;
        }
        int i5 = editorInfo.initialSelStart;
        int i6 = editorInfo.initialSelEnd;
        int i7 = i5 > i6 ? i6 - i4 : i5 - i4;
        int i8 = i5 > i6 ? i5 - i4 : i6 - i4;
        int length = charSequence.length();
        if (i4 < 0 || i7 < 0 || i8 > length) {
            e(editorInfo, null, 0, 0);
            return;
        }
        if (b(editorInfo.inputType)) {
            e(editorInfo, null, 0, 0);
        } else if (length <= 2048) {
            e(editorInfo, charSequence, i7, i8);
        } else {
            f(editorInfo, charSequence, i7, i8);
        }
    }

    public static void d(EditorInfo editorInfo, CharSequence charSequence) {
        if (Build.VERSION.SDK_INT >= 30) {
            C0072a.a(editorInfo, charSequence, 0);
        } else {
            c(editorInfo, charSequence, 0);
        }
    }

    private static void e(EditorInfo editorInfo, CharSequence charSequence, int i4, int i5) {
        if (editorInfo.extras == null) {
            editorInfo.extras = new Bundle();
        }
        editorInfo.extras.putCharSequence("androidx.core.view.inputmethod.EditorInfoCompat.CONTENT_SURROUNDING_TEXT", charSequence != null ? new SpannableStringBuilder(charSequence) : null);
        editorInfo.extras.putInt("androidx.core.view.inputmethod.EditorInfoCompat.CONTENT_SELECTION_HEAD", i4);
        editorInfo.extras.putInt("androidx.core.view.inputmethod.EditorInfoCompat.CONTENT_SELECTION_END", i5);
    }

    private static void f(EditorInfo editorInfo, CharSequence charSequence, int i4, int i5) {
        int i6 = i5 - i4;
        int i7 = i6 > 1024 ? 0 : i6;
        int i8 = 2048 - i7;
        int min = Math.min(charSequence.length() - i5, i8 - Math.min(i4, (int) (i8 * 0.8d)));
        int min2 = Math.min(i4, i8 - min);
        int i9 = i4 - min2;
        if (a(charSequence, i9, 0)) {
            i9++;
            min2--;
        }
        if (a(charSequence, (i5 + min) - 1, 1)) {
            min--;
        }
        e(editorInfo, i7 != i6 ? TextUtils.concat(charSequence.subSequence(i9, i9 + min2), charSequence.subSequence(i5, min + i5)) : charSequence.subSequence(i9, min2 + i7 + min + i9), min2, i7 + min2);
    }
}
