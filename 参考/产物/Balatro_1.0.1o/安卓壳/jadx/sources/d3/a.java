package d3;

import a1.b2.c3;
import b3.f;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends c3.a {
    @Override // c3.a
    public Random c() {
        ThreadLocalRandom current = ThreadLocalRandom.current();
        f.d(current, c3.d4(255));
        return current;
    }
}
