package s0;

import a1.b2.c3;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.util.Arrays;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class t0 extends SQLiteOpenHelper {

    /* renamed from: g, reason: collision with root package name */
    private static final String f4937g = c3.d4(463) + System.currentTimeMillis() + ")";

    /* renamed from: h, reason: collision with root package name */
    static int f4938h = 5;

    /* renamed from: i, reason: collision with root package name */
    private static final a f4939i;

    /* renamed from: j, reason: collision with root package name */
    private static final a f4940j;

    /* renamed from: k, reason: collision with root package name */
    private static final a f4941k;

    /* renamed from: l, reason: collision with root package name */
    private static final a f4942l;

    /* renamed from: m, reason: collision with root package name */
    private static final a f4943m;

    /* renamed from: n, reason: collision with root package name */
    private static final List f4944n;

    /* renamed from: e, reason: collision with root package name */
    private final int f4945e;

    /* renamed from: f, reason: collision with root package name */
    private boolean f4946f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        void a(SQLiteDatabase sQLiteDatabase);
    }

    static {
        a aVar = new a() { // from class: s0.o0
            @Override // s0.t0.a
            public final void a(SQLiteDatabase sQLiteDatabase) {
                t0.a(sQLiteDatabase);
            }
        };
        f4939i = aVar;
        a aVar2 = new a() { // from class: s0.p0
            @Override // s0.t0.a
            public final void a(SQLiteDatabase sQLiteDatabase) {
                t0.d(sQLiteDatabase);
            }
        };
        f4940j = aVar2;
        a aVar3 = new a() { // from class: s0.q0
            @Override // s0.t0.a
            public final void a(SQLiteDatabase sQLiteDatabase) {
                sQLiteDatabase.execSQL(c3.d4(757));
            }
        };
        f4941k = aVar3;
        a aVar4 = new a() { // from class: s0.r0
            @Override // s0.t0.a
            public final void a(SQLiteDatabase sQLiteDatabase) {
                t0.e(sQLiteDatabase);
            }
        };
        f4942l = aVar4;
        a aVar5 = new a() { // from class: s0.s0
            @Override // s0.t0.a
            public final void a(SQLiteDatabase sQLiteDatabase) {
                t0.c(sQLiteDatabase);
            }
        };
        f4943m = aVar5;
        f4944n = Arrays.asList(aVar, aVar2, aVar3, aVar4, aVar5);
    }

    t0(Context context, String str, int i4) {
        super(context, str, (SQLiteDatabase.CursorFactory) null, i4);
        this.f4946f = false;
        this.f4945e = i4;
    }

    public static /* synthetic */ void a(SQLiteDatabase sQLiteDatabase) {
        sQLiteDatabase.execSQL("CREATE TABLE events (_id INTEGER PRIMARY KEY, context_id INTEGER NOT NULL, transport_name TEXT NOT NULL, timestamp_ms INTEGER NOT NULL, uptime_ms INTEGER NOT NULL, payload BLOB NOT NULL, code INTEGER, num_attempts INTEGER NOT NULL,FOREIGN KEY (context_id) REFERENCES transport_contexts(_id) ON DELETE CASCADE)");
        sQLiteDatabase.execSQL("CREATE TABLE event_metadata (_id INTEGER PRIMARY KEY, event_id INTEGER NOT NULL, name TEXT NOT NULL, value TEXT NOT NULL,FOREIGN KEY (event_id) REFERENCES events(_id) ON DELETE CASCADE)");
        sQLiteDatabase.execSQL("CREATE TABLE transport_contexts (_id INTEGER PRIMARY KEY, backend_name TEXT NOT NULL, priority INTEGER NOT NULL, next_request_ms INTEGER NOT NULL)");
        sQLiteDatabase.execSQL("CREATE INDEX events_backend_id on events(context_id)");
        sQLiteDatabase.execSQL("CREATE UNIQUE INDEX contexts_backend_priority on transport_contexts(backend_name, priority)");
    }

    public static /* synthetic */ void c(SQLiteDatabase sQLiteDatabase) {
        sQLiteDatabase.execSQL("DROP TABLE IF EXISTS log_event_dropped");
        sQLiteDatabase.execSQL("DROP TABLE IF EXISTS global_log_event_state");
        sQLiteDatabase.execSQL("CREATE TABLE log_event_dropped (log_source VARCHAR(45) NOT NULL,reason INTEGER NOT NULL,events_dropped_count BIGINT NOT NULL,PRIMARY KEY(log_source, reason))");
        sQLiteDatabase.execSQL(c3.d4(1206));
        sQLiteDatabase.execSQL(f4937g);
    }

    public static /* synthetic */ void d(SQLiteDatabase sQLiteDatabase) {
        sQLiteDatabase.execSQL(c3.d4(177));
        sQLiteDatabase.execSQL("CREATE UNIQUE INDEX contexts_backend_priority_extras on transport_contexts(backend_name, priority, extras)");
        sQLiteDatabase.execSQL(c3.d4(312));
    }

    public static /* synthetic */ void e(SQLiteDatabase sQLiteDatabase) {
        sQLiteDatabase.execSQL("ALTER TABLE events ADD COLUMN inline BOOLEAN NOT NULL DEFAULT 1");
        sQLiteDatabase.execSQL(c3.d4(271));
        sQLiteDatabase.execSQL("CREATE TABLE event_payloads (sequence_num INTEGER NOT NULL, event_id INTEGER NOT NULL, bytes BLOB NOT NULL,FOREIGN KEY (event_id) REFERENCES events(_id) ON DELETE CASCADE,PRIMARY KEY (sequence_num, event_id))");
    }

    private void f(SQLiteDatabase sQLiteDatabase) {
        if (this.f4946f) {
            return;
        }
        onConfigure(sQLiteDatabase);
    }

    private void g(SQLiteDatabase sQLiteDatabase, int i4) {
        f(sQLiteDatabase);
        h(sQLiteDatabase, 0, i4);
    }

    private void h(SQLiteDatabase sQLiteDatabase, int i4, int i5) {
        List list = f4944n;
        if (i5 <= list.size()) {
            while (i4 < i5) {
                ((a) f4944n.get(i4)).a(sQLiteDatabase);
                i4++;
            }
            return;
        }
        throw new IllegalArgumentException("Migration from " + i4 + " to " + i5 + " was requested, but cannot be performed. Only " + list.size() + " migrations are provided");
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onConfigure(SQLiteDatabase sQLiteDatabase) {
        this.f4946f = true;
        sQLiteDatabase.rawQuery("PRAGMA busy_timeout=0;", new String[0]).close();
        sQLiteDatabase.setForeignKeyConstraintsEnabled(true);
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onCreate(SQLiteDatabase sQLiteDatabase) {
        g(sQLiteDatabase, this.f4945e);
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onDowngrade(SQLiteDatabase sQLiteDatabase, int i4, int i5) {
        sQLiteDatabase.execSQL("DROP TABLE events");
        sQLiteDatabase.execSQL(c3.d4(178));
        sQLiteDatabase.execSQL("DROP TABLE transport_contexts");
        sQLiteDatabase.execSQL("DROP TABLE IF EXISTS event_payloads");
        sQLiteDatabase.execSQL("DROP TABLE IF EXISTS log_event_dropped");
        sQLiteDatabase.execSQL(c3.d4(1013));
        g(sQLiteDatabase, i5);
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onOpen(SQLiteDatabase sQLiteDatabase) {
        f(sQLiteDatabase);
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i4, int i5) {
        f(sQLiteDatabase);
        h(sQLiteDatabase, i4, i5);
    }
}
