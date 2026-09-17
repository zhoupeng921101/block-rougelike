package t;

import android.graphics.Rect;
import android.text.method.TransformationMethod;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class h implements TransformationMethod {

    /* renamed from: a, reason: collision with root package name */
    private final TransformationMethod f4988a;

    h(TransformationMethod transformationMethod) {
        this.f4988a = transformationMethod;
    }

    public TransformationMethod a() {
        return this.f4988a;
    }

    @Override // android.text.method.TransformationMethod
    public CharSequence getTransformation(CharSequence charSequence, View view) {
        if (view.isInEditMode()) {
            return charSequence;
        }
        TransformationMethod transformationMethod = this.f4988a;
        if (transformationMethod != null) {
            charSequence = transformationMethod.getTransformation(charSequence, view);
        }
        return (charSequence == null || androidx.emoji2.text.e.b().d() != 1) ? charSequence : androidx.emoji2.text.e.b().o(charSequence);
    }

    @Override // android.text.method.TransformationMethod
    public void onFocusChanged(View view, CharSequence charSequence, boolean z3, int i4, Rect rect) {
        TransformationMethod transformationMethod = this.f4988a;
        if (transformationMethod != null) {
            transformationMethod.onFocusChanged(view, charSequence, z3, i4, rect);
        }
    }
}
