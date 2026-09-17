package org.libsdl.app;

import a1.b2.c3;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.util.Log;
import android.view.Display;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.WindowManager;
import org.libsdl.app.SDLActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SDLSurface extends SurfaceView implements SurfaceHolder.Callback, View.OnKeyListener, View.OnTouchListener, SensorEventListener {
    protected Display mDisplay;
    protected float mHeight;
    public boolean mIsSurfaceReady;
    protected SensorManager mSensorManager;
    protected float mWidth;

    public SDLSurface(Context context) {
        super(context);
        getHolder().addCallback(this);
        setFocusable(true);
        setFocusableInTouchMode(true);
        requestFocus();
        setOnKeyListener(this);
        setOnTouchListener(this);
        this.mDisplay = ((WindowManager) context.getSystemService("window")).getDefaultDisplay();
        this.mSensorManager = (SensorManager) context.getSystemService("sensor");
        setOnGenericMotionListener(SDLActivity.getMotionListener());
        this.mWidth = 1.0f;
        this.mHeight = 1.0f;
        this.mIsSurfaceReady = false;
    }

    public void enableSensor(int i4, boolean z3) {
        if (z3) {
            SensorManager sensorManager = this.mSensorManager;
            sensorManager.registerListener(this, sensorManager.getDefaultSensor(i4), 1, (Handler) null);
        } else {
            SensorManager sensorManager2 = this.mSensorManager;
            sensorManager2.unregisterListener(this, sensorManager2.getDefaultSensor(i4));
        }
    }

    public Surface getNativeSurface() {
        return getHolder().getSurface();
    }

    public void handlePause() {
        enableSensor(1, false);
    }

    public void handleResume() {
        setFocusable(true);
        setFocusableInTouchMode(true);
        requestFocus();
        setOnKeyListener(this);
        setOnTouchListener(this);
        enableSensor(1, true);
    }

    @Override // android.hardware.SensorEventListener
    public void onAccuracyChanged(Sensor sensor, int i4) {
    }

    @Override // android.view.View
    public boolean onCapturedPointerEvent(MotionEvent motionEvent) {
        int actionMasked = motionEvent.getActionMasked();
        if (actionMasked == 2 || actionMasked == 7) {
            SDLActivity.onNativeMouse(0, actionMasked, motionEvent.getX(0), motionEvent.getY(0), true);
            return true;
        }
        if (actionMasked == 8) {
            SDLActivity.onNativeMouse(0, actionMasked, motionEvent.getAxisValue(10, 0), motionEvent.getAxisValue(9, 0), false);
            return true;
        }
        if (actionMasked != 11 && actionMasked != 12) {
            return false;
        }
        SDLActivity.onNativeMouse(motionEvent.getButtonState(), actionMasked == 11 ? 0 : 1, motionEvent.getX(0), motionEvent.getY(0), true);
        return true;
    }

    @Override // android.view.View.OnKeyListener
    public boolean onKey(View view, int i4, KeyEvent keyEvent) {
        return SDLActivity.handleKeyEvent(view, i4, keyEvent, null);
    }

    @Override // android.hardware.SensorEventListener
    public void onSensorChanged(SensorEvent sensorEvent) {
        float f4;
        float f5;
        int i4 = 1;
        if (sensorEvent.sensor.getType() == 1) {
            int rotation = this.mDisplay.getRotation();
            if (rotation == 1) {
                float[] fArr = sensorEvent.values;
                float f6 = -fArr[1];
                f4 = fArr[0];
                f5 = f6;
            } else if (rotation == 2) {
                float[] fArr2 = sensorEvent.values;
                f5 = -fArr2[0];
                f4 = -fArr2[1];
                i4 = 4;
            } else if (rotation != 3) {
                float[] fArr3 = sensorEvent.values;
                f5 = fArr3[0];
                f4 = fArr3[1];
                i4 = 3;
            } else {
                float[] fArr4 = sensorEvent.values;
                float f7 = fArr4[1];
                f4 = -fArr4[0];
                f5 = f7;
                i4 = 2;
            }
            if (i4 != SDLActivity.mCurrentOrientation) {
                SDLActivity.mCurrentOrientation = i4;
                SDLActivity.onNativeOrientationChanged(i4);
            }
            SDLActivity.onNativeAccel((-f5) / 9.80665f, f4 / 9.80665f, sensorEvent.values[2] / 9.80665f);
        }
    }

    @Override // android.view.View.OnTouchListener
    public boolean onTouch(View view, MotionEvent motionEvent) {
        int i4;
        Object invoke;
        int deviceId = motionEvent.getDeviceId();
        int pointerCount = motionEvent.getPointerCount();
        int actionMasked = motionEvent.getActionMasked();
        if (deviceId < 0) {
            deviceId--;
        }
        int i5 = deviceId;
        if (motionEvent.getSource() == 8194 || motionEvent.getSource() == 12290) {
            try {
                invoke = motionEvent.getClass().getMethod("getButtonState", null).invoke(motionEvent, null);
            } catch (Exception unused) {
            }
            if (invoke != null) {
                i4 = ((Integer) invoke).intValue();
                SDLGenericMotionListener_API12 motionListener = SDLActivity.getMotionListener();
                SDLActivity.onNativeMouse(i4, actionMasked, motionListener.getEventX(motionEvent), motionListener.getEventY(motionEvent), motionListener.inRelativeMode());
            }
            i4 = 1;
            SDLGenericMotionListener_API12 motionListener2 = SDLActivity.getMotionListener();
            SDLActivity.onNativeMouse(i4, actionMasked, motionListener2.getEventX(motionEvent), motionListener2.getEventY(motionEvent), motionListener2.inRelativeMode());
        } else {
            int i6 = 0;
            if (actionMasked != 0 && actionMasked != 1) {
                if (actionMasked == 2) {
                    while (i6 < pointerCount) {
                        int pointerId = motionEvent.getPointerId(i6);
                        float x3 = motionEvent.getX(i6) / this.mWidth;
                        float y3 = motionEvent.getY(i6) / this.mHeight;
                        float pressure = motionEvent.getPressure(i6);
                        if (pressure > 1.0f) {
                            pressure = 1.0f;
                        }
                        SDLActivity.onNativeTouch(i5, pointerId, actionMasked, x3, y3, pressure);
                        i6++;
                    }
                } else if (actionMasked == 3) {
                    while (i6 < pointerCount) {
                        int pointerId2 = motionEvent.getPointerId(i6);
                        float x4 = motionEvent.getX(i6) / this.mWidth;
                        float y4 = motionEvent.getY(i6) / this.mHeight;
                        float pressure2 = motionEvent.getPressure(i6);
                        SDLActivity.onNativeTouch(i5, pointerId2, 1, x4, y4, pressure2 > 1.0f ? 1.0f : pressure2);
                        i6++;
                    }
                } else if (actionMasked == 5 || actionMasked == 6) {
                    i6 = -1;
                }
            }
            if (i6 == -1) {
                i6 = motionEvent.getActionIndex();
            }
            int pointerId3 = motionEvent.getPointerId(i6);
            float x5 = motionEvent.getX(i6) / this.mWidth;
            float y5 = motionEvent.getY(i6) / this.mHeight;
            float pressure3 = motionEvent.getPressure(i6);
            SDLActivity.onNativeTouch(i5, pointerId3, actionMasked, x5, y5, pressure3 > 1.0f ? 1.0f : pressure3);
        }
        return true;
    }

    /* JADX WARN: Removed duplicated region for block: B:12:0x0028 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    @Override // android.view.SurfaceHolder.Callback
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public void surfaceChanged(android.view.SurfaceHolder r5, int r6, int r7, int r8) {
        /*
            Method dump skipped, instructions count: 268
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: org.libsdl.app.SDLSurface.surfaceChanged(android.view.SurfaceHolder, int, int, int):void");
    }

    @Override // android.view.SurfaceHolder.Callback
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
        Log.v("SDL", "surfaceCreated()");
        SDLActivity.onNativeSurfaceCreated();
    }

    @Override // android.view.SurfaceHolder.Callback
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
        Log.v(c3.d4(1475), "surfaceDestroyed()");
        SDLActivity.mNextNativeState = SDLActivity.NativeState.PAUSED;
        SDLActivity.handleNativeState();
        this.mIsSurfaceReady = false;
        SDLActivity.onNativeSurfaceDestroyed();
    }
}
