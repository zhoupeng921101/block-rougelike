package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.util.AttributeSet;
import android.widget.ImageButton;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class j extends ImageButton {

    /* renamed from: a, reason: collision with root package name */
    private final e f586a;

    /* renamed from: b, reason: collision with root package name */
    private final k f587b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f588c;

    public j(Context context, AttributeSet attributeSet, int i4) {
        super(i0.b(context), attributeSet, i4);
        this.f588c = false;
        h0.a(this, getContext());
        e eVar = new e(this);
        this.f586a = eVar;
        eVar.e(attributeSet, i4);
        k kVar = new k(this);
        this.f587b = kVar;
        kVar.g(attributeSet, i4);
    }

    @Override // android.widget.ImageView, android.view.View
    protected void drawableStateChanged() {
        super.drawableStateChanged();
        e eVar = this.f586a;
        if (eVar != null) {
            eVar.b();
        }
        k kVar = this.f587b;
        if (kVar != null) {
            kVar.c();
        }
    }

    public ColorStateList getSupportBackgroundTintList() {
        e eVar = this.f586a;
        if (eVar != null) {
            return eVar.c();
        }
        return null;
    }

    public PorterDuff.Mode getSupportBackgroundTintMode() {
        e eVar = this.f586a;
        if (eVar != null) {
            return eVar.d();
        }
        return null;
    }

    public ColorStateList getSupportImageTintList() {
        k kVar = this.f587b;
        if (kVar != null) {
            return kVar.d();
        }
        return null;
    }

    public PorterDuff.Mode getSupportImageTintMode() {
        k kVar = this.f587b;
        if (kVar != null) {
            return kVar.e();
        }
        return null;
    }

    @Override // android.widget.ImageView, android.view.View
    public boolean hasOverlappingRendering() {
        return this.f587b.f() && super.hasOverlappingRendering();
    }

    @Override // android.view.View
    public void setBackgroundDrawable(Drawable drawable) {
        super.setBackgroundDrawable(drawable);
        e eVar = this.f586a;
        if (eVar != null) {
            eVar.f(drawable);
        }
    }

    @Override // android.view.View
    public void setBackgroundResource(int i4) {
        super.setBackgroundResource(i4);
        e eVar = this.f586a;
        if (eVar != null) {
            eVar.g(i4);
        }
    }

    @Override // android.widget.ImageView
    public void setImageBitmap(Bitmap bitmap) {
        super.setImageBitmap(bitmap);
        k kVar = this.f587b;
        if (kVar != null) {
            kVar.c();
        }
    }

    @Override // android.widget.ImageView
    public void setImageDrawable(Drawable drawable) {
        k kVar = this.f587b;
        if (kVar != null && drawable != null && !this.f588c) {
            kVar.h(drawable);
        }
        super.setImageDrawable(drawable);
        k kVar2 = this.f587b;
        if (kVar2 != null) {
            kVar2.c();
            if (this.f588c) {
                return;
            }
            this.f587b.b();
        }
    }

    @Override // android.widget.ImageView
    public void setImageLevel(int i4) {
        super.setImageLevel(i4);
        this.f588c = true;
    }

    @Override // android.widget.ImageView
    public void setImageResource(int i4) {
        this.f587b.i(i4);
    }

    @Override // android.widget.ImageView
    public void setImageURI(Uri uri) {
        super.setImageURI(uri);
        k kVar = this.f587b;
        if (kVar != null) {
            kVar.c();
        }
    }

    public void setSupportBackgroundTintList(ColorStateList colorStateList) {
        e eVar = this.f586a;
        if (eVar != null) {
            eVar.i(colorStateList);
        }
    }

    public void setSupportBackgroundTintMode(PorterDuff.Mode mode) {
        e eVar = this.f586a;
        if (eVar != null) {
            eVar.j(mode);
        }
    }

    public void setSupportImageTintList(ColorStateList colorStateList) {
        k kVar = this.f587b;
        if (kVar != null) {
            kVar.j(colorStateList);
        }
    }

    public void setSupportImageTintMode(PorterDuff.Mode mode) {
        k kVar = this.f587b;
        if (kVar != null) {
            kVar.k(mode);
        }
    }
}
