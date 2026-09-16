package o;

import a1.b2.c3;
import android.os.Build;
import android.text.PrecomputedText;
import android.text.Spannable;
import android.text.TextDirectionHeuristic;
import android.text.TextDirectionHeuristics;
import android.text.TextPaint;
import android.text.TextUtils;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class k implements Spannable {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private final TextPaint f4280a;

        /* renamed from: b, reason: collision with root package name */
        private final TextDirectionHeuristic f4281b;

        /* renamed from: c, reason: collision with root package name */
        private final int f4282c;

        /* renamed from: d, reason: collision with root package name */
        private final int f4283d;

        /* renamed from: e, reason: collision with root package name */
        final PrecomputedText.Params f4284e;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: o.k$a$a, reason: collision with other inner class name */
        public static class C0061a {

            /* renamed from: a, reason: collision with root package name */
            private final TextPaint f4285a;

            /* renamed from: c, reason: collision with root package name */
            private int f4287c = 1;

            /* renamed from: d, reason: collision with root package name */
            private int f4288d = 1;

            /* renamed from: b, reason: collision with root package name */
            private TextDirectionHeuristic f4286b = TextDirectionHeuristics.FIRSTSTRONG_LTR;

            public C0061a(TextPaint textPaint) {
                this.f4285a = textPaint;
            }

            public a a() {
                return new a(this.f4285a, this.f4286b, this.f4287c, this.f4288d);
            }

            public C0061a b(int i4) {
                this.f4287c = i4;
                return this;
            }

            public C0061a c(int i4) {
                this.f4288d = i4;
                return this;
            }

            public C0061a d(TextDirectionHeuristic textDirectionHeuristic) {
                this.f4286b = textDirectionHeuristic;
                return this;
            }
        }

        public a(PrecomputedText.Params params) {
            TextPaint textPaint;
            TextDirectionHeuristic textDirection;
            int breakStrategy;
            int hyphenationFrequency;
            textPaint = params.getTextPaint();
            this.f4280a = textPaint;
            textDirection = params.getTextDirection();
            this.f4281b = textDirection;
            breakStrategy = params.getBreakStrategy();
            this.f4282c = breakStrategy;
            hyphenationFrequency = params.getHyphenationFrequency();
            this.f4283d = hyphenationFrequency;
            this.f4284e = Build.VERSION.SDK_INT < 29 ? null : params;
        }

        a(TextPaint textPaint, TextDirectionHeuristic textDirectionHeuristic, int i4, int i5) {
            PrecomputedText.Params.Builder breakStrategy;
            PrecomputedText.Params.Builder hyphenationFrequency;
            PrecomputedText.Params.Builder textDirection;
            PrecomputedText.Params build;
            if (Build.VERSION.SDK_INT >= 29) {
                breakStrategy = j.a(textPaint).setBreakStrategy(i4);
                hyphenationFrequency = breakStrategy.setHyphenationFrequency(i5);
                textDirection = hyphenationFrequency.setTextDirection(textDirectionHeuristic);
                build = textDirection.build();
                this.f4284e = build;
            } else {
                this.f4284e = null;
            }
            this.f4280a = textPaint;
            this.f4281b = textDirectionHeuristic;
            this.f4282c = i4;
            this.f4283d = i5;
        }

        public boolean a(a aVar) {
            if (this.f4282c == aVar.b() && this.f4283d == aVar.c() && this.f4280a.getTextSize() == aVar.e().getTextSize() && this.f4280a.getTextScaleX() == aVar.e().getTextScaleX() && this.f4280a.getTextSkewX() == aVar.e().getTextSkewX() && this.f4280a.getLetterSpacing() == aVar.e().getLetterSpacing() && TextUtils.equals(this.f4280a.getFontFeatureSettings(), aVar.e().getFontFeatureSettings()) && this.f4280a.getFlags() == aVar.e().getFlags() && this.f4280a.getTextLocales().equals(aVar.e().getTextLocales())) {
                return this.f4280a.getTypeface() == null ? aVar.e().getTypeface() == null : this.f4280a.getTypeface().equals(aVar.e().getTypeface());
            }
            return false;
        }

        public int b() {
            return this.f4282c;
        }

        public int c() {
            return this.f4283d;
        }

        public TextDirectionHeuristic d() {
            return this.f4281b;
        }

        public TextPaint e() {
            return this.f4280a;
        }

        public boolean equals(Object obj) {
            if (obj == this) {
                return true;
            }
            if (!(obj instanceof a)) {
                return false;
            }
            a aVar = (a) obj;
            return a(aVar) && this.f4281b == aVar.d();
        }

        public int hashCode() {
            return androidx.core.util.b.b(Float.valueOf(this.f4280a.getTextSize()), Float.valueOf(this.f4280a.getTextScaleX()), Float.valueOf(this.f4280a.getTextSkewX()), Float.valueOf(this.f4280a.getLetterSpacing()), Integer.valueOf(this.f4280a.getFlags()), this.f4280a.getTextLocales(), this.f4280a.getTypeface(), Boolean.valueOf(this.f4280a.isElegantTextHeight()), this.f4281b, Integer.valueOf(this.f4282c), Integer.valueOf(this.f4283d));
        }

        public String toString() {
            String fontVariationSettings;
            StringBuilder sb = new StringBuilder(c3.d4(894));
            sb.append("textSize=" + this.f4280a.getTextSize());
            sb.append(", textScaleX=" + this.f4280a.getTextScaleX());
            sb.append(c3.d4(1047) + this.f4280a.getTextSkewX());
            int i4 = Build.VERSION.SDK_INT;
            sb.append(", letterSpacing=" + this.f4280a.getLetterSpacing());
            sb.append(", elegantTextHeight=" + this.f4280a.isElegantTextHeight());
            sb.append(", textLocale=" + this.f4280a.getTextLocales());
            sb.append(", typeface=" + this.f4280a.getTypeface());
            if (i4 >= 26) {
                StringBuilder sb2 = new StringBuilder();
                sb2.append(", variationSettings=");
                fontVariationSettings = this.f4280a.getFontVariationSettings();
                sb2.append(fontVariationSettings);
                sb.append(sb2.toString());
            }
            sb.append(", textDir=" + this.f4281b);
            sb.append(", breakStrategy=" + this.f4282c);
            sb.append(", hyphenationFrequency=" + this.f4283d);
            sb.append("}");
            return sb.toString();
        }
    }
}
