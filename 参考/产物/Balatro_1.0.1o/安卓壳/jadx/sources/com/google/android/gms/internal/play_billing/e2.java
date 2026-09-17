package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e2 implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    h2 f2749e;

    e2(h2 h2Var) {
        this.f2749e = h2Var;
    }

    /* JADX WARN: Code restructure failed: missing block: B:3:0x0006, code lost:
    
        r1 = r0.f2778l;
     */
    @Override // java.lang.Runnable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public final void run() {
        /*
            r10 = this;
            com.google.android.gms.internal.play_billing.h2 r0 = r10.f2749e
            if (r0 != 0) goto L6
            goto L84
        L6:
            com.google.android.gms.internal.play_billing.c2 r1 = com.google.android.gms.internal.play_billing.h2.x(r0)
            if (r1 == 0) goto L84
            r2 = 0
            r10.f2749e = r2
            boolean r3 = r1.isDone()
            if (r3 == 0) goto L19
            r0.r(r1)
            return
        L19:
            r3 = 1
            java.util.concurrent.ScheduledFuture r4 = com.google.android.gms.internal.play_billing.h2.z(r0)     // Catch: java.lang.Throwable -> L75
            com.google.android.gms.internal.play_billing.h2.A(r0, r2)     // Catch: java.lang.Throwable -> L75
            java.lang.String r5 = "Timed out"
            if (r4 == 0) goto L51
            java.util.concurrent.TimeUnit r6 = java.util.concurrent.TimeUnit.MILLISECONDS     // Catch: java.lang.Throwable -> L4f
            long r6 = r4.getDelay(r6)     // Catch: java.lang.Throwable -> L4f
            long r6 = java.lang.Math.abs(r6)     // Catch: java.lang.Throwable -> L4f
            r8 = 10
            int r4 = (r6 > r8 ? 1 : (r6 == r8 ? 0 : -1))
            if (r4 <= 0) goto L51
            java.lang.StringBuilder r4 = new java.lang.StringBuilder     // Catch: java.lang.Throwable -> L4f
            r4.<init>()     // Catch: java.lang.Throwable -> L4f
            r4.append(r5)     // Catch: java.lang.Throwable -> L4f
            java.lang.String r8 = " (timeout delayed by "
            r4.append(r8)     // Catch: java.lang.Throwable -> L4f
            r4.append(r6)     // Catch: java.lang.Throwable -> L4f
            java.lang.String r6 = " ms after scheduled time)"
            r4.append(r6)     // Catch: java.lang.Throwable -> L4f
            java.lang.String r5 = r4.toString()     // Catch: java.lang.Throwable -> L4f
            goto L51
        L4f:
            r4 = move-exception
            goto L77
        L51:
            java.lang.String r4 = r1.toString()     // Catch: java.lang.Throwable -> L4f
            java.lang.StringBuilder r6 = new java.lang.StringBuilder     // Catch: java.lang.Throwable -> L4f
            r6.<init>()     // Catch: java.lang.Throwable -> L4f
            r6.append(r5)     // Catch: java.lang.Throwable -> L4f
            java.lang.String r7 = ": "
            r6.append(r7)     // Catch: java.lang.Throwable -> L4f
            r6.append(r4)     // Catch: java.lang.Throwable -> L4f
            java.lang.String r4 = r6.toString()     // Catch: java.lang.Throwable -> L4f
            com.google.android.gms.internal.play_billing.f2 r5 = new com.google.android.gms.internal.play_billing.f2     // Catch: java.lang.Throwable -> L75
            r5.<init>(r4, r2)     // Catch: java.lang.Throwable -> L75
            r0.q(r5)     // Catch: java.lang.Throwable -> L75
            r1.cancel(r3)
            return
        L75:
            r0 = move-exception
            goto L80
        L77:
            com.google.android.gms.internal.play_billing.f2 r6 = new com.google.android.gms.internal.play_billing.f2     // Catch: java.lang.Throwable -> L75
            r6.<init>(r5, r2)     // Catch: java.lang.Throwable -> L75
            r0.q(r6)     // Catch: java.lang.Throwable -> L75
            throw r4     // Catch: java.lang.Throwable -> L75
        L80:
            r1.cancel(r3)
            throw r0
        L84:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.internal.play_billing.e2.run():void");
    }
}
