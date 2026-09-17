package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.transition.Transition;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.widget.HeaderViewListAdapter;
import android.widget.ListAdapter;
import android.widget.PopupWindow;
import androidx.appcompat.view.menu.ListMenuItemView;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b0 extends z implements a0 {
    private static Method J;
    private a0 I;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static void a(PopupWindow popupWindow, Transition transition) {
            popupWindow.setEnterTransition(transition);
        }

        static void b(PopupWindow popupWindow, Transition transition) {
            popupWindow.setExitTransition(transition);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static void a(PopupWindow popupWindow, boolean z3) {
            popupWindow.setTouchModal(z3);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class c extends v {

        /* renamed from: m, reason: collision with root package name */
        final int f481m;

        /* renamed from: n, reason: collision with root package name */
        final int f482n;

        /* renamed from: o, reason: collision with root package name */
        private a0 f483o;

        /* renamed from: p, reason: collision with root package name */
        private MenuItem f484p;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        static class a {
            static int a(Configuration configuration) {
                return configuration.getLayoutDirection();
            }
        }

        public c(Context context, boolean z3) {
            super(context, z3);
            if (1 == a.a(context.getResources().getConfiguration())) {
                this.f481m = 21;
                this.f482n = 22;
            } else {
                this.f481m = 22;
                this.f482n = 21;
            }
        }

        @Override // androidx.appcompat.widget.v
        public /* bridge */ /* synthetic */ int d(int i4, int i5, int i6, int i7, int i8) {
            return super.d(i4, i5, i6, i7, i8);
        }

        @Override // androidx.appcompat.widget.v
        public /* bridge */ /* synthetic */ boolean e(MotionEvent motionEvent, int i4) {
            return super.e(motionEvent, i4);
        }

        @Override // androidx.appcompat.widget.v, android.view.ViewGroup, android.view.View
        public /* bridge */ /* synthetic */ boolean hasFocus() {
            return super.hasFocus();
        }

        @Override // androidx.appcompat.widget.v, android.view.View
        public /* bridge */ /* synthetic */ boolean hasWindowFocus() {
            return super.hasWindowFocus();
        }

        @Override // androidx.appcompat.widget.v, android.view.View
        public /* bridge */ /* synthetic */ boolean isFocused() {
            return super.isFocused();
        }

        @Override // androidx.appcompat.widget.v, android.view.View
        public /* bridge */ /* synthetic */ boolean isInTouchMode() {
            return super.isInTouchMode();
        }

        @Override // androidx.appcompat.widget.v, android.view.View
        public boolean onHoverEvent(MotionEvent motionEvent) {
            androidx.appcompat.view.menu.d dVar;
            int i4;
            int pointToPosition;
            int i5;
            if (this.f483o != null) {
                ListAdapter adapter = getAdapter();
                if (adapter instanceof HeaderViewListAdapter) {
                    HeaderViewListAdapter headerViewListAdapter = (HeaderViewListAdapter) adapter;
                    i4 = headerViewListAdapter.getHeadersCount();
                    dVar = (androidx.appcompat.view.menu.d) headerViewListAdapter.getWrappedAdapter();
                } else {
                    dVar = (androidx.appcompat.view.menu.d) adapter;
                    i4 = 0;
                }
                androidx.appcompat.view.menu.f item = (motionEvent.getAction() == 10 || (pointToPosition = pointToPosition((int) motionEvent.getX(), (int) motionEvent.getY())) == -1 || (i5 = pointToPosition - i4) < 0 || i5 >= dVar.getCount()) ? null : dVar.getItem(i5);
                MenuItem menuItem = this.f484p;
                if (menuItem != item) {
                    androidx.appcompat.view.menu.e b4 = dVar.b();
                    if (menuItem != null) {
                        this.f483o.c(b4, menuItem);
                    }
                    this.f484p = item;
                    if (item != null) {
                        this.f483o.a(b4, item);
                    }
                }
            }
            return super.onHoverEvent(motionEvent);
        }

        @Override // android.widget.ListView, android.widget.AbsListView, android.view.View, android.view.KeyEvent.Callback
        public boolean onKeyDown(int i4, KeyEvent keyEvent) {
            ListMenuItemView listMenuItemView = (ListMenuItemView) getSelectedView();
            if (listMenuItemView != null && i4 == this.f481m) {
                if (listMenuItemView.isEnabled() && listMenuItemView.getItemData().hasSubMenu()) {
                    performItemClick(listMenuItemView, getSelectedItemPosition(), getSelectedItemId());
                }
                return true;
            }
            if (listMenuItemView == null || i4 != this.f482n) {
                return super.onKeyDown(i4, keyEvent);
            }
            setSelection(-1);
            ListAdapter adapter = getAdapter();
            (adapter instanceof HeaderViewListAdapter ? (androidx.appcompat.view.menu.d) ((HeaderViewListAdapter) adapter).getWrappedAdapter() : (androidx.appcompat.view.menu.d) adapter).b().d(false);
            return true;
        }

        @Override // androidx.appcompat.widget.v, android.widget.AbsListView, android.view.View
        public /* bridge */ /* synthetic */ boolean onTouchEvent(MotionEvent motionEvent) {
            return super.onTouchEvent(motionEvent);
        }

        public void setHoverListener(a0 a0Var) {
            this.f483o = a0Var;
        }

        @Override // androidx.appcompat.widget.v, android.widget.AbsListView
        public /* bridge */ /* synthetic */ void setSelector(Drawable drawable) {
            super.setSelector(drawable);
        }
    }

    static {
        try {
            if (Build.VERSION.SDK_INT <= 28) {
                J = PopupWindow.class.getDeclaredMethod("setTouchModal", Boolean.TYPE);
            }
        } catch (NoSuchMethodException unused) {
            Log.i(c3.d4(966), "Could not find method setTouchModal() on PopupWindow. Oh well.");
        }
    }

    public b0(Context context, AttributeSet attributeSet, int i4, int i5) {
        super(context, attributeSet, i4, i5);
    }

    public void E(Object obj) {
        a.a(this.F, (Transition) obj);
    }

    public void F(Object obj) {
        a.b(this.F, (Transition) obj);
    }

    public void G(a0 a0Var) {
        this.I = a0Var;
    }

    public void H(boolean z3) {
        if (Build.VERSION.SDK_INT > 28) {
            b.a(this.F, z3);
            return;
        }
        Method method = J;
        if (method != null) {
            try {
                method.invoke(this.F, Boolean.valueOf(z3));
            } catch (Exception unused) {
                Log.i("MenuPopupWindow", "Could not invoke setTouchModal() on PopupWindow. Oh well.");
            }
        }
    }

    @Override // androidx.appcompat.widget.a0
    public void a(androidx.appcompat.view.menu.e eVar, MenuItem menuItem) {
        a0 a0Var = this.I;
        if (a0Var != null) {
            a0Var.a(eVar, menuItem);
        }
    }

    @Override // androidx.appcompat.widget.a0
    public void c(androidx.appcompat.view.menu.e eVar, MenuItem menuItem) {
        a0 a0Var = this.I;
        if (a0Var != null) {
            a0Var.c(eVar, menuItem);
        }
    }

    @Override // androidx.appcompat.widget.z
    v g(Context context, boolean z3) {
        c cVar = new c(context, z3);
        cVar.setHoverListener(this);
        return cVar;
    }
}
