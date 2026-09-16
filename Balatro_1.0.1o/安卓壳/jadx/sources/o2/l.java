package o2;

import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.io.IOException;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class l implements k {

    /* renamed from: c, reason: collision with root package name */
    private static final g0 f4418c = g0.f(l.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private a f4419a;

    /* renamed from: b, reason: collision with root package name */
    private Context f4420b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a extends SQLiteOpenHelper {

        /* renamed from: e, reason: collision with root package name */
        private SQLiteDatabase f4421e;

        public a(Context context) {
            super(context, "singular-batch-managerx-1.db", (SQLiteDatabase.CursorFactory) null, 1);
        }

        public synchronized boolean a(String str) {
            l.f4418c.a("SQLiteHelper.delete key: " + str);
            try {
                if (!d(str)) {
                    l.f4418c.a("SQLiteHelper.delete key does not exist - returning false ");
                    return false;
                }
                try {
                    SQLiteDatabase writableDatabase = getWritableDatabase();
                    this.f4421e = writableDatabase;
                    if (writableDatabase.delete("events", "eventKey =?", new String[]{str}) != 1) {
                        l.f4418c.a("SQLiteHelper.delete failed ");
                        return false;
                    }
                    l.f4418c.a("SQLiteHelper.delete - success ");
                    SQLiteDatabase sQLiteDatabase = this.f4421e;
                    if (sQLiteDatabase != null) {
                        sQLiteDatabase.close();
                    }
                    return true;
                } catch (SQLException unused) {
                    throw new IOException();
                }
            } finally {
                SQLiteDatabase sQLiteDatabase2 = this.f4421e;
                if (sQLiteDatabase2 != null) {
                    sQLiteDatabase2.close();
                }
            }
        }

        /* JADX WARN: Code restructure failed: missing block: B:19:0x0058, code lost:
        
            if (r1 != null) goto L21;
         */
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        public synchronized java.util.Set b() {
            /*
                r6 = this;
                monitor-enter(r6)
                o2.g0 r0 = o2.l.g()     // Catch: java.lang.Throwable -> L54
                r1 = 0
                java.lang.String r1 = "SQLiteHelper.getAll"
                r0.a(r1)     // Catch: java.lang.Throwable -> L54
                java.util.HashSet r0 = new java.util.HashSet     // Catch: java.lang.Throwable -> L54
                r0.<init>()     // Catch: java.lang.Throwable -> L54
                r1 = 0
                android.database.sqlite.SQLiteDatabase r2 = r6.getReadableDatabase()     // Catch: java.lang.Throwable -> L4c
                r6.f4421e = r2     // Catch: java.lang.Throwable -> L4c
                java.lang.String r3 = "SELECT * FROM events"
                android.database.Cursor r1 = r2.rawQuery(r3, r1)     // Catch: java.lang.Throwable -> L4c
                if (r1 == 0) goto L4e
                int r2 = r1.getCount()     // Catch: java.lang.Throwable -> L4c
                if (r2 == 0) goto L4e
                r1.moveToFirst()     // Catch: java.lang.Throwable -> L4c
            L28:
                r2 = 0
                java.lang.String r2 = "eventKey"
                int r2 = r1.getColumnIndex(r2)     // Catch: java.lang.Throwable -> L4c
                java.lang.String r2 = r1.getString(r2)     // Catch: java.lang.Throwable -> L4c
                java.lang.String r3 = "value"
                int r3 = r1.getColumnIndex(r3)     // Catch: java.lang.Throwable -> L4c
                java.lang.String r3 = r1.getString(r3)     // Catch: java.lang.Throwable -> L4c
                java.util.AbstractMap$SimpleEntry r4 = new java.util.AbstractMap$SimpleEntry     // Catch: java.lang.Throwable -> L4c
                r4.<init>(r2, r3)     // Catch: java.lang.Throwable -> L4c
                r0.add(r4)     // Catch: java.lang.Throwable -> L4c
                boolean r2 = r1.moveToNext()     // Catch: java.lang.Throwable -> L4c
                if (r2 != 0) goto L28
                goto L4e
            L4c:
                r2 = move-exception
                goto L5e
            L4e:
                if (r1 == 0) goto L56
                r1.close()     // Catch: java.lang.Throwable -> L54
                goto L56
            L54:
                r0 = move-exception
                goto Lc0
            L56:
                android.database.sqlite.SQLiteDatabase r1 = r6.f4421e     // Catch: java.lang.Throwable -> L54
                if (r1 == 0) goto L8f
            L5a:
                r1.close()     // Catch: java.lang.Throwable -> L54
                goto L8f
            L5e:
                o2.g0 r3 = o2.l.g()     // Catch: java.lang.Throwable -> Lb2
                java.lang.StringBuilder r4 = new java.lang.StringBuilder     // Catch: java.lang.Throwable -> Lb2
                r4.<init>()     // Catch: java.lang.Throwable -> Lb2
                java.lang.String r5 = "SQLiteHelper.getAll exception: "
                r4.append(r5)     // Catch: java.lang.Throwable -> Lb2
                java.lang.String r5 = r2.getMessage()     // Catch: java.lang.Throwable -> Lb2
                r4.append(r5)     // Catch: java.lang.Throwable -> Lb2
                java.lang.String r4 = r4.toString()     // Catch: java.lang.Throwable -> Lb2
                r3.c(r4)     // Catch: java.lang.Throwable -> Lb2
                o2.g0 r3 = o2.l.g()     // Catch: java.lang.Throwable -> Lb2
                java.lang.String r2 = o2.l0.l(r2)     // Catch: java.lang.Throwable -> Lb2
                r3.c(r2)     // Catch: java.lang.Throwable -> Lb2
                if (r1 == 0) goto L8a
                r1.close()     // Catch: java.lang.Throwable -> L54
            L8a:
                android.database.sqlite.SQLiteDatabase r1 = r6.f4421e     // Catch: java.lang.Throwable -> L54
                if (r1 == 0) goto L8f
                goto L5a
            L8f:
                o2.g0 r1 = o2.l.g()     // Catch: java.lang.Throwable -> L54
                java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch: java.lang.Throwable -> L54
                r2.<init>()     // Catch: java.lang.Throwable -> L54
                java.lang.String r3 = "SQLiteHelper.getAll returning: "
                r2.append(r3)     // Catch: java.lang.Throwable -> L54
                int r3 = r0.size()     // Catch: java.lang.Throwable -> L54
                r2.append(r3)     // Catch: java.lang.Throwable -> L54
                java.lang.String r3 = " entries"
                r2.append(r3)     // Catch: java.lang.Throwable -> L54
                java.lang.String r2 = r2.toString()     // Catch: java.lang.Throwable -> L54
                r1.a(r2)     // Catch: java.lang.Throwable -> L54
                monitor-exit(r6)
                return r0
            Lb2:
                r0 = move-exception
                if (r1 == 0) goto Lb8
                r1.close()     // Catch: java.lang.Throwable -> L54
            Lb8:
                android.database.sqlite.SQLiteDatabase r1 = r6.f4421e     // Catch: java.lang.Throwable -> L54
                if (r1 == 0) goto Lbf
                r1.close()     // Catch: java.lang.Throwable -> L54
            Lbf:
                throw r0     // Catch: java.lang.Throwable -> L54
            Lc0:
                monitor-exit(r6)     // Catch: java.lang.Throwable -> L54
                throw r0
            */
            throw new UnsupportedOperationException("Method not decompiled: o2.l.a.b():java.util.Set");
        }

        public synchronized boolean c(String str, String str2) {
            SQLiteDatabase writableDatabase;
            l.f4418c.a("SQLiteHelper.insert key: " + str + " value: " + str2);
            if (d(str)) {
                l.f4418c.a("SQLiteHelper.insert key already exists - returning false ");
                return false;
            }
            SQLiteDatabase sQLiteDatabase = null;
            try {
                try {
                    writableDatabase = getWritableDatabase();
                } catch (SQLException e4) {
                    e = e4;
                }
            } catch (Throwable th) {
                th = th;
            }
            try {
                ContentValues contentValues = new ContentValues();
                contentValues.put("eventKey", str);
                contentValues.put("value", str2);
                if (writableDatabase.insert("events", null, contentValues) != -1) {
                    l.f4418c.a("SQLiteHelper.insert success ");
                    writableDatabase.close();
                    return true;
                }
                l.f4418c.a("SQLiteHelper.insert false ");
                writableDatabase.close();
                return false;
            } catch (SQLException e5) {
                e = e5;
                sQLiteDatabase = writableDatabase;
                throw new IOException(e);
            } catch (Throwable th2) {
                th = th2;
                sQLiteDatabase = writableDatabase;
                if (sQLiteDatabase != null) {
                    sQLiteDatabase.close();
                }
                throw th;
            }
        }

        public synchronized boolean d(String str) {
            l.f4418c.a("SQLiteHelper.keyExists: key: " + str);
            Cursor cursor = null;
            try {
                try {
                    SQLiteDatabase writableDatabase = getWritableDatabase();
                    this.f4421e = writableDatabase;
                    Cursor rawQuery = writableDatabase.rawQuery("SELECT * FROM events WHERE eventKey= ?", new String[]{str});
                    if (rawQuery == null || rawQuery.getCount() == 0) {
                        l.f4418c.a("SQLiteHelper.keyExists: returning false ");
                        if (rawQuery != null) {
                            rawQuery.close();
                        }
                        SQLiteDatabase sQLiteDatabase = this.f4421e;
                        if (sQLiteDatabase != null) {
                            sQLiteDatabase.close();
                        }
                        return false;
                    }
                    l.f4418c.a("SQLiteHelper.keyExists: returning true ");
                    rawQuery.close();
                    rawQuery.close();
                    SQLiteDatabase sQLiteDatabase2 = this.f4421e;
                    if (sQLiteDatabase2 != null) {
                        sQLiteDatabase2.close();
                    }
                    return true;
                } catch (SQLException unused) {
                    throw new IOException();
                }
            } catch (Throwable th) {
                if (0 != 0) {
                    cursor.close();
                }
                SQLiteDatabase sQLiteDatabase3 = this.f4421e;
                if (sQLiteDatabase3 != null) {
                    sQLiteDatabase3.close();
                }
                throw th;
            }
        }

        public synchronized boolean e(String str, String str2) {
            l.f4418c.a("SQLiteHelper.update key: " + str + " value: " + str2);
            try {
                if (!d(str)) {
                    l.f4418c.a("SQLiteHelper.update: key does not exist - returning false ");
                    return false;
                }
                try {
                    this.f4421e = getWritableDatabase();
                    ContentValues contentValues = new ContentValues();
                    contentValues.put("eventKey", str);
                    contentValues.put("value", str2);
                    if (this.f4421e.replace("events", null, contentValues) == -1) {
                        l.f4418c.a("SQLiteHelper.update - failed");
                        return false;
                    }
                    l.f4418c.a("SQLiteHelper.update - success");
                    SQLiteDatabase sQLiteDatabase = this.f4421e;
                    if (sQLiteDatabase != null) {
                        sQLiteDatabase.close();
                    }
                    return true;
                } catch (SQLException unused) {
                    throw new IOException();
                }
            } finally {
                SQLiteDatabase sQLiteDatabase2 = this.f4421e;
                if (sQLiteDatabase2 != null) {
                    sQLiteDatabase2.close();
                }
            }
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onCreate(SQLiteDatabase sQLiteDatabase) {
            sQLiteDatabase.execSQL("CREATE TABLE events (eventKey  TEXT PRIMARY KEY NOT NULL,value TEXT )");
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i4, int i5) {
        }
    }

    public l(Context context) {
        this.f4419a = new a(context);
        this.f4420b = context;
    }

    @Override // o2.k
    public synchronized boolean a(String str) {
        f4418c.a("deleteEvent: key: " + str);
        return this.f4419a.a(str);
    }

    @Override // o2.k
    public synchronized long b() {
        return h(this.f4420b);
    }

    @Override // o2.k
    public synchronized Set c() {
        Set b4;
        g0 g0Var = f4418c;
        g0Var.a("getAllEvents");
        b4 = this.f4419a.b();
        g0Var.a("getAllEvents: returning " + b4.size() + " events");
        return b4;
    }

    @Override // o2.k
    public synchronized long d() {
        return i(this.f4420b);
    }

    @Override // o2.k
    public synchronized boolean e(String str, String str2) {
        f4418c.a("addEvent: key: " + str + " value: " + str2);
        return this.f4419a.c(str, str2);
    }

    @Override // o2.k
    public synchronized boolean f(String str, String str2) {
        f4418c.a("updateEvent: key: " + str + " value: " + str2);
        return this.f4419a.e(str, str2);
    }

    long h(Context context) {
        return context.getSharedPreferences("batch_send_id", 0).getLong("sendId", 0L);
    }

    long i(Context context) {
        long h4 = h(context) + 1;
        try {
            SharedPreferences.Editor edit = context.getSharedPreferences("batch_send_id", 0).edit();
            edit.putLong("sendId", h4);
            edit.commit();
            return h4;
        } catch (Throwable th) {
            f4418c.c(l0.l(th));
            return h4;
        }
    }
}
