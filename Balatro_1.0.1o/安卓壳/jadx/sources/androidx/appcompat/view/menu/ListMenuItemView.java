package androidx.appcompat.view.menu;

import android.R;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;
import androidx.appcompat.view.menu.j;
import androidx.appcompat.widget.l0;
import androidx.core.view.v;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ListMenuItemView extends LinearLayout implements j.a, AbsListView.SelectionBoundsAdjuster {

    /* renamed from: a, reason: collision with root package name */
    private f f126a;

    /* renamed from: b, reason: collision with root package name */
    private ImageView f127b;

    /* renamed from: c, reason: collision with root package name */
    private RadioButton f128c;

    /* renamed from: d, reason: collision with root package name */
    private TextView f129d;

    /* renamed from: e, reason: collision with root package name */
    private CheckBox f130e;

    /* renamed from: f, reason: collision with root package name */
    private TextView f131f;

    /* renamed from: g, reason: collision with root package name */
    private ImageView f132g;

    /* renamed from: h, reason: collision with root package name */
    private ImageView f133h;

    /* renamed from: i, reason: collision with root package name */
    private LinearLayout f134i;

    /* renamed from: j, reason: collision with root package name */
    private Drawable f135j;

    /* renamed from: k, reason: collision with root package name */
    private int f136k;

    /* renamed from: l, reason: collision with root package name */
    private Context f137l;

    /* renamed from: m, reason: collision with root package name */
    private boolean f138m;

    /* renamed from: n, reason: collision with root package name */
    private Drawable f139n;

    /* renamed from: o, reason: collision with root package name */
    private boolean f140o;

    /* renamed from: p, reason: collision with root package name */
    private LayoutInflater f141p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f142q;

    public ListMenuItemView(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, c.a.f1843o);
    }

    public ListMenuItemView(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet);
        l0 s3 = l0.s(getContext(), attributeSet, c.i.f1987k1, i4, 0);
        this.f135j = s3.f(c.i.f1995m1);
        this.f136k = s3.l(c.i.f1991l1, -1);
        this.f138m = s3.a(c.i.f1999n1, false);
        this.f137l = context;
        this.f139n = s3.f(c.i.f2003o1);
        TypedArray obtainStyledAttributes = context.getTheme().obtainStyledAttributes(null, new int[]{R.attr.divider}, c.a.f1842n, 0);
        this.f140o = obtainStyledAttributes.hasValue(0);
        s3.t();
        obtainStyledAttributes.recycle();
    }

    private void b(View view) {
        c(view, -1);
    }

    private void c(View view, int i4) {
        LinearLayout linearLayout = this.f134i;
        if (linearLayout != null) {
            linearLayout.addView(view, i4);
        } else {
            addView(view, i4);
        }
    }

    private void e() {
        CheckBox checkBox = (CheckBox) getInflater().inflate(c.f.f1924f, (ViewGroup) this, false);
        this.f130e = checkBox;
        b(checkBox);
    }

    private void f() {
        ImageView imageView = (ImageView) getInflater().inflate(c.f.f1925g, (ViewGroup) this, false);
        this.f127b = imageView;
        c(imageView, 0);
    }

    private void g() {
        RadioButton radioButton = (RadioButton) getInflater().inflate(c.f.f1926h, (ViewGroup) this, false);
        this.f128c = radioButton;
        b(radioButton);
    }

    private LayoutInflater getInflater() {
        if (this.f141p == null) {
            this.f141p = LayoutInflater.from(getContext());
        }
        return this.f141p;
    }

    private void setSubMenuArrowVisible(boolean z3) {
        ImageView imageView = this.f132g;
        if (imageView != null) {
            imageView.setVisibility(z3 ? 0 : 8);
        }
    }

    @Override // androidx.appcompat.view.menu.j.a
    public boolean a() {
        return false;
    }

    @Override // android.widget.AbsListView.SelectionBoundsAdjuster
    public void adjustListItemSelectionBounds(Rect rect) {
        ImageView imageView = this.f133h;
        if (imageView == null || imageView.getVisibility() != 0) {
            return;
        }
        LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) this.f133h.getLayoutParams();
        rect.top += this.f133h.getHeight() + layoutParams.topMargin + layoutParams.bottomMargin;
    }

    @Override // androidx.appcompat.view.menu.j.a
    public void d(f fVar, int i4) {
        this.f126a = fVar;
        setVisibility(fVar.isVisible() ? 0 : 8);
        setTitle(fVar.h(this));
        setCheckable(fVar.isCheckable());
        h(fVar.z(), fVar.e());
        setIcon(fVar.getIcon());
        setEnabled(fVar.isEnabled());
        setSubMenuArrowVisible(fVar.hasSubMenu());
        setContentDescription(fVar.getContentDescription());
    }

    @Override // androidx.appcompat.view.menu.j.a
    public f getItemData() {
        return this.f126a;
    }

    public void h(boolean z3, char c4) {
        int i4 = (z3 && this.f126a.z()) ? 0 : 8;
        if (i4 == 0) {
            this.f131f.setText(this.f126a.f());
        }
        if (this.f131f.getVisibility() != i4) {
            this.f131f.setVisibility(i4);
        }
    }

    @Override // android.view.View
    protected void onFinishInflate() {
        super.onFinishInflate();
        v.J(this, this.f135j);
        TextView textView = (TextView) findViewById(c.e.A);
        this.f129d = textView;
        int i4 = this.f136k;
        if (i4 != -1) {
            textView.setTextAppearance(this.f137l, i4);
        }
        this.f131f = (TextView) findViewById(c.e.f1914v);
        ImageView imageView = (ImageView) findViewById(c.e.f1917y);
        this.f132g = imageView;
        if (imageView != null) {
            imageView.setImageDrawable(this.f139n);
        }
        this.f133h = (ImageView) findViewById(c.e.f1904l);
        this.f134i = (LinearLayout) findViewById(c.e.f1900h);
    }

    @Override // android.widget.LinearLayout, android.view.View
    protected void onMeasure(int i4, int i5) {
        if (this.f127b != null && this.f138m) {
            ViewGroup.LayoutParams layoutParams = getLayoutParams();
            LinearLayout.LayoutParams layoutParams2 = (LinearLayout.LayoutParams) this.f127b.getLayoutParams();
            int i6 = layoutParams.height;
            if (i6 > 0 && layoutParams2.width <= 0) {
                layoutParams2.width = i6;
            }
        }
        super.onMeasure(i4, i5);
    }

    public void setCheckable(boolean z3) {
        CompoundButton compoundButton;
        View view;
        if (!z3 && this.f128c == null && this.f130e == null) {
            return;
        }
        if (this.f126a.l()) {
            if (this.f128c == null) {
                g();
            }
            compoundButton = this.f128c;
            view = this.f130e;
        } else {
            if (this.f130e == null) {
                e();
            }
            compoundButton = this.f130e;
            view = this.f128c;
        }
        if (z3) {
            compoundButton.setChecked(this.f126a.isChecked());
            if (compoundButton.getVisibility() != 0) {
                compoundButton.setVisibility(0);
            }
            if (view == null || view.getVisibility() == 8) {
                return;
            }
            view.setVisibility(8);
            return;
        }
        CheckBox checkBox = this.f130e;
        if (checkBox != null) {
            checkBox.setVisibility(8);
        }
        RadioButton radioButton = this.f128c;
        if (radioButton != null) {
            radioButton.setVisibility(8);
        }
    }

    public void setChecked(boolean z3) {
        CompoundButton compoundButton;
        if (this.f126a.l()) {
            if (this.f128c == null) {
                g();
            }
            compoundButton = this.f128c;
        } else {
            if (this.f130e == null) {
                e();
            }
            compoundButton = this.f130e;
        }
        compoundButton.setChecked(z3);
    }

    public void setForceShowIcon(boolean z3) {
        this.f142q = z3;
        this.f138m = z3;
    }

    public void setGroupDividerEnabled(boolean z3) {
        ImageView imageView = this.f133h;
        if (imageView != null) {
            imageView.setVisibility((this.f140o || !z3) ? 8 : 0);
        }
    }

    public void setIcon(Drawable drawable) {
        boolean z3 = this.f126a.y() || this.f142q;
        if (z3 || this.f138m) {
            ImageView imageView = this.f127b;
            if (imageView == null && drawable == null && !this.f138m) {
                return;
            }
            if (imageView == null) {
                f();
            }
            if (drawable == null && !this.f138m) {
                this.f127b.setVisibility(8);
                return;
            }
            ImageView imageView2 = this.f127b;
            if (!z3) {
                drawable = null;
            }
            imageView2.setImageDrawable(drawable);
            if (this.f127b.getVisibility() != 0) {
                this.f127b.setVisibility(0);
            }
        }
    }

    public void setTitle(CharSequence charSequence) {
        if (charSequence == null) {
            if (this.f129d.getVisibility() != 8) {
                this.f129d.setVisibility(8);
            }
        } else {
            this.f129d.setText(charSequence);
            if (this.f129d.getVisibility() != 0) {
                this.f129d.setVisibility(0);
            }
        }
    }
}
