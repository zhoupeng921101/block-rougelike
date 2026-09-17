package androidx.core.app;

import android.app.RemoteInput;
import android.content.Intent;
import android.os.Bundle;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a0 {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static void a(Object obj, Intent intent, Bundle bundle) {
            RemoteInput.addResultsToIntent((RemoteInput[]) obj, intent, bundle);
        }

        public static RemoteInput b(a0 a0Var) {
            throw null;
        }

        static Bundle c(Intent intent) {
            return RemoteInput.getResultsFromIntent(intent);
        }
    }

    static RemoteInput a(a0 a0Var) {
        return a.b(a0Var);
    }

    static RemoteInput[] b(a0[] a0VarArr) {
        if (a0VarArr == null) {
            return null;
        }
        RemoteInput[] remoteInputArr = new RemoteInput[a0VarArr.length];
        for (int i4 = 0; i4 < a0VarArr.length; i4++) {
            a0 a0Var = a0VarArr[i4];
            remoteInputArr[i4] = a(null);
        }
        return remoteInputArr;
    }
}
