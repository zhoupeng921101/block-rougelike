package org.libsdl.app;

import android.os.Vibrator;
import android.view.InputDevice;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLHapticHandler {
    private final ArrayList<SDLHaptic> mHaptics = new ArrayList<>();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class SDLHaptic {
        public int device_id;
        public String name;
        public Vibrator vib;

        SDLHaptic() {
        }
    }

    protected SDLHaptic getHaptic(int i4) {
        ArrayList<SDLHaptic> arrayList = this.mHaptics;
        int size = arrayList.size();
        int i5 = 0;
        while (i5 < size) {
            SDLHaptic sDLHaptic = arrayList.get(i5);
            i5++;
            SDLHaptic sDLHaptic2 = sDLHaptic;
            if (sDLHaptic2.device_id == i4) {
                return sDLHaptic2;
            }
        }
        return null;
    }

    public void pollHapticDevices() {
        boolean z3;
        int[] deviceIds = InputDevice.getDeviceIds();
        int length = deviceIds.length;
        while (true) {
            length--;
            if (length <= -1) {
                break;
            }
            if (getHaptic(deviceIds[length]) == null) {
                InputDevice device = InputDevice.getDevice(deviceIds[length]);
                Vibrator vibrator = device.getVibrator();
                if (vibrator.hasVibrator()) {
                    SDLHaptic sDLHaptic = new SDLHaptic();
                    sDLHaptic.device_id = deviceIds[length];
                    sDLHaptic.name = device.getName();
                    sDLHaptic.vib = vibrator;
                    this.mHaptics.add(sDLHaptic);
                    SDLControllerManager.nativeAddHaptic(sDLHaptic.device_id, sDLHaptic.name);
                }
            }
        }
        Vibrator vibrator2 = (Vibrator) SDL.getContext().getSystemService("vibrator");
        if (vibrator2 != null) {
            z3 = vibrator2.hasVibrator();
            if (z3 && getHaptic(999999) == null) {
                SDLHaptic sDLHaptic2 = new SDLHaptic();
                sDLHaptic2.device_id = 999999;
                sDLHaptic2.name = "VIBRATOR_SERVICE";
                sDLHaptic2.vib = vibrator2;
                this.mHaptics.add(sDLHaptic2);
                SDLControllerManager.nativeAddHaptic(sDLHaptic2.device_id, sDLHaptic2.name);
            }
        } else {
            z3 = false;
        }
        ArrayList<SDLHaptic> arrayList = this.mHaptics;
        int size = arrayList.size();
        ArrayList arrayList2 = null;
        int i4 = 0;
        while (i4 < size) {
            SDLHaptic sDLHaptic3 = arrayList.get(i4);
            i4++;
            int i5 = sDLHaptic3.device_id;
            int i6 = 0;
            while (i6 < deviceIds.length && i5 != deviceIds[i6]) {
                i6++;
            }
            if (i5 != 999999 || !z3) {
                if (i6 == deviceIds.length) {
                    if (arrayList2 == null) {
                        arrayList2 = new ArrayList();
                    }
                    arrayList2.add(Integer.valueOf(i5));
                }
            }
        }
        if (arrayList2 != null) {
            int size2 = arrayList2.size();
            int i7 = 0;
            while (i7 < size2) {
                Object obj = arrayList2.get(i7);
                i7++;
                int intValue = ((Integer) obj).intValue();
                SDLControllerManager.nativeRemoveHaptic(intValue);
                int i8 = 0;
                while (true) {
                    if (i8 >= this.mHaptics.size()) {
                        break;
                    }
                    if (this.mHaptics.get(i8).device_id == intValue) {
                        this.mHaptics.remove(i8);
                        break;
                    }
                    i8++;
                }
            }
        }
    }

    public void run(int i4, float f4, int i5) {
        SDLHaptic haptic = getHaptic(i4);
        if (haptic != null) {
            haptic.vib.vibrate(i5);
        }
    }

    public void stop(int i4) {
        SDLHaptic haptic = getHaptic(i4);
        if (haptic != null) {
            haptic.vib.cancel();
        }
    }
}
