package org.libsdl.app;

import a1.b2.c3;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import org.libsdl.app.SDLHapticHandler;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLHapticHandler_API26 extends SDLHapticHandler {
    SDLHapticHandler_API26() {
    }

    @Override // org.libsdl.app.SDLHapticHandler
    public void run(int i4, float f4, int i5) {
        VibrationEffect createOneShot;
        SDLHapticHandler.SDLHaptic haptic = getHaptic(i4);
        if (haptic != null) {
            Log.d("SDL", "Rtest: Vibe with intensity " + f4 + c3.d4(1296) + i5);
            if (f4 == 0.0f) {
                stop(i4);
                return;
            }
            int round = Math.round(f4 * 255.0f);
            if (round > 255) {
                round = 255;
            }
            if (round < 1) {
                stop(i4);
                return;
            }
            try {
                Vibrator vibrator = haptic.vib;
                createOneShot = VibrationEffect.createOneShot(i5, round);
                vibrator.vibrate(createOneShot);
            } catch (Exception unused) {
                haptic.vib.vibrate(i5);
            }
        }
    }
}
