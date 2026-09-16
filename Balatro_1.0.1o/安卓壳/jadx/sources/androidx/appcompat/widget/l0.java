package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.util.TypedValue;
import androidx.core.content.res.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class l0 {

    /* renamed from: a, reason: collision with root package name */
    private final Context f602a;

    /* renamed from: b, reason: collision with root package name */
    private final TypedArray f603b;

    /* renamed from: c, reason: collision with root package name */
    private TypedValue f604c;

    private l0(Context context, TypedArray typedArray) {
        this.f602a = context;
        this.f603b = typedArray;
    }

    public static l0 q(Context context, int i4, int[] iArr) {
        return new l0(context, context.obtainStyledAttributes(i4, iArr));
    }

    public static l0 r(Context context, AttributeSet attributeSet, int[] iArr) {
        return new l0(context, context.obtainStyledAttributes(attributeSet, iArr));
    }

    public static l0 s(Context context, AttributeSet attributeSet, int[] iArr, int i4, int i5) {
        return new l0(context, context.obtainStyledAttributes(attributeSet, iArr, i4, i5));
    }

    public boolean a(int i4, boolean z3) {
        return this.f603b.getBoolean(i4, z3);
    }

    public int b(int i4, int i5) {
        return this.f603b.getColor(i4, i5);
    }

    public ColorStateList c(int i4) {
        int resourceId;
        ColorStateList a4;
        return (!this.f603b.hasValue(i4) || (resourceId = this.f603b.getResourceId(i4, 0)) == 0 || (a4 = e.a.a(this.f602a, resourceId)) == null) ? this.f603b.getColorStateList(i4) : a4;
    }

    public int d(int i4, int i5) {
        return this.f603b.getDimensionPixelOffset(i4, i5);
    }

    public int e(int i4, int i5) {
        return this.f603b.getDimensionPixelSize(i4, i5);
    }

    public Drawable f(int i4) {
        int resourceId;
        return (!this.f603b.hasValue(i4) || (resourceId = this.f603b.getResourceId(i4, 0)) == 0) ? this.f603b.getDrawable(i4) : e.a.b(this.f602a, resourceId);
    }

    public float g(int i4, float f4) {
        return this.f603b.getFloat(i4, f4);
    }

    public Typeface h(int i4, int i5, f.e eVar) {
        int resourceId = this.f603b.getResourceId(i4, 0);
        if (resourceId == 0) {
            return null;
        }
        if (this.f604c == null) {
            this.f604c = new TypedValue();
        }
        return androidx.core.content.res.f.f(this.f602a, resourceId, this.f604c, i5, eVar);
    }

    public int i(int i4, int i5) {
        return this.f603b.getInt(i4, i5);
    }

    public int j(int i4, int i5) {
        return this.f603b.getInteger(i4, i5);
    }

    public int k(int i4, int i5) {
        return this.f603b.getLayoutDimension(i4, i5);
    }

    public int l(int i4, int i5) {
        return this.f603b.getResourceId(i4, i5);
    }

    public String m(int i4) {
        return this.f603b.getString(i4);
    }

    public CharSequence n(int i4) {
        return this.f603b.getText(i4);
    }

    public TypedArray o() {
        return this.f603b;
    }

    public boolean p(int i4) {
        return this.f603b.hasValue(i4);
    }

    public void t() {
        this.f603b.recycle();
    }
}
