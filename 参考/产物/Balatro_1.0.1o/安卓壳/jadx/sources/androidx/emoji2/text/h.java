package androidx.emoji2.text;

import android.text.Editable;
import android.text.Selection;
import android.text.Spannable;
import android.text.method.MetaKeyKeyListener;
import android.view.KeyEvent;
import android.view.inputmethod.InputConnection;
import androidx.emoji2.text.e;
import androidx.emoji2.text.m;
import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h {

    /* renamed from: a, reason: collision with root package name */
    private final e.i f1218a;

    /* renamed from: b, reason: collision with root package name */
    private final m f1219b;

    /* renamed from: c, reason: collision with root package name */
    private e.d f1220c;

    /* renamed from: d, reason: collision with root package name */
    private final boolean f1221d;

    /* renamed from: e, reason: collision with root package name */
    private final int[] f1222e;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class a {
        static int a(CharSequence charSequence, int i4, int i5) {
            int length = charSequence.length();
            if (i4 < 0 || length < i4 || i5 < 0) {
                return -1;
            }
            while (true) {
                boolean z3 = false;
                while (i5 != 0) {
                    i4--;
                    if (i4 < 0) {
                        return z3 ? -1 : 0;
                    }
                    char charAt = charSequence.charAt(i4);
                    if (z3) {
                        if (!Character.isHighSurrogate(charAt)) {
                            return -1;
                        }
                        i5--;
                    } else if (!Character.isSurrogate(charAt)) {
                        i5--;
                    } else {
                        if (Character.isHighSurrogate(charAt)) {
                            return -1;
                        }
                        z3 = true;
                    }
                }
                return i4;
            }
        }

        static int b(CharSequence charSequence, int i4, int i5) {
            int length = charSequence.length();
            if (i4 < 0 || length < i4 || i5 < 0) {
                return -1;
            }
            while (true) {
                boolean z3 = false;
                while (i5 != 0) {
                    if (i4 >= length) {
                        if (z3) {
                            return -1;
                        }
                        return length;
                    }
                    char charAt = charSequence.charAt(i4);
                    if (z3) {
                        if (!Character.isLowSurrogate(charAt)) {
                            return -1;
                        }
                        i5--;
                        i4++;
                    } else if (!Character.isSurrogate(charAt)) {
                        i5--;
                        i4++;
                    } else {
                        if (Character.isLowSurrogate(charAt)) {
                            return -1;
                        }
                        i4++;
                        z3 = true;
                    }
                }
                return i4;
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b {

        /* renamed from: a, reason: collision with root package name */
        private int f1223a = 1;

        /* renamed from: b, reason: collision with root package name */
        private final m.a f1224b;

        /* renamed from: c, reason: collision with root package name */
        private m.a f1225c;

        /* renamed from: d, reason: collision with root package name */
        private m.a f1226d;

        /* renamed from: e, reason: collision with root package name */
        private int f1227e;

        /* renamed from: f, reason: collision with root package name */
        private int f1228f;

        /* renamed from: g, reason: collision with root package name */
        private final boolean f1229g;

        /* renamed from: h, reason: collision with root package name */
        private final int[] f1230h;

        b(m.a aVar, boolean z3, int[] iArr) {
            this.f1224b = aVar;
            this.f1225c = aVar;
            this.f1229g = z3;
            this.f1230h = iArr;
        }

        private static boolean d(int i4) {
            return i4 == 65039;
        }

        private static boolean f(int i4) {
            return i4 == 65038;
        }

        private int g() {
            this.f1223a = 1;
            this.f1225c = this.f1224b;
            this.f1228f = 0;
            return 1;
        }

        private boolean h() {
            if (this.f1225c.b().j() || d(this.f1227e)) {
                return true;
            }
            if (this.f1229g) {
                if (this.f1230h == null) {
                    return true;
                }
                if (Arrays.binarySearch(this.f1230h, this.f1225c.b().b(0)) < 0) {
                    return true;
                }
            }
            return false;
        }

        int a(int i4) {
            m.a a4 = this.f1225c.a(i4);
            int i5 = 2;
            if (this.f1223a != 2) {
                if (a4 == null) {
                    i5 = g();
                } else {
                    this.f1223a = 2;
                    this.f1225c = a4;
                    this.f1228f = 1;
                }
            } else if (a4 != null) {
                this.f1225c = a4;
                this.f1228f++;
            } else if (f(i4)) {
                i5 = g();
            } else if (!d(i4)) {
                if (this.f1225c.b() != null) {
                    i5 = 3;
                    if (this.f1228f != 1) {
                        this.f1226d = this.f1225c;
                        g();
                    } else if (h()) {
                        this.f1226d = this.f1225c;
                        g();
                    } else {
                        i5 = g();
                    }
                } else {
                    i5 = g();
                }
            }
            this.f1227e = i4;
            return i5;
        }

        g b() {
            return this.f1225c.b();
        }

        g c() {
            return this.f1226d.b();
        }

        boolean e() {
            if (this.f1223a != 2 || this.f1225c.b() == null) {
                return false;
            }
            return this.f1228f > 1 || h();
        }
    }

    h(m mVar, e.i iVar, e.d dVar, boolean z3, int[] iArr) {
        this.f1218a = iVar;
        this.f1219b = mVar;
        this.f1220c = dVar;
        this.f1221d = z3;
        this.f1222e = iArr;
    }

    private void a(Spannable spannable, g gVar, int i4, int i5) {
        spannable.setSpan(this.f1218a.a(gVar), i4, i5, 33);
    }

    private static boolean b(Editable editable, KeyEvent keyEvent, boolean z3) {
        i[] iVarArr;
        if (g(keyEvent)) {
            return false;
        }
        int selectionStart = Selection.getSelectionStart(editable);
        int selectionEnd = Selection.getSelectionEnd(editable);
        if (!f(selectionStart, selectionEnd) && (iVarArr = (i[]) editable.getSpans(selectionStart, selectionEnd, i.class)) != null && iVarArr.length > 0) {
            for (i iVar : iVarArr) {
                int spanStart = editable.getSpanStart(iVar);
                int spanEnd = editable.getSpanEnd(iVar);
                if ((z3 && spanStart == selectionStart) || ((!z3 && spanEnd == selectionStart) || (selectionStart > spanStart && selectionStart < spanEnd))) {
                    editable.delete(spanStart, spanEnd);
                    return true;
                }
            }
        }
        return false;
    }

    static boolean c(InputConnection inputConnection, Editable editable, int i4, int i5, boolean z3) {
        int max;
        int min;
        if (editable != null && inputConnection != null && i4 >= 0 && i5 >= 0) {
            int selectionStart = Selection.getSelectionStart(editable);
            int selectionEnd = Selection.getSelectionEnd(editable);
            if (f(selectionStart, selectionEnd)) {
                return false;
            }
            if (z3) {
                max = a.a(editable, selectionStart, Math.max(i4, 0));
                min = a.b(editable, selectionEnd, Math.max(i5, 0));
                if (max == -1 || min == -1) {
                    return false;
                }
            } else {
                max = Math.max(selectionStart - i4, 0);
                min = Math.min(selectionEnd + i5, editable.length());
            }
            i[] iVarArr = (i[]) editable.getSpans(max, min, i.class);
            if (iVarArr != null && iVarArr.length > 0) {
                for (i iVar : iVarArr) {
                    int spanStart = editable.getSpanStart(iVar);
                    int spanEnd = editable.getSpanEnd(iVar);
                    max = Math.min(spanStart, max);
                    min = Math.max(spanEnd, min);
                }
                int max2 = Math.max(max, 0);
                int min2 = Math.min(min, editable.length());
                inputConnection.beginBatchEdit();
                editable.delete(max2, min2);
                inputConnection.endBatchEdit();
                return true;
            }
        }
        return false;
    }

    static boolean d(Editable editable, int i4, KeyEvent keyEvent) {
        if (!(i4 != 67 ? i4 != 112 ? false : b(editable, keyEvent, true) : b(editable, keyEvent, false))) {
            return false;
        }
        MetaKeyKeyListener.adjustMetaAfterKeypress(editable);
        return true;
    }

    private boolean e(CharSequence charSequence, int i4, int i5, g gVar) {
        if (gVar.d() == 0) {
            gVar.k(this.f1220c.a(charSequence, i4, i5, gVar.h()));
        }
        return gVar.d() == 2;
    }

    private static boolean f(int i4, int i5) {
        return i4 == -1 || i5 == -1 || i4 != i5;
    }

    private static boolean g(KeyEvent keyEvent) {
        return !KeyEvent.metaStateHasNoModifiers(keyEvent.getMetaState());
    }

    /* JADX WARN: Code restructure failed: missing block: B:98:0x0124, code lost:
    
        r12 = (androidx.emoji2.text.n) r11;
     */
    /* JADX WARN: Removed duplicated region for block: B:15:0x0049 A[Catch: all -> 0x002a, TryCatch #0 {all -> 0x002a, blocks: (B:101:0x000e, B:104:0x0013, B:106:0x0017, B:108:0x0024, B:9:0x003a, B:11:0x0042, B:13:0x0045, B:15:0x0049, B:17:0x0055, B:19:0x0058, B:23:0x0065, B:29:0x0074, B:30:0x0080, B:34:0x009b, B:60:0x00ab, B:64:0x00b7, B:65:0x00c1, B:47:0x00cb, B:50:0x00d2, B:37:0x00d7, B:39:0x00e2, B:71:0x00e9, B:75:0x00f3, B:78:0x00ff, B:79:0x0104, B:81:0x010d, B:6:0x002f), top: B:100:0x000e }] */
    /* JADX WARN: Removed duplicated region for block: B:36:0x00d7 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:43:0x00a2 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:78:0x00ff A[Catch: all -> 0x002a, TryCatch #0 {all -> 0x002a, blocks: (B:101:0x000e, B:104:0x0013, B:106:0x0017, B:108:0x0024, B:9:0x003a, B:11:0x0042, B:13:0x0045, B:15:0x0049, B:17:0x0055, B:19:0x0058, B:23:0x0065, B:29:0x0074, B:30:0x0080, B:34:0x009b, B:60:0x00ab, B:64:0x00b7, B:65:0x00c1, B:47:0x00cb, B:50:0x00d2, B:37:0x00d7, B:39:0x00e2, B:71:0x00e9, B:75:0x00f3, B:78:0x00ff, B:79:0x0104, B:81:0x010d, B:6:0x002f), top: B:100:0x000e }] */
    /* JADX WARN: Removed duplicated region for block: B:81:0x010d A[Catch: all -> 0x002a, TRY_LEAVE, TryCatch #0 {all -> 0x002a, blocks: (B:101:0x000e, B:104:0x0013, B:106:0x0017, B:108:0x0024, B:9:0x003a, B:11:0x0042, B:13:0x0045, B:15:0x0049, B:17:0x0055, B:19:0x0058, B:23:0x0065, B:29:0x0074, B:30:0x0080, B:34:0x009b, B:60:0x00ab, B:64:0x00b7, B:65:0x00c1, B:47:0x00cb, B:50:0x00d2, B:37:0x00d7, B:39:0x00e2, B:71:0x00e9, B:75:0x00f3, B:78:0x00ff, B:79:0x0104, B:81:0x010d, B:6:0x002f), top: B:100:0x000e }] */
    /* JADX WARN: Removed duplicated region for block: B:92:0x0119  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    java.lang.CharSequence h(java.lang.CharSequence r11, int r12, int r13, int r14, boolean r15) {
        /*
            Method dump skipped, instructions count: 305
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.emoji2.text.h.h(java.lang.CharSequence, int, int, int, boolean):java.lang.CharSequence");
    }
}
