package androidx.appcompat.view.menu;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.view.menu.e;
import androidx.appcompat.view.menu.j;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.p;
import androidx.appcompat.widget.p0;
import androidx.appcompat.widget.x;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ActionMenuItemView extends p implements j.a, View.OnClickListener, ActionMenuView.a {

    /* renamed from: h, reason: collision with root package name */
    f f111h;

    /* renamed from: i, reason: collision with root package name */
    private CharSequence f112i;

    /* renamed from: j, reason: collision with root package name */
    private Drawable f113j;

    /* renamed from: k, reason: collision with root package name */
    e.b f114k;

    /* renamed from: l, reason: collision with root package name */
    private x f115l;

    /* renamed from: m, reason: collision with root package name */
    b f116m;

    /* renamed from: n, reason: collision with root package name */
    private boolean f117n;

    /* renamed from: o, reason: collision with root package name */
    private boolean f118o;

    /* renamed from: p, reason: collision with root package name */
    private int f119p;

    /* renamed from: q, reason: collision with root package name */
    private int f120q;

    /* renamed from: r, reason: collision with root package name */
    private int f121r;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class a extends x {
        public a() {
            super(ActionMenuItemView.this);
        }

        @Override // androidx.appcompat.widget.x
        public k b() {
            b bVar = ActionMenuItemView.this.f116m;
            if (bVar != null) {
                return bVar.a();
            }
            return null;
        }

        @Override // androidx.appcompat.widget.x
        protected boolean c() {
            k b4;
            ActionMenuItemView actionMenuItemView = ActionMenuItemView.this;
            e.b bVar = actionMenuItemView.f114k;
            return bVar != null && bVar.a(actionMenuItemView.f111h) && (b4 = b()) != null && b4.i();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class b {
        public abstract k a();
    }

    public ActionMenuItemView(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, 0);
    }

    public ActionMenuItemView(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        Resources resources = context.getResources();
        this.f117n = s();
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, c.i.f2021t, i4, 0);
        this.f119p = obtainStyledAttributes.getDimensionPixelSize(c.i.f2025u, 0);
        obtainStyledAttributes.recycle();
        this.f121r = (int) ((resources.getDisplayMetrics().density * 32.0f) + 0.5f);
        setOnClickListener(this);
        this.f120q = -1;
        setSaveEnabled(false);
    }

    private boolean s() {
        Configuration configuration = getContext().getResources().getConfiguration();
        int i4 = configuration.screenWidthDp;
        int i5 = configuration.screenHeightDp;
        if (i4 < 480) {
            return (i4 >= 640 && i5 >= 480) || configuration.orientation == 2;
        }
        return true;
    }

    private void t() {
        boolean z3 = true;
        boolean z4 = !TextUtils.isEmpty(this.f112i);
        if (this.f113j != null && (!this.f111h.A() || (!this.f117n && !this.f118o))) {
            z3 = false;
        }
        boolean z5 = z4 & z3;
        setText(z5 ? this.f112i : null);
        CharSequence contentDescription = this.f111h.getContentDescription();
        if (TextUtils.isEmpty(contentDescription)) {
            setContentDescription(z5 ? null : this.f111h.getTitle());
        } else {
            setContentDescription(contentDescription);
        }
        CharSequence tooltipText = this.f111h.getTooltipText();
        if (TextUtils.isEmpty(tooltipText)) {
            p0.a(this, z5 ? null : this.f111h.getTitle());
        } else {
            p0.a(this, tooltipText);
        }
    }

    @Override // androidx.appcompat.view.menu.j.a
    public boolean a() {
        return true;
    }

    @Override // androidx.appcompat.widget.ActionMenuView.a
    public boolean b() {
        return r();
    }

    @Override // androidx.appcompat.widget.ActionMenuView.a
    public boolean c() {
        return r() && this.f111h.getIcon() == null;
    }

    @Override // androidx.appcompat.view.menu.j.a
    public void d(f fVar, int i4) {
        this.f111h = fVar;
        setIcon(fVar.getIcon());
        setTitle(fVar.h(this));
        setId(fVar.getItemId());
        setVisibility(fVar.isVisible() ? 0 : 8);
        setEnabled(fVar.isEnabled());
        if (fVar.hasSubMenu() && this.f115l == null) {
            this.f115l = new a();
        }
    }

    @Override // android.widget.TextView, android.view.View
    public CharSequence getAccessibilityClassName() {
        return Button.class.getName();
    }

    @Override // androidx.appcompat.view.menu.j.a
    public f getItemData() {
        return this.f111h;
    }

    @Override // android.view.View.OnClickListener
    public void onClick(View view) {
        e.b bVar = this.f114k;
        if (bVar != null) {
            bVar.a(this.f111h);
        }
    }

    @Override // android.widget.TextView, android.view.View
    public void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);
        this.f117n = s();
        t();
    }

    @Override // androidx.appcompat.widget.p, android.widget.TextView, android.view.View
    protected void onMeasure(int i4, int i5) {
        int i6;
        boolean r3 = r();
        if (r3 && (i6 = this.f120q) >= 0) {
            super.setPadding(i6, getPaddingTop(), getPaddingRight(), getPaddingBottom());
        }
        super.onMeasure(i4, i5);
        int mode = View.MeasureSpec.getMode(i4);
        int size = View.MeasureSpec.getSize(i4);
        int measuredWidth = getMeasuredWidth();
        int min = mode == Integer.MIN_VALUE ? Math.min(size, this.f119p) : this.f119p;
        if (mode != 1073741824 && this.f119p > 0 && measuredWidth < min) {
            super.onMeasure(View.MeasureSpec.makeMeasureSpec(min, 1073741824), i5);
        }
        if (r3 || this.f113j == null) {
            return;
        }
        super.setPadding((getMeasuredWidth() - this.f113j.getBounds().width()) / 2, getPaddingTop(), getPaddingRight(), getPaddingBottom());
    }

    @Override // android.widget.TextView, android.view.View
    public void onRestoreInstanceState(Parcelable parcelable) {
        super.onRestoreInstanceState(null);
    }

    @Override // android.widget.TextView, android.view.View
    public boolean onTouchEvent(MotionEvent motionEvent) {
        x xVar;
        if (this.f111h.hasSubMenu() && (xVar = this.f115l) != null && xVar.onTouch(this, motionEvent)) {
            return true;
        }
        return super.onTouchEvent(motionEvent);
    }

    public boolean r() {
        return !TextUtils.isEmpty(getText());
    }

    public void setCheckable(boolean z3) {
    }

    public void setChecked(boolean z3) {
    }

    public void setExpandedFormat(boolean z3) {
        if (this.f118o != z3) {
            this.f118o = z3;
            f fVar = this.f111h;
            if (fVar != null) {
                fVar.a();
            }
        }
    }

    public void setIcon(Drawable drawable) {
        this.f113j = drawable;
        if (drawable != null) {
            int intrinsicWidth = drawable.getIntrinsicWidth();
            int intrinsicHeight = drawable.getIntrinsicHeight();
            int i4 = this.f121r;
            if (intrinsicWidth > i4) {
                intrinsicHeight = (int) (intrinsicHeight * (i4 / intrinsicWidth));
                intrinsicWidth = i4;
            }
            if (intrinsicHeight > i4) {
                intrinsicWidth = (int) (intrinsicWidth * (i4 / intrinsicHeight));
            } else {
                i4 = intrinsicHeight;
            }
            drawable.setBounds(0, 0, intrinsicWidth, i4);
        }
        setCompoundDrawables(drawable, null, null, null);
        t();
    }

    public void setItemInvoker(e.b bVar) {
        this.f114k = bVar;
    }

    @Override // android.widget.TextView, android.view.View
    public void setPadding(int i4, int i5, int i6, int i7) {
        this.f120q = i4;
        super.setPadding(i4, i5, i6, i7);
    }

    public void setPopupCallback(b bVar) {
        this.f116m = bVar;
    }

    public void setTitle(CharSequence charSequence) {
        this.f112i = charSequence;
        t();
    }
}
