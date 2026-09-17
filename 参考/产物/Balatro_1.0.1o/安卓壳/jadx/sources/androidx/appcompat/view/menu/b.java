package androidx.appcompat.view.menu;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.appcompat.view.menu.i;
import androidx.appcompat.view.menu.j;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b implements i {

    /* renamed from: a, reason: collision with root package name */
    protected Context f163a;

    /* renamed from: b, reason: collision with root package name */
    protected Context f164b;

    /* renamed from: c, reason: collision with root package name */
    protected e f165c;

    /* renamed from: d, reason: collision with root package name */
    protected LayoutInflater f166d;

    /* renamed from: e, reason: collision with root package name */
    protected LayoutInflater f167e;

    /* renamed from: f, reason: collision with root package name */
    private i.a f168f;

    /* renamed from: g, reason: collision with root package name */
    private int f169g;

    /* renamed from: h, reason: collision with root package name */
    private int f170h;

    /* renamed from: i, reason: collision with root package name */
    protected j f171i;

    public b(Context context, int i4, int i5) {
        this.f163a = context;
        this.f166d = LayoutInflater.from(context);
        this.f169g = i4;
        this.f170h = i5;
    }

    @Override // androidx.appcompat.view.menu.i
    public void a(e eVar, boolean z3) {
        i.a aVar = this.f168f;
        if (aVar != null) {
            aVar.a(eVar, z3);
        }
    }

    protected void b(View view, int i4) {
        ViewGroup viewGroup = (ViewGroup) view.getParent();
        if (viewGroup != null) {
            viewGroup.removeView(view);
        }
        ((ViewGroup) this.f171i).addView(view, i4);
    }

    @Override // androidx.appcompat.view.menu.i
    public void c(Context context, e eVar) {
        this.f164b = context;
        this.f167e = LayoutInflater.from(context);
        this.f165c = eVar;
    }

    public abstract void d(f fVar, j.a aVar);

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r2v4, types: [androidx.appcompat.view.menu.e] */
    @Override // androidx.appcompat.view.menu.i
    public boolean e(m mVar) {
        i.a aVar = this.f168f;
        m mVar2 = mVar;
        if (aVar == null) {
            return false;
        }
        if (mVar == null) {
            mVar2 = this.f165c;
        }
        return aVar.b(mVar2);
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // androidx.appcompat.view.menu.i
    public void f(boolean z3) {
        ViewGroup viewGroup = (ViewGroup) this.f171i;
        if (viewGroup == null) {
            return;
        }
        e eVar = this.f165c;
        int i4 = 0;
        if (eVar != null) {
            eVar.q();
            ArrayList A = this.f165c.A();
            int size = A.size();
            int i5 = 0;
            for (int i6 = 0; i6 < size; i6++) {
                f fVar = (f) A.get(i6);
                if (o(i5, fVar)) {
                    View childAt = viewGroup.getChildAt(i5);
                    f itemData = childAt instanceof j.a ? ((j.a) childAt).getItemData() : null;
                    View n3 = n(fVar, childAt, viewGroup);
                    if (fVar != itemData) {
                        n3.setPressed(false);
                        n3.jumpDrawablesToCurrentState();
                    }
                    if (n3 != childAt) {
                        b(n3, i5);
                    }
                    i5++;
                }
            }
            i4 = i5;
        }
        while (i4 < viewGroup.getChildCount()) {
            if (!l(viewGroup, i4)) {
                i4++;
            }
        }
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean h(e eVar, f fVar) {
        return false;
    }

    public j.a i(ViewGroup viewGroup) {
        return (j.a) this.f166d.inflate(this.f170h, viewGroup, false);
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean j(e eVar, f fVar) {
        return false;
    }

    @Override // androidx.appcompat.view.menu.i
    public void k(i.a aVar) {
        this.f168f = aVar;
    }

    protected boolean l(ViewGroup viewGroup, int i4) {
        viewGroup.removeViewAt(i4);
        return true;
    }

    public i.a m() {
        return this.f168f;
    }

    /* JADX WARN: Multi-variable type inference failed */
    public View n(f fVar, View view, ViewGroup viewGroup) {
        j.a i4 = view instanceof j.a ? (j.a) view : i(viewGroup);
        d(fVar, i4);
        return (View) i4;
    }

    public abstract boolean o(int i4, f fVar);
}
