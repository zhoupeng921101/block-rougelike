package androidx.core.content.res;

import a1.b2.c3;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.util.Base64;
import android.util.Xml;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class d {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static int a(TypedArray typedArray, int i4) {
            return typedArray.getType(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class c implements b {

        /* renamed from: a, reason: collision with root package name */
        private final C0007d[] f865a;

        public c(C0007d[] c0007dArr) {
            this.f865a = c0007dArr;
        }

        public C0007d[] a() {
            return this.f865a;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.content.res.d$d, reason: collision with other inner class name */
    public static final class C0007d {

        /* renamed from: a, reason: collision with root package name */
        private final String f866a;

        /* renamed from: b, reason: collision with root package name */
        private final int f867b;

        /* renamed from: c, reason: collision with root package name */
        private final boolean f868c;

        /* renamed from: d, reason: collision with root package name */
        private final String f869d;

        /* renamed from: e, reason: collision with root package name */
        private final int f870e;

        /* renamed from: f, reason: collision with root package name */
        private final int f871f;

        public C0007d(String str, int i4, boolean z3, String str2, int i5, int i6) {
            this.f866a = str;
            this.f867b = i4;
            this.f868c = z3;
            this.f869d = str2;
            this.f870e = i5;
            this.f871f = i6;
        }

        public String a() {
            return this.f866a;
        }

        public int b() {
            return this.f871f;
        }

        public int c() {
            return this.f870e;
        }

        public String d() {
            return this.f869d;
        }

        public int e() {
            return this.f867b;
        }

        public boolean f() {
            return this.f868c;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class e implements b {

        /* renamed from: a, reason: collision with root package name */
        private final androidx.core.provider.e f872a;

        /* renamed from: b, reason: collision with root package name */
        private final int f873b;

        /* renamed from: c, reason: collision with root package name */
        private final int f874c;

        /* renamed from: d, reason: collision with root package name */
        private final String f875d;

        public e(androidx.core.provider.e eVar, int i4, int i5, String str) {
            this.f872a = eVar;
            this.f874c = i4;
            this.f873b = i5;
            this.f875d = str;
        }

        public int a() {
            return this.f874c;
        }

        public androidx.core.provider.e b() {
            return this.f872a;
        }

        public String c() {
            return this.f875d;
        }

        public int d() {
            return this.f873b;
        }
    }

    private static int a(TypedArray typedArray, int i4) {
        return a.a(typedArray, i4);
    }

    public static b b(XmlPullParser xmlPullParser, Resources resources) {
        int next;
        do {
            next = xmlPullParser.next();
            if (next == 2) {
                break;
            }
        } while (next != 1);
        if (next == 2) {
            return d(xmlPullParser, resources);
        }
        throw new XmlPullParserException("No start tag found");
    }

    public static List c(Resources resources, int i4) {
        if (i4 == 0) {
            return Collections.EMPTY_LIST;
        }
        TypedArray obtainTypedArray = resources.obtainTypedArray(i4);
        try {
            if (obtainTypedArray.length() == 0) {
                return Collections.EMPTY_LIST;
            }
            ArrayList arrayList = new ArrayList();
            if (a(obtainTypedArray, 0) == 1) {
                for (int i5 = 0; i5 < obtainTypedArray.length(); i5++) {
                    int resourceId = obtainTypedArray.getResourceId(i5, 0);
                    if (resourceId != 0) {
                        arrayList.add(h(resources.getStringArray(resourceId)));
                    }
                }
            } else {
                arrayList.add(h(resources.getStringArray(i4)));
            }
            return arrayList;
        } finally {
            obtainTypedArray.recycle();
        }
    }

    private static b d(XmlPullParser xmlPullParser, Resources resources) {
        xmlPullParser.require(2, null, "font-family");
        if (xmlPullParser.getName().equals("font-family")) {
            return e(xmlPullParser, resources);
        }
        g(xmlPullParser);
        return null;
    }

    private static b e(XmlPullParser xmlPullParser, Resources resources) {
        TypedArray obtainAttributes = resources.obtainAttributes(Xml.asAttributeSet(xmlPullParser), l.c.f4096h);
        String string = obtainAttributes.getString(l.c.f4097i);
        String string2 = obtainAttributes.getString(l.c.f4101m);
        String string3 = obtainAttributes.getString(l.c.f4102n);
        int resourceId = obtainAttributes.getResourceId(l.c.f4098j, 0);
        int integer = obtainAttributes.getInteger(l.c.f4099k, 1);
        int integer2 = obtainAttributes.getInteger(l.c.f4100l, 500);
        String string4 = obtainAttributes.getString(l.c.f4103o);
        obtainAttributes.recycle();
        if (string != null && string2 != null && string3 != null) {
            while (xmlPullParser.next() != 3) {
                g(xmlPullParser);
            }
            return new e(new androidx.core.provider.e(string, string2, string3, c(resources, resourceId)), integer, integer2, string4);
        }
        ArrayList arrayList = new ArrayList();
        while (xmlPullParser.next() != 3) {
            if (xmlPullParser.getEventType() == 2) {
                if (xmlPullParser.getName().equals(c3.d4(1263))) {
                    arrayList.add(f(xmlPullParser, resources));
                } else {
                    g(xmlPullParser);
                }
            }
        }
        if (arrayList.isEmpty()) {
            return null;
        }
        return new c((C0007d[]) arrayList.toArray(new C0007d[0]));
    }

    private static C0007d f(XmlPullParser xmlPullParser, Resources resources) {
        TypedArray obtainAttributes = resources.obtainAttributes(Xml.asAttributeSet(xmlPullParser), l.c.f4104p);
        int i4 = obtainAttributes.getInt(obtainAttributes.hasValue(l.c.f4113y) ? l.c.f4113y : l.c.f4106r, 400);
        boolean z3 = 1 == obtainAttributes.getInt(obtainAttributes.hasValue(l.c.f4111w) ? l.c.f4111w : l.c.f4107s, 0);
        int i5 = obtainAttributes.hasValue(l.c.f4114z) ? l.c.f4114z : l.c.f4108t;
        String string = obtainAttributes.getString(obtainAttributes.hasValue(l.c.f4112x) ? l.c.f4112x : l.c.f4109u);
        int i6 = obtainAttributes.getInt(i5, 0);
        int i7 = obtainAttributes.hasValue(l.c.f4110v) ? l.c.f4110v : l.c.f4105q;
        int resourceId = obtainAttributes.getResourceId(i7, 0);
        String string2 = obtainAttributes.getString(i7);
        obtainAttributes.recycle();
        while (xmlPullParser.next() != 3) {
            g(xmlPullParser);
        }
        return new C0007d(string2, i4, z3, string, i6, resourceId);
    }

    private static void g(XmlPullParser xmlPullParser) {
        int i4 = 1;
        while (i4 > 0) {
            int next = xmlPullParser.next();
            if (next == 2) {
                i4++;
            } else if (next == 3) {
                i4--;
            }
        }
    }

    private static List h(String[] strArr) {
        ArrayList arrayList = new ArrayList();
        for (String str : strArr) {
            arrayList.add(Base64.decode(str, 0));
        }
        return arrayList;
    }
}
