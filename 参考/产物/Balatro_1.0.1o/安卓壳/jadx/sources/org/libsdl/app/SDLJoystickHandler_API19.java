package org.libsdl.app;

import android.view.InputDevice;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLJoystickHandler_API19 extends SDLJoystickHandler_API16 {
    SDLJoystickHandler_API19() {
    }

    @Override // org.libsdl.app.SDLJoystickHandler_API16
    public int getAxisMask(List<InputDevice.MotionRange> list) {
        boolean z3 = false;
        int i4 = list.size() >= 2 ? 3 : 0;
        if (list.size() >= 4) {
            i4 |= 12;
        }
        if (list.size() >= 6) {
            i4 |= 48;
        }
        Iterator<InputDevice.MotionRange> it = list.iterator();
        boolean z4 = false;
        while (it.hasNext()) {
            int axis = it.next().getAxis();
            if (axis == 11) {
                z3 = true;
            } else if (axis > 11 && axis < 14) {
                z4 = true;
            }
        }
        return (z3 && z4) ? 32768 | i4 : i4;
    }

    @Override // org.libsdl.app.SDLJoystickHandler_API16
    public int getButtonMask(InputDevice inputDevice) {
        int[] iArr = {1, 2, 4, 8, 16, 64, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 16, 1, 32768, 65536, 131072, 262144, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, Integer.MIN_VALUE, -1, -1, -1, -1};
        boolean[] hasKeys = inputDevice.hasKeys(96, 97, 99, 100, 4, 82, 110, 108, 106, 107, 102, 103, 19, 20, 21, 22, 109, 23, 104, 105, 98, 101, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203);
        int i4 = 0;
        for (int i5 = 0; i5 < 38; i5++) {
            if (hasKeys[i5]) {
                i4 |= iArr[i5];
            }
        }
        return i4;
    }

    @Override // org.libsdl.app.SDLJoystickHandler_API16
    public int getProductId(InputDevice inputDevice) {
        return inputDevice.getProductId();
    }

    @Override // org.libsdl.app.SDLJoystickHandler_API16
    public int getVendorId(InputDevice inputDevice) {
        return inputDevice.getVendorId();
    }
}
