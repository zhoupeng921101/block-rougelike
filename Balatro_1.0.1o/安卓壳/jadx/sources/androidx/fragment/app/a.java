package androidx.fragment.app;

import a1.b2.c3;
import android.util.Log;
import androidx.fragment.app.f0;
import androidx.fragment.app.x;
import com.android.support.BuildConfig;
import java.io.PrintWriter;
import java.util.ArrayList;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a extends f0 implements x.l {

    /* renamed from: t, reason: collision with root package name */
    final x f1323t;

    /* renamed from: u, reason: collision with root package name */
    boolean f1324u;

    /* renamed from: v, reason: collision with root package name */
    int f1325v;

    /* renamed from: w, reason: collision with root package name */
    boolean f1326w;

    a(x xVar) {
        super(xVar.r0(), xVar.t0() != null ? xVar.t0().u().getClassLoader() : null);
        this.f1325v = -1;
        this.f1326w = false;
        this.f1323t = xVar;
    }

    @Override // androidx.fragment.app.x.l
    public boolean a(ArrayList arrayList, ArrayList arrayList2) {
        if (x.G0(2)) {
            Log.v("FragmentManager", "Run: " + this);
        }
        arrayList.add(this);
        arrayList2.add(Boolean.FALSE);
        if (!this.f1453i) {
            return true;
        }
        this.f1323t.i(this);
        return true;
    }

    @Override // androidx.fragment.app.f0
    public int f() {
        return o(false);
    }

    @Override // androidx.fragment.app.f0
    public int g() {
        return o(true);
    }

    @Override // androidx.fragment.app.f0
    public void h() {
        j();
        this.f1323t.b0(this, false);
    }

    @Override // androidx.fragment.app.f0
    public void i() {
        j();
        this.f1323t.b0(this, true);
    }

    @Override // androidx.fragment.app.f0
    void k(int i4, Fragment fragment, String str, int i5) {
        super.k(i4, fragment, str, i5);
        fragment.f1286t = this.f1323t;
    }

    @Override // androidx.fragment.app.f0
    public f0 l(Fragment fragment) {
        x xVar = fragment.f1286t;
        if (xVar == null || xVar == this.f1323t) {
            return super.l(fragment);
        }
        throw new IllegalStateException("Cannot remove Fragment attached to a different FragmentManager. Fragment " + fragment.toString() + " is already attached to a FragmentManager.");
    }

    void n(int i4) {
        if (this.f1453i) {
            boolean G0 = x.G0(2);
            String d4 = c3.d4(1106);
            if (G0) {
                Log.v(d4, c3.d4(720) + this + " by " + i4);
            }
            int size = this.f1447c.size();
            for (int i5 = 0; i5 < size; i5++) {
                f0.a aVar = (f0.a) this.f1447c.get(i5);
                Fragment fragment = aVar.f1465b;
                if (fragment != null) {
                    fragment.f1285s += i4;
                    if (x.G0(2)) {
                        Log.v(d4, c3.d4(1353) + aVar.f1465b + " to " + aVar.f1465b.f1285s);
                    }
                }
            }
        }
    }

    int o(boolean z3) {
        if (this.f1324u) {
            throw new IllegalStateException("commit already called");
        }
        if (x.G0(2)) {
            Log.v("FragmentManager", "Commit: " + this);
            PrintWriter printWriter = new PrintWriter(new k0("FragmentManager"));
            p(c3.d4(416), printWriter);
            printWriter.close();
        }
        this.f1324u = true;
        if (this.f1453i) {
            this.f1325v = this.f1323t.l();
        } else {
            this.f1325v = -1;
        }
        this.f1323t.Y(this, z3);
        return this.f1325v;
    }

    public void p(String str, PrintWriter printWriter) {
        q(str, printWriter, true);
    }

    public void q(String str, PrintWriter printWriter, boolean z3) {
        String str2;
        if (z3) {
            printWriter.print(str);
            printWriter.print("mName=");
            printWriter.print(this.f1455k);
            printWriter.print(" mIndex=");
            printWriter.print(this.f1325v);
            printWriter.print(" mCommitted=");
            printWriter.println(this.f1324u);
            if (this.f1452h != 0) {
                printWriter.print(str);
                printWriter.print("mTransition=#");
                printWriter.print(Integer.toHexString(this.f1452h));
            }
            if (this.f1448d != 0 || this.f1449e != 0) {
                printWriter.print(str);
                printWriter.print("mEnterAnim=#");
                printWriter.print(Integer.toHexString(this.f1448d));
                printWriter.print(" mExitAnim=#");
                printWriter.println(Integer.toHexString(this.f1449e));
            }
            if (this.f1450f != 0 || this.f1451g != 0) {
                printWriter.print(str);
                printWriter.print("mPopEnterAnim=#");
                printWriter.print(Integer.toHexString(this.f1450f));
                printWriter.print(" mPopExitAnim=#");
                printWriter.println(Integer.toHexString(this.f1451g));
            }
            if (this.f1456l != 0 || this.f1457m != null) {
                printWriter.print(str);
                printWriter.print("mBreadCrumbTitleRes=#");
                printWriter.print(Integer.toHexString(this.f1456l));
                printWriter.print(" mBreadCrumbTitleText=");
                printWriter.println(this.f1457m);
            }
            if (this.f1458n != 0 || this.f1459o != null) {
                printWriter.print(str);
                printWriter.print(c3.d4(1308));
                printWriter.print(Integer.toHexString(this.f1458n));
                printWriter.print(" mBreadCrumbShortTitleText=");
                printWriter.println(this.f1459o);
            }
        }
        if (this.f1447c.isEmpty()) {
            return;
        }
        printWriter.print(str);
        printWriter.println("Operations:");
        int size = this.f1447c.size();
        for (int i4 = 0; i4 < size; i4++) {
            f0.a aVar = (f0.a) this.f1447c.get(i4);
            switch (aVar.f1464a) {
                case 0:
                    str2 = "NULL";
                    break;
                case BuildConfig.VERSION_CODE /* 1 */:
                    str2 = "ADD";
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    str2 = c3.d4(1024);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    str2 = "REMOVE";
                    break;
                case 4:
                    str2 = "HIDE";
                    break;
                case 5:
                    str2 = "SHOW";
                    break;
                case 6:
                    str2 = "DETACH";
                    break;
                case 7:
                    str2 = "ATTACH";
                    break;
                case 8:
                    str2 = "SET_PRIMARY_NAV";
                    break;
                case 9:
                    str2 = "UNSET_PRIMARY_NAV";
                    break;
                case 10:
                    str2 = c3.d4(1482);
                    break;
                default:
                    str2 = "cmd=" + aVar.f1464a;
                    break;
            }
            printWriter.print(str);
            printWriter.print(c3.d4(557));
            printWriter.print(i4);
            printWriter.print(c3.d4(324));
            printWriter.print(str2);
            printWriter.print(c3.d4(188));
            printWriter.println(aVar.f1465b);
            if (z3) {
                if (aVar.f1467d != 0 || aVar.f1468e != 0) {
                    printWriter.print(str);
                    printWriter.print("enterAnim=#");
                    printWriter.print(Integer.toHexString(aVar.f1467d));
                    printWriter.print(" exitAnim=#");
                    printWriter.println(Integer.toHexString(aVar.f1468e));
                }
                if (aVar.f1469f != 0 || aVar.f1470g != 0) {
                    printWriter.print(str);
                    printWriter.print("popEnterAnim=#");
                    printWriter.print(Integer.toHexString(aVar.f1469f));
                    printWriter.print(" popExitAnim=#");
                    printWriter.println(Integer.toHexString(aVar.f1470g));
                }
            }
        }
    }

    void r() {
        int size = this.f1447c.size();
        for (int i4 = 0; i4 < size; i4++) {
            f0.a aVar = (f0.a) this.f1447c.get(i4);
            Fragment fragment = aVar.f1465b;
            if (fragment != null) {
                fragment.f1280n = this.f1326w;
                fragment.w1(false);
                fragment.v1(this.f1452h);
                fragment.y1(this.f1460p, this.f1461q);
            }
            switch (aVar.f1464a) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.f1(fragment, false);
                    this.f1323t.j(fragment);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                default:
                    throw new IllegalArgumentException("Unknown cmd: " + aVar.f1464a);
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.Y0(fragment);
                    break;
                case 4:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.D0(fragment);
                    break;
                case 5:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.f1(fragment, false);
                    this.f1323t.j1(fragment);
                    break;
                case 6:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.w(fragment);
                    break;
                case 7:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.f1(fragment, false);
                    this.f1323t.n(fragment);
                    break;
                case 8:
                    this.f1323t.h1(fragment);
                    break;
                case 9:
                    this.f1323t.h1(null);
                    break;
                case 10:
                    this.f1323t.g1(fragment, aVar.f1472i);
                    break;
            }
        }
    }

    void s() {
        for (int size = this.f1447c.size() - 1; size >= 0; size--) {
            f0.a aVar = (f0.a) this.f1447c.get(size);
            Fragment fragment = aVar.f1465b;
            if (fragment != null) {
                fragment.f1280n = this.f1326w;
                fragment.w1(true);
                fragment.v1(x.c1(this.f1452h));
                fragment.y1(this.f1461q, this.f1460p);
            }
            switch (aVar.f1464a) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.f1(fragment, true);
                    this.f1323t.Y0(fragment);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                default:
                    throw new IllegalArgumentException("Unknown cmd: " + aVar.f1464a);
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.j(fragment);
                    break;
                case 4:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.j1(fragment);
                    break;
                case 5:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.f1(fragment, true);
                    this.f1323t.D0(fragment);
                    break;
                case 6:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.n(fragment);
                    break;
                case 7:
                    fragment.s1(aVar.f1467d, aVar.f1468e, aVar.f1469f, aVar.f1470g);
                    this.f1323t.f1(fragment, true);
                    this.f1323t.w(fragment);
                    break;
                case 8:
                    this.f1323t.h1(null);
                    break;
                case 9:
                    this.f1323t.h1(fragment);
                    break;
                case 10:
                    this.f1323t.g1(fragment, aVar.f1471h);
                    break;
            }
        }
    }

    Fragment t(ArrayList arrayList, Fragment fragment) {
        Fragment fragment2 = fragment;
        int i4 = 0;
        while (i4 < this.f1447c.size()) {
            f0.a aVar = (f0.a) this.f1447c.get(i4);
            int i5 = aVar.f1464a;
            if (i5 != 1) {
                if (i5 == 2) {
                    Fragment fragment3 = aVar.f1465b;
                    int i6 = fragment3.f1291y;
                    boolean z3 = false;
                    for (int size = arrayList.size() - 1; size >= 0; size--) {
                        Fragment fragment4 = (Fragment) arrayList.get(size);
                        if (fragment4.f1291y == i6) {
                            if (fragment4 == fragment3) {
                                z3 = true;
                            } else {
                                if (fragment4 == fragment2) {
                                    this.f1447c.add(i4, new f0.a(9, fragment4, true));
                                    i4++;
                                    fragment2 = null;
                                }
                                f0.a aVar2 = new f0.a(3, fragment4, true);
                                aVar2.f1467d = aVar.f1467d;
                                aVar2.f1469f = aVar.f1469f;
                                aVar2.f1468e = aVar.f1468e;
                                aVar2.f1470g = aVar.f1470g;
                                this.f1447c.add(i4, aVar2);
                                arrayList.remove(fragment4);
                                i4++;
                            }
                        }
                    }
                    if (z3) {
                        this.f1447c.remove(i4);
                        i4--;
                    } else {
                        aVar.f1464a = 1;
                        aVar.f1466c = true;
                        arrayList.add(fragment3);
                    }
                } else if (i5 == 3 || i5 == 6) {
                    arrayList.remove(aVar.f1465b);
                    Fragment fragment5 = aVar.f1465b;
                    if (fragment5 == fragment2) {
                        this.f1447c.add(i4, new f0.a(9, fragment5));
                        i4++;
                        fragment2 = null;
                    }
                } else if (i5 != 7) {
                    if (i5 == 8) {
                        this.f1447c.add(i4, new f0.a(9, fragment2, true));
                        aVar.f1466c = true;
                        i4++;
                        fragment2 = aVar.f1465b;
                    }
                }
                i4++;
            }
            arrayList.add(aVar.f1465b);
            i4++;
        }
        return fragment2;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(128);
        sb.append("BackStackEntry{");
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        if (this.f1325v >= 0) {
            sb.append(c3.d4(110));
            sb.append(this.f1325v);
        }
        if (this.f1455k != null) {
            sb.append(" ");
            sb.append(this.f1455k);
        }
        sb.append("}");
        return sb.toString();
    }

    public String u() {
        return this.f1455k;
    }

    public void v() {
        if (this.f1463s != null) {
            for (int i4 = 0; i4 < this.f1463s.size(); i4++) {
                ((Runnable) this.f1463s.get(i4)).run();
            }
            this.f1463s = null;
        }
    }

    Fragment w(ArrayList arrayList, Fragment fragment) {
        for (int size = this.f1447c.size() - 1; size >= 0; size--) {
            f0.a aVar = (f0.a) this.f1447c.get(size);
            int i4 = aVar.f1464a;
            if (i4 != 1) {
                if (i4 != 3) {
                    switch (i4) {
                        case 8:
                            fragment = null;
                            break;
                        case 9:
                            fragment = aVar.f1465b;
                            break;
                        case 10:
                            aVar.f1472i = aVar.f1471h;
                            break;
                    }
                }
                arrayList.add(aVar.f1465b);
            }
            arrayList.remove(aVar.f1465b);
        }
        return fragment;
    }
}
