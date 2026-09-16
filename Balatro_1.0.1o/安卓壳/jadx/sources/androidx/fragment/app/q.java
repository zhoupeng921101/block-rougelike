package androidx.fragment.app;

import a1.b2.c3;
import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class q implements LayoutInflater.Factory2 {

    /* renamed from: a, reason: collision with root package name */
    final x f1560a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements View.OnAttachStateChangeListener {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ d0 f1561a;

        a(d0 d0Var) {
            this.f1561a = d0Var;
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewAttachedToWindow(View view) {
            Fragment k4 = this.f1561a.k();
            this.f1561a.m();
            l0.n((ViewGroup) k4.I.getParent(), q.this.f1560a).j();
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewDetachedFromWindow(View view) {
        }
    }

    q(x xVar) {
        this.f1560a = xVar;
    }

    @Override // android.view.LayoutInflater.Factory2
    public View onCreateView(View view, String str, Context context, AttributeSet attributeSet) {
        d0 v3;
        if (m.class.getName().equals(str)) {
            return new m(context, attributeSet, this.f1560a);
        }
        if (!"fragment".equals(str)) {
            return null;
        }
        String attributeValue = attributeSet.getAttributeValue(null, "class");
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, u.c.f5010a);
        if (attributeValue == null) {
            attributeValue = obtainStyledAttributes.getString(u.c.f5011b);
        }
        int resourceId = obtainStyledAttributes.getResourceId(u.c.f5012c, -1);
        String string = obtainStyledAttributes.getString(u.c.f5013d);
        obtainStyledAttributes.recycle();
        if (attributeValue == null || !o.b(context.getClassLoader(), attributeValue)) {
            return null;
        }
        int id = view != null ? view.getId() : 0;
        if (id == -1 && resourceId == -1 && string == null) {
            throw new IllegalArgumentException(attributeSet.getPositionDescription() + ": Must specify unique android:id, android:tag, or have a parent with an id for " + attributeValue);
        }
        Fragment g02 = resourceId != -1 ? this.f1560a.g0(resourceId) : null;
        if (g02 == null && string != null) {
            g02 = this.f1560a.h0(string);
        }
        if (g02 == null && id != -1) {
            g02 = this.f1560a.g0(id);
        }
        if (g02 == null) {
            g02 = this.f1560a.r0().a(context.getClassLoader(), attributeValue);
            g02.f1281o = true;
            g02.f1290x = resourceId != 0 ? resourceId : id;
            g02.f1291y = id;
            g02.f1292z = string;
            g02.f1282p = true;
            x xVar = this.f1560a;
            g02.f1286t = xVar;
            g02.f1287u = xVar.t0();
            g02.y0(this.f1560a.t0().u(), attributeSet, g02.f1267b);
            v3 = this.f1560a.j(g02);
            if (x.G0(2)) {
                Log.v("FragmentManager", "Fragment " + g02 + c3.d4(422) + Integer.toHexString(resourceId));
            }
        } else {
            if (g02.f1282p) {
                throw new IllegalArgumentException(attributeSet.getPositionDescription() + ": Duplicate id 0x" + Integer.toHexString(resourceId) + c3.d4(915) + string + c3.d4(1269) + Integer.toHexString(id) + " with another fragment for " + attributeValue);
            }
            g02.f1282p = true;
            x xVar2 = this.f1560a;
            g02.f1286t = xVar2;
            g02.f1287u = xVar2.t0();
            g02.y0(this.f1560a.t0().u(), attributeSet, g02.f1267b);
            v3 = this.f1560a.v(g02);
            if (x.G0(2)) {
                Log.v("FragmentManager", c3.d4(328) + g02 + " has been re-attached via the <fragment> tag: id=0x" + Integer.toHexString(resourceId));
            }
        }
        ViewGroup viewGroup = (ViewGroup) view;
        v.c.g(g02, viewGroup);
        g02.H = viewGroup;
        v3.m();
        v3.j();
        View view2 = g02.I;
        if (view2 == null) {
            throw new IllegalStateException("Fragment " + attributeValue + " did not create a view.");
        }
        if (resourceId != 0) {
            view2.setId(resourceId);
        }
        if (g02.I.getTag() == null) {
            g02.I.setTag(string);
        }
        g02.I.addOnAttachStateChangeListener(new a(v3));
        return g02.I;
    }

    @Override // android.view.LayoutInflater.Factory
    public View onCreateView(String str, Context context, AttributeSet attributeSet) {
        return onCreateView(null, str, context, attributeSet);
    }
}
