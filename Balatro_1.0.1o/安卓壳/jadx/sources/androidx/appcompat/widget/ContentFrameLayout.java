package androidx.appcompat.widget;

import android.content.Context;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.widget.FrameLayout;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ContentFrameLayout extends FrameLayout {

    /* renamed from: a, reason: collision with root package name */
    private TypedValue f374a;

    /* renamed from: b, reason: collision with root package name */
    private TypedValue f375b;

    /* renamed from: c, reason: collision with root package name */
    private TypedValue f376c;

    /* renamed from: d, reason: collision with root package name */
    private TypedValue f377d;

    /* renamed from: e, reason: collision with root package name */
    private TypedValue f378e;

    /* renamed from: f, reason: collision with root package name */
    private TypedValue f379f;

    /* renamed from: g, reason: collision with root package name */
    private final Rect f380g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
    }

    public ContentFrameLayout(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, 0);
    }

    public ContentFrameLayout(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f380g = new Rect();
    }

    public TypedValue getFixedHeightMajor() {
        if (this.f378e == null) {
            this.f378e = new TypedValue();
        }
        return this.f378e;
    }

    public TypedValue getFixedHeightMinor() {
        if (this.f379f == null) {
            this.f379f = new TypedValue();
        }
        return this.f379f;
    }

    public TypedValue getFixedWidthMajor() {
        if (this.f376c == null) {
            this.f376c = new TypedValue();
        }
        return this.f376c;
    }

    public TypedValue getFixedWidthMinor() {
        if (this.f377d == null) {
            this.f377d = new TypedValue();
        }
        return this.f377d;
    }

    public TypedValue getMinWidthMajor() {
        if (this.f374a == null) {
            this.f374a = new TypedValue();
        }
        return this.f374a;
    }

    public TypedValue getMinWidthMinor() {
        if (this.f375b == null) {
            this.f375b = new TypedValue();
        }
        return this.f375b;
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
    }

    /* JADX WARN: Removed duplicated region for block: B:15:0x004a  */
    /* JADX WARN: Removed duplicated region for block: B:17:0x0063  */
    /* JADX WARN: Removed duplicated region for block: B:26:0x0086  */
    /* JADX WARN: Removed duplicated region for block: B:35:0x00ab  */
    /* JADX WARN: Removed duplicated region for block: B:40:0x00b8  */
    /* JADX WARN: Removed duplicated region for block: B:43:0x00cc  */
    /* JADX WARN: Removed duplicated region for block: B:45:0x00d6  */
    /* JADX WARN: Removed duplicated region for block: B:47:0x00de  */
    /* JADX WARN: Removed duplicated region for block: B:50:? A[RETURN, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:51:0x00be  */
    /* JADX WARN: Removed duplicated region for block: B:54:0x00ae  */
    @Override // android.widget.FrameLayout, android.view.View
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    protected void onMeasure(int r14, int r15) {
        /*
            Method dump skipped, instructions count: 226
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.ContentFrameLayout.onMeasure(int, int):void");
    }

    public void setAttachListener(a aVar) {
    }
}
