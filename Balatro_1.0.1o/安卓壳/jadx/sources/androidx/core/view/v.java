package androidx.core.view;

import a1.b2.c3;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.util.SparseArray;
import android.view.Display;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.ViewTreeObserver;
import android.view.WindowInsets;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityManager;
import android.view.accessibility.AccessibilityNodeProvider;
import androidx.core.view.a;
import androidx.core.view.a0;
import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.WeakHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class v {

    /* renamed from: c, reason: collision with root package name */
    private static Field f1088c;

    /* renamed from: a, reason: collision with root package name */
    private static final AtomicInteger f1086a = new AtomicInteger(1);

    /* renamed from: b, reason: collision with root package name */
    private static WeakHashMap f1087b = null;

    /* renamed from: d, reason: collision with root package name */
    private static boolean f1089d = false;

    /* renamed from: e, reason: collision with root package name */
    private static final int[] f1090e = {l.b.f4064b, l.b.f4065c, l.b.f4076n, l.b.f4087y, l.b.B, l.b.C, l.b.D, l.b.E, l.b.F, l.b.G, l.b.f4066d, l.b.f4067e, l.b.f4068f, l.b.f4069g, l.b.f4070h, l.b.f4071i, l.b.f4072j, l.b.f4073k, l.b.f4074l, l.b.f4075m, l.b.f4077o, l.b.f4078p, l.b.f4079q, l.b.f4080r, l.b.f4081s, l.b.f4082t, l.b.f4083u, l.b.f4084v, l.b.f4085w, l.b.f4086x, l.b.f4088z, l.b.A};

    /* renamed from: f, reason: collision with root package name */
    private static final s f1091f = new s() { // from class: androidx.core.view.u
    };

    /* renamed from: g, reason: collision with root package name */
    private static final e f1092g = new e();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends f {
        a(int i4, Class cls, int i5) {
            super(i4, cls, i5);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: i, reason: merged with bridge method [inline-methods] */
        public Boolean d(View view) {
            return Boolean.valueOf(m.d(view));
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: j, reason: merged with bridge method [inline-methods] */
        public void e(View view, Boolean bool) {
            m.i(view, bool.booleanValue());
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: k, reason: merged with bridge method [inline-methods] */
        public boolean h(Boolean bool, Boolean bool2) {
            return !a(bool, bool2);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends f {
        b(int i4, Class cls, int i5, int i6) {
            super(i4, cls, i5, i6);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: i, reason: merged with bridge method [inline-methods] */
        public CharSequence d(View view) {
            return m.b(view);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: j, reason: merged with bridge method [inline-methods] */
        public void e(View view, CharSequence charSequence) {
            m.h(view, charSequence);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: k, reason: merged with bridge method [inline-methods] */
        public boolean h(CharSequence charSequence, CharSequence charSequence2) {
            return !TextUtils.equals(charSequence, charSequence2);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c extends f {
        c(int i4, Class cls, int i5, int i6) {
            super(i4, cls, i5, i6);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: i, reason: merged with bridge method [inline-methods] */
        public CharSequence d(View view) {
            return o.a(view);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: j, reason: merged with bridge method [inline-methods] */
        public void e(View view, CharSequence charSequence) {
            o.b(view, charSequence);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: k, reason: merged with bridge method [inline-methods] */
        public boolean h(CharSequence charSequence, CharSequence charSequence2) {
            return !TextUtils.equals(charSequence, charSequence2);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d extends f {
        d(int i4, Class cls, int i5) {
            super(i4, cls, i5);
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: i, reason: merged with bridge method [inline-methods] */
        public Boolean d(View view) {
            return Boolean.valueOf(m.c(view));
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: j, reason: merged with bridge method [inline-methods] */
        public void e(View view, Boolean bool) {
            m.g(view, bool.booleanValue());
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        @Override // androidx.core.view.v.f
        /* renamed from: k, reason: merged with bridge method [inline-methods] */
        public boolean h(Boolean bool, Boolean bool2) {
            return !a(bool, bool2);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class e implements ViewTreeObserver.OnGlobalLayoutListener, View.OnAttachStateChangeListener {

        /* renamed from: a, reason: collision with root package name */
        private final WeakHashMap f1093a = new WeakHashMap();

        e() {
        }

        private void b(View view, boolean z3) {
            boolean z4 = view.isShown() && view.getWindowVisibility() == 0;
            if (z3 != z4) {
                v.y(view, z4 ? 16 : 32);
                this.f1093a.put(view, Boolean.valueOf(z4));
            }
        }

        private void c(View view) {
            view.getViewTreeObserver().addOnGlobalLayoutListener(this);
        }

        private void e(View view) {
            g.o(view.getViewTreeObserver(), this);
        }

        void a(View view) {
            this.f1093a.put(view, Boolean.valueOf(view.isShown() && view.getWindowVisibility() == 0));
            view.addOnAttachStateChangeListener(this);
            if (i.b(view)) {
                c(view);
            }
        }

        void d(View view) {
            this.f1093a.remove(view);
            view.removeOnAttachStateChangeListener(this);
            e(view);
        }

        @Override // android.view.ViewTreeObserver.OnGlobalLayoutListener
        public void onGlobalLayout() {
            if (Build.VERSION.SDK_INT < 28) {
                for (Map.Entry entry : this.f1093a.entrySet()) {
                    b((View) entry.getKey(), ((Boolean) entry.getValue()).booleanValue());
                }
            }
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewAttachedToWindow(View view) {
            c(view);
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewDetachedFromWindow(View view) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static abstract class f {

        /* renamed from: a, reason: collision with root package name */
        private final int f1094a;

        /* renamed from: b, reason: collision with root package name */
        private final Class f1095b;

        /* renamed from: c, reason: collision with root package name */
        private final int f1096c;

        /* renamed from: d, reason: collision with root package name */
        private final int f1097d;

        f(int i4, Class cls, int i5) {
            this(i4, cls, 0, i5);
        }

        f(int i4, Class cls, int i5, int i6) {
            this.f1094a = i4;
            this.f1095b = cls;
            this.f1097d = i5;
            this.f1096c = i6;
        }

        private boolean b() {
            return true;
        }

        private boolean c() {
            return Build.VERSION.SDK_INT >= this.f1096c;
        }

        boolean a(Boolean bool, Boolean bool2) {
            return (bool != null && bool.booleanValue()) == (bool2 != null && bool2.booleanValue());
        }

        abstract Object d(View view);

        abstract void e(View view, Object obj);

        Object f(View view) {
            if (c()) {
                return d(view);
            }
            if (!b()) {
                return null;
            }
            Object tag = view.getTag(this.f1094a);
            if (this.f1095b.isInstance(tag)) {
                return tag;
            }
            return null;
        }

        void g(View view, Object obj) {
            if (c()) {
                e(view, obj);
            } else if (b() && h(f(view), obj)) {
                v.f(view);
                view.setTag(this.f1094a, obj);
                v.y(view, this.f1097d);
            }
        }

        abstract boolean h(Object obj, Object obj2);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class g {
        static AccessibilityNodeProvider a(View view) {
            return view.getAccessibilityNodeProvider();
        }

        static boolean b(View view) {
            return view.getFitsSystemWindows();
        }

        static int c(View view) {
            return view.getImportantForAccessibility();
        }

        static int d(View view) {
            return view.getMinimumHeight();
        }

        static int e(View view) {
            return view.getMinimumWidth();
        }

        static ViewParent f(View view) {
            return view.getParentForAccessibility();
        }

        static int g(View view) {
            return view.getWindowSystemUiVisibility();
        }

        static boolean h(View view) {
            return view.hasOverlappingRendering();
        }

        static boolean i(View view) {
            return view.hasTransientState();
        }

        static boolean j(View view, int i4, Bundle bundle) {
            return view.performAccessibilityAction(i4, bundle);
        }

        static void k(View view) {
            view.postInvalidateOnAnimation();
        }

        static void l(View view, int i4, int i5, int i6, int i7) {
            view.postInvalidateOnAnimation(i4, i5, i6, i7);
        }

        static void m(View view, Runnable runnable) {
            view.postOnAnimation(runnable);
        }

        static void n(View view, Runnable runnable, long j4) {
            view.postOnAnimationDelayed(runnable, j4);
        }

        static void o(ViewTreeObserver viewTreeObserver, ViewTreeObserver.OnGlobalLayoutListener onGlobalLayoutListener) {
            viewTreeObserver.removeOnGlobalLayoutListener(onGlobalLayoutListener);
        }

        static void p(View view) {
            view.requestFitSystemWindows();
        }

        static void q(View view, Drawable drawable) {
            view.setBackground(drawable);
        }

        static void r(View view, boolean z3) {
            view.setHasTransientState(z3);
        }

        static void s(View view, int i4) {
            view.setImportantForAccessibility(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class h {
        static int a() {
            return View.generateViewId();
        }

        static Display b(View view) {
            return view.getDisplay();
        }

        static int c(View view) {
            return view.getLabelFor();
        }

        static int d(View view) {
            return view.getLayoutDirection();
        }

        static int e(View view) {
            return view.getPaddingEnd();
        }

        static int f(View view) {
            return view.getPaddingStart();
        }

        static boolean g(View view) {
            return view.isPaddingRelative();
        }

        static void h(View view, int i4) {
            view.setLabelFor(i4);
        }

        static void i(View view, Paint paint) {
            view.setLayerPaint(paint);
        }

        static void j(View view, int i4) {
            view.setLayoutDirection(i4);
        }

        static void k(View view, int i4, int i5, int i6, int i7) {
            view.setPaddingRelative(i4, i5, i6, i7);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class i {
        static int a(View view) {
            return view.getAccessibilityLiveRegion();
        }

        static boolean b(View view) {
            return view.isAttachedToWindow();
        }

        static boolean c(View view) {
            return view.isLaidOut();
        }

        static boolean d(View view) {
            return view.isLayoutDirectionResolved();
        }

        static void e(ViewParent viewParent, View view, View view2, int i4) {
            viewParent.notifySubtreeAccessibilityStateChanged(view, view2, i4);
        }

        static void f(View view, int i4) {
            view.setAccessibilityLiveRegion(i4);
        }

        static void g(AccessibilityEvent accessibilityEvent, int i4) {
            accessibilityEvent.setContentChangeTypes(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class j {
        static WindowInsets a(View view, WindowInsets windowInsets) {
            return view.dispatchApplyWindowInsets(windowInsets);
        }

        static WindowInsets b(View view, WindowInsets windowInsets) {
            return view.onApplyWindowInsets(windowInsets);
        }

        static void c(View view) {
            view.requestApplyInsets();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class k {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements View.OnApplyWindowInsetsListener {

            /* renamed from: a, reason: collision with root package name */
            a0 f1098a = null;

            /* renamed from: b, reason: collision with root package name */
            final /* synthetic */ View f1099b;

            a(View view, r rVar) {
                this.f1099b = view;
            }

            @Override // android.view.View.OnApplyWindowInsetsListener
            public WindowInsets onApplyWindowInsets(View view, WindowInsets windowInsets) {
                a0 u3 = a0.u(windowInsets, view);
                if (Build.VERSION.SDK_INT < 30) {
                    k.a(windowInsets, this.f1099b);
                    if (u3.equals(this.f1098a)) {
                        throw null;
                    }
                }
                this.f1098a = u3;
                throw null;
            }
        }

        static void a(WindowInsets windowInsets, View view) {
            View.OnApplyWindowInsetsListener onApplyWindowInsetsListener = (View.OnApplyWindowInsetsListener) view.getTag(l.b.Q);
            if (onApplyWindowInsetsListener != null) {
                onApplyWindowInsetsListener.onApplyWindowInsets(view, windowInsets);
            }
        }

        static a0 b(View view, a0 a0Var, Rect rect) {
            WindowInsets s3 = a0Var.s();
            if (s3 != null) {
                return a0.u(view.computeSystemWindowInsets(s3, rect), view);
            }
            rect.setEmpty();
            return a0Var;
        }

        static boolean c(View view, float f4, float f5, boolean z3) {
            return view.dispatchNestedFling(f4, f5, z3);
        }

        static boolean d(View view, float f4, float f5) {
            return view.dispatchNestedPreFling(f4, f5);
        }

        static boolean e(View view, int i4, int i5, int[] iArr, int[] iArr2) {
            return view.dispatchNestedPreScroll(i4, i5, iArr, iArr2);
        }

        static boolean f(View view, int i4, int i5, int i6, int i7, int[] iArr) {
            return view.dispatchNestedScroll(i4, i5, i6, i7, iArr);
        }

        static ColorStateList g(View view) {
            return view.getBackgroundTintList();
        }

        static PorterDuff.Mode h(View view) {
            return view.getBackgroundTintMode();
        }

        static float i(View view) {
            return view.getElevation();
        }

        public static a0 j(View view) {
            return a0.a.a(view);
        }

        static String k(View view) {
            return view.getTransitionName();
        }

        static float l(View view) {
            return view.getTranslationZ();
        }

        static float m(View view) {
            return view.getZ();
        }

        static boolean n(View view) {
            return view.hasNestedScrollingParent();
        }

        static boolean o(View view) {
            return view.isImportantForAccessibility();
        }

        static boolean p(View view) {
            return view.isNestedScrollingEnabled();
        }

        static void q(View view, ColorStateList colorStateList) {
            view.setBackgroundTintList(colorStateList);
        }

        static void r(View view, PorterDuff.Mode mode) {
            view.setBackgroundTintMode(mode);
        }

        static void s(View view, float f4) {
            view.setElevation(f4);
        }

        static void t(View view, boolean z3) {
            view.setNestedScrollingEnabled(z3);
        }

        static void u(View view, r rVar) {
            if (Build.VERSION.SDK_INT < 30) {
                view.setTag(l.b.L, rVar);
            }
            if (rVar == null) {
                view.setOnApplyWindowInsetsListener((View.OnApplyWindowInsetsListener) view.getTag(l.b.Q));
            } else {
                view.setOnApplyWindowInsetsListener(new a(view, rVar));
            }
        }

        static void v(View view, String str) {
            view.setTransitionName(str);
        }

        static void w(View view, float f4) {
            view.setTranslationZ(f4);
        }

        static void x(View view, float f4) {
            view.setZ(f4);
        }

        static boolean y(View view, int i4) {
            return view.startNestedScroll(i4);
        }

        static void z(View view) {
            view.stopNestedScroll();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class l {
        public static a0 a(View view) {
            WindowInsets rootWindowInsets = view.getRootWindowInsets();
            if (rootWindowInsets == null) {
                return null;
            }
            a0 t3 = a0.t(rootWindowInsets);
            t3.q(t3);
            t3.d(view.getRootView());
            return t3;
        }

        static int b(View view) {
            return view.getScrollIndicators();
        }

        static void c(View view, int i4) {
            view.setScrollIndicators(i4);
        }

        static void d(View view, int i4, int i5) {
            view.setScrollIndicators(i4, i5);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class m {
        static void a(View view, final p pVar) {
            k.g gVar = (k.g) view.getTag(l.b.P);
            if (gVar == null) {
                gVar = new k.g();
                view.setTag(l.b.P, gVar);
            }
            Objects.requireNonNull(pVar);
            View.OnUnhandledKeyEventListener onUnhandledKeyEventListener = new View.OnUnhandledKeyEventListener(pVar) { // from class: androidx.core.view.w
                @Override // android.view.View.OnUnhandledKeyEventListener
                public final boolean onUnhandledKeyEvent(View view2, KeyEvent keyEvent) {
                    throw null;
                }
            };
            gVar.put(pVar, onUnhandledKeyEventListener);
            view.addOnUnhandledKeyEventListener(onUnhandledKeyEventListener);
        }

        static CharSequence b(View view) {
            return view.getAccessibilityPaneTitle();
        }

        static boolean c(View view) {
            return view.isAccessibilityHeading();
        }

        static boolean d(View view) {
            return view.isScreenReaderFocusable();
        }

        static void e(View view, p pVar) {
            View.OnUnhandledKeyEventListener onUnhandledKeyEventListener;
            k.g gVar = (k.g) view.getTag(l.b.P);
            if (gVar == null || (onUnhandledKeyEventListener = (View.OnUnhandledKeyEventListener) gVar.get(pVar)) == null) {
                return;
            }
            view.removeOnUnhandledKeyEventListener(onUnhandledKeyEventListener);
        }

        static <T> T f(View view, int i4) {
            return (T) view.requireViewById(i4);
        }

        static void g(View view, boolean z3) {
            view.setAccessibilityHeading(z3);
        }

        static void h(View view, CharSequence charSequence) {
            view.setAccessibilityPaneTitle(charSequence);
        }

        static void i(View view, boolean z3) {
            view.setScreenReaderFocusable(z3);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class n {
        static View.AccessibilityDelegate a(View view) {
            return view.getAccessibilityDelegate();
        }

        static List<Rect> b(View view) {
            return view.getSystemGestureExclusionRects();
        }

        static void c(View view, Context context, int[] iArr, AttributeSet attributeSet, TypedArray typedArray, int i4, int i5) {
            view.saveAttributeDataForStyleable(context, iArr, attributeSet, typedArray, i4, i5);
        }

        static void d(View view, List<Rect> list) {
            view.setSystemGestureExclusionRects(list);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class o {
        static CharSequence a(View view) {
            return view.getStateDescription();
        }

        static void b(View view, CharSequence charSequence) {
            view.setStateDescription(charSequence);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface p {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class q {

        /* renamed from: d, reason: collision with root package name */
        private static final ArrayList f1100d = new ArrayList();

        /* renamed from: a, reason: collision with root package name */
        private WeakHashMap f1101a = null;

        /* renamed from: b, reason: collision with root package name */
        private SparseArray f1102b = null;

        /* renamed from: c, reason: collision with root package name */
        private WeakReference f1103c = null;

        q() {
        }

        static q a(View view) {
            q qVar = (q) view.getTag(l.b.O);
            if (qVar != null) {
                return qVar;
            }
            q qVar2 = new q();
            view.setTag(l.b.O, qVar2);
            return qVar2;
        }

        private View c(View view, KeyEvent keyEvent) {
            WeakHashMap weakHashMap = this.f1101a;
            if (weakHashMap != null && weakHashMap.containsKey(view)) {
                if (view instanceof ViewGroup) {
                    ViewGroup viewGroup = (ViewGroup) view;
                    for (int childCount = viewGroup.getChildCount() - 1; childCount >= 0; childCount--) {
                        View c4 = c(viewGroup.getChildAt(childCount), keyEvent);
                        if (c4 != null) {
                            return c4;
                        }
                    }
                }
                if (e(view, keyEvent)) {
                    return view;
                }
            }
            return null;
        }

        private SparseArray d() {
            if (this.f1102b == null) {
                this.f1102b = new SparseArray();
            }
            return this.f1102b;
        }

        private boolean e(View view, KeyEvent keyEvent) {
            int size;
            ArrayList arrayList = (ArrayList) view.getTag(l.b.P);
            if (arrayList == null || arrayList.size() - 1 < 0) {
                return false;
            }
            h.d.a(arrayList.get(size));
            throw null;
        }

        private void g() {
            WeakHashMap weakHashMap = this.f1101a;
            if (weakHashMap != null) {
                weakHashMap.clear();
            }
            ArrayList arrayList = f1100d;
            if (arrayList.isEmpty()) {
                return;
            }
            synchronized (arrayList) {
                try {
                    if (this.f1101a == null) {
                        this.f1101a = new WeakHashMap();
                    }
                    for (int size = arrayList.size() - 1; size >= 0; size--) {
                        ArrayList arrayList2 = f1100d;
                        View view = (View) ((WeakReference) arrayList2.get(size)).get();
                        if (view == null) {
                            arrayList2.remove(size);
                        } else {
                            this.f1101a.put(view, Boolean.TRUE);
                            for (ViewParent parent = view.getParent(); parent instanceof View; parent = parent.getParent()) {
                                this.f1101a.put((View) parent, Boolean.TRUE);
                            }
                        }
                    }
                } catch (Throwable th) {
                    throw th;
                }
            }
        }

        boolean b(View view, KeyEvent keyEvent) {
            if (keyEvent.getAction() == 0) {
                g();
            }
            View c4 = c(view, keyEvent);
            if (keyEvent.getAction() == 0) {
                int keyCode = keyEvent.getKeyCode();
                if (c4 != null && !KeyEvent.isModifierKey(keyCode)) {
                    d().put(keyCode, new WeakReference(c4));
                }
            }
            return c4 != null;
        }

        boolean f(KeyEvent keyEvent) {
            WeakReference weakReference;
            int indexOfKey;
            WeakReference weakReference2 = this.f1103c;
            if (weakReference2 != null && weakReference2.get() == keyEvent) {
                return false;
            }
            this.f1103c = new WeakReference(keyEvent);
            SparseArray d4 = d();
            if (keyEvent.getAction() != 1 || (indexOfKey = d4.indexOfKey(keyEvent.getKeyCode())) < 0) {
                weakReference = null;
            } else {
                weakReference = (WeakReference) d4.valueAt(indexOfKey);
                d4.removeAt(indexOfKey);
            }
            if (weakReference == null) {
                weakReference = (WeakReference) d4.get(keyEvent.getKeyCode());
            }
            if (weakReference == null) {
                return false;
            }
            View view = (View) weakReference.get();
            if (view != null && v.v(view)) {
                e(view, keyEvent);
            }
            return true;
        }
    }

    private static f A() {
        return new b(l.b.K, CharSequence.class, 8, 28);
    }

    public static void B(View view) {
        g.k(view);
    }

    public static void C(View view, Runnable runnable) {
        g.m(view, runnable);
    }

    public static void D(View view, Runnable runnable, long j4) {
        g.n(view, runnable, j4);
    }

    public static void E(View view) {
        j.c(view);
    }

    public static void F(View view, Context context, int[] iArr, AttributeSet attributeSet, TypedArray typedArray, int i4, int i5) {
        if (Build.VERSION.SDK_INT >= 29) {
            n.c(view, context, iArr, attributeSet, typedArray, i4, i5);
        }
    }

    private static f G() {
        return new a(l.b.M, Boolean.class, 28);
    }

    public static void H(View view, androidx.core.view.a aVar) {
        if (aVar == null && (h(view) instanceof a.C0012a)) {
            aVar = new androidx.core.view.a();
        }
        view.setAccessibilityDelegate(aVar == null ? null : aVar.d());
    }

    public static void I(View view, CharSequence charSequence) {
        A().g(view, charSequence);
        if (charSequence != null) {
            f1092g.a(view);
        } else {
            f1092g.d(view);
        }
    }

    public static void J(View view, Drawable drawable) {
        g.q(view, drawable);
    }

    public static void K(View view, ColorStateList colorStateList) {
        k.q(view, colorStateList);
    }

    public static void L(View view, PorterDuff.Mode mode) {
        k.r(view, mode);
    }

    public static void M(View view, int i4) {
        g.s(view, i4);
    }

    public static void N(View view, String str) {
        k.v(view, str);
    }

    private static void O(View view) {
        if (n(view) == 0) {
            M(view, 1);
        }
        for (ViewParent parent = view.getParent(); parent instanceof View; parent = parent.getParent()) {
            if (n((View) parent) == 4) {
                M(view, 2);
                return;
            }
        }
    }

    private static f P() {
        return new c(l.b.N, CharSequence.class, 64, 30);
    }

    public static void Q(View view) {
        k.z(view);
    }

    private static f a() {
        return new d(l.b.J, Boolean.class, 28);
    }

    public static a0 b(View view, a0 a0Var, Rect rect) {
        return k.b(view, a0Var, rect);
    }

    public static a0 c(View view, a0 a0Var) {
        WindowInsets s3 = a0Var.s();
        if (s3 != null) {
            WindowInsets a4 = j.a(view, s3);
            if (!a4.equals(s3)) {
                return a0.u(a4, view);
            }
        }
        return a0Var;
    }

    static boolean d(View view, KeyEvent keyEvent) {
        if (Build.VERSION.SDK_INT >= 28) {
            return false;
        }
        return q.a(view).b(view, keyEvent);
    }

    static boolean e(View view, KeyEvent keyEvent) {
        if (Build.VERSION.SDK_INT >= 28) {
            return false;
        }
        return q.a(view).f(keyEvent);
    }

    static void f(View view) {
        androidx.core.view.a g4 = g(view);
        if (g4 == null) {
            g4 = new androidx.core.view.a();
        }
        H(view, g4);
    }

    public static androidx.core.view.a g(View view) {
        View.AccessibilityDelegate h4 = h(view);
        if (h4 == null) {
            return null;
        }
        return h4 instanceof a.C0012a ? ((a.C0012a) h4).f1000a : new androidx.core.view.a(h4);
    }

    private static View.AccessibilityDelegate h(View view) {
        return Build.VERSION.SDK_INT >= 29 ? n.a(view) : i(view);
    }

    private static View.AccessibilityDelegate i(View view) {
        if (f1089d) {
            return null;
        }
        if (f1088c == null) {
            try {
                Field declaredField = View.class.getDeclaredField("mAccessibilityDelegate");
                f1088c = declaredField;
                declaredField.setAccessible(true);
            } catch (Throwable unused) {
                f1089d = true;
                return null;
            }
        }
        try {
            Object obj = f1088c.get(view);
            if (obj instanceof View.AccessibilityDelegate) {
                return (View.AccessibilityDelegate) obj;
            }
            return null;
        } catch (Throwable unused2) {
            f1089d = true;
            return null;
        }
    }

    public static int j(View view) {
        return i.a(view);
    }

    public static CharSequence k(View view) {
        return (CharSequence) A().f(view);
    }

    public static ColorStateList l(View view) {
        return k.g(view);
    }

    public static PorterDuff.Mode m(View view) {
        return k.h(view);
    }

    public static int n(View view) {
        return g.c(view);
    }

    public static int o(View view) {
        return h.d(view);
    }

    public static int p(View view) {
        return g.d(view);
    }

    public static a0 q(View view) {
        return l.a(view);
    }

    public static CharSequence r(View view) {
        return (CharSequence) P().f(view);
    }

    public static String s(View view) {
        return k.k(view);
    }

    public static int t(View view) {
        return g.g(view);
    }

    public static boolean u(View view) {
        Boolean bool = (Boolean) a().f(view);
        return bool != null && bool.booleanValue();
    }

    public static boolean v(View view) {
        return i.b(view);
    }

    public static boolean w(View view) {
        return i.c(view);
    }

    public static boolean x(View view) {
        Boolean bool = (Boolean) G().f(view);
        return bool != null && bool.booleanValue();
    }

    static void y(View view, int i4) {
        AccessibilityManager accessibilityManager = (AccessibilityManager) view.getContext().getSystemService("accessibility");
        if (accessibilityManager.isEnabled()) {
            boolean z3 = k(view) != null && view.isShown() && view.getWindowVisibility() == 0;
            if (j(view) != 0 || z3) {
                AccessibilityEvent obtain = AccessibilityEvent.obtain();
                obtain.setEventType(z3 ? 32 : 2048);
                i.g(obtain, i4);
                if (z3) {
                    obtain.getText().add(k(view));
                    O(view);
                }
                view.sendAccessibilityEventUnchecked(obtain);
                return;
            }
            if (i4 == 32) {
                AccessibilityEvent obtain2 = AccessibilityEvent.obtain();
                view.onInitializeAccessibilityEvent(obtain2);
                obtain2.setEventType(32);
                i.g(obtain2, i4);
                obtain2.setSource(view);
                view.onPopulateAccessibilityEvent(obtain2);
                obtain2.getText().add(k(view));
                accessibilityManager.sendAccessibilityEvent(obtain2);
                return;
            }
            if (view.getParent() != null) {
                try {
                    i.e(view.getParent(), view, view, i4);
                } catch (AbstractMethodError e4) {
                    Log.e("ViewCompat", view.getParent().getClass().getSimpleName() + c3.d4(820), e4);
                }
            }
        }
    }

    public static a0 z(View view, a0 a0Var) {
        WindowInsets s3 = a0Var.s();
        if (s3 != null) {
            WindowInsets b4 = j.b(view, s3);
            if (!b4.equals(s3)) {
                return a0.u(b4, view);
            }
        }
        return a0Var;
    }
}
