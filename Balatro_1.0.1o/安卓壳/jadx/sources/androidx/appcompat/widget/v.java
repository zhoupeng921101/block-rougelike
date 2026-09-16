package androidx.appcompat.widget;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ListAdapter;
import android.widget.ListView;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class v extends ListView {

    /* renamed from: a, reason: collision with root package name */
    private final Rect f698a;

    /* renamed from: b, reason: collision with root package name */
    private int f699b;

    /* renamed from: c, reason: collision with root package name */
    private int f700c;

    /* renamed from: d, reason: collision with root package name */
    private int f701d;

    /* renamed from: e, reason: collision with root package name */
    private int f702e;

    /* renamed from: f, reason: collision with root package name */
    private int f703f;

    /* renamed from: g, reason: collision with root package name */
    private d f704g;

    /* renamed from: h, reason: collision with root package name */
    private boolean f705h;

    /* renamed from: i, reason: collision with root package name */
    private boolean f706i;

    /* renamed from: j, reason: collision with root package name */
    private boolean f707j;

    /* renamed from: k, reason: collision with root package name */
    private androidx.core.widget.d f708k;

    /* renamed from: l, reason: collision with root package name */
    f f709l;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static void a(View view, float f4, float f5) {
            view.drawableHotspotChanged(f4, f5);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {

        /* renamed from: a, reason: collision with root package name */
        private static Method f710a;

        /* renamed from: b, reason: collision with root package name */
        private static Method f711b;

        /* renamed from: c, reason: collision with root package name */
        private static Method f712c;

        /* renamed from: d, reason: collision with root package name */
        private static boolean f713d;

        static {
            try {
                Class cls = Integer.TYPE;
                Class cls2 = Boolean.TYPE;
                Class cls3 = Float.TYPE;
                Method declaredMethod = AbsListView.class.getDeclaredMethod("positionSelector", cls, View.class, cls2, cls3, cls3);
                f710a = declaredMethod;
                declaredMethod.setAccessible(true);
                Method declaredMethod2 = AdapterView.class.getDeclaredMethod("setSelectedPositionInt", cls);
                f711b = declaredMethod2;
                declaredMethod2.setAccessible(true);
                Method declaredMethod3 = AdapterView.class.getDeclaredMethod("setNextSelectedPositionInt", cls);
                f712c = declaredMethod3;
                declaredMethod3.setAccessible(true);
                f713d = true;
            } catch (NoSuchMethodException e4) {
                e4.printStackTrace();
            }
        }

        static boolean a() {
            return f713d;
        }

        static void b(v vVar, int i4, View view) {
            try {
                f710a.invoke(vVar, Integer.valueOf(i4), view, Boolean.FALSE, -1, -1);
                f711b.invoke(vVar, Integer.valueOf(i4));
                f712c.invoke(vVar, Integer.valueOf(i4));
            } catch (IllegalAccessException e4) {
                e4.printStackTrace();
            } catch (InvocationTargetException e5) {
                e5.printStackTrace();
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {
        static boolean a(AbsListView absListView) {
            return absListView.isSelectedChildViewEnabled();
        }

        static void b(AbsListView absListView, boolean z3) {
            absListView.setSelectedChildViewEnabled(z3);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class d extends f.a {

        /* renamed from: b, reason: collision with root package name */
        private boolean f714b;

        d(Drawable drawable) {
            super(drawable);
            this.f714b = true;
        }

        void b(boolean z3) {
            this.f714b = z3;
        }

        @Override // f.a, android.graphics.drawable.Drawable
        public void draw(Canvas canvas) {
            if (this.f714b) {
                super.draw(canvas);
            }
        }

        @Override // f.a, android.graphics.drawable.Drawable
        public void setHotspot(float f4, float f5) {
            if (this.f714b) {
                super.setHotspot(f4, f5);
            }
        }

        @Override // f.a, android.graphics.drawable.Drawable
        public void setHotspotBounds(int i4, int i5, int i6, int i7) {
            if (this.f714b) {
                super.setHotspotBounds(i4, i5, i6, i7);
            }
        }

        @Override // f.a, android.graphics.drawable.Drawable
        public boolean setState(int[] iArr) {
            if (this.f714b) {
                return super.setState(iArr);
            }
            return false;
        }

        @Override // f.a, android.graphics.drawable.Drawable
        public boolean setVisible(boolean z3, boolean z4) {
            if (this.f714b) {
                return super.setVisible(z3, z4);
            }
            return false;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class e {

        /* renamed from: a, reason: collision with root package name */
        private static final Field f715a;

        static {
            Field field = null;
            try {
                field = AbsListView.class.getDeclaredField("mIsChildViewEnabled");
                field.setAccessible(true);
            } catch (NoSuchFieldException e4) {
                e4.printStackTrace();
            }
            f715a = field;
        }

        static boolean a(AbsListView absListView) {
            Field field = f715a;
            if (field == null) {
                return false;
            }
            try {
                return field.getBoolean(absListView);
            } catch (IllegalAccessException e4) {
                e4.printStackTrace();
                return false;
            }
        }

        static void b(AbsListView absListView, boolean z3) {
            Field field = f715a;
            if (field != null) {
                try {
                    field.set(absListView, Boolean.valueOf(z3));
                } catch (IllegalAccessException e4) {
                    e4.printStackTrace();
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class f implements Runnable {
        f() {
        }

        public void a() {
            v vVar = v.this;
            vVar.f709l = null;
            vVar.removeCallbacks(this);
        }

        public void b() {
            v.this.post(this);
        }

        @Override // java.lang.Runnable
        public void run() {
            v vVar = v.this;
            vVar.f709l = null;
            vVar.drawableStateChanged();
        }
    }

    v(Context context, boolean z3) {
        super(context, null, c.a.f1842n);
        this.f698a = new Rect();
        this.f699b = 0;
        this.f700c = 0;
        this.f701d = 0;
        this.f702e = 0;
        this.f706i = z3;
        setCacheColorHint(0);
    }

    private void a() {
        this.f707j = false;
        setPressed(false);
        drawableStateChanged();
        View childAt = getChildAt(this.f703f - getFirstVisiblePosition());
        if (childAt != null) {
            childAt.setPressed(false);
        }
    }

    private void b(View view, int i4) {
        performItemClick(view, i4, getItemIdAtPosition(i4));
    }

    private void c(Canvas canvas) {
        Drawable selector;
        if (this.f698a.isEmpty() || (selector = getSelector()) == null) {
            return;
        }
        selector.setBounds(this.f698a);
        selector.draw(canvas);
    }

    private void f(int i4, View view) {
        Rect rect = this.f698a;
        rect.set(view.getLeft(), view.getTop(), view.getRight(), view.getBottom());
        rect.left -= this.f699b;
        rect.top -= this.f700c;
        rect.right += this.f701d;
        rect.bottom += this.f702e;
        boolean k4 = k();
        if (view.isEnabled() != k4) {
            l(!k4);
            if (i4 != -1) {
                refreshDrawableState();
            }
        }
    }

    private void g(int i4, View view) {
        Drawable selector = getSelector();
        boolean z3 = (selector == null || i4 == -1) ? false : true;
        if (z3) {
            selector.setVisible(false, false);
        }
        f(i4, view);
        if (z3) {
            Rect rect = this.f698a;
            float exactCenterX = rect.exactCenterX();
            float exactCenterY = rect.exactCenterY();
            selector.setVisible(getVisibility() == 0, false);
            androidx.core.graphics.drawable.a.c(selector, exactCenterX, exactCenterY);
        }
    }

    private void h(int i4, View view, float f4, float f5) {
        g(i4, view);
        Drawable selector = getSelector();
        if (selector == null || i4 == -1) {
            return;
        }
        androidx.core.graphics.drawable.a.c(selector, f4, f5);
    }

    private void i(View view, int i4, float f4, float f5) {
        View childAt;
        this.f707j = true;
        a.a(this, f4, f5);
        if (!isPressed()) {
            setPressed(true);
        }
        layoutChildren();
        int i5 = this.f703f;
        if (i5 != -1 && (childAt = getChildAt(i5 - getFirstVisiblePosition())) != null && childAt != view && childAt.isPressed()) {
            childAt.setPressed(false);
        }
        this.f703f = i4;
        a.a(view, f4 - view.getLeft(), f5 - view.getTop());
        if (!view.isPressed()) {
            view.setPressed(true);
        }
        h(i4, view, f4, f5);
        j(false);
        refreshDrawableState();
    }

    private void j(boolean z3) {
        d dVar = this.f704g;
        if (dVar != null) {
            dVar.b(z3);
        }
    }

    private boolean k() {
        return androidx.core.os.a.c() ? c.a(this) : e.a(this);
    }

    private void l(boolean z3) {
        if (androidx.core.os.a.c()) {
            c.b(this, z3);
        } else {
            e.b(this, z3);
        }
    }

    private boolean m() {
        return this.f707j;
    }

    private void n() {
        Drawable selector = getSelector();
        if (selector != null && m() && isPressed()) {
            selector.setState(getDrawableState());
        }
    }

    public int d(int i4, int i5, int i6, int i7, int i8) {
        int listPaddingTop = getListPaddingTop();
        int listPaddingBottom = getListPaddingBottom();
        int dividerHeight = getDividerHeight();
        Drawable divider = getDivider();
        ListAdapter adapter = getAdapter();
        if (adapter == null) {
            return listPaddingTop + listPaddingBottom;
        }
        int i9 = listPaddingTop + listPaddingBottom;
        if (dividerHeight <= 0 || divider == null) {
            dividerHeight = 0;
        }
        int count = adapter.getCount();
        int i10 = 0;
        int i11 = 0;
        int i12 = 0;
        View view = null;
        while (i10 < count) {
            int itemViewType = adapter.getItemViewType(i10);
            if (itemViewType != i11) {
                view = null;
                i11 = itemViewType;
            }
            view = adapter.getView(i10, view, this);
            ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
            if (layoutParams == null) {
                layoutParams = generateDefaultLayoutParams();
                view.setLayoutParams(layoutParams);
            }
            int i13 = layoutParams.height;
            view.measure(i4, i13 > 0 ? View.MeasureSpec.makeMeasureSpec(i13, 1073741824) : View.MeasureSpec.makeMeasureSpec(0, 0));
            view.forceLayout();
            if (i10 > 0) {
                i9 += dividerHeight;
            }
            i9 += view.getMeasuredHeight();
            if (i9 >= i7) {
                return (i8 < 0 || i10 <= i8 || i12 <= 0 || i9 == i7) ? i7 : i12;
            }
            if (i8 >= 0 && i10 >= i8) {
                i12 = i9;
            }
            i10++;
        }
        return i9;
    }

    @Override // android.widget.ListView, android.widget.AbsListView, android.view.ViewGroup, android.view.View
    protected void dispatchDraw(Canvas canvas) {
        c(canvas);
        super.dispatchDraw(canvas);
    }

    @Override // android.widget.AbsListView, android.view.ViewGroup, android.view.View
    protected void drawableStateChanged() {
        if (this.f709l != null) {
            return;
        }
        super.drawableStateChanged();
        j(true);
        n();
    }

    /* JADX WARN: Code restructure failed: missing block: B:6:0x000c, code lost:
    
        if (r0 != 3) goto L8;
     */
    /* JADX WARN: Removed duplicated region for block: B:11:0x004f  */
    /* JADX WARN: Removed duplicated region for block: B:17:0x0065  */
    /* JADX WARN: Removed duplicated region for block: B:9:0x0048 A[ADDED_TO_REGION] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public boolean e(android.view.MotionEvent r8, int r9) {
        /*
            r7 = this;
            int r0 = r8.getActionMasked()
            r1 = 1
            r2 = 0
            if (r0 == r1) goto L16
            r3 = 2
            if (r0 == r3) goto L14
            r9 = 3
            if (r0 == r9) goto L11
        Le:
            r3 = r1
            r9 = r2
            goto L46
        L11:
            r9 = r2
            r3 = r9
            goto L46
        L14:
            r3 = r1
            goto L17
        L16:
            r3 = r2
        L17:
            int r9 = r8.findPointerIndex(r9)
            if (r9 >= 0) goto L1e
            goto L11
        L1e:
            float r4 = r8.getX(r9)
            int r4 = (int) r4
            float r9 = r8.getY(r9)
            int r9 = (int) r9
            int r5 = r7.pointToPosition(r4, r9)
            r6 = -1
            if (r5 != r6) goto L31
            r9 = r1
            goto L46
        L31:
            int r3 = r7.getFirstVisiblePosition()
            int r3 = r5 - r3
            android.view.View r3 = r7.getChildAt(r3)
            float r4 = (float) r4
            float r9 = (float) r9
            r7.i(r3, r5, r4, r9)
            if (r0 != r1) goto Le
            r7.b(r3, r5)
            goto Le
        L46:
            if (r3 == 0) goto L4a
            if (r9 == 0) goto L4d
        L4a:
            r7.a()
        L4d:
            if (r3 == 0) goto L65
            androidx.core.widget.d r9 = r7.f708k
            if (r9 != 0) goto L5a
            androidx.core.widget.d r9 = new androidx.core.widget.d
            r9.<init>(r7)
            r7.f708k = r9
        L5a:
            androidx.core.widget.d r9 = r7.f708k
            r9.m(r1)
            androidx.core.widget.d r9 = r7.f708k
            r9.onTouch(r7, r8)
            return r3
        L65:
            androidx.core.widget.d r8 = r7.f708k
            if (r8 == 0) goto L6c
            r8.m(r2)
        L6c:
            return r3
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.v.e(android.view.MotionEvent, int):boolean");
    }

    @Override // android.view.ViewGroup, android.view.View
    public boolean hasFocus() {
        return this.f706i || super.hasFocus();
    }

    @Override // android.view.View
    public boolean hasWindowFocus() {
        return this.f706i || super.hasWindowFocus();
    }

    @Override // android.view.View
    public boolean isFocused() {
        return this.f706i || super.isFocused();
    }

    @Override // android.view.View
    public boolean isInTouchMode() {
        return (this.f706i && this.f705h) || super.isInTouchMode();
    }

    @Override // android.widget.ListView, android.widget.AbsListView, android.widget.AdapterView, android.view.ViewGroup, android.view.View
    protected void onDetachedFromWindow() {
        this.f709l = null;
        super.onDetachedFromWindow();
    }

    @Override // android.view.View
    public boolean onHoverEvent(MotionEvent motionEvent) {
        int i4 = Build.VERSION.SDK_INT;
        if (i4 < 26) {
            return super.onHoverEvent(motionEvent);
        }
        int actionMasked = motionEvent.getActionMasked();
        if (actionMasked == 10 && this.f709l == null) {
            f fVar = new f();
            this.f709l = fVar;
            fVar.b();
        }
        boolean onHoverEvent = super.onHoverEvent(motionEvent);
        if (actionMasked != 9 && actionMasked != 7) {
            setSelection(-1);
            return onHoverEvent;
        }
        int pointToPosition = pointToPosition((int) motionEvent.getX(), (int) motionEvent.getY());
        if (pointToPosition != -1 && pointToPosition != getSelectedItemPosition()) {
            View childAt = getChildAt(pointToPosition - getFirstVisiblePosition());
            if (childAt.isEnabled()) {
                requestFocus();
                if (i4 < 30 || !b.a()) {
                    setSelectionFromTop(pointToPosition, childAt.getTop() - getTop());
                } else {
                    b.b(this, pointToPosition, childAt);
                }
            }
            n();
        }
        return onHoverEvent;
    }

    @Override // android.widget.AbsListView, android.view.View
    public boolean onTouchEvent(MotionEvent motionEvent) {
        if (motionEvent.getAction() == 0) {
            this.f703f = pointToPosition((int) motionEvent.getX(), (int) motionEvent.getY());
        }
        f fVar = this.f709l;
        if (fVar != null) {
            fVar.a();
        }
        return super.onTouchEvent(motionEvent);
    }

    void setListSelectionHidden(boolean z3) {
        this.f705h = z3;
    }

    @Override // android.widget.AbsListView
    public void setSelector(Drawable drawable) {
        d dVar = drawable != null ? new d(drawable) : null;
        this.f704g = dVar;
        super.setSelector(dVar);
        Rect rect = new Rect();
        if (drawable != null) {
            drawable.getPadding(rect);
        }
        this.f699b = rect.left;
        this.f700c = rect.top;
        this.f701d = rect.right;
        this.f702e = rect.bottom;
    }
}
