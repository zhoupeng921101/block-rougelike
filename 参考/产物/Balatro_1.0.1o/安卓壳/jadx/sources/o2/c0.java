package o2;

import a1.b2.c3;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.provider.BaseColumns;
import java.io.IOException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c0 implements x {

    /* renamed from: b, reason: collision with root package name */
    private static final g0 f4305b = g0.f(c0.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private b f4306a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a extends SQLiteOpenHelper implements BaseColumns {
        public a(Context context) {
            super(context, "singular-1.db", (SQLiteDatabase.CursorFactory) null, 1);
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onCreate(SQLiteDatabase sQLiteDatabase) {
            sQLiteDatabase.execSQL(c3.d4(264));
        }

        @Override // android.database.sqlite.SQLiteOpenHelper
        public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i4, int i5) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class b {

        /* renamed from: a, reason: collision with root package name */
        private final a f4307a;

        b(a aVar) {
            this.f4307a = aVar;
        }

        private long a(SQLiteDatabase sQLiteDatabase) {
            Cursor cursor = null;
            try {
                try {
                    cursor = sQLiteDatabase.rawQuery("SELECT COUNT(_id) FROM events", null);
                    cursor.moveToFirst();
                    long j4 = cursor.getLong(0);
                    c0.f4305b.b("getCount() = %d", Long.valueOf(j4));
                    cursor.close();
                    return j4;
                } catch (SQLException e4) {
                    throw new IOException(e4);
                }
            } catch (Throwable th) {
                if (cursor != null) {
                    cursor.close();
                }
                throw th;
            }
        }

        private long c(SQLiteDatabase sQLiteDatabase) {
            Cursor cursor = null;
            try {
                try {
                    cursor = sQLiteDatabase.rawQuery(c3.d4(1130), null);
                    cursor.moveToFirst();
                    long j4 = cursor.getLong(0);
                    c0.f4305b.b("getMinId() id = %d", Long.valueOf(j4));
                    cursor.close();
                    return j4;
                } catch (SQLException e4) {
                    throw new IOException(e4);
                }
            } catch (Throwable th) {
                if (cursor != null) {
                    cursor.close();
                }
                throw th;
            }
        }

        private String f(SQLiteDatabase sQLiteDatabase) {
            long c4;
            String[] strArr;
            Cursor query;
            Cursor cursor = null;
            try {
                try {
                    c4 = c(sQLiteDatabase);
                    strArr = new String[]{String.valueOf(c4)};
                    query = sQLiteDatabase.query("events", new String[]{"value"}, "_id = ?", strArr, null, null, null);
                } catch (SQLException e4) {
                    e = e4;
                }
            } catch (Throwable th) {
                th = th;
            }
            try {
                query.moveToFirst();
                if (query.getCount() == 0) {
                    query.close();
                    return null;
                }
                String string = query.getString(query.getColumnIndex("value"));
                sQLiteDatabase.delete("events", "_id = ?", strArr);
                c0.f4305b.b("removeHead() _id = %d", Long.valueOf(c4));
                query.close();
                return string;
            } catch (SQLException e5) {
                e = e5;
                cursor = query;
                throw new IOException(e);
            } catch (Throwable th2) {
                th = th2;
                cursor = query;
                if (cursor != null) {
                    cursor.close();
                }
                throw th;
            }
        }

        String b() {
            SQLiteDatabase sQLiteDatabase;
            long c4;
            Cursor query;
            Cursor cursor = null;
            String string = null;
            cursor = null;
            cursor = null;
            cursor = null;
            try {
                sQLiteDatabase = this.f4307a.getReadableDatabase();
                try {
                    try {
                        c4 = c(sQLiteDatabase);
                        query = sQLiteDatabase.query("events", new String[]{"value"}, "_id = ?", new String[]{String.valueOf(c4)}, null, null, null);
                    } catch (SQLException e4) {
                        e = e4;
                    }
                } catch (Throwable th) {
                    th = th;
                }
            } catch (SQLException e5) {
                e = e5;
                sQLiteDatabase = null;
            } catch (Throwable th2) {
                th = th2;
                sQLiteDatabase = null;
            }
            try {
                query.moveToFirst();
                if (query.getCount() != 0) {
                    string = query.getString(0);
                }
                c0.f4305b.b("getHead() _id = %d, value = %s", Long.valueOf(c4), string);
                query.close();
                sQLiteDatabase.close();
                return string;
            } catch (SQLException e6) {
                e = e6;
                cursor = query;
                throw new IOException(e);
            } catch (Throwable th3) {
                th = th3;
                cursor = query;
                if (cursor != null) {
                    cursor.close();
                }
                if (sQLiteDatabase != null) {
                    sQLiteDatabase.close();
                }
                throw th;
            }
        }

        /* JADX WARN: Removed duplicated region for block: B:18:0x006b  */
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        long d(java.lang.String r9) {
            /*
                r8 = this;
                android.content.ContentValues r0 = new android.content.ContentValues
                r0.<init>()
                java.lang.String r1 = "value"
                r0.put(r1, r9)
                r9 = 0
                o2.c0$a r1 = r8.f4307a     // Catch: java.lang.Throwable -> L5c android.database.SQLException -> L60
                android.database.sqlite.SQLiteDatabase r1 = r1.getWritableDatabase()     // Catch: java.lang.Throwable -> L5c android.database.SQLException -> L60
                java.lang.String r2 = "events"
                long r2 = r1.insert(r2, r9, r0)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                o2.g0 r9 = o2.c0.b()     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                java.lang.StringBuilder r0 = new java.lang.StringBuilder     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r0.<init>()     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                java.lang.String r4 = "insert() row = "
                r0.append(r4)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r0.append(r2)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                java.lang.String r0 = r0.toString()     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r9.a(r0)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                long r4 = r8.a(r1)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r6 = 10000(0x2710, double:4.9407E-320)
                int r9 = (r4 > r6 ? 1 : (r4 == r6 ? 0 : -1))
                if (r9 <= 0) goto L58
                o2.g0 r9 = o2.c0.b()     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                java.lang.String r0 = "Pruning Queue; current size = %d; max size = %d"
                java.lang.Long r4 = java.lang.Long.valueOf(r4)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r5 = 10000(0x2710, float:1.4013E-41)
                java.lang.Integer r5 = java.lang.Integer.valueOf(r5)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                java.lang.Object[] r4 = new java.lang.Object[]{r4, r5}     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r9.b(r0, r4)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                r8.f(r1)     // Catch: java.lang.Throwable -> L54 android.database.SQLException -> L56
                goto L58
            L54:
                r9 = move-exception
                goto L69
            L56:
                r9 = move-exception
                goto L63
            L58:
                r1.close()
                return r2
            L5c:
                r0 = move-exception
                r1 = r9
                r9 = r0
                goto L69
            L60:
                r0 = move-exception
                r1 = r9
                r9 = r0
            L63:
                java.io.IOException r0 = new java.io.IOException     // Catch: java.lang.Throwable -> L54
                r0.<init>(r9)     // Catch: java.lang.Throwable -> L54
                throw r0     // Catch: java.lang.Throwable -> L54
            L69:
                if (r1 == 0) goto L6e
                r1.close()
            L6e:
                throw r9
            */
            throw new UnsupportedOperationException("Method not decompiled: o2.c0.b.d(java.lang.String):long");
        }

        String e() {
            SQLiteDatabase sQLiteDatabase = null;
            try {
                sQLiteDatabase = this.f4307a.getWritableDatabase();
                return f(sQLiteDatabase);
            } finally {
                if (sQLiteDatabase != null) {
                    sQLiteDatabase.close();
                }
            }
        }
    }

    public c0(Context context) {
        this.f4306a = new b(new a(context.getApplicationContext()));
    }

    @Override // o2.x
    public synchronized void a(String str) {
        if (this.f4306a.d(str) == -1) {
            throw new IOException("Failed to add element = " + str);
        }
    }

    @Override // o2.x
    public synchronized String peek() {
        return this.f4306a.b();
    }

    @Override // o2.x
    public synchronized void remove() {
        this.f4306a.e();
    }
}
