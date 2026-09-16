package org.libsdl.app;

import a1.b2.c3;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.UiModeManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.SparseArray;
import android.view.Display;
import android.view.InputDevice;
import android.view.KeyEvent;
import android.view.PointerIcon;
import android.view.Surface;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.android.support.BuildConfig;
import java.util.Hashtable;
import java.util.Locale;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SDLActivity extends Activity implements View.OnSystemUiVisibilityChangeListener {
    static final int COMMAND_CHANGE_TITLE = 1;
    static final int COMMAND_CHANGE_WINDOW_STYLE = 2;
    static final int COMMAND_SET_KEEP_SCREEN_ON = 5;
    static final int COMMAND_TEXTEDIT_HIDE = 3;
    protected static final int COMMAND_USER = 32768;
    private static final int SDL_MAJOR_VERSION = 2;
    private static final int SDL_MICRO_VERSION = 5;
    private static final int SDL_MINOR_VERSION = 28;
    protected static final int SDL_ORIENTATION_LANDSCAPE = 1;
    protected static final int SDL_ORIENTATION_LANDSCAPE_FLIPPED = 2;
    protected static final int SDL_ORIENTATION_PORTRAIT = 3;
    protected static final int SDL_ORIENTATION_PORTRAIT_FLIPPED = 4;
    protected static final int SDL_ORIENTATION_UNKNOWN = 0;
    private static final int SDL_SYSTEM_CURSOR_ARROW = 0;
    private static final int SDL_SYSTEM_CURSOR_CROSSHAIR = 3;
    private static final int SDL_SYSTEM_CURSOR_HAND = 11;
    private static final int SDL_SYSTEM_CURSOR_IBEAM = 1;
    private static final int SDL_SYSTEM_CURSOR_NO = 10;
    private static final int SDL_SYSTEM_CURSOR_SIZEALL = 9;
    private static final int SDL_SYSTEM_CURSOR_SIZENESW = 6;
    private static final int SDL_SYSTEM_CURSOR_SIZENS = 8;
    private static final int SDL_SYSTEM_CURSOR_SIZENWSE = 5;
    private static final int SDL_SYSTEM_CURSOR_SIZEWE = 7;
    private static final int SDL_SYSTEM_CURSOR_WAIT = 2;
    private static final int SDL_SYSTEM_CURSOR_WAITARROW = 4;
    private static final String TAG = "SDL";
    protected static SDLClipboardHandler mClipboardHandler;
    protected static Locale mCurrentLocale;
    public static NativeState mCurrentNativeState;
    protected static int mCurrentOrientation;
    protected static Hashtable<Integer, PointerIcon> mCursors;
    public static boolean mExitCalledFromJava;
    protected static boolean mFullscreenModeActive;
    protected static HIDDeviceManager mHIDDeviceManager;
    public static boolean mHasFocus;
    public static boolean mIsResumedCalled;
    protected static int mLastCursorID;
    protected static ViewGroup mLayout;
    protected static SDLGenericMotionListener_API12 mMotionListener;
    public static NativeState mNextNativeState;
    protected static Thread mSDLThread;
    protected static boolean mScreenKeyboardShown;
    protected static SDLActivity mSingleton;
    protected static SDLSurface mSurface;
    protected static DummyEdit mTextEdit;
    Handler commandHandler = new SDLCommandHandler();
    protected final int[] messageboxSelection = new int[1];
    private final Runnable rehideSystemUi = new Runnable() { // from class: org.libsdl.app.SDLActivity.7
        @Override // java.lang.Runnable
        public void run() {
            SDLActivity.this.getWindow().getDecorView().setSystemUiVisibility(5894);
        }
    };
    public static final boolean mHasMultiWindow = true;
    public static boolean mBrokenLibraries = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum NativeState {
        INIT,
        RESUMED,
        PAUSED
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    protected static class SDLCommandHandler extends Handler {
        protected SDLCommandHandler() {
        }

        @Override // android.os.Handler
        public void handleMessage(Message message) {
            Window window;
            Context context = SDL.getContext();
            if (context == null) {
                Log.e(SDLActivity.TAG, c3.d4(1250));
                return;
            }
            int i4 = message.arg1;
            String d4 = c3.d4(599);
            if (i4 == 1) {
                if (context instanceof Activity) {
                    ((Activity) context).setTitle((String) message.obj);
                    return;
                } else {
                    Log.e(SDLActivity.TAG, d4);
                    return;
                }
            }
            if (i4 == 2) {
                if (!(context instanceof Activity)) {
                    Log.e(SDLActivity.TAG, d4);
                    return;
                }
                Window window2 = ((Activity) context).getWindow();
                if (window2 != null) {
                    Object obj = message.obj;
                    if (!(obj instanceof Integer) || ((Integer) obj).intValue() == 0) {
                        window2.getDecorView().setSystemUiVisibility(256);
                        window2.addFlags(2048);
                        window2.clearFlags(1024);
                        SDLActivity.mFullscreenModeActive = false;
                        return;
                    }
                    window2.getDecorView().setSystemUiVisibility(5894);
                    window2.addFlags(1024);
                    window2.clearFlags(2048);
                    SDLActivity.mFullscreenModeActive = true;
                    return;
                }
                return;
            }
            if (i4 == 3) {
                DummyEdit dummyEdit = SDLActivity.mTextEdit;
                if (dummyEdit != null) {
                    dummyEdit.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
                    ((InputMethodManager) context.getSystemService("input_method")).hideSoftInputFromWindow(SDLActivity.mTextEdit.getWindowToken(), 0);
                    SDLActivity.mScreenKeyboardShown = false;
                    SDLActivity.mSurface.requestFocus();
                    return;
                }
                return;
            }
            if (i4 != 5) {
                if (!(context instanceof SDLActivity) || ((SDLActivity) context).onUnhandledMessage(i4, message.obj)) {
                    return;
                }
                Log.e(SDLActivity.TAG, "error handling message, command is " + message.arg1);
                return;
            }
            if (!(context instanceof Activity) || (window = ((Activity) context).getWindow()) == null) {
                return;
            }
            Object obj2 = message.obj;
            if (!(obj2 instanceof Integer) || ((Integer) obj2).intValue() == 0) {
                window.clearFlags(128);
            } else {
                window.addFlags(128);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class ShowTextInputTask implements Runnable {
        static final int HEIGHT_PADDING = 15;

        /* renamed from: h, reason: collision with root package name */
        public int f4507h;

        /* renamed from: w, reason: collision with root package name */
        public int f4508w;

        /* renamed from: x, reason: collision with root package name */
        public int f4509x;

        /* renamed from: y, reason: collision with root package name */
        public int f4510y;

        public ShowTextInputTask(int i4, int i5, int i6, int i7) {
            this.f4509x = i4;
            this.f4510y = i5;
            this.f4508w = i6;
            this.f4507h = i7;
            if (i6 <= 0) {
                this.f4508w = 1;
            }
            if (i7 + HEIGHT_PADDING <= 0) {
                this.f4507h = -14;
            }
        }

        @Override // java.lang.Runnable
        public void run() {
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(this.f4508w, this.f4507h + HEIGHT_PADDING);
            layoutParams.leftMargin = this.f4509x;
            layoutParams.topMargin = this.f4510y;
            DummyEdit dummyEdit = SDLActivity.mTextEdit;
            if (dummyEdit == null) {
                SDLActivity.mTextEdit = new DummyEdit(SDL.getContext());
                SDLActivity.mLayout.addView(SDLActivity.mTextEdit, layoutParams);
            } else {
                dummyEdit.setLayoutParams(layoutParams);
            }
            SDLActivity.mTextEdit.setVisibility(0);
            SDLActivity.mTextEdit.requestFocus();
            ((InputMethodManager) SDL.getContext().getSystemService("input_method")).showSoftInput(SDLActivity.mTextEdit, 0);
            SDLActivity.mScreenKeyboardShown = true;
        }
    }

    private void appQuitFinish() {
        if (mSDLThread != null) {
            nativeSendQuit();
            try {
                mSDLThread.join();
            } catch (Exception e4) {
                Log.v(TAG, c3.d4(800) + e4);
            }
        }
        nativeQuit();
    }

    public static String clipboardGetText() {
        return mClipboardHandler.clipboardGetText();
    }

    public static boolean clipboardHasText() {
        return mClipboardHandler.clipboardHasText();
    }

    public static void clipboardSetText(String str) {
        mClipboardHandler.clipboardSetText(str);
    }

    public static int createCustomCursor(int[] iArr, int i4, int i5, int i6, int i7) {
        Bitmap createBitmap = Bitmap.createBitmap(iArr, i4, i5, Bitmap.Config.ARGB_8888);
        mLastCursorID++;
        try {
            mCursors.put(Integer.valueOf(mLastCursorID), PointerIcon.create(createBitmap, i6, i7));
            return mLastCursorID;
        } catch (Exception unused) {
            return 0;
        }
    }

    public static void destroyCustomCursor(int i4) {
        try {
            mCursors.remove(Integer.valueOf(i4));
        } catch (Exception unused) {
        }
    }

    public static View getContentView() {
        return mLayout;
    }

    public static Context getContext() {
        return SDL.getContext();
    }

    public static int getCurrentOrientation() {
        Activity activity = (Activity) getContext();
        if (activity == null) {
            return 0;
        }
        int rotation = activity.getWindowManager().getDefaultDisplay().getRotation();
        if (rotation == 0) {
            return 3;
        }
        if (rotation == 1) {
            return 1;
        }
        if (rotation != 2) {
            return rotation != 3 ? 0 : 2;
        }
        return 4;
    }

    public static double getDiagonal() {
        DisplayMetrics displayMetrics = new DisplayMetrics();
        Activity activity = (Activity) getContext();
        if (activity == null) {
            return 0.0d;
        }
        activity.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        double d4 = displayMetrics.widthPixels / displayMetrics.xdpi;
        double d5 = displayMetrics.heightPixels / displayMetrics.ydpi;
        return Math.sqrt((d4 * d4) + (d5 * d5));
    }

    public static DisplayMetrics getDisplayDPI() {
        return getContext().getResources().getDisplayMetrics();
    }

    public static boolean getManifestEnvironmentVariables() {
        Bundle bundle;
        try {
            if (getContext() == null || (bundle = getContext().getPackageManager().getApplicationInfo(getContext().getPackageName(), 128).metaData) == null) {
                return false;
            }
            for (String str : bundle.keySet()) {
                if (str.startsWith("SDL_ENV.")) {
                    nativeSetenv(str.substring(SDL_SYSTEM_CURSOR_SIZENS), bundle.get(str).toString());
                }
            }
            return true;
        } catch (Exception e4) {
            Log.v(c3.d4(801), "exception " + e4.toString());
            return false;
        }
    }

    protected static SDLGenericMotionListener_API12 getMotionListener() {
        if (mMotionListener == null) {
            if (Build.VERSION.SDK_INT >= 26) {
                mMotionListener = new SDLGenericMotionListener_API26();
            } else {
                mMotionListener = new SDLGenericMotionListener_API24();
            }
        }
        return mMotionListener;
    }

    public static Surface getNativeSurface() {
        SDLSurface sDLSurface = mSurface;
        if (sDLSurface == null) {
            return null;
        }
        return sDLSurface.getNativeSurface();
    }

    public static boolean handleKeyEvent(View view, int i4, KeyEvent keyEvent, InputConnection inputConnection) {
        int action;
        InputDevice device;
        int deviceId = keyEvent.getDeviceId();
        int source = keyEvent.getSource();
        if (source == 0 && (device = InputDevice.getDevice(deviceId)) != null) {
            source = device.getSources();
        }
        if (SDLControllerManager.isDeviceSDLJoystick(deviceId)) {
            if (keyEvent.getAction() == 0) {
                if (SDLControllerManager.onNativePadDown(deviceId, i4) == 0) {
                    return true;
                }
            } else if (keyEvent.getAction() == 1 && SDLControllerManager.onNativePadUp(deviceId, i4) == 0) {
                return true;
            }
        }
        if ((source & 8194) == 8194 && ((i4 == 4 || i4 == 125) && ((action = keyEvent.getAction()) == 0 || action == 1))) {
            return true;
        }
        if (keyEvent.getAction() != 0) {
            if (keyEvent.getAction() != 1) {
                return false;
            }
            onNativeKeyUp(i4);
            return true;
        }
        if (isTextInputEvent(keyEvent)) {
            if (inputConnection != null) {
                inputConnection.commitText(String.valueOf((char) keyEvent.getUnicodeChar()), 1);
            } else {
                SDLInputConnection.nativeCommitText(String.valueOf((char) keyEvent.getUnicodeChar()), 1);
            }
        }
        onNativeKeyDown(i4);
        return true;
    }

    public static void handleNativeState() {
        NativeState nativeState = mNextNativeState;
        if (nativeState == mCurrentNativeState) {
            return;
        }
        if (nativeState == NativeState.INIT) {
            mCurrentNativeState = mNextNativeState;
            return;
        }
        if (mNextNativeState == NativeState.PAUSED) {
            if (mSDLThread != null) {
                nativePause();
            }
            SDLSurface sDLSurface = mSurface;
            if (sDLSurface != null) {
                sDLSurface.handlePause();
            }
            mCurrentNativeState = mNextNativeState;
            return;
        }
        if (mNextNativeState == NativeState.RESUMED && mSurface.mIsSurfaceReady && mHasFocus && mIsResumedCalled) {
            if (mSDLThread == null) {
                mSDLThread = new Thread(new SDLMain(), "SDLThread");
                mSurface.enableSensor(1, true);
                mSDLThread.start();
            } else {
                nativeResume();
            }
            mSurface.handleResume();
            mCurrentNativeState = mNextNativeState;
        }
    }

    public static void initTouch() {
        for (int i4 : InputDevice.getDeviceIds()) {
            InputDevice device = InputDevice.getDevice(i4);
            if (device != null && ((device.getSources() & 4098) == 4098 || device.isVirtual())) {
                int id = device.getId();
                if (id < 0) {
                    id--;
                }
                nativeAddTouch(id, device.getName());
            }
        }
    }

    public static void initialize() {
        mSingleton = null;
        mSurface = null;
        mTextEdit = null;
        mLayout = null;
        mClipboardHandler = null;
        mCursors = new Hashtable<>();
        mLastCursorID = 0;
        mSDLThread = null;
        mExitCalledFromJava = false;
        mIsResumedCalled = false;
        mHasFocus = true;
        NativeState nativeState = NativeState.INIT;
        mNextNativeState = nativeState;
        mCurrentNativeState = nativeState;
    }

    public static boolean isAndroidTV() {
        if (((UiModeManager) getContext().getSystemService("uimode")).getCurrentModeType() == 4) {
            return true;
        }
        String str = Build.MANUFACTURER;
        if (str.equals("MINIX") && Build.MODEL.equals("NEO-U1")) {
            return true;
        }
        if (str.equals("Amlogic") && Build.MODEL.equals("X96-W")) {
            return true;
        }
        return str.equals("Amlogic") && Build.MODEL.startsWith("TV");
    }

    public static boolean isChromebook() {
        if (getContext() == null) {
            return false;
        }
        return getContext().getPackageManager().hasSystemFeature("org.chromium.arc.device_management");
    }

    public static boolean isDeXMode() {
        try {
            Configuration configuration = getContext().getResources().getConfiguration();
            Class<?> cls = configuration.getClass();
            return cls.getField("SEM_DESKTOP_MODE_ENABLED").getInt(cls) == cls.getField("semDesktopModeEnabled").getInt(configuration);
        } catch (Exception unused) {
            return false;
        }
    }

    public static boolean isScreenKeyboardShown() {
        if (mTextEdit != null && mScreenKeyboardShown) {
            return ((InputMethodManager) SDL.getContext().getSystemService("input_method")).isAcceptingText();
        }
        return false;
    }

    public static boolean isTablet() {
        return getDiagonal() >= 7.0d;
    }

    public static boolean isTextInputEvent(KeyEvent keyEvent) {
        if (keyEvent.isCtrlPressed()) {
            return false;
        }
        return keyEvent.isPrintingKey() || keyEvent.getKeyCode() == 62;
    }

    public static void manualBackButton() {
        mSingleton.pressBackButton();
    }

    public static void minimizeWindow() {
        if (mSingleton == null) {
            return;
        }
        Intent intent = new Intent("android.intent.action.MAIN");
        intent.addCategory("android.intent.category.HOME");
        intent.setFlags(268435456);
        mSingleton.startActivity(intent);
    }

    public static native void nativeAddTouch(int i4, String str);

    public static native void nativeFocusChanged(boolean z3);

    public static native String nativeGetHint(String str);

    public static native boolean nativeGetHintBoolean(String str, boolean z3);

    public static native String nativeGetVersion();

    public static native void nativeLowMemory();

    public static native void nativePause();

    public static native void nativePermissionResult(int i4, boolean z3);

    public static native void nativeQuit();

    public static native void nativeResume();

    public static native int nativeRunMain(String str, String str2, Object obj);

    public static native void nativeSendQuit();

    public static native void nativeSetScreenResolution(int i4, int i5, int i6, int i7, float f4);

    public static native void nativeSetenv(String str, String str2);

    public static native int nativeSetupJNI();

    public static native void onNativeAccel(float f4, float f5, float f6);

    public static native void onNativeClipboardChanged();

    public static native void onNativeDropFile(String str);

    public static native void onNativeKeyDown(int i4);

    public static native void onNativeKeyUp(int i4);

    public static native void onNativeKeyboardFocusLost();

    public static native void onNativeLocaleChanged();

    public static native void onNativeMouse(int i4, int i5, float f4, float f5, boolean z3);

    public static native void onNativeOrientationChanged(int i4);

    public static native void onNativeResize();

    public static native boolean onNativeSoftReturnKey();

    public static native void onNativeSurfaceChanged();

    public static native void onNativeSurfaceCreated();

    public static native void onNativeSurfaceDestroyed();

    public static native void onNativeTouch(int i4, int i5, int i6, float f4, float f5, float f6);

    public static int openURL(String str) {
        try {
            Intent intent = new Intent("android.intent.action.VIEW");
            intent.setData(Uri.parse(str));
            intent.addFlags(1208483840);
            mSingleton.startActivity(intent);
            return 0;
        } catch (Exception unused) {
            return -1;
        }
    }

    public static void requestPermission(String str, int i4) {
        Activity activity = (Activity) getContext();
        if (activity.checkSelfPermission(str) != 0) {
            activity.requestPermissions(new String[]{str}, i4);
        } else {
            nativePermissionResult(i4, true);
        }
    }

    public static boolean sendMessage(int i4, int i5) {
        SDLActivity sDLActivity = mSingleton;
        if (sDLActivity == null) {
            return false;
        }
        return sDLActivity.sendCommand(i4, Integer.valueOf(i5));
    }

    public static boolean setActivityTitle(String str) {
        return mSingleton.sendCommand(1, str);
    }

    public static boolean setCustomCursor(int i4) {
        try {
            mSurface.setPointerIcon(mCursors.get(Integer.valueOf(i4)));
            return true;
        } catch (Exception unused) {
            return false;
        }
    }

    public static void setOrientation(int i4, int i5, boolean z3, String str) {
        SDLActivity sDLActivity = mSingleton;
        if (sDLActivity != null) {
            sDLActivity.setOrientationBis(i4, i5, z3, str);
        }
    }

    public static boolean setRelativeMouseEnabled(boolean z3) {
        if (!z3 || supportsRelativeMouse()) {
            return getMotionListener().setRelativeMouseEnabled(z3);
        }
        return false;
    }

    public static boolean setSystemCursor(int i4) {
        int i5;
        switch (i4) {
            case 0:
                i5 = 1000;
                break;
            case BuildConfig.VERSION_CODE /* 1 */:
                i5 = 1008;
                break;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
            case 4:
                i5 = 1004;
                break;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                i5 = 1007;
                break;
            case 5:
                i5 = 1017;
                break;
            case SDL_SYSTEM_CURSOR_SIZENESW /* 6 */:
                i5 = 1016;
                break;
            case SDL_SYSTEM_CURSOR_SIZEWE /* 7 */:
                i5 = 1014;
                break;
            case SDL_SYSTEM_CURSOR_SIZENS /* 8 */:
                i5 = 1015;
                break;
            case SDL_SYSTEM_CURSOR_SIZEALL /* 9 */:
                i5 = 1020;
                break;
            case SDL_SYSTEM_CURSOR_NO /* 10 */:
                i5 = 1012;
                break;
            case SDL_SYSTEM_CURSOR_HAND /* 11 */:
                i5 = 1002;
                break;
            default:
                i5 = 0;
                break;
        }
        try {
            mSurface.setPointerIcon(PointerIcon.getSystemIcon(SDL.getContext(), i5));
            return true;
        } catch (Exception unused) {
            return false;
        }
    }

    public static void setWindowStyle(boolean z3) {
        mSingleton.sendCommand(2, Integer.valueOf(z3 ? 1 : 0));
    }

    public static boolean shouldMinimizeOnFocusLoss() {
        return false;
    }

    public static boolean showTextInput(int i4, int i5, int i6, int i7) {
        return mSingleton.commandHandler.post(new ShowTextInputTask(i4, i5, i6, i7));
    }

    public static int showToast(String str, int i4, int i5, int i6, int i7) {
        SDLActivity sDLActivity = mSingleton;
        if (sDLActivity == null) {
            return -1;
        }
        try {
            sDLActivity.runOnUiThread(new Runnable(str, i4, i5, i6, i7) { // from class: org.libsdl.app.SDLActivity.1OneShotTask
                int mDuration;
                int mGravity;
                String mMessage;
                int mXOffset;
                int mYOffset;

                {
                    this.mMessage = str;
                    this.mDuration = i4;
                    this.mGravity = i5;
                    this.mXOffset = i6;
                    this.mYOffset = i7;
                }

                @Override // java.lang.Runnable
                public void run() {
                    try {
                        Toast makeText = Toast.makeText(SDLActivity.mSingleton, this.mMessage, this.mDuration);
                        int i8 = this.mGravity;
                        if (i8 >= 0) {
                            makeText.setGravity(i8, this.mXOffset, this.mYOffset);
                        }
                        makeText.show();
                    } catch (Exception e4) {
                        Log.e(c3.d4(1196), e4.getMessage());
                    }
                }
            });
            return 0;
        } catch (Exception unused) {
            return -1;
        }
    }

    public static boolean supportsRelativeMouse() {
        if (Build.VERSION.SDK_INT >= 27 || !isDeXMode()) {
            return getMotionListener().supportsRelativeMouse();
        }
        return false;
    }

    protected SDLSurface createSDLSurface(Context context) {
        return new SDLSurface(context);
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public boolean dispatchKeyEvent(KeyEvent keyEvent) {
        int keyCode;
        if (mBrokenLibraries || (keyCode = keyEvent.getKeyCode()) == 25 || keyCode == 24 || keyCode == 27 || keyCode == 168 || keyCode == 169) {
            return false;
        }
        return super.dispatchKeyEvent(keyEvent);
    }

    protected String[] getArguments() {
        return new String[0];
    }

    protected String[] getLibraries() {
        return new String[]{"SDL2", "main"};
    }

    protected String getMainFunction() {
        return "SDL_main";
    }

    protected String getMainSharedObject() {
        String str;
        String[] libraries = mSingleton.getLibraries();
        if (libraries.length > 0) {
            str = "lib" + libraries[libraries.length - 1] + ".so";
        } else {
            str = "libmain.so";
        }
        return getContext().getApplicationInfo().nativeLibraryDir + "/" + str;
    }

    public void loadLibraries() {
        for (String str : getLibraries()) {
            SDL.loadLibrary(str);
        }
    }

    protected void messageboxCreateAndShow(Bundle bundle) {
        int i4;
        int i5;
        int i6;
        int[] intArray = bundle.getIntArray("colors");
        char c4 = 2;
        int i7 = 0;
        if (intArray != null) {
            i4 = intArray[0];
            i5 = intArray[1];
            int i8 = intArray[2];
            i6 = intArray[3];
            int i9 = intArray[4];
        } else {
            i4 = 0;
            i5 = 0;
            i6 = 0;
        }
        final AlertDialog create = new AlertDialog.Builder(this).create();
        create.setTitle(bundle.getString(c3.d4(1391)));
        create.setCancelable(false);
        create.setOnDismissListener(new DialogInterface.OnDismissListener() { // from class: org.libsdl.app.SDLActivity.4
            @Override // android.content.DialogInterface.OnDismissListener
            public void onDismiss(DialogInterface dialogInterface) {
                synchronized (SDLActivity.this.messageboxSelection) {
                    SDLActivity.this.messageboxSelection.notify();
                }
            }
        });
        TextView textView = new TextView(this);
        textView.setGravity(17);
        textView.setText(bundle.getString("message"));
        if (i5 != 0) {
            textView.setTextColor(i5);
        }
        int[] intArray2 = bundle.getIntArray(c3.d4(308));
        int[] intArray3 = bundle.getIntArray(c3.d4(1197));
        String[] stringArray = bundle.getStringArray("buttonTexts");
        final SparseArray sparseArray = new SparseArray();
        LinearLayout linearLayout = new LinearLayout(this);
        linearLayout.setOrientation(0);
        linearLayout.setGravity(17);
        while (i7 < stringArray.length) {
            Button button = new Button(this);
            final int i10 = intArray3[i7];
            char c5 = c4;
            button.setOnClickListener(new View.OnClickListener() { // from class: org.libsdl.app.SDLActivity.5
                @Override // android.view.View.OnClickListener
                public void onClick(View view) {
                    SDLActivity.this.messageboxSelection[0] = i10;
                    create.dismiss();
                }
            });
            int i11 = intArray2[i7];
            if (i11 != 0) {
                if ((i11 & 1) != 0) {
                    sparseArray.put(66, button);
                }
                if ((intArray2[i7] & 2) != 0) {
                    sparseArray.put(111, button);
                }
            }
            button.setText(stringArray[i7]);
            if (i5 != 0) {
                button.setTextColor(i5);
            }
            if (i6 != 0) {
                Drawable background = button.getBackground();
                if (background == null) {
                    button.setBackgroundColor(i6);
                } else {
                    background.setColorFilter(i6, PorterDuff.Mode.MULTIPLY);
                }
            }
            linearLayout.addView(button);
            i7++;
            c4 = c5;
        }
        LinearLayout linearLayout2 = new LinearLayout(this);
        linearLayout2.setOrientation(1);
        linearLayout2.addView(textView);
        linearLayout2.addView(linearLayout);
        if (i4 != 0) {
            linearLayout2.setBackgroundColor(i4);
        }
        create.setView(linearLayout2);
        create.setOnKeyListener(new DialogInterface.OnKeyListener() { // from class: org.libsdl.app.SDLActivity.6
            @Override // android.content.DialogInterface.OnKeyListener
            public boolean onKey(DialogInterface dialogInterface, int i12, KeyEvent keyEvent) {
                Button button2 = (Button) sparseArray.get(i12);
                if (button2 == null) {
                    return false;
                }
                if (keyEvent.getAction() == 1) {
                    button2.performClick();
                }
                return true;
            }
        });
        create.show();
    }

    public int messageboxShowMessageBox(int i4, String str, String str2, int[] iArr, int[] iArr2, String[] strArr, int[] iArr3) {
        this.messageboxSelection[0] = -1;
        if (iArr.length != iArr2.length && iArr2.length != strArr.length) {
            return -1;
        }
        final Bundle bundle = new Bundle();
        bundle.putInt(c3.d4(1006), i4);
        bundle.putString("title", str);
        bundle.putString("message", str2);
        bundle.putIntArray(c3.d4(1051), iArr);
        bundle.putIntArray("buttonIds", iArr2);
        bundle.putStringArray("buttonTexts", strArr);
        bundle.putIntArray("colors", iArr3);
        runOnUiThread(new Runnable() { // from class: org.libsdl.app.SDLActivity.3
            @Override // java.lang.Runnable
            public void run() {
                SDLActivity.this.messageboxCreateAndShow(bundle);
            }
        });
        synchronized (this.messageboxSelection) {
            try {
                this.messageboxSelection.wait();
            } catch (InterruptedException e4) {
                e4.printStackTrace();
                return -1;
            }
        }
        return this.messageboxSelection[0];
    }

    @Override // android.app.Activity
    public void onBackPressed() {
        if (nativeGetHintBoolean("SDL_ANDROID_TRAP_BACK_BUTTON", false) || isFinishing()) {
            return;
        }
        super.onBackPressed();
    }

    @Override // android.app.Activity, android.content.ComponentCallbacks
    public void onConfigurationChanged(Configuration configuration) {
        Log.v(TAG, c3.d4(648));
        super.onConfigurationChanged(configuration);
        if (mBrokenLibraries) {
            return;
        }
        Locale locale = mCurrentLocale;
        if (locale == null || !locale.equals(configuration.locale)) {
            mCurrentLocale = configuration.locale;
            onNativeLocaleChanged();
        }
    }

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        String message;
        Log.v(TAG, "Device: " + Build.DEVICE);
        Log.v(TAG, "Model: " + Build.MODEL);
        Log.v(TAG, "onCreate()");
        super.onCreate(bundle);
        try {
            Thread.currentThread().setName("SDLActivity");
        } catch (Exception e4) {
            Log.v(TAG, "modify thread properties failed " + e4.toString());
        }
        try {
            loadLibraries();
            mBrokenLibraries = false;
            message = c3.d4(36);
        } catch (Exception e5) {
            System.err.println(e5.getMessage());
            mBrokenLibraries = true;
            message = e5.getMessage();
        } catch (UnsatisfiedLinkError e6) {
            System.err.println(e6.getMessage());
            mBrokenLibraries = true;
            message = e6.getMessage();
        }
        if (!mBrokenLibraries) {
            String str = String.valueOf(2) + "." + String.valueOf(SDL_MINOR_VERSION) + "." + String.valueOf(5);
            String nativeGetVersion = nativeGetVersion();
            if (!nativeGetVersion.equals(str)) {
                mBrokenLibraries = true;
                message = c3.d4(268) + str + ", got " + nativeGetVersion + c3.d4(1090);
            }
        }
        if (!mBrokenLibraries) {
            startNative();
            return;
        }
        mSingleton = this;
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        StringBuilder sb = new StringBuilder();
        sb.append("An error occurred while trying to start the application. Please try again and/or reinstall.");
        String d4 = c3.d4(269);
        sb.append(System.getProperty(d4));
        sb.append(System.getProperty(d4));
        sb.append("Error: ");
        sb.append(message);
        builder.setMessage(sb.toString());
        builder.setTitle(c3.d4(538));
        builder.setPositiveButton("Exit", new DialogInterface.OnClickListener() { // from class: org.libsdl.app.SDLActivity.1
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i4) {
                SDLActivity.mSingleton.finish();
            }
        });
        builder.setCancelable(false);
        builder.create().show();
    }

    @Override // android.app.Activity
    protected void onDestroy() {
        Log.v(TAG, c3.d4(749));
        HIDDeviceManager hIDDeviceManager = mHIDDeviceManager;
        if (hIDDeviceManager != null) {
            HIDDeviceManager.release(hIDDeviceManager);
            mHIDDeviceManager = null;
        }
        SDLAudioManager.release(this);
        if (mBrokenLibraries) {
            super.onDestroy();
        } else {
            appQuitFinish();
            super.onDestroy();
        }
    }

    @Override // android.app.Activity, android.content.ComponentCallbacks
    public void onLowMemory() {
        Log.v(TAG, "onLowMemory()");
        super.onLowMemory();
        if (mBrokenLibraries) {
            return;
        }
        nativeLowMemory();
    }

    @Override // android.app.Activity
    protected void onPause() {
        Log.v(TAG, "onPause()");
        super.onPause();
        HIDDeviceManager hIDDeviceManager = mHIDDeviceManager;
        if (hIDDeviceManager != null) {
            hIDDeviceManager.setFrozen(true);
        }
        if (mHasMultiWindow) {
            return;
        }
        pauseNativeThread();
    }

    @Override // android.app.Activity
    public void onRequestPermissionsResult(int i4, String[] strArr, int[] iArr) {
        boolean z3 = false;
        if (iArr.length > 0 && iArr[0] == 0) {
            z3 = true;
        }
        nativePermissionResult(i4, z3);
    }

    @Override // android.app.Activity
    protected void onResume() {
        Log.v(c3.d4(399), "onResume()");
        super.onResume();
        HIDDeviceManager hIDDeviceManager = mHIDDeviceManager;
        if (hIDDeviceManager != null) {
            hIDDeviceManager.setFrozen(false);
        }
        if (mHasMultiWindow) {
            return;
        }
        resumeNativeThread();
    }

    @Override // android.app.Activity
    protected void onStart() {
        Log.v(c3.d4(456), c3.d4(1091));
        super.onStart();
        if (mHasMultiWindow) {
            resumeNativeThread();
        }
    }

    @Override // android.app.Activity
    protected void onStop() {
        Log.v(c3.d4(847), c3.d4(1141));
        super.onStop();
        if (mHasMultiWindow) {
            pauseNativeThread();
        }
    }

    @Override // android.view.View.OnSystemUiVisibilityChangeListener
    public void onSystemUiVisibilityChange(int i4) {
        Handler handler;
        if (mFullscreenModeActive) {
            if (((i4 & 4) == 0 || (i4 & 2) == 0) && (handler = getWindow().getDecorView().getHandler()) != null) {
                handler.removeCallbacks(this.rehideSystemUi);
                handler.postDelayed(this.rehideSystemUi, 2000L);
            }
        }
    }

    protected boolean onUnhandledMessage(int i4, Object obj) {
        return false;
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public void onWindowFocusChanged(boolean z3) {
        super.onWindowFocusChanged(z3);
        Log.v(TAG, "onWindowFocusChanged(): " + z3);
        if (mBrokenLibraries) {
            return;
        }
        mHasFocus = z3;
        if (z3) {
            mNextNativeState = NativeState.RESUMED;
            getMotionListener().reclaimRelativeMouseModeIfNeeded();
            handleNativeState();
            nativeFocusChanged(true);
            return;
        }
        nativeFocusChanged(false);
        if (mHasMultiWindow) {
            return;
        }
        mNextNativeState = NativeState.PAUSED;
        handleNativeState();
    }

    protected void pauseNativeThread() {
        mNextNativeState = NativeState.PAUSED;
        mIsResumedCalled = false;
        if (mBrokenLibraries) {
            return;
        }
        handleNativeState();
    }

    public void pressBackButton() {
        runOnUiThread(new Runnable() { // from class: org.libsdl.app.SDLActivity.2
            @Override // java.lang.Runnable
            public void run() {
                if (SDLActivity.this.isFinishing()) {
                    return;
                }
                SDLActivity.this.superOnBackPressed();
            }
        });
    }

    public void resetNative() {
        Log.v(TAG, "resetNative()");
        mExitCalledFromJava = true;
        appQuitFinish();
    }

    protected void resumeNativeThread() {
        mNextNativeState = NativeState.RESUMED;
        mIsResumedCalled = true;
        if (mBrokenLibraries) {
            return;
        }
        handleNativeState();
    }

    boolean sendCommand(int i4, Object obj) {
        Message obtainMessage = this.commandHandler.obtainMessage();
        obtainMessage.arg1 = i4;
        obtainMessage.obj = obj;
        boolean sendMessage = this.commandHandler.sendMessage(obtainMessage);
        if (i4 == 2) {
            boolean z3 = false;
            if (obj instanceof Integer) {
                Display defaultDisplay = ((WindowManager) getSystemService(c3.d4(457))).getDefaultDisplay();
                DisplayMetrics displayMetrics = new DisplayMetrics();
                defaultDisplay.getRealMetrics(displayMetrics);
                if (displayMetrics.widthPixels == mSurface.getWidth() && displayMetrics.heightPixels == mSurface.getHeight()) {
                    z3 = true;
                }
                if (((Integer) obj).intValue() == 1) {
                    z3 = !z3;
                }
            }
            if (z3 && getContext() != null) {
                synchronized (getContext()) {
                    try {
                        getContext().wait(500L);
                    } catch (InterruptedException e4) {
                        e4.printStackTrace();
                    }
                }
            }
        }
        return sendMessage;
    }

    /* JADX WARN: Code restructure failed: missing block: B:33:0x007a, code lost:
    
        if (r7 != false) goto L57;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public void setOrientationBis(int r10, int r11, boolean r12, java.lang.String r13) {
        /*
            Method dump skipped, instructions count: 206
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: org.libsdl.app.SDLActivity.setOrientationBis(int, int, boolean, java.lang.String):void");
    }

    public void startNative() {
        String path;
        boolean z3 = mSDLThread != null;
        SDL.setupJNI();
        SDL.initialize();
        mSingleton = this;
        SDL.setContext(this);
        mClipboardHandler = new SDLClipboardHandler();
        mHIDDeviceManager = HIDDeviceManager.acquire(this);
        mSurface = createSDLSurface(this);
        RelativeLayout relativeLayout = new RelativeLayout(this);
        mLayout = relativeLayout;
        relativeLayout.addView(mSurface);
        int currentOrientation = getCurrentOrientation();
        mCurrentOrientation = currentOrientation;
        onNativeOrientationChanged(currentOrientation);
        try {
            mCurrentLocale = getContext().getResources().getConfiguration().getLocales().get(0);
        } catch (Exception unused) {
        }
        setContentView(mLayout);
        setWindowStyle(false);
        getWindow().getDecorView().setOnSystemUiVisibilityChangeListener(this);
        Intent intent = getIntent();
        if (intent != null && intent.getData() != null && (path = intent.getData().getPath()) != null) {
            Log.v(TAG, c3.d4(400) + path);
            onNativeDropFile(path);
        }
        if (z3) {
            resumeNativeThread();
        }
    }

    public void superOnBackPressed() {
        super.onBackPressed();
    }
}
