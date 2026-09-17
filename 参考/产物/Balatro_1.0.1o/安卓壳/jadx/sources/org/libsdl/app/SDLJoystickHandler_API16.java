package org.libsdl.app;

import android.view.InputDevice;
import android.view.MotionEvent;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLJoystickHandler_API16 extends SDLJoystickHandler {
    private final ArrayList<SDLJoystick> mJoysticks = new ArrayList<>();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class RangeComparator implements Comparator<InputDevice.MotionRange> {
        RangeComparator() {
        }

        @Override // java.util.Comparator
        public int compare(InputDevice.MotionRange motionRange, InputDevice.MotionRange motionRange2) {
            int axis = motionRange.getAxis();
            int axis2 = motionRange2.getAxis();
            if (axis == 22) {
                axis = 23;
            } else if (axis == 23) {
                axis = 22;
            }
            if (axis2 == 22) {
                axis2 = 23;
            } else if (axis2 == 23) {
                axis2 = 22;
            }
            if (axis == 11) {
                axis = 13;
            } else if (axis > 11 && axis < 14) {
                axis--;
            }
            if (axis2 == 11) {
                axis2 = 13;
            } else if (axis2 > 11 && axis2 < 14) {
                axis2--;
            }
            return axis - axis2;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class SDLJoystick {
        public ArrayList<InputDevice.MotionRange> axes;
        public String desc;
        public int device_id;
        public ArrayList<InputDevice.MotionRange> hats;
        public String name;

        SDLJoystick() {
        }
    }

    public int getAxisMask(List<InputDevice.MotionRange> list) {
        return -1;
    }

    public int getButtonMask(InputDevice inputDevice) {
        return -1;
    }

    protected SDLJoystick getJoystick(int i4) {
        ArrayList<SDLJoystick> arrayList = this.mJoysticks;
        int size = arrayList.size();
        int i5 = 0;
        while (i5 < size) {
            SDLJoystick sDLJoystick = arrayList.get(i5);
            i5++;
            SDLJoystick sDLJoystick2 = sDLJoystick;
            if (sDLJoystick2.device_id == i4) {
                return sDLJoystick2;
            }
        }
        return null;
    }

    public String getJoystickDescriptor(InputDevice inputDevice) {
        String descriptor = inputDevice.getDescriptor();
        return (descriptor == null || descriptor.isEmpty()) ? inputDevice.getName() : descriptor;
    }

    public int getProductId(InputDevice inputDevice) {
        return 0;
    }

    public int getVendorId(InputDevice inputDevice) {
        return 0;
    }

    @Override // org.libsdl.app.SDLJoystickHandler
    public boolean handleMotionEvent(MotionEvent motionEvent) {
        SDLJoystick joystick;
        int actionIndex = motionEvent.getActionIndex();
        if (motionEvent.getActionMasked() == 2 && (joystick = getJoystick(motionEvent.getDeviceId())) != null) {
            for (int i4 = 0; i4 < joystick.axes.size(); i4++) {
                InputDevice.MotionRange motionRange = joystick.axes.get(i4);
                SDLControllerManager.onNativeJoy(joystick.device_id, i4, (((motionEvent.getAxisValue(motionRange.getAxis(), actionIndex) - motionRange.getMin()) / motionRange.getRange()) * 2.0f) - 1.0f);
            }
            for (int i5 = 0; i5 < joystick.hats.size() / 2; i5++) {
                int i6 = i5 * 2;
                SDLControllerManager.onNativeHat(joystick.device_id, i5, Math.round(motionEvent.getAxisValue(joystick.hats.get(i6).getAxis(), actionIndex)), Math.round(motionEvent.getAxisValue(joystick.hats.get(i6 + 1).getAxis(), actionIndex)));
            }
        }
        return true;
    }

    @Override // org.libsdl.app.SDLJoystickHandler
    public void pollInputDevices() {
        int[] deviceIds = InputDevice.getDeviceIds();
        for (int i4 : deviceIds) {
            if (SDLControllerManager.isDeviceSDLJoystick(i4) && getJoystick(i4) == null) {
                InputDevice device = InputDevice.getDevice(i4);
                SDLJoystick sDLJoystick = new SDLJoystick();
                sDLJoystick.device_id = i4;
                sDLJoystick.name = device.getName();
                sDLJoystick.desc = getJoystickDescriptor(device);
                sDLJoystick.axes = new ArrayList<>();
                sDLJoystick.hats = new ArrayList<>();
                List<InputDevice.MotionRange> motionRanges = device.getMotionRanges();
                Collections.sort(motionRanges, new RangeComparator());
                for (InputDevice.MotionRange motionRange : motionRanges) {
                    if ((motionRange.getSource() & 16) != 0) {
                        if (motionRange.getAxis() == 15 || motionRange.getAxis() == 16) {
                            sDLJoystick.hats.add(motionRange);
                        } else {
                            sDLJoystick.axes.add(motionRange);
                        }
                    }
                }
                this.mJoysticks.add(sDLJoystick);
                SDLControllerManager.nativeAddJoystick(sDLJoystick.device_id, sDLJoystick.name, sDLJoystick.desc, getVendorId(device), getProductId(device), false, getButtonMask(device), sDLJoystick.axes.size(), getAxisMask(sDLJoystick.axes), sDLJoystick.hats.size() / 2, 0);
            }
        }
        ArrayList<SDLJoystick> arrayList = this.mJoysticks;
        int size = arrayList.size();
        ArrayList arrayList2 = null;
        int i5 = 0;
        while (i5 < size) {
            SDLJoystick sDLJoystick2 = arrayList.get(i5);
            i5++;
            int i6 = sDLJoystick2.device_id;
            int i7 = 0;
            while (i7 < deviceIds.length && i6 != deviceIds[i7]) {
                i7++;
            }
            if (i7 == deviceIds.length) {
                if (arrayList2 == null) {
                    arrayList2 = new ArrayList();
                }
                arrayList2.add(Integer.valueOf(i6));
            }
        }
        if (arrayList2 != null) {
            int size2 = arrayList2.size();
            int i8 = 0;
            while (i8 < size2) {
                Object obj = arrayList2.get(i8);
                i8++;
                int intValue = ((Integer) obj).intValue();
                SDLControllerManager.nativeRemoveJoystick(intValue);
                int i9 = 0;
                while (true) {
                    if (i9 >= this.mJoysticks.size()) {
                        break;
                    }
                    if (this.mJoysticks.get(i9).device_id == intValue) {
                        this.mJoysticks.remove(i9);
                        break;
                    }
                    i9++;
                }
            }
        }
    }
}
