package androidx.appcompat.view.menu;

import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.ActionProvider;
import android.view.ContextMenu;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a implements m.b {

    /* renamed from: a, reason: collision with root package name */
    private final int f143a;

    /* renamed from: b, reason: collision with root package name */
    private final int f144b;

    /* renamed from: c, reason: collision with root package name */
    private final int f145c;

    /* renamed from: d, reason: collision with root package name */
    private CharSequence f146d;

    /* renamed from: e, reason: collision with root package name */
    private CharSequence f147e;

    /* renamed from: f, reason: collision with root package name */
    private Intent f148f;

    /* renamed from: g, reason: collision with root package name */
    private char f149g;

    /* renamed from: i, reason: collision with root package name */
    private char f151i;

    /* renamed from: k, reason: collision with root package name */
    private Drawable f153k;

    /* renamed from: l, reason: collision with root package name */
    private Context f154l;

    /* renamed from: m, reason: collision with root package name */
    private MenuItem.OnMenuItemClickListener f155m;

    /* renamed from: n, reason: collision with root package name */
    private CharSequence f156n;

    /* renamed from: o, reason: collision with root package name */
    private CharSequence f157o;

    /* renamed from: h, reason: collision with root package name */
    private int f150h = 4096;

    /* renamed from: j, reason: collision with root package name */
    private int f152j = 4096;

    /* renamed from: p, reason: collision with root package name */
    private ColorStateList f158p = null;

    /* renamed from: q, reason: collision with root package name */
    private PorterDuff.Mode f159q = null;

    /* renamed from: r, reason: collision with root package name */
    private boolean f160r = false;

    /* renamed from: s, reason: collision with root package name */
    private boolean f161s = false;

    /* renamed from: t, reason: collision with root package name */
    private int f162t = 16;

    public a(Context context, int i4, int i5, int i6, int i7, CharSequence charSequence) {
        this.f154l = context;
        this.f143a = i5;
        this.f144b = i4;
        this.f145c = i7;
        this.f146d = charSequence;
    }

    private void a() {
        Drawable drawable = this.f153k;
        if (drawable != null) {
            if (this.f160r || this.f161s) {
                Drawable h4 = androidx.core.graphics.drawable.a.h(drawable);
                this.f153k = h4;
                Drawable mutate = h4.mutate();
                this.f153k = mutate;
                if (this.f160r) {
                    androidx.core.graphics.drawable.a.f(mutate, this.f158p);
                }
                if (this.f161s) {
                    androidx.core.graphics.drawable.a.g(this.f153k, this.f159q);
                }
            }
        }
    }

    @Override // android.view.MenuItem
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public m.b setActionView(int i4) {
        throw new UnsupportedOperationException();
    }

    @Override // android.view.MenuItem
    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public m.b setActionView(View view) {
        throw new UnsupportedOperationException();
    }

    @Override // android.view.MenuItem
    public boolean collapseActionView() {
        return false;
    }

    @Override // android.view.MenuItem
    /* renamed from: d, reason: merged with bridge method [inline-methods] */
    public m.b setShowAsActionFlags(int i4) {
        setShowAsAction(i4);
        return this;
    }

    @Override // android.view.MenuItem
    public boolean expandActionView() {
        return false;
    }

    @Override // android.view.MenuItem
    public ActionProvider getActionProvider() {
        throw new UnsupportedOperationException();
    }

    @Override // android.view.MenuItem
    public View getActionView() {
        return null;
    }

    @Override // android.view.MenuItem
    public int getAlphabeticModifiers() {
        return this.f152j;
    }

    @Override // android.view.MenuItem
    public char getAlphabeticShortcut() {
        return this.f151i;
    }

    @Override // android.view.MenuItem
    public CharSequence getContentDescription() {
        return this.f156n;
    }

    @Override // android.view.MenuItem
    public int getGroupId() {
        return this.f144b;
    }

    @Override // android.view.MenuItem
    public Drawable getIcon() {
        return this.f153k;
    }

    @Override // android.view.MenuItem
    public ColorStateList getIconTintList() {
        return this.f158p;
    }

    @Override // android.view.MenuItem
    public PorterDuff.Mode getIconTintMode() {
        return this.f159q;
    }

    @Override // android.view.MenuItem
    public Intent getIntent() {
        return this.f148f;
    }

    @Override // android.view.MenuItem
    public int getItemId() {
        return this.f143a;
    }

    @Override // android.view.MenuItem
    public ContextMenu.ContextMenuInfo getMenuInfo() {
        return null;
    }

    @Override // android.view.MenuItem
    public int getNumericModifiers() {
        return this.f150h;
    }

    @Override // android.view.MenuItem
    public char getNumericShortcut() {
        return this.f149g;
    }

    @Override // android.view.MenuItem
    public int getOrder() {
        return this.f145c;
    }

    @Override // android.view.MenuItem
    public SubMenu getSubMenu() {
        return null;
    }

    @Override // android.view.MenuItem
    public CharSequence getTitle() {
        return this.f146d;
    }

    @Override // android.view.MenuItem
    public CharSequence getTitleCondensed() {
        CharSequence charSequence = this.f147e;
        return charSequence != null ? charSequence : this.f146d;
    }

    @Override // android.view.MenuItem
    public CharSequence getTooltipText() {
        return this.f157o;
    }

    @Override // android.view.MenuItem
    public boolean hasSubMenu() {
        return false;
    }

    @Override // android.view.MenuItem
    public boolean isActionViewExpanded() {
        return false;
    }

    @Override // android.view.MenuItem
    public boolean isCheckable() {
        return (this.f162t & 1) != 0;
    }

    @Override // android.view.MenuItem
    public boolean isChecked() {
        return (this.f162t & 2) != 0;
    }

    @Override // android.view.MenuItem
    public boolean isEnabled() {
        return (this.f162t & 16) != 0;
    }

    @Override // android.view.MenuItem
    public boolean isVisible() {
        return (this.f162t & 8) == 0;
    }

    @Override // android.view.MenuItem
    public MenuItem setActionProvider(ActionProvider actionProvider) {
        throw new UnsupportedOperationException();
    }

    @Override // android.view.MenuItem
    public MenuItem setAlphabeticShortcut(char c4) {
        this.f151i = Character.toLowerCase(c4);
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setAlphabeticShortcut(char c4, int i4) {
        this.f151i = Character.toLowerCase(c4);
        this.f152j = KeyEvent.normalizeMetaState(i4);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setCheckable(boolean z3) {
        this.f162t = (z3 ? 1 : 0) | (this.f162t & (-2));
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setChecked(boolean z3) {
        this.f162t = (z3 ? 2 : 0) | (this.f162t & (-3));
        return this;
    }

    @Override // android.view.MenuItem
    public m.b setContentDescription(CharSequence charSequence) {
        this.f156n = charSequence;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setEnabled(boolean z3) {
        this.f162t = (z3 ? 16 : 0) | (this.f162t & (-17));
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setIcon(int i4) {
        this.f153k = androidx.core.content.a.c(this.f154l, i4);
        a();
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setIcon(Drawable drawable) {
        this.f153k = drawable;
        a();
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setIconTintList(ColorStateList colorStateList) {
        this.f158p = colorStateList;
        this.f160r = true;
        a();
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setIconTintMode(PorterDuff.Mode mode) {
        this.f159q = mode;
        this.f161s = true;
        a();
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setIntent(Intent intent) {
        this.f148f = intent;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setNumericShortcut(char c4) {
        this.f149g = c4;
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setNumericShortcut(char c4, int i4) {
        this.f149g = c4;
        this.f150h = KeyEvent.normalizeMetaState(i4);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setOnActionExpandListener(MenuItem.OnActionExpandListener onActionExpandListener) {
        throw new UnsupportedOperationException();
    }

    @Override // android.view.MenuItem
    public MenuItem setOnMenuItemClickListener(MenuItem.OnMenuItemClickListener onMenuItemClickListener) {
        this.f155m = onMenuItemClickListener;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setShortcut(char c4, char c5) {
        this.f149g = c4;
        this.f151i = Character.toLowerCase(c5);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setShortcut(char c4, char c5, int i4, int i5) {
        this.f149g = c4;
        this.f150h = KeyEvent.normalizeMetaState(i4);
        this.f151i = Character.toLowerCase(c5);
        this.f152j = KeyEvent.normalizeMetaState(i5);
        return this;
    }

    @Override // android.view.MenuItem
    public void setShowAsAction(int i4) {
    }

    @Override // android.view.MenuItem
    public MenuItem setTitle(int i4) {
        this.f146d = this.f154l.getResources().getString(i4);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setTitle(CharSequence charSequence) {
        this.f146d = charSequence;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setTitleCondensed(CharSequence charSequence) {
        this.f147e = charSequence;
        return this;
    }

    @Override // android.view.MenuItem
    public m.b setTooltipText(CharSequence charSequence) {
        this.f157o = charSequence;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setVisible(boolean z3) {
        this.f162t = (this.f162t & 8) | (z3 ? 0 : 8);
        return this;
    }
}
