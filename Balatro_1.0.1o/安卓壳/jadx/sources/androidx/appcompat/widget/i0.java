package androidx.appcompat.widget;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.AssetManager;
import android.content.res.Resources;
import java.lang.ref.WeakReference;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class i0 extends ContextWrapper {

    /* renamed from: c, reason: collision with root package name */
    private static final Object f582c = new Object();

    /* renamed from: d, reason: collision with root package name */
    private static ArrayList f583d;

    /* renamed from: a, reason: collision with root package name */
    private final Resources f584a;

    /* renamed from: b, reason: collision with root package name */
    private final Resources.Theme f585b;

    private i0(Context context) {
        super(context);
        if (!u0.c()) {
            this.f584a = new k0(this, context.getResources());
            this.f585b = null;
            return;
        }
        u0 u0Var = new u0(this, context.getResources());
        this.f584a = u0Var;
        Resources.Theme newTheme = u0Var.newTheme();
        this.f585b = newTheme;
        newTheme.setTo(context.getTheme());
    }

    private static boolean a(Context context) {
        return ((context instanceof i0) || (context.getResources() instanceof k0) || (context.getResources() instanceof u0) || !u0.c()) ? false : true;
    }

    public static Context b(Context context) {
        if (!a(context)) {
            return context;
        }
        synchronized (f582c) {
            try {
                ArrayList arrayList = f583d;
                if (arrayList == null) {
                    f583d = new ArrayList();
                } else {
                    for (int size = arrayList.size() - 1; size >= 0; size--) {
                        WeakReference weakReference = (WeakReference) f583d.get(size);
                        if (weakReference == null || weakReference.get() == null) {
                            f583d.remove(size);
                        }
                    }
                    for (int size2 = f583d.size() - 1; size2 >= 0; size2--) {
                        WeakReference weakReference2 = (WeakReference) f583d.get(size2);
                        i0 i0Var = weakReference2 != null ? (i0) weakReference2.get() : null;
                        if (i0Var != null && i0Var.getBaseContext() == context) {
                            return i0Var;
                        }
                    }
                }
                i0 i0Var2 = new i0(context);
                f583d.add(new WeakReference(i0Var2));
                return i0Var2;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // android.content.ContextWrapper, android.content.Context
    public AssetManager getAssets() {
        return this.f584a.getAssets();
    }

    @Override // android.content.ContextWrapper, android.content.Context
    public Resources getResources() {
        return this.f584a;
    }

    @Override // android.content.ContextWrapper, android.content.Context
    public Resources.Theme getTheme() {
        Resources.Theme theme = this.f585b;
        return theme == null ? super.getTheme() : theme;
    }

    @Override // android.content.ContextWrapper, android.content.Context
    public void setTheme(int i4) {
        Resources.Theme theme = this.f585b;
        if (theme == null) {
            super.setTheme(i4);
        } else {
            theme.applyStyle(i4, true);
        }
    }
}
