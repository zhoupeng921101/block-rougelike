package androidx.core.view;

import a1.b2.c3;
import android.os.Bundle;
import android.text.style.ClickableSpan;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.view.accessibility.AccessibilityNodeProvider;
import androidx.core.view.accessibility.t;
import java.lang.ref.WeakReference;
import java.util.Collections;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a {

    /* renamed from: c, reason: collision with root package name */
    private static final View.AccessibilityDelegate f997c = new View.AccessibilityDelegate();

    /* renamed from: a, reason: collision with root package name */
    private final View.AccessibilityDelegate f998a;

    /* renamed from: b, reason: collision with root package name */
    private final View.AccessibilityDelegate f999b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.view.a$a, reason: collision with other inner class name */
    static final class C0012a extends View.AccessibilityDelegate {

        /* renamed from: a, reason: collision with root package name */
        final a f1000a;

        C0012a(a aVar) {
            this.f1000a = aVar;
        }

        @Override // android.view.View.AccessibilityDelegate
        public boolean dispatchPopulateAccessibilityEvent(View view, AccessibilityEvent accessibilityEvent) {
            return this.f1000a.a(view, accessibilityEvent);
        }

        @Override // android.view.View.AccessibilityDelegate
        public AccessibilityNodeProvider getAccessibilityNodeProvider(View view) {
            androidx.core.view.accessibility.u b4 = this.f1000a.b(view);
            if (b4 != null) {
                return (AccessibilityNodeProvider) b4.a();
            }
            return null;
        }

        @Override // android.view.View.AccessibilityDelegate
        public void onInitializeAccessibilityEvent(View view, AccessibilityEvent accessibilityEvent) {
            this.f1000a.f(view, accessibilityEvent);
        }

        @Override // android.view.View.AccessibilityDelegate
        public void onInitializeAccessibilityNodeInfo(View view, AccessibilityNodeInfo accessibilityNodeInfo) {
            androidx.core.view.accessibility.t P = androidx.core.view.accessibility.t.P(accessibilityNodeInfo);
            P.L(v.x(view));
            P.J(v.u(view));
            P.K(v.k(view));
            P.N(v.r(view));
            this.f1000a.g(view, P);
            P.c(accessibilityNodeInfo.getText(), view);
            List c4 = a.c(view);
            for (int i4 = 0; i4 < c4.size(); i4++) {
                P.a((t.a) c4.get(i4));
            }
        }

        @Override // android.view.View.AccessibilityDelegate
        public void onPopulateAccessibilityEvent(View view, AccessibilityEvent accessibilityEvent) {
            this.f1000a.h(view, accessibilityEvent);
        }

        @Override // android.view.View.AccessibilityDelegate
        public boolean onRequestSendAccessibilityEvent(ViewGroup viewGroup, View view, AccessibilityEvent accessibilityEvent) {
            return this.f1000a.i(viewGroup, view, accessibilityEvent);
        }

        @Override // android.view.View.AccessibilityDelegate
        public boolean performAccessibilityAction(View view, int i4, Bundle bundle) {
            return this.f1000a.j(view, i4, bundle);
        }

        @Override // android.view.View.AccessibilityDelegate
        public void sendAccessibilityEvent(View view, int i4) {
            this.f1000a.l(view, i4);
        }

        @Override // android.view.View.AccessibilityDelegate
        public void sendAccessibilityEventUnchecked(View view, AccessibilityEvent accessibilityEvent) {
            this.f1000a.m(view, accessibilityEvent);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static AccessibilityNodeProvider a(View.AccessibilityDelegate accessibilityDelegate, View view) {
            return accessibilityDelegate.getAccessibilityNodeProvider(view);
        }

        static boolean b(View.AccessibilityDelegate accessibilityDelegate, View view, int i4, Bundle bundle) {
            return accessibilityDelegate.performAccessibilityAction(view, i4, bundle);
        }
    }

    public a() {
        this(f997c);
    }

    public a(View.AccessibilityDelegate accessibilityDelegate) {
        this.f998a = accessibilityDelegate;
        this.f999b = new C0012a(this);
    }

    static List c(View view) {
        List list = (List) view.getTag(l.b.H);
        return list == null ? Collections.EMPTY_LIST : list;
    }

    private boolean e(ClickableSpan clickableSpan, View view) {
        if (clickableSpan != null) {
            ClickableSpan[] k4 = androidx.core.view.accessibility.t.k(view.createAccessibilityNodeInfo().getText());
            for (int i4 = 0; k4 != null && i4 < k4.length; i4++) {
                if (clickableSpan.equals(k4[i4])) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean k(int i4, View view) {
        WeakReference weakReference;
        SparseArray sparseArray = (SparseArray) view.getTag(l.b.I);
        if (sparseArray == null || (weakReference = (WeakReference) sparseArray.get(i4)) == null) {
            return false;
        }
        ClickableSpan clickableSpan = (ClickableSpan) weakReference.get();
        if (!e(clickableSpan, view)) {
            return false;
        }
        clickableSpan.onClick(view);
        return true;
    }

    public boolean a(View view, AccessibilityEvent accessibilityEvent) {
        return this.f998a.dispatchPopulateAccessibilityEvent(view, accessibilityEvent);
    }

    public androidx.core.view.accessibility.u b(View view) {
        AccessibilityNodeProvider a4 = b.a(this.f998a, view);
        if (a4 != null) {
            return new androidx.core.view.accessibility.u(a4);
        }
        return null;
    }

    View.AccessibilityDelegate d() {
        return this.f999b;
    }

    public void f(View view, AccessibilityEvent accessibilityEvent) {
        this.f998a.onInitializeAccessibilityEvent(view, accessibilityEvent);
    }

    public void g(View view, androidx.core.view.accessibility.t tVar) {
        this.f998a.onInitializeAccessibilityNodeInfo(view, tVar.O());
    }

    public void h(View view, AccessibilityEvent accessibilityEvent) {
        this.f998a.onPopulateAccessibilityEvent(view, accessibilityEvent);
    }

    public boolean i(ViewGroup viewGroup, View view, AccessibilityEvent accessibilityEvent) {
        return this.f998a.onRequestSendAccessibilityEvent(viewGroup, view, accessibilityEvent);
    }

    public boolean j(View view, int i4, Bundle bundle) {
        List c4 = c(view);
        boolean z3 = false;
        int i5 = 0;
        while (true) {
            if (i5 >= c4.size()) {
                break;
            }
            t.a aVar = (t.a) c4.get(i5);
            if (aVar.a() == i4) {
                z3 = aVar.c(view, bundle);
                break;
            }
            i5++;
        }
        if (!z3) {
            z3 = b.b(this.f998a, view, i4, bundle);
        }
        return (z3 || i4 != l.b.f4063a || bundle == null) ? z3 : k(bundle.getInt(c3.d4(107), -1), view);
    }

    public void l(View view, int i4) {
        this.f998a.sendAccessibilityEvent(view, i4);
    }

    public void m(View view, AccessibilityEvent accessibilityEvent) {
        this.f998a.sendAccessibilityEventUnchecked(view, accessibilityEvent);
    }
}
