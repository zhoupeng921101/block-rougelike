package k0;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h {

    /* renamed from: a, reason: collision with root package name */
    private final i0.b f3960a;

    /* renamed from: b, reason: collision with root package name */
    private final byte[] f3961b;

    public h(i0.b bVar, byte[] bArr) {
        if (bVar == null) {
            throw new NullPointerException("encoding is null");
        }
        if (bArr == null) {
            throw new NullPointerException("bytes is null");
        }
        this.f3960a = bVar;
        this.f3961b = bArr;
    }

    public byte[] a() {
        return this.f3961b;
    }

    public i0.b b() {
        return this.f3960a;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof h)) {
            return false;
        }
        h hVar = (h) obj;
        if (this.f3960a.equals(hVar.f3960a)) {
            return Arrays.equals(this.f3961b, hVar.f3961b);
        }
        return false;
    }

    public int hashCode() {
        return ((this.f3960a.hashCode() ^ 1000003) * 1000003) ^ Arrays.hashCode(this.f3961b);
    }

    public String toString() {
        return "EncodedPayload{encoding=" + this.f3960a + ", bytes=[...]}";
    }
}
