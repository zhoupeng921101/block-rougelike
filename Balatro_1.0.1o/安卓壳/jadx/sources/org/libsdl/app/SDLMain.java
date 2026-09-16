package org.libsdl.app;

import a1.b2.c3;
import android.os.Process;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLMain implements Runnable {
    SDLMain() {
    }

    @Override // java.lang.Runnable
    public void run() {
        SDLActivity sDLActivity;
        String mainSharedObject = SDLActivity.mSingleton.getMainSharedObject();
        String mainFunction = SDLActivity.mSingleton.getMainFunction();
        String[] arguments = SDLActivity.mSingleton.getArguments();
        try {
            Process.setThreadPriority(-4);
        } catch (Exception e4) {
            Log.v("SDL", "modify thread properties failed " + e4.toString());
        }
        Log.v("SDL", c3.d4(600) + mainFunction + " from library " + mainSharedObject);
        SDLActivity.nativeRunMain(mainSharedObject, mainFunction, arguments);
        Log.v("SDL", c3.d4(221));
        if (SDLActivity.mExitCalledFromJava || (sDLActivity = SDLActivity.mSingleton) == null || sDLActivity.isFinishing()) {
            return;
        }
        SDLActivity.mSDLThread = null;
        SDLActivity.mSingleton.finish();
    }
}
