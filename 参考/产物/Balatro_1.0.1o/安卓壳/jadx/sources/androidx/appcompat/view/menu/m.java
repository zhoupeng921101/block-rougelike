package androidx.appcompat.view.menu;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import androidx.appcompat.view.menu.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class m extends e implements SubMenu {
    private e B;
    private f C;

    public m(Context context, e eVar, f fVar) {
        super(context);
        this.B = eVar;
        this.C = fVar;
    }

    @Override // androidx.appcompat.view.menu.e
    public boolean B() {
        return this.B.B();
    }

    @Override // androidx.appcompat.view.menu.e
    public boolean C() {
        return this.B.C();
    }

    @Override // androidx.appcompat.view.menu.e
    public boolean D() {
        return this.B.D();
    }

    @Override // androidx.appcompat.view.menu.e
    public void L(e.a aVar) {
        this.B.L(aVar);
    }

    public Menu W() {
        return this.B;
    }

    @Override // androidx.appcompat.view.menu.e
    public boolean e(f fVar) {
        return this.B.e(fVar);
    }

    @Override // androidx.appcompat.view.menu.e
    boolean g(e eVar, MenuItem menuItem) {
        return super.g(eVar, menuItem) || this.B.g(eVar, menuItem);
    }

    @Override // android.view.SubMenu
    public MenuItem getItem() {
        return this.C;
    }

    @Override // androidx.appcompat.view.menu.e
    public boolean j(f fVar) {
        return this.B.j(fVar);
    }

    @Override // androidx.appcompat.view.menu.e, android.view.Menu
    public void setGroupDividerEnabled(boolean z3) {
        this.B.setGroupDividerEnabled(z3);
    }

    @Override // android.view.SubMenu
    public SubMenu setHeaderIcon(int i4) {
        return (SubMenu) super.N(i4);
    }

    @Override // android.view.SubMenu
    public SubMenu setHeaderIcon(Drawable drawable) {
        return (SubMenu) super.O(drawable);
    }

    @Override // android.view.SubMenu
    public SubMenu setHeaderTitle(int i4) {
        return (SubMenu) super.Q(i4);
    }

    @Override // android.view.SubMenu
    public SubMenu setHeaderTitle(CharSequence charSequence) {
        return (SubMenu) super.R(charSequence);
    }

    @Override // android.view.SubMenu
    public SubMenu setHeaderView(View view) {
        return (SubMenu) super.S(view);
    }

    @Override // android.view.SubMenu
    public SubMenu setIcon(int i4) {
        this.C.setIcon(i4);
        return this;
    }

    @Override // android.view.SubMenu
    public SubMenu setIcon(Drawable drawable) {
        this.C.setIcon(drawable);
        return this;
    }

    @Override // androidx.appcompat.view.menu.e, android.view.Menu
    public void setQwertyMode(boolean z3) {
        this.B.setQwertyMode(z3);
    }

    @Override // androidx.appcompat.view.menu.e
    public e z() {
        return this.B.z();
    }
}
