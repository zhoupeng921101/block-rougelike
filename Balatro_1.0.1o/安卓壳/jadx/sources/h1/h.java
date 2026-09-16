package h1;

import android.accounts.Account;
import android.content.Context;
import android.os.Looper;
import com.google.android.gms.common.api.Scope;
import e1.a;
import e1.f;
import java.util.Collections;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h extends d implements a.f {
    private final e F;
    private final Set G;
    private final Account H;

    protected h(Context context, Looper looper, int i4, e eVar, f.a aVar, f.b bVar) {
        this(context, looper, i4, eVar, (f1.e) aVar, (f1.l) bVar);
    }

    protected h(Context context, Looper looper, int i4, e eVar, f1.e eVar2, f1.l lVar) {
        this(context, looper, i.a(context), d1.i.l(), i4, eVar, (f1.e) q.i(eVar2), (f1.l) q.i(lVar));
    }

    protected h(Context context, Looper looper, i iVar, d1.i iVar2, int i4, e eVar, f1.e eVar2, f1.l lVar) {
        super(context, looper, iVar, iVar2, i4, eVar2 == null ? null : new e0(eVar2), lVar != null ? new f0(lVar) : null, eVar.l());
        this.F = eVar;
        this.H = eVar.a();
        this.G = j0(eVar.d());
    }

    private final Set j0(Set set) {
        Set i02 = i0(set);
        Iterator it = i02.iterator();
        while (it.hasNext()) {
            if (!set.contains((Scope) it.next())) {
                throw new IllegalStateException("Expanding scopes is not permitted, use implied scopes instead");
            }
        }
        return i02;
    }

    @Override // h1.d
    protected final Set B() {
        return this.G;
    }

    @Override // e1.a.f
    public Set b() {
        return m() ? this.G : Collections.EMPTY_SET;
    }

    protected final e h0() {
        return this.F;
    }

    protected Set i0(Set set) {
        return set;
    }

    @Override // h1.d
    public final Account t() {
        return this.H;
    }

    @Override // h1.d
    protected Executor v() {
        return null;
    }
}
