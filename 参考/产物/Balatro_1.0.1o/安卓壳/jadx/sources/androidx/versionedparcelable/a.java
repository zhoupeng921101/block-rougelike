package androidx.versionedparcelable;

import a1.b2.c3;
import android.os.Parcelable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: a, reason: collision with root package name */
    protected final k.a f1760a;

    /* renamed from: b, reason: collision with root package name */
    protected final k.a f1761b;

    /* renamed from: c, reason: collision with root package name */
    protected final k.a f1762c;

    public a(k.a aVar, k.a aVar2, k.a aVar3) {
        this.f1760a = aVar;
        this.f1761b = aVar2;
        this.f1762c = aVar3;
    }

    private void N(d0.a aVar) {
        try {
            I(c(aVar.getClass()).getName());
        } catch (ClassNotFoundException e4) {
            throw new RuntimeException(aVar.getClass().getSimpleName() + " does not have a Parcelizer", e4);
        }
    }

    private Class c(Class cls) {
        Class cls2 = (Class) this.f1762c.get(cls.getName());
        if (cls2 != null) {
            return cls2;
        }
        Class<?> cls3 = Class.forName(String.format("%s.%sParcelizer", cls.getPackage().getName(), cls.getSimpleName()), false, cls.getClassLoader());
        this.f1762c.put(cls.getName(), cls3);
        return cls3;
    }

    private Method d(String str) {
        Method method = (Method) this.f1760a.get(str);
        if (method != null) {
            return method;
        }
        System.currentTimeMillis();
        Method declaredMethod = Class.forName(str, true, a.class.getClassLoader()).getDeclaredMethod("read", a.class);
        this.f1760a.put(str, declaredMethod);
        return declaredMethod;
    }

    private Method e(Class cls) {
        Method method = (Method) this.f1761b.get(cls.getName());
        if (method != null) {
            return method;
        }
        Class c4 = c(cls);
        System.currentTimeMillis();
        Method declaredMethod = c4.getDeclaredMethod("write", cls, a.class);
        this.f1761b.put(cls.getName(), declaredMethod);
        return declaredMethod;
    }

    protected abstract void A(byte[] bArr);

    public void B(byte[] bArr, int i4) {
        w(i4);
        A(bArr);
    }

    protected abstract void C(CharSequence charSequence);

    public void D(CharSequence charSequence, int i4) {
        w(i4);
        C(charSequence);
    }

    protected abstract void E(int i4);

    public void F(int i4, int i5) {
        w(i5);
        E(i4);
    }

    protected abstract void G(Parcelable parcelable);

    public void H(Parcelable parcelable, int i4) {
        w(i4);
        G(parcelable);
    }

    protected abstract void I(String str);

    public void J(String str, int i4) {
        w(i4);
        I(str);
    }

    protected void K(d0.a aVar, a aVar2) {
        try {
            e(aVar.getClass()).invoke(null, aVar, aVar2);
        } catch (ClassNotFoundException e4) {
            throw new RuntimeException("VersionedParcel encountered ClassNotFoundException", e4);
        } catch (IllegalAccessException e5) {
            throw new RuntimeException("VersionedParcel encountered IllegalAccessException", e5);
        } catch (NoSuchMethodException e6) {
            throw new RuntimeException("VersionedParcel encountered NoSuchMethodException", e6);
        } catch (InvocationTargetException e7) {
            if (!(e7.getCause() instanceof RuntimeException)) {
                throw new RuntimeException("VersionedParcel encountered InvocationTargetException", e7);
            }
            throw ((RuntimeException) e7.getCause());
        }
    }

    protected void L(d0.a aVar) {
        if (aVar == null) {
            I(null);
            return;
        }
        N(aVar);
        a b4 = b();
        K(aVar, b4);
        b4.a();
    }

    public void M(d0.a aVar, int i4) {
        w(i4);
        L(aVar);
    }

    protected abstract void a();

    protected abstract a b();

    public boolean f() {
        return false;
    }

    protected abstract boolean g();

    public boolean h(boolean z3, int i4) {
        return !m(i4) ? z3 : g();
    }

    protected abstract byte[] i();

    public byte[] j(byte[] bArr, int i4) {
        return !m(i4) ? bArr : i();
    }

    protected abstract CharSequence k();

    public CharSequence l(CharSequence charSequence, int i4) {
        return !m(i4) ? charSequence : k();
    }

    protected abstract boolean m(int i4);

    protected d0.a n(String str, a aVar) {
        try {
            return (d0.a) d(str).invoke(null, aVar);
        } catch (ClassNotFoundException e4) {
            throw new RuntimeException("VersionedParcel encountered ClassNotFoundException", e4);
        } catch (IllegalAccessException e5) {
            throw new RuntimeException("VersionedParcel encountered IllegalAccessException", e5);
        } catch (NoSuchMethodException e6) {
            throw new RuntimeException("VersionedParcel encountered NoSuchMethodException", e6);
        } catch (InvocationTargetException e7) {
            if (e7.getCause() instanceof RuntimeException) {
                throw ((RuntimeException) e7.getCause());
            }
            throw new RuntimeException(c3.d4(678), e7);
        }
    }

    protected abstract int o();

    public int p(int i4, int i5) {
        return !m(i5) ? i4 : o();
    }

    protected abstract Parcelable q();

    public Parcelable r(Parcelable parcelable, int i4) {
        return !m(i4) ? parcelable : q();
    }

    protected abstract String s();

    public String t(String str, int i4) {
        return !m(i4) ? str : s();
    }

    protected d0.a u() {
        String s3 = s();
        if (s3 == null) {
            return null;
        }
        return n(s3, b());
    }

    public d0.a v(d0.a aVar, int i4) {
        return !m(i4) ? aVar : u();
    }

    protected abstract void w(int i4);

    public void x(boolean z3, boolean z4) {
    }

    protected abstract void y(boolean z3);

    public void z(boolean z3, int i4) {
        w(i4);
        y(z3);
    }
}
