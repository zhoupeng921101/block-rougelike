package org.libsdl.app;

import android.os.Build;
import android.view.InputDevice;
import android.view.MotionEvent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SDLControllerManager {
    private static final String TAG = "SDLControllerManager";
    protected static SDLHapticHandler mHapticHandler;
    protected static SDLJoystickHandler mJoystickHandler;

    public static boolean handleJoystickMotionEvent(MotionEvent motionEvent) {
        return mJoystickHandler.handleMotionEvent(motionEvent);
    }

    public static void hapticRun(int i4, float f4, int i5) {
        mHapticHandler.run(i4, f4, i5);
    }

    public static void hapticStop(int i4) {
        mHapticHandler.stop(i4);
    }

    public static void initialize() {
        if (mJoystickHandler == null) {
            mJoystickHandler = new SDLJoystickHandler_API19();
        }
        if (mHapticHandler == null) {
            if (Build.VERSION.SDK_INT >= 26) {
                mHapticHandler = new SDLHapticHandler_API26();
            } else {
                mHapticHandler = new SDLHapticHandler();
            }
        }
    }

    public static boolean isDeviceSDLJoystick(int i4) {
        InputDevice device = InputDevice.getDevice(i4);
        if (device == null || i4 < 0) {
            return false;
        }
        int sources = device.getSources();
        return (sources & 16) != 0 || (sources & 513) == 513 || (sources & 1025) == 1025;
    }

    public static native int nativeAddHaptic(int i4, String str);

    public static native int nativeAddJoystick(int i4, String str, String str2, int i5, int i6, boolean z3, int i7, int i8, int i9, int i10, int i11);

    public static native int nativeRemoveHaptic(int i4);

    public static native int nativeRemoveJoystick(int i4);

    public static native int nativeSetupJNI();

    public static native void onNativeHat(int i4, int i5, int i6, int i7);

    public static native void onNativeJoy(int i4, int i5, float f4);

    public static native int onNativePadDown(int i4, int i5);

    public static native int onNativePadUp(int i4, int i5);

    public static void pollHapticDevices() {
        mHapticHandler.pollHapticDevices();
    }

    public static void pollInputDevices() {
        mJoystickHandler.pollInputDevices();
    }
}
