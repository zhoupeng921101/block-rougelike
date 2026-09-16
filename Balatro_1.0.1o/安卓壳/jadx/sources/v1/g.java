package v1;

import android.net.Uri;
import com.google.android.gms.common.data.BitmapTeleporter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface g {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private String f5050a;

        /* renamed from: b, reason: collision with root package name */
        private Long f5051b;

        /* renamed from: c, reason: collision with root package name */
        private Long f5052c;

        /* renamed from: d, reason: collision with root package name */
        private BitmapTeleporter f5053d;

        /* renamed from: e, reason: collision with root package name */
        private Uri f5054e;

        public g a() {
            return new h(this.f5050a, this.f5051b, this.f5053d, this.f5054e, this.f5052c);
        }

        public a b(String str) {
            this.f5050a = str;
            return this;
        }
    }

    BitmapTeleporter a();
}
