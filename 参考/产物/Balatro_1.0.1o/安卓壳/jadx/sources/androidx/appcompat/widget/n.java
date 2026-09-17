package androidx.appcompat.widget;

import android.view.textclassifier.TextClassificationManager;
import android.view.textclassifier.TextClassifier;
import android.widget.TextView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class n {

    /* renamed from: a, reason: collision with root package name */
    private TextView f608a;

    /* renamed from: b, reason: collision with root package name */
    private TextClassifier f609b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class a {
        static TextClassifier a(TextView textView) {
            TextClassificationManager textClassificationManager = (TextClassificationManager) textView.getContext().getSystemService(TextClassificationManager.class);
            return textClassificationManager != null ? textClassificationManager.getTextClassifier() : TextClassifier.NO_OP;
        }
    }

    n(TextView textView) {
        this.f608a = (TextView) androidx.core.util.c.d(textView);
    }

    public TextClassifier a() {
        TextClassifier textClassifier = this.f609b;
        return textClassifier == null ? a.a(this.f608a) : textClassifier;
    }

    public void b(TextClassifier textClassifier) {
        this.f609b = textClassifier;
    }
}
