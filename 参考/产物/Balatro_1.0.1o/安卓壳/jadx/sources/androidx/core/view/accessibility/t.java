package androidx.core.view.accessibility;

import a1.b2.c3;
import android.R;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.ClickableSpan;
import android.util.SparseArray;
import android.view.View;
import android.view.accessibility.AccessibilityNodeInfo;
import androidx.core.view.accessibility.w;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class t {

    /* renamed from: d, reason: collision with root package name */
    private static int f1037d;

    /* renamed from: a, reason: collision with root package name */
    private final AccessibilityNodeInfo f1038a;

    /* renamed from: b, reason: collision with root package name */
    public int f1039b = -1;

    /* renamed from: c, reason: collision with root package name */
    private int f1040c = -1;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {
        public static final a A;
        public static final a B;
        public static final a C;
        public static final a D;
        public static final a E;
        public static final a F;
        public static final a G;
        public static final a H;
        public static final a I;
        public static final a J;
        public static final a K;
        public static final a L;
        public static final a M;
        public static final a N;
        public static final a O;
        public static final a P;
        public static final a Q;
        public static final a R;
        public static final a S;
        public static final a T;

        /* renamed from: d, reason: collision with root package name */
        public static final a f1041d = new a(1, null);

        /* renamed from: e, reason: collision with root package name */
        public static final a f1042e = new a(2, null);

        /* renamed from: f, reason: collision with root package name */
        public static final a f1043f = new a(4, null);

        /* renamed from: g, reason: collision with root package name */
        public static final a f1044g = new a(8, null);

        /* renamed from: h, reason: collision with root package name */
        public static final a f1045h = new a(16, null);

        /* renamed from: i, reason: collision with root package name */
        public static final a f1046i = new a(32, null);

        /* renamed from: j, reason: collision with root package name */
        public static final a f1047j = new a(64, null);

        /* renamed from: k, reason: collision with root package name */
        public static final a f1048k = new a(128, null);

        /* renamed from: l, reason: collision with root package name */
        public static final a f1049l = new a(256, null, w.b.class);

        /* renamed from: m, reason: collision with root package name */
        public static final a f1050m = new a(512, null, w.b.class);

        /* renamed from: n, reason: collision with root package name */
        public static final a f1051n = new a(1024, null, w.c.class);

        /* renamed from: o, reason: collision with root package name */
        public static final a f1052o = new a(2048, null, w.c.class);

        /* renamed from: p, reason: collision with root package name */
        public static final a f1053p = new a(4096, null);

        /* renamed from: q, reason: collision with root package name */
        public static final a f1054q = new a(8192, null);

        /* renamed from: r, reason: collision with root package name */
        public static final a f1055r = new a(16384, null);

        /* renamed from: s, reason: collision with root package name */
        public static final a f1056s = new a(32768, null);

        /* renamed from: t, reason: collision with root package name */
        public static final a f1057t = new a(65536, null);

        /* renamed from: u, reason: collision with root package name */
        public static final a f1058u = new a(131072, null, w.g.class);

        /* renamed from: v, reason: collision with root package name */
        public static final a f1059v = new a(262144, null);

        /* renamed from: w, reason: collision with root package name */
        public static final a f1060w = new a(524288, null);

        /* renamed from: x, reason: collision with root package name */
        public static final a f1061x = new a(1048576, null);

        /* renamed from: y, reason: collision with root package name */
        public static final a f1062y = new a(2097152, null, w.h.class);

        /* renamed from: z, reason: collision with root package name */
        public static final a f1063z;

        /* renamed from: a, reason: collision with root package name */
        final Object f1064a;

        /* renamed from: b, reason: collision with root package name */
        private final int f1065b;

        /* renamed from: c, reason: collision with root package name */
        private final Class f1066c;

        static {
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction2;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction3;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction4;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction5;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction6;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction7;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction8;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction9;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction10;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction11;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction12;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction13;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction14;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction15;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction16;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction17;
            AccessibilityNodeInfo.AccessibilityAction accessibilityAction18;
            int i4 = Build.VERSION.SDK_INT;
            f1063z = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SHOW_ON_SCREEN, R.id.accessibilityActionShowOnScreen, null, null, null);
            A = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_TO_POSITION, R.id.accessibilityActionScrollToPosition, null, null, w.e.class);
            B = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_UP, R.id.accessibilityActionScrollUp, null, null, null);
            C = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_LEFT, R.id.accessibilityActionScrollLeft, null, null, null);
            D = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_DOWN, R.id.accessibilityActionScrollDown, null, null, null);
            E = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_RIGHT, R.id.accessibilityActionScrollRight, null, null, null);
            F = new a(i4 >= 29 ? AccessibilityNodeInfo.AccessibilityAction.ACTION_PAGE_UP : null, R.id.accessibilityActionPageUp, null, null, null);
            if (i4 >= 29) {
                accessibilityAction18 = AccessibilityNodeInfo.AccessibilityAction.ACTION_PAGE_DOWN;
                accessibilityAction = accessibilityAction18;
            } else {
                accessibilityAction = null;
            }
            G = new a(accessibilityAction, R.id.accessibilityActionPageDown, null, null, null);
            if (i4 >= 29) {
                accessibilityAction17 = AccessibilityNodeInfo.AccessibilityAction.ACTION_PAGE_LEFT;
                accessibilityAction2 = accessibilityAction17;
            } else {
                accessibilityAction2 = null;
            }
            H = new a(accessibilityAction2, R.id.accessibilityActionPageLeft, null, null, null);
            if (i4 >= 29) {
                accessibilityAction16 = AccessibilityNodeInfo.AccessibilityAction.ACTION_PAGE_RIGHT;
                accessibilityAction3 = accessibilityAction16;
            } else {
                accessibilityAction3 = null;
            }
            I = new a(accessibilityAction3, R.id.accessibilityActionPageRight, null, null, null);
            J = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_CONTEXT_CLICK, R.id.accessibilityActionContextClick, null, null, null);
            K = new a(AccessibilityNodeInfo.AccessibilityAction.ACTION_SET_PROGRESS, R.id.accessibilityActionSetProgress, null, null, w.f.class);
            L = new a(i4 >= 26 ? AccessibilityNodeInfo.AccessibilityAction.ACTION_MOVE_WINDOW : null, R.id.accessibilityActionMoveWindow, null, null, w.d.class);
            M = new a(i4 >= 28 ? AccessibilityNodeInfo.AccessibilityAction.ACTION_SHOW_TOOLTIP : null, R.id.accessibilityActionShowTooltip, null, null, null);
            if (i4 >= 28) {
                accessibilityAction15 = AccessibilityNodeInfo.AccessibilityAction.ACTION_HIDE_TOOLTIP;
                accessibilityAction4 = accessibilityAction15;
            } else {
                accessibilityAction4 = null;
            }
            N = new a(accessibilityAction4, R.id.accessibilityActionHideTooltip, null, null, null);
            if (i4 >= 30) {
                accessibilityAction14 = AccessibilityNodeInfo.AccessibilityAction.ACTION_PRESS_AND_HOLD;
                accessibilityAction5 = accessibilityAction14;
            } else {
                accessibilityAction5 = null;
            }
            O = new a(accessibilityAction5, R.id.accessibilityActionPressAndHold, null, null, null);
            if (i4 >= 30) {
                accessibilityAction13 = AccessibilityNodeInfo.AccessibilityAction.ACTION_IME_ENTER;
                accessibilityAction6 = accessibilityAction13;
            } else {
                accessibilityAction6 = null;
            }
            P = new a(accessibilityAction6, R.id.accessibilityActionImeEnter, null, null, null);
            if (i4 >= 32) {
                accessibilityAction12 = AccessibilityNodeInfo.AccessibilityAction.ACTION_DRAG_START;
                accessibilityAction7 = accessibilityAction12;
            } else {
                accessibilityAction7 = null;
            }
            Q = new a(accessibilityAction7, R.id.accessibilityActionDragStart, null, null, null);
            if (i4 >= 32) {
                accessibilityAction11 = AccessibilityNodeInfo.AccessibilityAction.ACTION_DRAG_DROP;
                accessibilityAction8 = accessibilityAction11;
            } else {
                accessibilityAction8 = null;
            }
            R = new a(accessibilityAction8, R.id.accessibilityActionDragDrop, null, null, null);
            if (i4 >= 32) {
                accessibilityAction10 = AccessibilityNodeInfo.AccessibilityAction.ACTION_DRAG_CANCEL;
                accessibilityAction9 = accessibilityAction10;
            } else {
                accessibilityAction9 = null;
            }
            S = new a(accessibilityAction9, R.id.accessibilityActionDragCancel, null, null, null);
            T = new a(i4 >= 33 ? AccessibilityNodeInfo.AccessibilityAction.ACTION_SHOW_TEXT_SUGGESTIONS : null, R.id.accessibilityActionShowTextSuggestions, null, null, null);
        }

        public a(int i4, CharSequence charSequence) {
            this(null, i4, charSequence, null, null);
        }

        private a(int i4, CharSequence charSequence, Class cls) {
            this(null, i4, charSequence, null, cls);
        }

        a(Object obj) {
            this(obj, 0, null, null, null);
        }

        a(Object obj, int i4, CharSequence charSequence, w wVar, Class cls) {
            this.f1065b = i4;
            if (obj == null) {
                this.f1064a = new AccessibilityNodeInfo.AccessibilityAction(i4, charSequence);
            } else {
                this.f1064a = obj;
            }
            this.f1066c = cls;
        }

        public int a() {
            return ((AccessibilityNodeInfo.AccessibilityAction) this.f1064a).getId();
        }

        public CharSequence b() {
            return ((AccessibilityNodeInfo.AccessibilityAction) this.f1064a).getLabel();
        }

        public boolean c(View view, Bundle bundle) {
            return false;
        }

        public boolean equals(Object obj) {
            if (obj == null || !(obj instanceof a)) {
                return false;
            }
            a aVar = (a) obj;
            Object obj2 = this.f1064a;
            return obj2 == null ? aVar.f1064a == null : obj2.equals(aVar.f1064a);
        }

        public int hashCode() {
            Object obj = this.f1064a;
            if (obj != null) {
                return obj.hashCode();
            }
            return 0;
        }
    }

    private t(AccessibilityNodeInfo accessibilityNodeInfo) {
        this.f1038a = accessibilityNodeInfo;
    }

    private void G(View view) {
        SparseArray p3 = p(view);
        if (p3 != null) {
            ArrayList arrayList = new ArrayList();
            for (int i4 = 0; i4 < p3.size(); i4++) {
                if (((WeakReference) p3.valueAt(i4)).get() == null) {
                    arrayList.add(Integer.valueOf(i4));
                }
            }
            for (int i5 = 0; i5 < arrayList.size(); i5++) {
                p3.remove(((Integer) arrayList.get(i5)).intValue());
            }
        }
    }

    private void H(int i4, boolean z3) {
        Bundle m3 = m();
        if (m3 != null) {
            int i5 = m3.getInt("androidx.view.accessibility.AccessibilityNodeInfoCompat.BOOLEAN_PROPERTY_KEY", 0) & (~i4);
            if (!z3) {
                i4 = 0;
            }
            m3.putInt("androidx.view.accessibility.AccessibilityNodeInfoCompat.BOOLEAN_PROPERTY_KEY", i4 | i5);
        }
    }

    public static t P(AccessibilityNodeInfo accessibilityNodeInfo) {
        return new t(accessibilityNodeInfo);
    }

    private void b(ClickableSpan clickableSpan, Spanned spanned, int i4) {
        e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_START_KEY").add(Integer.valueOf(spanned.getSpanStart(clickableSpan)));
        e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_END_KEY").add(Integer.valueOf(spanned.getSpanEnd(clickableSpan)));
        e(c3.d4(468)).add(Integer.valueOf(spanned.getSpanFlags(clickableSpan)));
        e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_ID_KEY").add(Integer.valueOf(i4));
    }

    private void d() {
        this.f1038a.getExtras().remove("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_START_KEY");
        this.f1038a.getExtras().remove("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_END_KEY");
        this.f1038a.getExtras().remove("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_FLAGS_KEY");
        this.f1038a.getExtras().remove(c3.d4(912));
    }

    private List e(String str) {
        ArrayList<Integer> integerArrayList = this.f1038a.getExtras().getIntegerArrayList(str);
        if (integerArrayList != null) {
            return integerArrayList;
        }
        ArrayList<Integer> arrayList = new ArrayList<>();
        this.f1038a.getExtras().putIntegerArrayList(str, arrayList);
        return arrayList;
    }

    private static String g(int i4) {
        if (i4 == 1) {
            return "ACTION_FOCUS";
        }
        if (i4 == 2) {
            return c3.d4(870);
        }
        switch (i4) {
            case 4:
                return "ACTION_SELECT";
            case 8:
                return c3.d4(108);
            case 16:
                return "ACTION_CLICK";
            case 32:
                return "ACTION_LONG_CLICK";
            case 64:
                return "ACTION_ACCESSIBILITY_FOCUS";
            case 128:
                return "ACTION_CLEAR_ACCESSIBILITY_FOCUS";
            case 256:
                return c3.d4(1400);
            case 512:
                return "ACTION_PREVIOUS_AT_MOVEMENT_GRANULARITY";
            case 1024:
                return "ACTION_NEXT_HTML_ELEMENT";
            case 2048:
                return "ACTION_PREVIOUS_HTML_ELEMENT";
            case 4096:
                return "ACTION_SCROLL_FORWARD";
            case 8192:
                return "ACTION_SCROLL_BACKWARD";
            case 16384:
                return "ACTION_COPY";
            case 32768:
                return "ACTION_PASTE";
            case 65536:
                return c3.d4(1102);
            case 131072:
                return "ACTION_SET_SELECTION";
            case 262144:
                return "ACTION_EXPAND";
            case 524288:
                return "ACTION_COLLAPSE";
            case 2097152:
                return "ACTION_SET_TEXT";
            case R.id.accessibilityActionMoveWindow:
                return "ACTION_MOVE_WINDOW";
            default:
                switch (i4) {
                    case R.id.accessibilityActionShowOnScreen:
                        return "ACTION_SHOW_ON_SCREEN";
                    case R.id.accessibilityActionScrollToPosition:
                        return "ACTION_SCROLL_TO_POSITION";
                    case R.id.accessibilityActionScrollUp:
                        return "ACTION_SCROLL_UP";
                    case R.id.accessibilityActionScrollLeft:
                        return c3.d4(1021);
                    case R.id.accessibilityActionScrollDown:
                        return "ACTION_SCROLL_DOWN";
                    case R.id.accessibilityActionScrollRight:
                        return "ACTION_SCROLL_RIGHT";
                    case R.id.accessibilityActionContextClick:
                        return "ACTION_CONTEXT_CLICK";
                    case R.id.accessibilityActionSetProgress:
                        return "ACTION_SET_PROGRESS";
                    default:
                        switch (i4) {
                            case R.id.accessibilityActionShowTooltip:
                                return "ACTION_SHOW_TOOLTIP";
                            case R.id.accessibilityActionHideTooltip:
                                return "ACTION_HIDE_TOOLTIP";
                            case R.id.accessibilityActionPageUp:
                                return c3.d4(718);
                            case R.id.accessibilityActionPageDown:
                                return "ACTION_PAGE_DOWN";
                            case R.id.accessibilityActionPageLeft:
                                return "ACTION_PAGE_LEFT";
                            case R.id.accessibilityActionPageRight:
                                return "ACTION_PAGE_RIGHT";
                            case R.id.accessibilityActionPressAndHold:
                                return "ACTION_PRESS_AND_HOLD";
                            default:
                                switch (i4) {
                                    case R.id.accessibilityActionImeEnter:
                                        return c3.d4(1352);
                                    case R.id.accessibilityActionDragStart:
                                        return c3.d4(765);
                                    case R.id.accessibilityActionDragDrop:
                                        return "ACTION_DRAG_DROP";
                                    case R.id.accessibilityActionDragCancel:
                                        return "ACTION_DRAG_CANCEL";
                                    default:
                                        return c3.d4(1020);
                                }
                        }
                }
        }
    }

    public static ClickableSpan[] k(CharSequence charSequence) {
        if (charSequence instanceof Spanned) {
            return (ClickableSpan[]) ((Spanned) charSequence).getSpans(0, charSequence.length(), ClickableSpan.class);
        }
        return null;
    }

    private SparseArray n(View view) {
        SparseArray p3 = p(view);
        if (p3 != null) {
            return p3;
        }
        SparseArray sparseArray = new SparseArray();
        view.setTag(l.b.I, sparseArray);
        return sparseArray;
    }

    private SparseArray p(View view) {
        return (SparseArray) view.getTag(l.b.I);
    }

    private boolean t() {
        return !e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_START_KEY").isEmpty();
    }

    private int u(ClickableSpan clickableSpan, SparseArray sparseArray) {
        if (sparseArray != null) {
            for (int i4 = 0; i4 < sparseArray.size(); i4++) {
                if (clickableSpan.equals((ClickableSpan) ((WeakReference) sparseArray.valueAt(i4)).get())) {
                    return sparseArray.keyAt(i4);
                }
            }
        }
        int i5 = f1037d;
        f1037d = i5 + 1;
        return i5;
    }

    public boolean A() {
        return this.f1038a.isFocused();
    }

    public boolean B() {
        return this.f1038a.isLongClickable();
    }

    public boolean C() {
        return this.f1038a.isPassword();
    }

    public boolean D() {
        return this.f1038a.isScrollable();
    }

    public boolean E() {
        return this.f1038a.isSelected();
    }

    public boolean F(int i4, Bundle bundle) {
        return this.f1038a.performAction(i4, bundle);
    }

    public void I(CharSequence charSequence) {
        this.f1038a.setClassName(charSequence);
    }

    public void J(boolean z3) {
        if (Build.VERSION.SDK_INT >= 28) {
            this.f1038a.setHeading(z3);
        } else {
            H(2, z3);
        }
    }

    public void K(CharSequence charSequence) {
        if (Build.VERSION.SDK_INT >= 28) {
            this.f1038a.setPaneTitle(charSequence);
        } else {
            this.f1038a.getExtras().putCharSequence("androidx.view.accessibility.AccessibilityNodeInfoCompat.PANE_TITLE_KEY", charSequence);
        }
    }

    public void L(boolean z3) {
        if (Build.VERSION.SDK_INT >= 28) {
            this.f1038a.setScreenReaderFocusable(z3);
        } else {
            H(1, z3);
        }
    }

    public void M(boolean z3) {
        this.f1038a.setScrollable(z3);
    }

    public void N(CharSequence charSequence) {
        if (androidx.core.os.a.b()) {
            this.f1038a.setStateDescription(charSequence);
        } else {
            this.f1038a.getExtras().putCharSequence("androidx.view.accessibility.AccessibilityNodeInfoCompat.STATE_DESCRIPTION_KEY", charSequence);
        }
    }

    public AccessibilityNodeInfo O() {
        return this.f1038a;
    }

    public void a(a aVar) {
        this.f1038a.addAction((AccessibilityNodeInfo.AccessibilityAction) aVar.f1064a);
    }

    public void c(CharSequence charSequence, View view) {
        if (Build.VERSION.SDK_INT < 26) {
            d();
            G(view);
            ClickableSpan[] k4 = k(charSequence);
            if (k4 == null || k4.length <= 0) {
                return;
            }
            m().putInt("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_ACTION_ID_KEY", l.b.f4063a);
            SparseArray n3 = n(view);
            for (int i4 = 0; i4 < k4.length; i4++) {
                int u3 = u(k4[i4], n3);
                n3.put(u3, new WeakReference(k4[i4]));
                b(k4[i4], (Spanned) charSequence, u3);
            }
        }
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || !(obj instanceof t)) {
            return false;
        }
        t tVar = (t) obj;
        AccessibilityNodeInfo accessibilityNodeInfo = this.f1038a;
        if (accessibilityNodeInfo == null) {
            if (tVar.f1038a != null) {
                return false;
            }
        } else if (!accessibilityNodeInfo.equals(tVar.f1038a)) {
            return false;
        }
        return this.f1040c == tVar.f1040c && this.f1039b == tVar.f1039b;
    }

    public List f() {
        List<AccessibilityNodeInfo.AccessibilityAction> actionList = this.f1038a.getActionList();
        if (actionList == null) {
            return Collections.EMPTY_LIST;
        }
        ArrayList arrayList = new ArrayList();
        int size = actionList.size();
        for (int i4 = 0; i4 < size; i4++) {
            arrayList.add(new a(actionList.get(i4)));
        }
        return arrayList;
    }

    public void h(Rect rect) {
        this.f1038a.getBoundsInParent(rect);
    }

    public int hashCode() {
        AccessibilityNodeInfo accessibilityNodeInfo = this.f1038a;
        if (accessibilityNodeInfo == null) {
            return 0;
        }
        return accessibilityNodeInfo.hashCode();
    }

    public void i(Rect rect) {
        this.f1038a.getBoundsInScreen(rect);
    }

    public CharSequence j() {
        return this.f1038a.getClassName();
    }

    public CharSequence l() {
        return this.f1038a.getContentDescription();
    }

    public Bundle m() {
        return this.f1038a.getExtras();
    }

    public CharSequence o() {
        return this.f1038a.getPackageName();
    }

    public CharSequence q() {
        if (!t()) {
            return this.f1038a.getText();
        }
        List e4 = e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_START_KEY");
        List e5 = e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_END_KEY");
        List e6 = e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_FLAGS_KEY");
        List e7 = e("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_ID_KEY");
        SpannableString spannableString = new SpannableString(TextUtils.substring(this.f1038a.getText(), 0, this.f1038a.getText().length()));
        for (int i4 = 0; i4 < e4.size(); i4++) {
            spannableString.setSpan(new androidx.core.view.accessibility.a(((Integer) e7.get(i4)).intValue(), this, m().getInt("androidx.view.accessibility.AccessibilityNodeInfoCompat.SPANS_ACTION_ID_KEY")), ((Integer) e4.get(i4)).intValue(), ((Integer) e5.get(i4)).intValue(), ((Integer) e6.get(i4)).intValue());
        }
        return spannableString;
    }

    public String r() {
        String uniqueId;
        if (!androidx.core.os.a.c()) {
            return this.f1038a.getExtras().getString(c3.d4(1439));
        }
        uniqueId = this.f1038a.getUniqueId();
        return uniqueId;
    }

    public String s() {
        return this.f1038a.getViewIdResourceName();
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString());
        Rect rect = new Rect();
        h(rect);
        sb.append("; boundsInParent: " + rect);
        i(rect);
        sb.append("; boundsInScreen: " + rect);
        sb.append("; packageName: ");
        sb.append(o());
        sb.append("; className: ");
        sb.append(j());
        sb.append("; text: ");
        sb.append(q());
        sb.append(c3.d4(323));
        sb.append(l());
        sb.append("; viewId: ");
        sb.append(s());
        sb.append("; uniqueId: ");
        sb.append(r());
        sb.append("; checkable: ");
        sb.append(v());
        sb.append("; checked: ");
        sb.append(w());
        sb.append("; focusable: ");
        sb.append(z());
        sb.append("; focused: ");
        sb.append(A());
        sb.append("; selected: ");
        sb.append(E());
        sb.append("; clickable: ");
        sb.append(x());
        sb.append("; longClickable: ");
        sb.append(B());
        sb.append("; enabled: ");
        sb.append(y());
        sb.append("; password: ");
        sb.append(C());
        sb.append("; scrollable: " + D());
        sb.append("; [");
        List f4 = f();
        for (int i4 = 0; i4 < f4.size(); i4++) {
            a aVar = (a) f4.get(i4);
            String g4 = g(aVar.a());
            if (g4.equals(c3.d4(556)) && aVar.b() != null) {
                g4 = aVar.b().toString();
            }
            sb.append(g4);
            if (i4 != f4.size() - 1) {
                sb.append(c3.d4(469));
            }
        }
        sb.append("]");
        return sb.toString();
    }

    public boolean v() {
        return this.f1038a.isCheckable();
    }

    public boolean w() {
        return this.f1038a.isChecked();
    }

    public boolean x() {
        return this.f1038a.isClickable();
    }

    public boolean y() {
        return this.f1038a.isEnabled();
    }

    public boolean z() {
        return this.f1038a.isFocusable();
    }
}
