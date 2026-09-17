package s0;

import a1.b2.c3;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabaseLockedException;
import android.os.SystemClock;
import android.util.Base64;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import k0.i;
import n0.a;
import n0.c;
import t0.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class m0 implements s0.d, t0.b, s0.c {

    /* renamed from: j, reason: collision with root package name */
    private static final i0.b f4911j = i0.b.b("proto");

    /* renamed from: e, reason: collision with root package name */
    private final t0 f4912e;

    /* renamed from: f, reason: collision with root package name */
    private final u0.a f4913f;

    /* renamed from: g, reason: collision with root package name */
    private final u0.a f4914g;

    /* renamed from: h, reason: collision with root package name */
    private final e f4915h;

    /* renamed from: i, reason: collision with root package name */
    private final s2.a f4916i;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    interface b {
        Object apply(Object obj);
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {

        /* renamed from: a, reason: collision with root package name */
        final String f4917a;

        /* renamed from: b, reason: collision with root package name */
        final String f4918b;

        private c(String str, String str2) {
            this.f4917a = str;
            this.f4918b = str2;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    interface d {
        Object a();
    }

    m0(u0.a aVar, u0.a aVar2, e eVar, t0 t0Var, s2.a aVar3) {
        this.f4912e = t0Var;
        this.f4913f = aVar;
        this.f4914g = aVar2;
        this.f4915h = eVar;
        this.f4916i = aVar3;
    }

    public static /* synthetic */ Object A(Map map, Cursor cursor) {
        while (true) {
            if (!cursor.moveToNext()) {
                return null;
            }
            long j4 = cursor.getLong(0);
            Set set = (Set) map.get(Long.valueOf(j4));
            if (set == null) {
                set = new HashSet();
                map.put(Long.valueOf(j4), set);
            }
            set.add(new c(cursor.getString(1), cursor.getString(2)));
        }
    }

    public static /* synthetic */ Integer B(final m0 m0Var, long j4, SQLiteDatabase sQLiteDatabase) {
        m0Var.getClass();
        String[] strArr = {String.valueOf(j4)};
        h0(sQLiteDatabase.rawQuery("SELECT COUNT(*), transport_name FROM events WHERE timestamp_ms < ? GROUP BY transport_name", strArr), new b() { // from class: s0.s
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.j(m0.this, (Cursor) obj);
            }
        });
        return Integer.valueOf(sQLiteDatabase.delete("events", "timestamp_ms < ?", strArr));
    }

    public static /* synthetic */ Object C(m0 m0Var, List list, k0.o oVar, Cursor cursor) {
        m0Var.getClass();
        while (cursor.moveToNext()) {
            long j4 = cursor.getLong(0);
            boolean z3 = cursor.getInt(7) != 0;
            i.a k4 = k0.i.a().j(cursor.getString(1)).i(cursor.getLong(2)).k(cursor.getLong(3));
            if (z3) {
                k4.h(new k0.h(f0(cursor.getString(4)), cursor.getBlob(5)));
            } else {
                k4.h(new k0.h(f0(cursor.getString(4)), m0Var.d0(j4)));
            }
            if (!cursor.isNull(6)) {
                k4.g(Integer.valueOf(cursor.getInt(6)));
            }
            list.add(k.a(j4, oVar, k4.d()));
        }
        return null;
    }

    public static /* synthetic */ Object D(m0 m0Var, SQLiteDatabase sQLiteDatabase) {
        m0Var.getClass();
        sQLiteDatabase.compileStatement("DELETE FROM log_event_dropped").execute();
        sQLiteDatabase.compileStatement(c3.d4(408) + m0Var.f4913f.a()).execute();
        return null;
    }

    public static /* synthetic */ n0.a E(final m0 m0Var, String str, final Map map, final a.C0060a c0060a, SQLiteDatabase sQLiteDatabase) {
        m0Var.getClass();
        return (n0.a) h0(sQLiteDatabase.rawQuery(str, new String[0]), new b() { // from class: s0.a0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.r(m0.this, map, c0060a, (Cursor) obj);
            }
        });
    }

    public static /* synthetic */ Long F(Cursor cursor) {
        if (cursor.moveToNext()) {
            return Long.valueOf(cursor.getLong(0));
        }
        return 0L;
    }

    public static /* synthetic */ n0.f G(final long j4, SQLiteDatabase sQLiteDatabase) {
        return (n0.f) h0(sQLiteDatabase.rawQuery("SELECT last_metrics_upload_ms FROM global_log_event_state LIMIT 1", new String[0]), new b() { // from class: s0.d0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.e(j4, (Cursor) obj);
            }
        });
    }

    private c.b H(int i4) {
        c.b bVar = c.b.REASON_UNKNOWN;
        if (i4 == bVar.a()) {
            return bVar;
        }
        c.b bVar2 = c.b.MESSAGE_TOO_OLD;
        if (i4 == bVar2.a()) {
            return bVar2;
        }
        c.b bVar3 = c.b.CACHE_FULL;
        if (i4 == bVar3.a()) {
            return bVar3;
        }
        c.b bVar4 = c.b.f4223i;
        if (i4 == bVar4.a()) {
            return bVar4;
        }
        c.b bVar5 = c.b.MAX_RETRIES_REACHED;
        if (i4 == bVar5.a()) {
            return bVar5;
        }
        c.b bVar6 = c.b.INVALID_PAYLOD;
        if (i4 == bVar6.a()) {
            return bVar6;
        }
        c.b bVar7 = c.b.f4226l;
        if (i4 == bVar7.a()) {
            return bVar7;
        }
        o0.a.b("SQLiteEventStore", "%n is not valid. No matched LogEventDropped-Reason found. Treated it as REASON_UNKNOWN", Integer.valueOf(i4));
        return bVar;
    }

    private void J(final SQLiteDatabase sQLiteDatabase) {
        e0(new d() { // from class: s0.l
            @Override // s0.m0.d
            public final Object a() {
                return m0.u(sQLiteDatabase);
            }
        }, new b() { // from class: s0.w
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.x((Throwable) obj);
            }
        });
    }

    private long K(SQLiteDatabase sQLiteDatabase, k0.o oVar) {
        Long U = U(sQLiteDatabase, oVar);
        if (U != null) {
            return U.longValue();
        }
        ContentValues contentValues = new ContentValues();
        contentValues.put("backend_name", oVar.b());
        contentValues.put("priority", Integer.valueOf(v0.a.a(oVar.d())));
        contentValues.put("next_request_ms", (Integer) 0);
        if (oVar.c() != null) {
            contentValues.put(c3.d4(1257), Base64.encodeToString(oVar.c(), 0));
        }
        return sQLiteDatabase.insert("transport_contexts", null, contentValues);
    }

    private n0.b N() {
        return n0.b.b().b(n0.e.c().b(L()).c(e.f4894a.f()).a()).a();
    }

    private long P() {
        return M().compileStatement("PRAGMA page_count").simpleQueryForLong();
    }

    private long R() {
        return M().compileStatement("PRAGMA page_size").simpleQueryForLong();
    }

    private n0.f T() {
        final long a4 = this.f4913f.a();
        return (n0.f) W(new b() { // from class: s0.c0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.G(a4, (SQLiteDatabase) obj);
            }
        });
    }

    private Long U(SQLiteDatabase sQLiteDatabase, k0.o oVar) {
        StringBuilder sb = new StringBuilder("backend_name = ? and priority = ?");
        ArrayList arrayList = new ArrayList(Arrays.asList(oVar.b(), String.valueOf(v0.a.a(oVar.d()))));
        if (oVar.c() != null) {
            sb.append(" and extras = ?");
            arrayList.add(Base64.encodeToString(oVar.c(), 0));
        } else {
            sb.append(" and extras is null");
        }
        return (Long) h0(sQLiteDatabase.query("transport_contexts", new String[]{c3.d4(224)}, sb.toString(), (String[]) arrayList.toArray(new String[0]), null, null, null), new b() { // from class: s0.n
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.w((Cursor) obj);
            }
        });
    }

    private boolean X() {
        return P() * R() >= this.f4915h.f();
    }

    private List Y(List list, Map map) {
        ListIterator listIterator = list.listIterator();
        while (listIterator.hasNext()) {
            k kVar = (k) listIterator.next();
            if (map.containsKey(Long.valueOf(kVar.c()))) {
                i.a l3 = kVar.b().l();
                for (c cVar : (Set) map.get(Long.valueOf(kVar.c()))) {
                    l3.c(cVar.f4917a, cVar.f4918b);
                }
                listIterator.set(k.a(kVar.c(), kVar.d(), l3.d()));
            }
        }
        return list;
    }

    private List Z(SQLiteDatabase sQLiteDatabase, final k0.o oVar, int i4) {
        final ArrayList arrayList = new ArrayList();
        Long U = U(sQLiteDatabase, oVar);
        if (U == null) {
            return arrayList;
        }
        h0(sQLiteDatabase.query(c3.d4(856), new String[]{"_id", "transport_name", "timestamp_ms", "uptime_ms", "payload_encoding", "payload", c3.d4(1012), c3.d4(139)}, c3.d4(1519), new String[]{U.toString()}, null, null, null, String.valueOf(i4)), new b() { // from class: s0.x
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.C(m0.this, arrayList, oVar, (Cursor) obj);
            }
        });
        return arrayList;
    }

    private Map a0(SQLiteDatabase sQLiteDatabase, List list) {
        final HashMap hashMap = new HashMap();
        StringBuilder sb = new StringBuilder("event_id IN (");
        for (int i4 = 0; i4 < list.size(); i4++) {
            sb.append(((k) list.get(i4)).c());
            if (i4 < list.size() - 1) {
                sb.append(',');
            }
        }
        sb.append(')');
        h0(sQLiteDatabase.query("event_metadata", new String[]{"event_id", "name", "value"}, sb.toString(), null, null, null, null), new b() { // from class: s0.z
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.A(hashMap, (Cursor) obj);
            }
        });
        return hashMap;
    }

    private static byte[] b0(String str) {
        if (str == null) {
            return null;
        }
        return Base64.decode(str, 0);
    }

    private void c0(a.C0060a c0060a, Map map) {
        for (Map.Entry entry : map.entrySet()) {
            c0060a.a(n0.d.c().c((String) entry.getKey()).b((List) entry.getValue()).a());
        }
    }

    private byte[] d0(long j4) {
        return (byte[]) h0(M().query("event_payloads", new String[]{c3.d4(1258)}, "event_id = ?", new String[]{String.valueOf(j4)}, null, null, "sequence_num"), new b() { // from class: s0.b0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.n((Cursor) obj);
            }
        });
    }

    public static /* synthetic */ n0.f e(long j4, Cursor cursor) {
        cursor.moveToNext();
        return n0.f.c().c(cursor.getLong(0)).b(j4).a();
    }

    private Object e0(d dVar, b bVar) {
        long a4 = this.f4914g.a();
        while (true) {
            try {
                return dVar.a();
            } catch (SQLiteDatabaseLockedException e4) {
                if (this.f4914g.a() >= this.f4915h.b() + a4) {
                    return bVar.apply(e4);
                }
                SystemClock.sleep(50L);
            }
        }
    }

    public static /* synthetic */ List f(m0 m0Var, k0.o oVar, SQLiteDatabase sQLiteDatabase) {
        List Z = m0Var.Z(sQLiteDatabase, oVar, m0Var.f4915h.d());
        for (i0.d dVar : i0.d.values()) {
            if (dVar != oVar.d()) {
                int d4 = m0Var.f4915h.d() - Z.size();
                if (d4 <= 0) {
                    break;
                }
                Z.addAll(m0Var.Z(sQLiteDatabase, oVar.f(dVar), d4));
            }
        }
        return m0Var.Y(Z, m0Var.a0(sQLiteDatabase, Z));
    }

    private static i0.b f0(String str) {
        return str == null ? f4911j : i0.b.b(str);
    }

    public static /* synthetic */ List g(Cursor cursor) {
        ArrayList arrayList = new ArrayList();
        while (cursor.moveToNext()) {
            arrayList.add(k0.o.a().b(cursor.getString(1)).d(v0.a.b(cursor.getInt(2))).c(b0(cursor.getString(3))).a());
        }
        return arrayList;
    }

    private static String g0(Iterable iterable) {
        StringBuilder sb = new StringBuilder(c3.d4(176));
        Iterator it = iterable.iterator();
        while (it.hasNext()) {
            sb.append(((k) it.next()).c());
            if (it.hasNext()) {
                sb.append(',');
            }
        }
        sb.append(')');
        return sb.toString();
    }

    public static /* synthetic */ Object h(m0 m0Var, Cursor cursor) {
        m0Var.getClass();
        while (cursor.moveToNext()) {
            m0Var.b(cursor.getInt(0), c.b.MAX_RETRIES_REACHED, cursor.getString(1));
        }
        return null;
    }

    static Object h0(Cursor cursor, b bVar) {
        try {
            return bVar.apply(cursor);
        } finally {
            cursor.close();
        }
    }

    public static /* synthetic */ SQLiteDatabase i(Throwable th) {
        throw new t0.a("Timed out while trying to open db.", th);
    }

    public static /* synthetic */ Object j(m0 m0Var, Cursor cursor) {
        m0Var.getClass();
        while (cursor.moveToNext()) {
            m0Var.b(cursor.getInt(0), c.b.MESSAGE_TOO_OLD, cursor.getString(1));
        }
        return null;
    }

    public static /* synthetic */ Object k(final m0 m0Var, String str, String str2, SQLiteDatabase sQLiteDatabase) {
        m0Var.getClass();
        sQLiteDatabase.compileStatement(str).execute();
        h0(sQLiteDatabase.rawQuery(str2, null), new b() { // from class: s0.v
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.h(m0.this, (Cursor) obj);
            }
        });
        sQLiteDatabase.compileStatement("DELETE FROM events WHERE num_attempts >= 16").execute();
        return null;
    }

    public static /* synthetic */ Boolean l(m0 m0Var, k0.o oVar, SQLiteDatabase sQLiteDatabase) {
        Long U = m0Var.U(sQLiteDatabase, oVar);
        return U == null ? Boolean.FALSE : (Boolean) h0(m0Var.M().rawQuery("SELECT 1 FROM events WHERE context_id = ? LIMIT 1", new String[]{U.toString()}), new b() { // from class: s0.u
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return Boolean.valueOf(((Cursor) obj).moveToNext());
            }
        });
    }

    public static /* synthetic */ Object m(long j4, k0.o oVar, SQLiteDatabase sQLiteDatabase) {
        ContentValues contentValues = new ContentValues();
        contentValues.put("next_request_ms", Long.valueOf(j4));
        if (sQLiteDatabase.update("transport_contexts", contentValues, "backend_name = ? and priority = ?", new String[]{oVar.b(), String.valueOf(v0.a.a(oVar.d()))}) < 1) {
            contentValues.put("backend_name", oVar.b());
            contentValues.put("priority", Integer.valueOf(v0.a.a(oVar.d())));
            sQLiteDatabase.insert("transport_contexts", null, contentValues);
        }
        return null;
    }

    public static /* synthetic */ byte[] n(Cursor cursor) {
        ArrayList arrayList = new ArrayList();
        int i4 = 0;
        while (cursor.moveToNext()) {
            byte[] blob = cursor.getBlob(0);
            arrayList.add(blob);
            i4 += blob.length;
        }
        byte[] bArr = new byte[i4];
        int i5 = 0;
        for (int i6 = 0; i6 < arrayList.size(); i6++) {
            byte[] bArr2 = (byte[]) arrayList.get(i6);
            System.arraycopy(bArr2, 0, bArr, i5, bArr2.length);
            i5 += bArr2.length;
        }
        return bArr;
    }

    public static /* synthetic */ List p(SQLiteDatabase sQLiteDatabase) {
        return (List) h0(sQLiteDatabase.rawQuery("SELECT distinct t._id, t.backend_name, t.priority, t.extras FROM transport_contexts AS t, events AS e WHERE e.context_id = t._id", new String[0]), new b() { // from class: s0.k0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.g((Cursor) obj);
            }
        });
    }

    public static /* synthetic */ n0.a r(m0 m0Var, Map map, a.C0060a c0060a, Cursor cursor) {
        m0Var.getClass();
        while (cursor.moveToNext()) {
            String string = cursor.getString(0);
            c.b H = m0Var.H(cursor.getInt(1));
            long j4 = cursor.getLong(2);
            if (!map.containsKey(string)) {
                map.put(string, new ArrayList());
            }
            ((List) map.get(string)).add(n0.c.c().c(H).b(j4).a());
        }
        m0Var.c0(c0060a, map);
        c0060a.e(m0Var.T());
        c0060a.d(m0Var.N());
        c0060a.c((String) m0Var.f4916i.get());
        return c0060a.b();
    }

    public static /* synthetic */ Long t(m0 m0Var, k0.i iVar, k0.o oVar, SQLiteDatabase sQLiteDatabase) {
        if (m0Var.X()) {
            m0Var.b(1L, c.b.CACHE_FULL, iVar.j());
            return -1L;
        }
        long K = m0Var.K(sQLiteDatabase, oVar);
        int e4 = m0Var.f4915h.e();
        byte[] a4 = iVar.e().a();
        boolean z3 = a4.length <= e4;
        ContentValues contentValues = new ContentValues();
        contentValues.put("context_id", Long.valueOf(K));
        contentValues.put("transport_name", iVar.j());
        contentValues.put(c3.d4(140), Long.valueOf(iVar.f()));
        contentValues.put("uptime_ms", Long.valueOf(iVar.k()));
        contentValues.put(c3.d4(1054), iVar.e().b().a());
        contentValues.put("code", iVar.d());
        contentValues.put("num_attempts", (Integer) 0);
        contentValues.put("inline", Boolean.valueOf(z3));
        contentValues.put(c3.d4(39), z3 ? a4 : new byte[0]);
        long insert = sQLiteDatabase.insert("events", null, contentValues);
        if (!z3) {
            int ceil = (int) Math.ceil(a4.length / e4);
            for (int i4 = 1; i4 <= ceil; i4++) {
                byte[] copyOfRange = Arrays.copyOfRange(a4, (i4 - 1) * e4, Math.min(i4 * e4, a4.length));
                ContentValues contentValues2 = new ContentValues();
                contentValues2.put("event_id", Long.valueOf(insert));
                contentValues2.put("sequence_num", Integer.valueOf(i4));
                contentValues2.put("bytes", copyOfRange);
                sQLiteDatabase.insert("event_payloads", null, contentValues2);
            }
        }
        for (Map.Entry entry : iVar.i().entrySet()) {
            ContentValues contentValues3 = new ContentValues();
            contentValues3.put("event_id", Long.valueOf(insert));
            contentValues3.put("name", (String) entry.getKey());
            contentValues3.put(c3.d4(225), (String) entry.getValue());
            sQLiteDatabase.insert(c3.d4(226), null, contentValues3);
        }
        return Long.valueOf(insert);
    }

    public static /* synthetic */ Object u(SQLiteDatabase sQLiteDatabase) {
        sQLiteDatabase.beginTransaction();
        return null;
    }

    public static /* synthetic */ Long w(Cursor cursor) {
        if (cursor.moveToNext()) {
            return Long.valueOf(cursor.getLong(0));
        }
        return null;
    }

    public static /* synthetic */ Object x(Throwable th) {
        throw new t0.a(c3.d4(141), th);
    }

    public static /* synthetic */ Object z(String str, c.b bVar, long j4, SQLiteDatabase sQLiteDatabase) {
        if (((Boolean) h0(sQLiteDatabase.rawQuery("SELECT 1 FROM log_event_dropped WHERE log_source = ? AND reason = ?", new String[]{str, Integer.toString(bVar.a())}), new b() { // from class: s0.y
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                Boolean valueOf;
                valueOf = Boolean.valueOf(r0.getCount() > 0);
                return valueOf;
            }
        })).booleanValue()) {
            sQLiteDatabase.execSQL("UPDATE log_event_dropped SET events_dropped_count = events_dropped_count + " + j4 + " WHERE log_source = ? AND reason = ?", new String[]{str, Integer.toString(bVar.a())});
            return null;
        }
        ContentValues contentValues = new ContentValues();
        contentValues.put("log_source", str);
        contentValues.put("reason", Integer.valueOf(bVar.a()));
        contentValues.put(c3.d4(857), Long.valueOf(j4));
        sQLiteDatabase.insert("log_event_dropped", null, contentValues);
        return null;
    }

    @Override // s0.d
    public Iterable I() {
        return (Iterable) W(new b() { // from class: s0.g0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.p((SQLiteDatabase) obj);
            }
        });
    }

    long L() {
        return P() * R();
    }

    SQLiteDatabase M() {
        final t0 t0Var = this.f4912e;
        Objects.requireNonNull(t0Var);
        return (SQLiteDatabase) e0(new d() { // from class: s0.e0
            @Override // s0.m0.d
            public final Object a() {
                return t0.this.getWritableDatabase();
            }
        }, new b() { // from class: s0.f0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.i((Throwable) obj);
            }
        });
    }

    @Override // s0.d
    public long O(k0.o oVar) {
        return ((Long) h0(M().rawQuery("SELECT next_request_ms FROM transport_contexts WHERE backend_name = ? and priority = ?", new String[]{oVar.b(), String.valueOf(v0.a.a(oVar.d()))}), new b() { // from class: s0.h0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.F((Cursor) obj);
            }
        })).longValue();
    }

    @Override // s0.d
    public Iterable Q(final k0.o oVar) {
        return (Iterable) W(new b() { // from class: s0.m
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.f(m0.this, oVar, (SQLiteDatabase) obj);
            }
        });
    }

    @Override // s0.d
    public void S(Iterable iterable) {
        if (iterable.iterator().hasNext()) {
            final String str = c3.d4(40) + g0(iterable);
            final String str2 = "SELECT COUNT(*), transport_name FROM events WHERE num_attempts >= 16 GROUP BY transport_name";
            W(new b() { // from class: s0.l0
                @Override // s0.m0.b
                public final Object apply(Object obj) {
                    return m0.k(m0.this, str, str2, (SQLiteDatabase) obj);
                }
            });
        }
    }

    @Override // s0.d
    public void V(final k0.o oVar, final long j4) {
        W(new b() { // from class: s0.p
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.m(j4, oVar, (SQLiteDatabase) obj);
            }
        });
    }

    Object W(b bVar) {
        SQLiteDatabase M = M();
        M.beginTransaction();
        try {
            Object apply = bVar.apply(M);
            M.setTransactionSuccessful();
            return apply;
        } finally {
            M.endTransaction();
        }
    }

    @Override // t0.b
    public Object a(b.a aVar) {
        SQLiteDatabase M = M();
        J(M);
        try {
            Object a4 = aVar.a();
            M.setTransactionSuccessful();
            return a4;
        } finally {
            M.endTransaction();
        }
    }

    @Override // s0.c
    public void b(final long j4, final c.b bVar, final String str) {
        W(new b() { // from class: s0.r
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.z(str, bVar, j4, (SQLiteDatabase) obj);
            }
        });
    }

    @Override // s0.c
    public n0.a c() {
        final a.C0060a e4 = n0.a.e();
        final HashMap hashMap = new HashMap();
        final String str = "SELECT log_source, reason, events_dropped_count FROM log_event_dropped";
        return (n0.a) W(new b() { // from class: s0.t
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.E(m0.this, str, hashMap, e4, (SQLiteDatabase) obj);
            }
        });
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        this.f4912e.close();
    }

    @Override // s0.c
    public void d() {
        W(new b() { // from class: s0.q
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.D(m0.this, (SQLiteDatabase) obj);
            }
        });
    }

    @Override // s0.d
    public int o() {
        final long a4 = this.f4913f.a() - this.f4915h.c();
        return ((Integer) W(new b() { // from class: s0.j0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.B(m0.this, a4, (SQLiteDatabase) obj);
            }
        })).intValue();
    }

    @Override // s0.d
    public void q(Iterable iterable) {
        if (iterable.iterator().hasNext()) {
            M().compileStatement("DELETE FROM events WHERE _id in " + g0(iterable)).execute();
        }
    }

    @Override // s0.d
    public k v(final k0.o oVar, final k0.i iVar) {
        o0.a.c("SQLiteEventStore", "Storing event with priority=%s, name=%s for destination %s", oVar.d(), iVar.j(), oVar.b());
        long longValue = ((Long) W(new b() { // from class: s0.i0
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.t(m0.this, iVar, oVar, (SQLiteDatabase) obj);
            }
        })).longValue();
        if (longValue < 1) {
            return null;
        }
        return k.a(longValue, oVar, iVar);
    }

    @Override // s0.d
    public boolean y(final k0.o oVar) {
        return ((Boolean) W(new b() { // from class: s0.o
            @Override // s0.m0.b
            public final Object apply(Object obj) {
                return m0.l(m0.this, oVar, (SQLiteDatabase) obj);
            }
        })).booleanValue();
    }
}
