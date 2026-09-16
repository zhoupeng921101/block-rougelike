package androidx.fragment.app;

import a1.b2.c3;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class e0 {

    /* renamed from: a, reason: collision with root package name */
    private final ArrayList f1440a = new ArrayList();

    /* renamed from: b, reason: collision with root package name */
    private final HashMap f1441b = new HashMap();

    /* renamed from: c, reason: collision with root package name */
    private final HashMap f1442c = new HashMap();

    /* renamed from: d, reason: collision with root package name */
    private a0 f1443d;

    e0() {
    }

    void A(a0 a0Var) {
        this.f1443d = a0Var;
    }

    c0 B(String str, c0 c0Var) {
        return c0Var != null ? (c0) this.f1442c.put(str, c0Var) : (c0) this.f1442c.remove(str);
    }

    void a(Fragment fragment) {
        if (this.f1440a.contains(fragment)) {
            throw new IllegalStateException("Fragment already added: " + fragment);
        }
        synchronized (this.f1440a) {
            this.f1440a.add(fragment);
        }
        fragment.f1278l = true;
    }

    void b() {
        this.f1441b.values().removeAll(Collections.singleton(null));
    }

    boolean c(String str) {
        return this.f1441b.get(str) != null;
    }

    void d(int i4) {
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null) {
                d0Var.t(i4);
            }
        }
    }

    void e(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        String str2 = str + "    ";
        if (!this.f1441b.isEmpty()) {
            printWriter.print(str);
            printWriter.println("Active Fragments:");
            for (d0 d0Var : this.f1441b.values()) {
                printWriter.print(str);
                if (d0Var != null) {
                    Fragment k4 = d0Var.k();
                    printWriter.println(k4);
                    k4.h(str2, fileDescriptor, printWriter, strArr);
                } else {
                    printWriter.println("null");
                }
            }
        }
        int size = this.f1440a.size();
        if (size > 0) {
            printWriter.print(str);
            printWriter.println("Added Fragments:");
            for (int i4 = 0; i4 < size; i4++) {
                Fragment fragment = (Fragment) this.f1440a.get(i4);
                printWriter.print(str);
                printWriter.print("  #");
                printWriter.print(i4);
                printWriter.print(": ");
                printWriter.println(fragment.toString());
            }
        }
    }

    Fragment f(String str) {
        d0 d0Var = (d0) this.f1441b.get(str);
        if (d0Var != null) {
            return d0Var.k();
        }
        return null;
    }

    Fragment g(int i4) {
        for (int size = this.f1440a.size() - 1; size >= 0; size--) {
            Fragment fragment = (Fragment) this.f1440a.get(size);
            if (fragment != null && fragment.f1290x == i4) {
                return fragment;
            }
        }
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null) {
                Fragment k4 = d0Var.k();
                if (k4.f1290x == i4) {
                    return k4;
                }
            }
        }
        return null;
    }

    Fragment h(String str) {
        if (str != null) {
            for (int size = this.f1440a.size() - 1; size >= 0; size--) {
                Fragment fragment = (Fragment) this.f1440a.get(size);
                if (fragment != null && str.equals(fragment.f1292z)) {
                    return fragment;
                }
            }
        }
        if (str == null) {
            return null;
        }
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null) {
                Fragment k4 = d0Var.k();
                if (str.equals(k4.f1292z)) {
                    return k4;
                }
            }
        }
        return null;
    }

    Fragment i(String str) {
        Fragment k4;
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null && (k4 = d0Var.k().k(str)) != null) {
                return k4;
            }
        }
        return null;
    }

    int j(Fragment fragment) {
        View view;
        View view2;
        ViewGroup viewGroup = fragment.H;
        if (viewGroup == null) {
            return -1;
        }
        int indexOf = this.f1440a.indexOf(fragment);
        for (int i4 = indexOf - 1; i4 >= 0; i4--) {
            Fragment fragment2 = (Fragment) this.f1440a.get(i4);
            if (fragment2.H == viewGroup && (view2 = fragment2.I) != null) {
                return viewGroup.indexOfChild(view2) + 1;
            }
        }
        while (true) {
            indexOf++;
            if (indexOf >= this.f1440a.size()) {
                return -1;
            }
            Fragment fragment3 = (Fragment) this.f1440a.get(indexOf);
            if (fragment3.H == viewGroup && (view = fragment3.I) != null) {
                return viewGroup.indexOfChild(view);
            }
        }
    }

    List k() {
        ArrayList arrayList = new ArrayList();
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null) {
                arrayList.add(d0Var);
            }
        }
        return arrayList;
    }

    List l() {
        ArrayList arrayList = new ArrayList();
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null) {
                arrayList.add(d0Var.k());
            } else {
                arrayList.add(null);
            }
        }
        return arrayList;
    }

    ArrayList m() {
        return new ArrayList(this.f1442c.values());
    }

    d0 n(String str) {
        return (d0) this.f1441b.get(str);
    }

    List o() {
        ArrayList arrayList;
        if (this.f1440a.isEmpty()) {
            return Collections.EMPTY_LIST;
        }
        synchronized (this.f1440a) {
            arrayList = new ArrayList(this.f1440a);
        }
        return arrayList;
    }

    a0 p() {
        return this.f1443d;
    }

    c0 q(String str) {
        return (c0) this.f1442c.get(str);
    }

    void r(d0 d0Var) {
        Fragment k4 = d0Var.k();
        if (c(k4.f1272f)) {
            return;
        }
        this.f1441b.put(k4.f1272f, d0Var);
        if (k4.D) {
            if (k4.C) {
                this.f1443d.e(k4);
            } else {
                this.f1443d.o(k4);
            }
            k4.D = false;
        }
        if (x.G0(2)) {
            Log.v("FragmentManager", "Added fragment to active set " + k4);
        }
    }

    void s(d0 d0Var) {
        Fragment k4 = d0Var.k();
        if (k4.C) {
            this.f1443d.o(k4);
        }
        if (((d0) this.f1441b.put(k4.f1272f, null)) != null && x.G0(2)) {
            Log.v(c3.d4(1484), "Removed fragment from active set " + k4);
        }
    }

    void t() {
        ArrayList arrayList = this.f1440a;
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            d0 d0Var = (d0) this.f1441b.get(((Fragment) obj).f1272f);
            if (d0Var != null) {
                d0Var.m();
            }
        }
        for (d0 d0Var2 : this.f1441b.values()) {
            if (d0Var2 != null) {
                d0Var2.m();
                Fragment k4 = d0Var2.k();
                if (k4.f1279m && !k4.a0()) {
                    if (k4.f1280n && !this.f1442c.containsKey(k4.f1272f)) {
                        d0Var2.r();
                    }
                    s(d0Var2);
                }
            }
        }
    }

    void u(Fragment fragment) {
        synchronized (this.f1440a) {
            this.f1440a.remove(fragment);
        }
        fragment.f1278l = false;
    }

    void v() {
        this.f1441b.clear();
    }

    void w(List list) {
        this.f1440a.clear();
        if (list != null) {
            Iterator it = list.iterator();
            while (it.hasNext()) {
                String str = (String) it.next();
                Fragment f4 = f(str);
                if (f4 == null) {
                    throw new IllegalStateException("No instantiated fragment for (" + str + ")");
                }
                if (x.G0(2)) {
                    Log.v("FragmentManager", "restoreSaveState: added (" + str + c3.d4(1267) + f4);
                }
                a(f4);
            }
        }
    }

    void x(ArrayList arrayList) {
        this.f1442c.clear();
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            c0 c0Var = (c0) obj;
            this.f1442c.put(c0Var.f1352f, c0Var);
        }
    }

    ArrayList y() {
        ArrayList arrayList = new ArrayList(this.f1441b.size());
        for (d0 d0Var : this.f1441b.values()) {
            if (d0Var != null) {
                Fragment k4 = d0Var.k();
                d0Var.r();
                arrayList.add(k4.f1272f);
                if (x.G0(2)) {
                    Log.v("FragmentManager", "Saved state of " + k4 + ": " + k4.f1267b);
                }
            }
        }
        return arrayList;
    }

    ArrayList z() {
        synchronized (this.f1440a) {
            try {
                if (this.f1440a.isEmpty()) {
                    return null;
                }
                ArrayList arrayList = new ArrayList(this.f1440a.size());
                ArrayList arrayList2 = this.f1440a;
                int size = arrayList2.size();
                int i4 = 0;
                while (i4 < size) {
                    Object obj = arrayList2.get(i4);
                    i4++;
                    Fragment fragment = (Fragment) obj;
                    arrayList.add(fragment.f1272f);
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "saveAllState: adding fragment (" + fragment.f1272f + "): " + fragment);
                    }
                }
                return arrayList;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
