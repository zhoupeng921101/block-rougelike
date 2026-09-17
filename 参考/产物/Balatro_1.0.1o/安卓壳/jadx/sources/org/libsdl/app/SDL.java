package org.libsdl.app;

import a1.b2.c3;
import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SDL {
    protected static Context mContext;

    public static Context getContext() {
        return mContext;
    }

    public static void initialize() {
        setContext(null);
        SDLActivity.initialize();
        SDLAudioManager.initialize();
        SDLControllerManager.initialize();
    }

    public static void loadLibrary(String str) {
        if (str == null) {
            throw new NullPointerException(c3.d4(846));
        }
        try {
            Class<?> loadClass = mContext.getClassLoader().loadClass("com.getkeepsafe.relinker.ReLinker");
            Class<?> loadClass2 = mContext.getClassLoader().loadClass("com.getkeepsafe.relinker.ReLinker$LoadListener");
            Class<?> loadClass3 = mContext.getClassLoader().loadClass("android.content.Context");
            Class<?> loadClass4 = mContext.getClassLoader().loadClass("java.lang.String");
            Object invoke = loadClass.getDeclaredMethod("force", null).invoke(null, null);
            invoke.getClass().getDeclaredMethod("loadLibrary", loadClass3, loadClass4, loadClass4, loadClass2).invoke(invoke, mContext, str, null, null);
        } catch (Throwable unused) {
            System.loadLibrary(str);
        }
    }

    public static void setContext(Context context) {
        SDLAudioManager.setContext(context);
        mContext = context;
    }

    public static void setupJNI() {
        SDLActivity.nativeSetupJNI();
        SDLAudioManager.nativeSetupJNI();
        SDLControllerManager.nativeSetupJNI();
    }
}
