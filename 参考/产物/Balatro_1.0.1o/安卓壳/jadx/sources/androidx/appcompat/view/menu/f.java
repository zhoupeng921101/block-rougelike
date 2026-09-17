package androidx.appcompat.view.menu;

import a1.b2.c3;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.view.ActionProvider;
import android.view.ContextMenu;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import androidx.appcompat.view.menu.j;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f implements m.b {
    private View A;
    private MenuItem.OnActionExpandListener B;
    private ContextMenu.ContextMenuInfo D;

    /* renamed from: a, reason: collision with root package name */
    private final int f239a;

    /* renamed from: b, reason: collision with root package name */
    private final int f240b;

    /* renamed from: c, reason: collision with root package name */
    private final int f241c;

    /* renamed from: d, reason: collision with root package name */
    private final int f242d;

    /* renamed from: e, reason: collision with root package name */
    private CharSequence f243e;

    /* renamed from: f, reason: collision with root package name */
    private CharSequence f244f;

    /* renamed from: g, reason: collision with root package name */
    private Intent f245g;

    /* renamed from: h, reason: collision with root package name */
    private char f246h;

    /* renamed from: j, reason: collision with root package name */
    private char f248j;

    /* renamed from: l, reason: collision with root package name */
    private Drawable f250l;

    /* renamed from: n, reason: collision with root package name */
    e f252n;

    /* renamed from: o, reason: collision with root package name */
    private m f253o;

    /* renamed from: p, reason: collision with root package name */
    private Runnable f254p;

    /* renamed from: q, reason: collision with root package name */
    private MenuItem.OnMenuItemClickListener f255q;

    /* renamed from: r, reason: collision with root package name */
    private CharSequence f256r;

    /* renamed from: s, reason: collision with root package name */
    private CharSequence f257s;

    /* renamed from: z, reason: collision with root package name */
    private int f264z;

    /* renamed from: i, reason: collision with root package name */
    private int f247i = 4096;

    /* renamed from: k, reason: collision with root package name */
    private int f249k = 4096;

    /* renamed from: m, reason: collision with root package name */
    private int f251m = 0;

    /* renamed from: t, reason: collision with root package name */
    private ColorStateList f258t = null;

    /* renamed from: u, reason: collision with root package name */
    private PorterDuff.Mode f259u = null;

    /* renamed from: v, reason: collision with root package name */
    private boolean f260v = false;

    /* renamed from: w, reason: collision with root package name */
    private boolean f261w = false;

    /* renamed from: x, reason: collision with root package name */
    private boolean f262x = false;

    /* renamed from: y, reason: collision with root package name */
    private int f263y = 16;
    private boolean C = false;

    f(e eVar, int i4, int i5, int i6, int i7, CharSequence charSequence, int i8) {
        this.f252n = eVar;
        this.f239a = i5;
        this.f240b = i4;
        this.f241c = i6;
        this.f242d = i7;
        this.f243e = charSequence;
        this.f264z = i8;
    }

    private static void b(StringBuilder sb, int i4, int i5, String str) {
        if ((i4 & i5) == i5) {
            sb.append(str);
        }
    }

    private Drawable c(Drawable drawable) {
        if (drawable != null && this.f262x && (this.f260v || this.f261w)) {
            drawable = androidx.core.graphics.drawable.a.h(drawable).mutate();
            if (this.f260v) {
                androidx.core.graphics.drawable.a.f(drawable, this.f258t);
            }
            if (this.f261w) {
                androidx.core.graphics.drawable.a.g(drawable, this.f259u);
            }
            this.f262x = false;
        }
        return drawable;
    }

    public boolean A() {
        return (this.f264z & 4) == 4;
    }

    public void a() {
        this.f252n.E(this);
    }

    @Override // android.view.MenuItem
    public boolean collapseActionView() {
        if ((this.f264z & 8) == 0) {
            return false;
        }
        if (this.A == null) {
            return true;
        }
        MenuItem.OnActionExpandListener onActionExpandListener = this.B;
        if (onActionExpandListener == null || onActionExpandListener.onMenuItemActionCollapse(this)) {
            return this.f252n.e(this);
        }
        return false;
    }

    public int d() {
        return this.f242d;
    }

    char e() {
        return this.f252n.C() ? this.f248j : this.f246h;
    }

    @Override // android.view.MenuItem
    public boolean expandActionView() {
        if (!i()) {
            return false;
        }
        MenuItem.OnActionExpandListener onActionExpandListener = this.B;
        if (onActionExpandListener == null || onActionExpandListener.onMenuItemActionExpand(this)) {
            return this.f252n.j(this);
        }
        return false;
    }

    String f() {
        char e4 = e();
        if (e4 == 0) {
            return "";
        }
        Resources resources = this.f252n.s().getResources();
        StringBuilder sb = new StringBuilder();
        if (ViewConfiguration.get(this.f252n.s()).hasPermanentMenuKey()) {
            sb.append(resources.getString(c.g.f1942k));
        }
        int i4 = this.f252n.C() ? this.f249k : this.f247i;
        b(sb, i4, 65536, resources.getString(c.g.f1938g));
        b(sb, i4, 4096, resources.getString(c.g.f1934c));
        b(sb, i4, 2, resources.getString(c.g.f1933b));
        b(sb, i4, 1, resources.getString(c.g.f1939h));
        b(sb, i4, 4, resources.getString(c.g.f1941j));
        b(sb, i4, 8, resources.getString(c.g.f1937f));
        if (e4 == '\b') {
            sb.append(resources.getString(c.g.f1935d));
        } else if (e4 == '\n') {
            sb.append(resources.getString(c.g.f1936e));
        } else if (e4 != ' ') {
            sb.append(e4);
        } else {
            sb.append(resources.getString(c.g.f1940i));
        }
        return sb.toString();
    }

    public androidx.core.view.b g() {
        return null;
    }

    @Override // android.view.MenuItem
    public ActionProvider getActionProvider() {
        throw new UnsupportedOperationException("This is not supported, use MenuItemCompat.getActionProvider()");
    }

    @Override // android.view.MenuItem
    public View getActionView() {
        View view = this.A;
        if (view != null) {
            return view;
        }
        return null;
    }

    @Override // android.view.MenuItem
    public int getAlphabeticModifiers() {
        return this.f249k;
    }

    @Override // android.view.MenuItem
    public char getAlphabeticShortcut() {
        return this.f248j;
    }

    @Override // android.view.MenuItem
    public CharSequence getContentDescription() {
        return this.f256r;
    }

    @Override // android.view.MenuItem
    public int getGroupId() {
        return this.f240b;
    }

    @Override // android.view.MenuItem
    public Drawable getIcon() {
        Drawable drawable = this.f250l;
        if (drawable != null) {
            return c(drawable);
        }
        if (this.f251m == 0) {
            return null;
        }
        Drawable b4 = e.a.b(this.f252n.s(), this.f251m);
        this.f251m = 0;
        this.f250l = b4;
        return c(b4);
    }

    @Override // android.view.MenuItem
    public ColorStateList getIconTintList() {
        return this.f258t;
    }

    @Override // android.view.MenuItem
    public PorterDuff.Mode getIconTintMode() {
        return this.f259u;
    }

    @Override // android.view.MenuItem
    public Intent getIntent() {
        return this.f245g;
    }

    @Override // android.view.MenuItem
    public int getItemId() {
        return this.f239a;
    }

    @Override // android.view.MenuItem
    public ContextMenu.ContextMenuInfo getMenuInfo() {
        return this.D;
    }

    @Override // android.view.MenuItem
    public int getNumericModifiers() {
        return this.f247i;
    }

    @Override // android.view.MenuItem
    public char getNumericShortcut() {
        return this.f246h;
    }

    @Override // android.view.MenuItem
    public int getOrder() {
        return this.f241c;
    }

    @Override // android.view.MenuItem
    public SubMenu getSubMenu() {
        return this.f253o;
    }

    @Override // android.view.MenuItem
    public CharSequence getTitle() {
        return this.f243e;
    }

    @Override // android.view.MenuItem
    public CharSequence getTitleCondensed() {
        CharSequence charSequence = this.f244f;
        return charSequence != null ? charSequence : this.f243e;
    }

    @Override // android.view.MenuItem
    public CharSequence getTooltipText() {
        return this.f257s;
    }

    CharSequence h(j.a aVar) {
        return (aVar == null || !aVar.a()) ? getTitle() : getTitleCondensed();
    }

    @Override // android.view.MenuItem
    public boolean hasSubMenu() {
        return this.f253o != null;
    }

    public boolean i() {
        return ((this.f264z & 8) == 0 || this.A == null) ? false : true;
    }

    @Override // android.view.MenuItem
    public boolean isActionViewExpanded() {
        return this.C;
    }

    @Override // android.view.MenuItem
    public boolean isCheckable() {
        return (this.f263y & 1) == 1;
    }

    @Override // android.view.MenuItem
    public boolean isChecked() {
        return (this.f263y & 2) == 2;
    }

    @Override // android.view.MenuItem
    public boolean isEnabled() {
        return (this.f263y & 16) != 0;
    }

    @Override // android.view.MenuItem
    public boolean isVisible() {
        return (this.f263y & 8) == 0;
    }

    public boolean j() {
        MenuItem.OnMenuItemClickListener onMenuItemClickListener = this.f255q;
        if (onMenuItemClickListener != null && onMenuItemClickListener.onMenuItemClick(this)) {
            return true;
        }
        e eVar = this.f252n;
        if (eVar.g(eVar, this)) {
            return true;
        }
        Runnable runnable = this.f254p;
        if (runnable != null) {
            runnable.run();
            return true;
        }
        if (this.f245g == null) {
            return false;
        }
        try {
            this.f252n.s().startActivity(this.f245g);
            return true;
        } catch (ActivityNotFoundException e4) {
            Log.e("MenuItemImpl", c3.d4(662), e4);
            return false;
        }
    }

    public boolean k() {
        return (this.f263y & 32) == 32;
    }

    public boolean l() {
        return (this.f263y & 4) != 0;
    }

    public boolean m() {
        return (this.f264z & 1) == 1;
    }

    public boolean n() {
        return (this.f264z & 2) == 2;
    }

    @Override // android.view.MenuItem
    /* renamed from: o, reason: merged with bridge method [inline-methods] */
    public m.b setActionView(int i4) {
        Context s3 = this.f252n.s();
        setActionView(LayoutInflater.from(s3).inflate(i4, (ViewGroup) new LinearLayout(s3), false));
        return this;
    }

    @Override // android.view.MenuItem
    /* renamed from: p, reason: merged with bridge method [inline-methods] */
    public m.b setActionView(View view) {
        int i4;
        this.A = view;
        if (view != null && view.getId() == -1 && (i4 = this.f239a) > 0) {
            view.setId(i4);
        }
        this.f252n.E(this);
        return this;
    }

    public void q(boolean z3) {
        this.C = z3;
        this.f252n.G(false);
    }

    void r(boolean z3) {
        int i4 = this.f263y;
        int i5 = (z3 ? 2 : 0) | (i4 & (-3));
        this.f263y = i5;
        if (i4 != i5) {
            this.f252n.G(false);
        }
    }

    public void s(boolean z3) {
        this.f263y = (z3 ? 4 : 0) | (this.f263y & (-5));
    }

    @Override // android.view.MenuItem
    public MenuItem setActionProvider(ActionProvider actionProvider) {
        throw new UnsupportedOperationException("This is not supported, use MenuItemCompat.setActionProvider()");
    }

    @Override // android.view.MenuItem
    public MenuItem setAlphabeticShortcut(char c4) {
        if (this.f248j == c4) {
            return this;
        }
        this.f248j = Character.toLowerCase(c4);
        this.f252n.G(false);
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setAlphabeticShortcut(char c4, int i4) {
        if (this.f248j == c4 && this.f249k == i4) {
            return this;
        }
        this.f248j = Character.toLowerCase(c4);
        this.f249k = KeyEvent.normalizeMetaState(i4);
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setCheckable(boolean z3) {
        int i4 = this.f263y;
        int i5 = (z3 ? 1 : 0) | (i4 & (-2));
        this.f263y = i5;
        if (i4 != i5) {
            this.f252n.G(false);
        }
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setChecked(boolean z3) {
        if ((this.f263y & 4) != 0) {
            this.f252n.M(this);
            return this;
        }
        r(z3);
        return this;
    }

    @Override // android.view.MenuItem
    public m.b setContentDescription(CharSequence charSequence) {
        this.f256r = charSequence;
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setEnabled(boolean z3) {
        if (z3) {
            this.f263y |= 16;
        } else {
            this.f263y &= -17;
        }
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setIcon(int i4) {
        this.f250l = null;
        this.f251m = i4;
        this.f262x = true;
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setIcon(Drawable drawable) {
        this.f251m = 0;
        this.f250l = drawable;
        this.f262x = true;
        this.f252n.G(false);
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setIconTintList(ColorStateList colorStateList) {
        this.f258t = colorStateList;
        this.f260v = true;
        this.f262x = true;
        this.f252n.G(false);
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setIconTintMode(PorterDuff.Mode mode) {
        this.f259u = mode;
        this.f261w = true;
        this.f262x = true;
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setIntent(Intent intent) {
        this.f245g = intent;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setNumericShortcut(char c4) {
        if (this.f246h == c4) {
            return this;
        }
        this.f246h = c4;
        this.f252n.G(false);
        return this;
    }

    @Override // m.b, android.view.MenuItem
    public MenuItem setNumericShortcut(char c4, int i4) {
        if (this.f246h == c4 && this.f247i == i4) {
            return this;
        }
        this.f246h = c4;
        this.f247i = KeyEvent.normalizeMetaState(i4);
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setOnActionExpandListener(MenuItem.OnActionExpandListener onActionExpandListener) {
        this.B = onActionExpandListener;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setOnMenuItemClickListener(MenuItem.OnMenuItemClickListener onMenuItemClickListener) {
        this.f255q = onMenuItemClickListener;
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setShortcut(char c4, char c5) {
        this.f246h = c4;
        this.f248j = Character.toLowerCase(c5);
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setShortcut(char c4, char c5, int i4, int i5) {
        this.f246h = c4;
        this.f247i = KeyEvent.normalizeMetaState(i4);
        this.f248j = Character.toLowerCase(c5);
        this.f249k = KeyEvent.normalizeMetaState(i5);
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public void setShowAsAction(int i4) {
        int i5 = i4 & 3;
        if (i5 != 0 && i5 != 1 && i5 != 2) {
            throw new IllegalArgumentException("SHOW_AS_ACTION_ALWAYS, SHOW_AS_ACTION_IF_ROOM, and SHOW_AS_ACTION_NEVER are mutually exclusive.");
        }
        this.f264z = i4;
        this.f252n.E(this);
    }

    @Override // android.view.MenuItem
    public MenuItem setTitle(int i4) {
        return setTitle(this.f252n.s().getString(i4));
    }

    @Override // android.view.MenuItem
    public MenuItem setTitle(CharSequence charSequence) {
        this.f243e = charSequence;
        this.f252n.G(false);
        m mVar = this.f253o;
        if (mVar != null) {
            mVar.setHeaderTitle(charSequence);
        }
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setTitleCondensed(CharSequence charSequence) {
        this.f244f = charSequence;
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public m.b setTooltipText(CharSequence charSequence) {
        this.f257s = charSequence;
        this.f252n.G(false);
        return this;
    }

    @Override // android.view.MenuItem
    public MenuItem setVisible(boolean z3) {
        if (x(z3)) {
            this.f252n.F(this);
        }
        return this;
    }

    public void t(boolean z3) {
        if (z3) {
            this.f263y |= 32;
        } else {
            this.f263y &= -33;
        }
    }

    public String toString() {
        CharSequence charSequence = this.f243e;
        if (charSequence != null) {
            return charSequence.toString();
        }
        return null;
    }

    void u(ContextMenu.ContextMenuInfo contextMenuInfo) {
        this.D = contextMenuInfo;
    }

    @Override // android.view.MenuItem
    /* renamed from: v, reason: merged with bridge method [inline-methods] */
    public m.b setShowAsActionFlags(int i4) {
        setShowAsAction(i4);
        return this;
    }

    public void w(m mVar) {
        this.f253o = mVar;
        mVar.setHeaderTitle(getTitle());
    }

    boolean x(boolean z3) {
        int i4 = this.f263y;
        int i5 = (z3 ? 0 : 8) | (i4 & (-9));
        this.f263y = i5;
        return i4 != i5;
    }

    public boolean y() {
        return this.f252n.w();
    }

    boolean z() {
        return this.f252n.D() && e() != 0;
    }
}
