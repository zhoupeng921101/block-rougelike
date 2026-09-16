package androidx.appcompat.view.menu;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.view.ContextMenu;
import android.view.KeyCharacterMap;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class e implements m.a {
    private static final int[] A = {1, 4, 5, 3, 2, 0};

    /* renamed from: a, reason: collision with root package name */
    private final Context f213a;

    /* renamed from: b, reason: collision with root package name */
    private final Resources f214b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f215c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f216d;

    /* renamed from: e, reason: collision with root package name */
    private a f217e;

    /* renamed from: m, reason: collision with root package name */
    private ContextMenu.ContextMenuInfo f225m;

    /* renamed from: n, reason: collision with root package name */
    CharSequence f226n;

    /* renamed from: o, reason: collision with root package name */
    Drawable f227o;

    /* renamed from: p, reason: collision with root package name */
    View f228p;

    /* renamed from: x, reason: collision with root package name */
    private f f236x;

    /* renamed from: z, reason: collision with root package name */
    private boolean f238z;

    /* renamed from: l, reason: collision with root package name */
    private int f224l = 0;

    /* renamed from: q, reason: collision with root package name */
    private boolean f229q = false;

    /* renamed from: r, reason: collision with root package name */
    private boolean f230r = false;

    /* renamed from: s, reason: collision with root package name */
    private boolean f231s = false;

    /* renamed from: t, reason: collision with root package name */
    private boolean f232t = false;

    /* renamed from: u, reason: collision with root package name */
    private boolean f233u = false;

    /* renamed from: v, reason: collision with root package name */
    private ArrayList f234v = new ArrayList();

    /* renamed from: w, reason: collision with root package name */
    private CopyOnWriteArrayList f235w = new CopyOnWriteArrayList();

    /* renamed from: y, reason: collision with root package name */
    private boolean f237y = false;

    /* renamed from: f, reason: collision with root package name */
    private ArrayList f218f = new ArrayList();

    /* renamed from: g, reason: collision with root package name */
    private ArrayList f219g = new ArrayList();

    /* renamed from: h, reason: collision with root package name */
    private boolean f220h = true;

    /* renamed from: i, reason: collision with root package name */
    private ArrayList f221i = new ArrayList();

    /* renamed from: j, reason: collision with root package name */
    private ArrayList f222j = new ArrayList();

    /* renamed from: k, reason: collision with root package name */
    private boolean f223k = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        boolean a(e eVar, MenuItem menuItem);

        void b(e eVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b {
        boolean a(f fVar);
    }

    public e(Context context) {
        this.f213a = context;
        this.f214b = context.getResources();
        T(true);
    }

    private void J(int i4, boolean z3) {
        if (i4 < 0 || i4 >= this.f218f.size()) {
            return;
        }
        this.f218f.remove(i4);
        if (z3) {
            G(true);
        }
    }

    private void P(int i4, CharSequence charSequence, int i5, Drawable drawable, View view) {
        Resources y3 = y();
        if (view != null) {
            this.f228p = view;
            this.f226n = null;
            this.f227o = null;
        } else {
            if (i4 > 0) {
                this.f226n = y3.getText(i4);
            } else if (charSequence != null) {
                this.f226n = charSequence;
            }
            if (i5 > 0) {
                this.f227o = androidx.core.content.a.c(s(), i5);
            } else if (drawable != null) {
                this.f227o = drawable;
            }
            this.f228p = null;
        }
        G(false);
    }

    /* JADX WARN: Code restructure failed: missing block: B:5:0x0019, code lost:
    
        if (androidx.core.view.x.b(android.view.ViewConfiguration.get(r2.f213a), r2.f213a) != false) goto L9;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private void T(boolean r3) {
        /*
            r2 = this;
            if (r3 == 0) goto L1c
            android.content.res.Resources r3 = r2.f214b
            android.content.res.Configuration r3 = r3.getConfiguration()
            int r3 = r3.keyboard
            r0 = 1
            if (r3 == r0) goto L1c
            android.content.Context r3 = r2.f213a
            android.view.ViewConfiguration r3 = android.view.ViewConfiguration.get(r3)
            android.content.Context r1 = r2.f213a
            boolean r3 = androidx.core.view.x.b(r3, r1)
            if (r3 == 0) goto L1c
            goto L1d
        L1c:
            r0 = 0
        L1d:
            r2.f216d = r0
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.view.menu.e.T(boolean):void");
    }

    private f f(int i4, int i5, int i6, int i7, CharSequence charSequence, int i8) {
        return new f(this, i4, i5, i6, i7, charSequence, i8);
    }

    private void h(boolean z3) {
        if (this.f235w.isEmpty()) {
            return;
        }
        V();
        Iterator it = this.f235w.iterator();
        while (it.hasNext()) {
            WeakReference weakReference = (WeakReference) it.next();
            i iVar = (i) weakReference.get();
            if (iVar == null) {
                this.f235w.remove(weakReference);
            } else {
                iVar.f(z3);
            }
        }
        U();
    }

    private boolean i(m mVar, i iVar) {
        if (this.f235w.isEmpty()) {
            return false;
        }
        boolean e4 = iVar != null ? iVar.e(mVar) : false;
        Iterator it = this.f235w.iterator();
        while (it.hasNext()) {
            WeakReference weakReference = (WeakReference) it.next();
            i iVar2 = (i) weakReference.get();
            if (iVar2 == null) {
                this.f235w.remove(weakReference);
            } else if (!e4) {
                e4 = iVar2.e(mVar);
            }
        }
        return e4;
    }

    private static int m(ArrayList arrayList, int i4) {
        for (int size = arrayList.size() - 1; size >= 0; size--) {
            if (((f) arrayList.get(size)).d() <= i4) {
                return size + 1;
            }
        }
        return 0;
    }

    private static int x(int i4) {
        int i5 = ((-65536) & i4) >> 16;
        if (i5 >= 0) {
            int[] iArr = A;
            if (i5 < iArr.length) {
                return (i4 & 65535) | (iArr[i5] << 16);
            }
        }
        throw new IllegalArgumentException("order does not contain a valid category.");
    }

    public ArrayList A() {
        if (!this.f220h) {
            return this.f219g;
        }
        this.f219g.clear();
        int size = this.f218f.size();
        for (int i4 = 0; i4 < size; i4++) {
            f fVar = (f) this.f218f.get(i4);
            if (fVar.isVisible()) {
                this.f219g.add(fVar);
            }
        }
        this.f220h = false;
        this.f223k = true;
        return this.f219g;
    }

    public boolean B() {
        return this.f237y;
    }

    boolean C() {
        return this.f215c;
    }

    public boolean D() {
        return this.f216d;
    }

    void E(f fVar) {
        this.f223k = true;
        G(true);
    }

    void F(f fVar) {
        this.f220h = true;
        G(true);
    }

    public void G(boolean z3) {
        if (this.f229q) {
            this.f230r = true;
            if (z3) {
                this.f231s = true;
                return;
            }
            return;
        }
        if (z3) {
            this.f220h = true;
            this.f223k = true;
        }
        h(z3);
    }

    public boolean H(MenuItem menuItem, int i4) {
        return I(menuItem, null, i4);
    }

    public boolean I(MenuItem menuItem, i iVar, int i4) {
        f fVar = (f) menuItem;
        if (fVar == null || !fVar.isEnabled()) {
            return false;
        }
        boolean j4 = fVar.j();
        fVar.g();
        if (fVar.i()) {
            boolean expandActionView = fVar.expandActionView() | j4;
            if (expandActionView) {
                d(true);
            }
            return expandActionView;
        }
        if (!fVar.hasSubMenu()) {
            if ((i4 & 1) == 0) {
                d(true);
            }
            return j4;
        }
        if ((i4 & 4) == 0) {
            d(false);
        }
        if (!fVar.hasSubMenu()) {
            fVar.w(new m(s(), this, fVar));
        }
        boolean i5 = i((m) fVar.getSubMenu(), iVar) | j4;
        if (!i5) {
            d(true);
        }
        return i5;
    }

    public void K(i iVar) {
        Iterator it = this.f235w.iterator();
        while (it.hasNext()) {
            WeakReference weakReference = (WeakReference) it.next();
            i iVar2 = (i) weakReference.get();
            if (iVar2 == null || iVar2 == iVar) {
                this.f235w.remove(weakReference);
            }
        }
    }

    public void L(a aVar) {
        this.f217e = aVar;
    }

    void M(MenuItem menuItem) {
        int groupId = menuItem.getGroupId();
        int size = this.f218f.size();
        V();
        for (int i4 = 0; i4 < size; i4++) {
            f fVar = (f) this.f218f.get(i4);
            if (fVar.getGroupId() == groupId && fVar.l() && fVar.isCheckable()) {
                fVar.r(fVar == menuItem);
            }
        }
        U();
    }

    protected e N(int i4) {
        P(0, null, i4, null, null);
        return this;
    }

    protected e O(Drawable drawable) {
        P(0, null, 0, drawable, null);
        return this;
    }

    protected e Q(int i4) {
        P(i4, null, 0, null, null);
        return this;
    }

    protected e R(CharSequence charSequence) {
        P(0, charSequence, 0, null, null);
        return this;
    }

    protected e S(View view) {
        P(0, null, 0, null, view);
        return this;
    }

    public void U() {
        this.f229q = false;
        if (this.f230r) {
            this.f230r = false;
            G(this.f231s);
        }
    }

    public void V() {
        if (this.f229q) {
            return;
        }
        this.f229q = true;
        this.f230r = false;
        this.f231s = false;
    }

    protected MenuItem a(int i4, int i5, int i6, CharSequence charSequence) {
        int x3 = x(i6);
        f f4 = f(i4, i5, i6, x3, charSequence, this.f224l);
        ContextMenu.ContextMenuInfo contextMenuInfo = this.f225m;
        if (contextMenuInfo != null) {
            f4.u(contextMenuInfo);
        }
        ArrayList arrayList = this.f218f;
        arrayList.add(m(arrayList, x3), f4);
        G(true);
        return f4;
    }

    @Override // android.view.Menu
    public MenuItem add(int i4) {
        return a(0, 0, 0, this.f214b.getString(i4));
    }

    @Override // android.view.Menu
    public MenuItem add(int i4, int i5, int i6, int i7) {
        return a(i4, i5, i6, this.f214b.getString(i7));
    }

    @Override // android.view.Menu
    public MenuItem add(int i4, int i5, int i6, CharSequence charSequence) {
        return a(i4, i5, i6, charSequence);
    }

    @Override // android.view.Menu
    public MenuItem add(CharSequence charSequence) {
        return a(0, 0, 0, charSequence);
    }

    @Override // android.view.Menu
    public int addIntentOptions(int i4, int i5, int i6, ComponentName componentName, Intent[] intentArr, Intent intent, int i7, MenuItem[] menuItemArr) {
        int i8;
        PackageManager packageManager = this.f213a.getPackageManager();
        List<ResolveInfo> queryIntentActivityOptions = packageManager.queryIntentActivityOptions(componentName, intentArr, intent, 0);
        int size = queryIntentActivityOptions != null ? queryIntentActivityOptions.size() : 0;
        if ((i7 & 1) == 0) {
            removeGroup(i4);
        }
        for (int i9 = 0; i9 < size; i9++) {
            ResolveInfo resolveInfo = queryIntentActivityOptions.get(i9);
            int i10 = resolveInfo.specificIndex;
            Intent intent2 = new Intent(i10 < 0 ? intent : intentArr[i10]);
            ActivityInfo activityInfo = resolveInfo.activityInfo;
            intent2.setComponent(new ComponentName(activityInfo.applicationInfo.packageName, activityInfo.name));
            MenuItem intent3 = add(i4, i5, i6, resolveInfo.loadLabel(packageManager)).setIcon(resolveInfo.loadIcon(packageManager)).setIntent(intent2);
            if (menuItemArr != null && (i8 = resolveInfo.specificIndex) >= 0) {
                menuItemArr[i8] = intent3;
            }
        }
        return size;
    }

    @Override // android.view.Menu
    public SubMenu addSubMenu(int i4) {
        return addSubMenu(0, 0, 0, this.f214b.getString(i4));
    }

    @Override // android.view.Menu
    public SubMenu addSubMenu(int i4, int i5, int i6, int i7) {
        return addSubMenu(i4, i5, i6, this.f214b.getString(i7));
    }

    @Override // android.view.Menu
    public SubMenu addSubMenu(int i4, int i5, int i6, CharSequence charSequence) {
        f fVar = (f) a(i4, i5, i6, charSequence);
        m mVar = new m(this.f213a, this, fVar);
        fVar.w(mVar);
        return mVar;
    }

    @Override // android.view.Menu
    public SubMenu addSubMenu(CharSequence charSequence) {
        return addSubMenu(0, 0, 0, charSequence);
    }

    public void b(i iVar, Context context) {
        this.f235w.add(new WeakReference(iVar));
        iVar.c(context, this);
        this.f223k = true;
    }

    public void c() {
        a aVar = this.f217e;
        if (aVar != null) {
            aVar.b(this);
        }
    }

    @Override // android.view.Menu
    public void clear() {
        f fVar = this.f236x;
        if (fVar != null) {
            e(fVar);
        }
        this.f218f.clear();
        G(true);
    }

    public void clearHeader() {
        this.f227o = null;
        this.f226n = null;
        this.f228p = null;
        G(false);
    }

    @Override // android.view.Menu
    public void close() {
        d(true);
    }

    public final void d(boolean z3) {
        if (this.f233u) {
            return;
        }
        this.f233u = true;
        Iterator it = this.f235w.iterator();
        while (it.hasNext()) {
            WeakReference weakReference = (WeakReference) it.next();
            i iVar = (i) weakReference.get();
            if (iVar == null) {
                this.f235w.remove(weakReference);
            } else {
                iVar.a(this, z3);
            }
        }
        this.f233u = false;
    }

    public boolean e(f fVar) {
        boolean z3 = false;
        if (!this.f235w.isEmpty() && this.f236x == fVar) {
            V();
            Iterator it = this.f235w.iterator();
            while (it.hasNext()) {
                WeakReference weakReference = (WeakReference) it.next();
                i iVar = (i) weakReference.get();
                if (iVar == null) {
                    this.f235w.remove(weakReference);
                } else {
                    z3 = iVar.h(this, fVar);
                    if (z3) {
                        break;
                    }
                }
            }
            U();
            if (z3) {
                this.f236x = null;
            }
        }
        return z3;
    }

    @Override // android.view.Menu
    public MenuItem findItem(int i4) {
        MenuItem findItem;
        int size = size();
        for (int i5 = 0; i5 < size; i5++) {
            f fVar = (f) this.f218f.get(i5);
            if (fVar.getItemId() == i4) {
                return fVar;
            }
            if (fVar.hasSubMenu() && (findItem = fVar.getSubMenu().findItem(i4)) != null) {
                return findItem;
            }
        }
        return null;
    }

    boolean g(e eVar, MenuItem menuItem) {
        a aVar = this.f217e;
        return aVar != null && aVar.a(eVar, menuItem);
    }

    @Override // android.view.Menu
    public MenuItem getItem(int i4) {
        return (MenuItem) this.f218f.get(i4);
    }

    @Override // android.view.Menu
    public boolean hasVisibleItems() {
        if (this.f238z) {
            return true;
        }
        int size = size();
        for (int i4 = 0; i4 < size; i4++) {
            if (((f) this.f218f.get(i4)).isVisible()) {
                return true;
            }
        }
        return false;
    }

    @Override // android.view.Menu
    public boolean isShortcutKey(int i4, KeyEvent keyEvent) {
        return o(i4, keyEvent) != null;
    }

    public boolean j(f fVar) {
        boolean z3 = false;
        if (this.f235w.isEmpty()) {
            return false;
        }
        V();
        Iterator it = this.f235w.iterator();
        while (it.hasNext()) {
            WeakReference weakReference = (WeakReference) it.next();
            i iVar = (i) weakReference.get();
            if (iVar == null) {
                this.f235w.remove(weakReference);
            } else {
                z3 = iVar.j(this, fVar);
                if (z3) {
                    break;
                }
            }
        }
        U();
        if (z3) {
            this.f236x = fVar;
        }
        return z3;
    }

    public int k(int i4) {
        return l(i4, 0);
    }

    public int l(int i4, int i5) {
        int size = size();
        if (i5 < 0) {
            i5 = 0;
        }
        while (i5 < size) {
            if (((f) this.f218f.get(i5)).getGroupId() == i4) {
                return i5;
            }
            i5++;
        }
        return -1;
    }

    public int n(int i4) {
        int size = size();
        for (int i5 = 0; i5 < size; i5++) {
            if (((f) this.f218f.get(i5)).getItemId() == i4) {
                return i5;
            }
        }
        return -1;
    }

    f o(int i4, KeyEvent keyEvent) {
        ArrayList arrayList = this.f234v;
        arrayList.clear();
        p(arrayList, i4, keyEvent);
        if (arrayList.isEmpty()) {
            return null;
        }
        int metaState = keyEvent.getMetaState();
        KeyCharacterMap.KeyData keyData = new KeyCharacterMap.KeyData();
        keyEvent.getKeyData(keyData);
        int size = arrayList.size();
        if (size == 1) {
            return (f) arrayList.get(0);
        }
        boolean C = C();
        for (int i5 = 0; i5 < size; i5++) {
            f fVar = (f) arrayList.get(i5);
            char alphabeticShortcut = C ? fVar.getAlphabeticShortcut() : fVar.getNumericShortcut();
            char[] cArr = keyData.meta;
            if ((alphabeticShortcut == cArr[0] && (metaState & 2) == 0) || ((alphabeticShortcut == cArr[2] && (metaState & 2) != 0) || (C && alphabeticShortcut == '\b' && i4 == 67))) {
                return fVar;
            }
        }
        return null;
    }

    void p(List list, int i4, KeyEvent keyEvent) {
        boolean C = C();
        int modifiers = keyEvent.getModifiers();
        KeyCharacterMap.KeyData keyData = new KeyCharacterMap.KeyData();
        if (keyEvent.getKeyData(keyData) || i4 == 67) {
            int size = this.f218f.size();
            for (int i5 = 0; i5 < size; i5++) {
                f fVar = (f) this.f218f.get(i5);
                if (fVar.hasSubMenu()) {
                    ((e) fVar.getSubMenu()).p(list, i4, keyEvent);
                }
                char alphabeticShortcut = C ? fVar.getAlphabeticShortcut() : fVar.getNumericShortcut();
                if ((modifiers & 69647) == ((C ? fVar.getAlphabeticModifiers() : fVar.getNumericModifiers()) & 69647) && alphabeticShortcut != 0) {
                    char[] cArr = keyData.meta;
                    if ((alphabeticShortcut == cArr[0] || alphabeticShortcut == cArr[2] || (C && alphabeticShortcut == '\b' && i4 == 67)) && fVar.isEnabled()) {
                        list.add(fVar);
                    }
                }
            }
        }
    }

    @Override // android.view.Menu
    public boolean performIdentifierAction(int i4, int i5) {
        return H(findItem(i4), i5);
    }

    @Override // android.view.Menu
    public boolean performShortcut(int i4, KeyEvent keyEvent, int i5) {
        f o3 = o(i4, keyEvent);
        boolean H = o3 != null ? H(o3, i5) : false;
        if ((i5 & 2) != 0) {
            d(true);
        }
        return H;
    }

    public void q() {
        ArrayList A2 = A();
        if (this.f223k) {
            Iterator it = this.f235w.iterator();
            boolean z3 = false;
            while (it.hasNext()) {
                WeakReference weakReference = (WeakReference) it.next();
                i iVar = (i) weakReference.get();
                if (iVar == null) {
                    this.f235w.remove(weakReference);
                } else {
                    z3 |= iVar.g();
                }
            }
            if (z3) {
                this.f221i.clear();
                this.f222j.clear();
                int size = A2.size();
                for (int i4 = 0; i4 < size; i4++) {
                    f fVar = (f) A2.get(i4);
                    if (fVar.k()) {
                        this.f221i.add(fVar);
                    } else {
                        this.f222j.add(fVar);
                    }
                }
            } else {
                this.f221i.clear();
                this.f222j.clear();
                this.f222j.addAll(A());
            }
            this.f223k = false;
        }
    }

    public ArrayList r() {
        q();
        return this.f221i;
    }

    @Override // android.view.Menu
    public void removeGroup(int i4) {
        int k4 = k(i4);
        if (k4 >= 0) {
            int size = this.f218f.size() - k4;
            int i5 = 0;
            while (true) {
                int i6 = i5 + 1;
                if (i5 >= size || ((f) this.f218f.get(k4)).getGroupId() != i4) {
                    break;
                }
                J(k4, false);
                i5 = i6;
            }
            G(true);
        }
    }

    @Override // android.view.Menu
    public void removeItem(int i4) {
        J(n(i4), true);
    }

    public Context s() {
        return this.f213a;
    }

    @Override // android.view.Menu
    public void setGroupCheckable(int i4, boolean z3, boolean z4) {
        int size = this.f218f.size();
        for (int i5 = 0; i5 < size; i5++) {
            f fVar = (f) this.f218f.get(i5);
            if (fVar.getGroupId() == i4) {
                fVar.s(z4);
                fVar.setCheckable(z3);
            }
        }
    }

    @Override // android.view.Menu
    public void setGroupDividerEnabled(boolean z3) {
        this.f237y = z3;
    }

    @Override // android.view.Menu
    public void setGroupEnabled(int i4, boolean z3) {
        int size = this.f218f.size();
        for (int i5 = 0; i5 < size; i5++) {
            f fVar = (f) this.f218f.get(i5);
            if (fVar.getGroupId() == i4) {
                fVar.setEnabled(z3);
            }
        }
    }

    @Override // android.view.Menu
    public void setGroupVisible(int i4, boolean z3) {
        int size = this.f218f.size();
        boolean z4 = false;
        for (int i5 = 0; i5 < size; i5++) {
            f fVar = (f) this.f218f.get(i5);
            if (fVar.getGroupId() == i4 && fVar.x(z3)) {
                z4 = true;
            }
        }
        if (z4) {
            G(true);
        }
    }

    @Override // android.view.Menu
    public void setQwertyMode(boolean z3) {
        this.f215c = z3;
        G(false);
    }

    @Override // android.view.Menu
    public int size() {
        return this.f218f.size();
    }

    public f t() {
        return this.f236x;
    }

    public CharSequence u() {
        return this.f226n;
    }

    public ArrayList v() {
        q();
        return this.f222j;
    }

    boolean w() {
        return this.f232t;
    }

    Resources y() {
        return this.f214b;
    }

    public e z() {
        return this;
    }
}
