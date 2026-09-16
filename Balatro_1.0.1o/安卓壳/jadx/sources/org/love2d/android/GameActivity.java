package org.love2d.android;

import a1.b2.c3;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Vibrator;
import android.util.DisplayMetrics;
import android.util.Log;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.libsdl.app.SDLActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class GameActivity extends SDLActivity {
    public static final /* synthetic */ boolean $assertionsDisabled = false;
    public static final int EXTERNAL_STORAGE_REQUEST_CODE = 2;
    public static final int RECORD_AUDIO_REQUEST_CODE = 3;
    public static Context context = null;
    public static String gamePath = "";
    public static boolean immersiveActive;
    public static DisplayMetrics metrics;
    public static boolean needToCopyGameInArchive;
    public static Vibrator vibrator;
    public final int[] externalStorageRequestDummy = new int[1];
    public final int[] recordAudioRequestDummy = new int[1];
    public boolean storagePermissionUnnecessary = false;
    public boolean shortEdgesMode = false;
    public boolean embed = false;
    public int safeAreaTop = 0;
    public int safeAreaLeft = 0;
    public int safeAreaBottom = 0;
    public int safeAreaRight = 0;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class a implements DialogInterface.OnClickListener {
        public a() {
        }

        @Override // android.content.DialogInterface.OnClickListener
        public void onClick(DialogInterface dialogInterface, int i4) {
            GameActivity.this.finish();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class b implements Runnable {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public class a implements DialogInterface.OnClickListener {
            public a() {
            }

            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i4) {
                synchronized (GameActivity.this.recordAudioRequestDummy) {
                    GameActivity.this.recordAudioRequestDummy.notify();
                }
            }
        }

        public b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            new AlertDialog.Builder(SDLActivity.mSingleton).setTitle("Audio Recording Permission Missing").setMessage("It appears that this game uses mic capabilities. The game may not work correctly without mic permission!").setNeutralButton("Continue", new a()).create().show();
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:12:0x003a  */
    /* JADX WARN: Removed duplicated region for block: B:14:0x003f  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private java.util.HashMap<java.lang.String, java.lang.Boolean> buildFileTree(android.content.res.AssetManager r7, java.lang.String r8, java.util.HashMap<java.lang.String, java.lang.Boolean> r9) {
        /*
            r6 = this;
            java.lang.String r0 = "GameActivity"
            java.lang.String r1 = "/"
            boolean r2 = r8.endsWith(r1)
            r3 = 0
            if (r2 == 0) goto L16
            int r2 = r8.length()
            int r2 = r2 + (-1)
            java.lang.String r2 = r8.substring(r3, r2)
            goto L17
        L16:
            r2 = r8
        L17:
            java.io.InputStream r4 = r7.open(r2)     // Catch: java.io.IOException -> L24 java.io.FileNotFoundException -> L29
            r4.close()     // Catch: java.io.IOException -> L24 java.io.FileNotFoundException -> L29
            java.lang.Boolean r4 = java.lang.Boolean.FALSE     // Catch: java.io.IOException -> L24 java.io.FileNotFoundException -> L29
            r9.put(r2, r4)     // Catch: java.io.IOException -> L24 java.io.FileNotFoundException -> L29
            return r9
        L24:
            r7 = move-exception
            android.util.Log.e(r0, r8, r7)
            goto L5c
        L29:
            java.lang.String[] r0 = r7.list(r2)     // Catch: java.io.IOException -> L2e
            goto L33
        L2e:
            r4 = move-exception
            android.util.Log.e(r0, r2, r4)
            r0 = 0
        L33:
            java.lang.Boolean r4 = java.lang.Boolean.TRUE
            r9.put(r8, r4)
            if (r2 == r8) goto L3d
            r9.put(r2, r4)
        L3d:
            if (r0 == 0) goto L5c
            int r2 = r0.length
        L40:
            if (r3 >= r2) goto L5c
            r4 = r0[r3]
            java.lang.StringBuilder r5 = new java.lang.StringBuilder
            r5.<init>()
            r5.append(r8)
            r5.append(r4)
            r5.append(r1)
            java.lang.String r4 = r5.toString()
            r6.buildFileTree(r7, r4, r9)
            int r3 = r3 + 1
            goto L40
        L5c:
            return r9
        */
        throw new UnsupportedOperationException("Method not decompiled: org.love2d.android.GameActivity.buildFileTree(android.content.res.AssetManager, java.lang.String, java.util.HashMap):java.util.HashMap");
    }

    private void copyGameInsideArchive() {
        try {
            InputStream open = getAssets().open("game.love");
            String str = getCacheDir().getPath() + "/game.love";
            if (copyAssetFile(open, str)) {
                gamePath = str;
            } else {
                gamePath = "game.love";
            }
            this.storagePermissionUnnecessary = true;
        } catch (IOException e4) {
            Log.d("GameActivity", "Could not open game.love from assets: " + e4.getMessage());
        }
    }

    public static String getGamePath() {
        GameActivity gameActivity = (GameActivity) SDLActivity.mSingleton;
        Log.d("GameActivity", "called getGamePath(), game path = " + gamePath);
        if (gamePath.length() > 0) {
            if (gameActivity.storagePermissionUnnecessary || gameActivity.hasExternalStoragePermission()) {
                return gamePath;
            }
            Log.d("GameActivity", "cannot open game " + gamePath + ": no external storage permission given!");
        } else if (needToCopyGameInArchive) {
            gameActivity.copyGameInsideArchive();
        } else {
            gameActivity.checkLovegameFolder();
        }
        return gamePath;
    }

    public static DisplayMetrics getMetrics() {
        return metrics;
    }

    public static native void nativeSetDefaultStreamValues(int i4, int i5);

    public static boolean openURLFromLOVE(String str) {
        Log.d("GameActivity", c3.d4(1199) + str);
        return SDLActivity.openURL(str) == 0;
    }

    public static void vibrate(double d4) {
        Vibrator vibrator2 = vibrator;
        if (vibrator2 != null) {
            vibrator2.vibrate((long) (d4 * 1000.0d));
        }
    }

    public String[] buildFileTree() {
        HashMap<String, Boolean> buildFileTree = buildFileTree(getAssets(), "", new HashMap<>());
        ArrayList arrayList = new ArrayList();
        for (Map.Entry<String, Boolean> entry : buildFileTree.entrySet()) {
            StringBuilder sb = new StringBuilder();
            sb.append(entry.getValue().booleanValue() ? "d" : "f");
            sb.append(entry.getKey());
            arrayList.add(sb.toString());
        }
        String[] strArr = new String[arrayList.size()];
        arrayList.toArray(strArr);
        return strArr;
    }

    protected void checkLovegameFolder() {
        if (this.embed) {
            return;
        }
        String d4 = c3.d4(492);
        Log.d(d4, "fallback to lovegame folder");
        File externalFilesDir = getExternalFilesDir("games");
        String d42 = c3.d4(89);
        if (new File(externalFilesDir, d42).exists()) {
            gamePath = externalFilesDir.getPath() + "/lovegame/";
            this.storagePermissionUnnecessary = true;
        } else if (Build.VERSION.SDK_INT <= 28) {
            if (hasExternalStoragePermission()) {
                File externalStorageDirectory = Environment.getExternalStorageDirectory();
                if (new File(externalStorageDirectory, d42).exists()) {
                    gamePath = externalStorageDirectory.getPath() + "/lovegame/";
                    this.storagePermissionUnnecessary = false;
                }
            } else {
                Log.d(d4, "Cannot load game from /sdcard/lovegame: permission not granted");
            }
        }
        Log.d(d4, "lovegame directory: " + gamePath);
    }

    boolean copyAssetFile(InputStream inputStream, String str) {
        BufferedOutputStream bufferedOutputStream;
        int i4;
        String d4 = c3.d4(1432);
        boolean z3 = false;
        try {
            bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(str, false));
        } catch (IOException e4) {
            Log.d(d4, c3.d4(805) + e4.getMessage());
            bufferedOutputStream = null;
        }
        try {
            byte[] bArr = new byte[1024];
            int read = inputStream.read(bArr);
            i4 = 0;
            do {
                try {
                    bufferedOutputStream.write(bArr, 0, read);
                    i4 += read;
                    read = inputStream.read(bArr);
                } catch (IOException e5) {
                    e = e5;
                    Log.d(d4, "Copying failed:" + e.getMessage());
                    inputStream.close();
                    bufferedOutputStream.close();
                    z3 = true;
                    Log.d(d4, "Successfully copied stream to " + str + " (" + i4 + " bytes written).");
                    return z3;
                }
            } while (read != -1);
        } catch (IOException e6) {
            e = e6;
            i4 = 0;
        }
        try {
            inputStream.close();
            bufferedOutputStream.close();
            z3 = true;
        } catch (IOException e7) {
            Log.d(d4, "Copying failed: " + e7.getMessage());
        }
        Log.d(d4, "Successfully copied stream to " + str + " (" + i4 + " bytes written).");
        return z3;
    }

    public int getAudioFreq() {
        int parseInt = Integer.parseInt(((AudioManager) getSystemService("audio")).getProperty(c3.d4(493)));
        if (parseInt > 0) {
            return parseInt;
        }
        return 44100;
    }

    public int getAudioSMP() {
        int parseInt = Integer.parseInt(((AudioManager) getSystemService("audio")).getProperty("android.media.property.OUTPUT_FRAMES_PER_BUFFER"));
        if (parseInt > 0) {
            return parseInt;
        }
        return 256;
    }

    public String getCRequirePath() {
        ApplicationInfo applicationInfo = getApplicationInfo();
        if (isNativeLibsExtracted()) {
            return applicationInfo.nativeLibraryDir + "/?.so";
        }
        return applicationInfo.sourceDir + "!/lib/" + Build.SUPPORTED_ABIS[0] + "/?.so";
    }

    public boolean getImmersiveMode() {
        return immersiveActive;
    }

    @Override // org.libsdl.app.SDLActivity
    protected String[] getLibraries() {
        return new String[]{"mpg123", "openal", "love"};
    }

    @Override // org.libsdl.app.SDLActivity
    protected String getMainSharedObject() {
        return "lib" + getLibraries()[r0.length - 1] + ".so";
    }

    protected void handleIntent(Intent intent) {
        Uri data = intent.getData();
        if (!this.embed && data != null) {
            String scheme = data.getScheme();
            String path = data.getPath();
            if (scheme.equals(c3.d4(1297))) {
                Log.d("GameActivity", c3.d4(806) + path);
                List<String> pathSegments = data.getPathSegments();
                if (pathSegments.get(pathSegments.size() - 1).equals("main.lua")) {
                    gamePath = path.substring(0, path.length() - 8);
                } else {
                    gamePath = path;
                }
            } else if (scheme.equals("content")) {
                Log.d("GameActivity", c3.d4(173) + path);
                try {
                    String[] split = path.split("/");
                    String str = getCacheDir().getPath() + "/" + (split.length > 0 ? split[split.length - 1] : "game.love").replaceAll("[^a-zA-Z0-9_\\\\-\\\\.]", "_");
                    if (copyAssetFile(getContentResolver().openInputStream(data), str)) {
                        gamePath = str;
                        this.storagePermissionUnnecessary = true;
                    }
                } catch (Exception e4) {
                    Log.d("GameActivity", c3.d4(650) + data.toString() + ": " + e4.getMessage());
                }
            } else {
                Log.e("GameActivity", "Unsupported scheme: '" + data.getScheme() + "'.");
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setMessage("Could not load LÖVE game '" + path + "' as it uses unsupported scheme '" + data.getScheme() + "'. Please contact the developer.");
                builder.setTitle("LÖVE for Android Error");
                builder.setPositiveButton("Exit", new a());
                builder.setCancelable(false);
                builder.create().show();
            }
        }
        Log.d("GameActivity", "new gamePath: " + gamePath);
    }

    public boolean hasBackgroundMusic() {
        return ((AudioManager) getSystemService("audio")).isMusicActive();
    }

    public boolean hasExternalStoragePermission() {
        if (androidx.core.content.a.a(this, "android.permission.READ_EXTERNAL_STORAGE") == 0) {
            return true;
        }
        Log.d(c3.d4(1433), "Requesting permission and locking LÖVE thread until we have an answer.");
        androidx.core.app.a.e(this, new String[]{c3.d4(651)}, 2);
        synchronized (this.externalStorageRequestDummy) {
            try {
                this.externalStorageRequestDummy.wait();
            } catch (InterruptedException e4) {
                Log.d("GameActivity", "requesting external storage permission", e4);
                return false;
            }
        }
        return androidx.core.content.a.a(this, "android.permission.READ_EXTERNAL_STORAGE") == 0;
    }

    public boolean hasRecordAudioPermission() {
        return androidx.core.content.a.a(this, "android.permission.RECORD_AUDIO") == 0;
    }

    /* JADX WARN: Code restructure failed: missing block: B:5:0x000a, code lost:
    
        r0 = getWindow().getDecorView().getRootWindowInsets().getDisplayCutout();
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public boolean initializeSafeArea() {
        /*
            r2 = this;
            int r0 = android.os.Build.VERSION.SDK_INT
            r1 = 28
            if (r0 < r1) goto L36
            boolean r0 = r2.shortEdgesMode
            if (r0 == 0) goto L36
            android.view.Window r0 = r2.getWindow()
            android.view.View r0 = r0.getDecorView()
            android.view.WindowInsets r0 = r0.getRootWindowInsets()
            android.view.DisplayCutout r0 = androidx.core.view.j0.a(r0)
            if (r0 == 0) goto L36
            int r1 = org.love2d.android.b.a(r0)
            r2.safeAreaTop = r1
            int r1 = org.love2d.android.c.a(r0)
            r2.safeAreaLeft = r1
            int r1 = org.love2d.android.d.a(r0)
            r2.safeAreaBottom = r1
            int r0 = org.love2d.android.e.a(r0)
            r2.safeAreaRight = r0
            r0 = 1
            return r0
        L36:
            r0 = 0
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: org.love2d.android.GameActivity.initializeSafeArea():boolean");
    }

    public boolean isNativeLibsExtracted() {
        return (getApplicationInfo().flags & 268435456) != 0;
    }

    @Override // org.libsdl.app.SDLActivity, android.app.Activity
    protected void onCreate(Bundle bundle) {
        Log.d("GameActivity", "started");
        context = getApplicationContext();
        if (checkCallingOrSelfPermission("android.permission.VIBRATE") == 0) {
            vibrator = (Vibrator) getSystemService("vibrator");
        } else {
            Log.d("GameActivity", c3.d4(1144));
        }
        gamePath = "";
        this.storagePermissionUnnecessary = false;
        boolean z3 = getResources().getBoolean(p.f4569a);
        this.embed = z3;
        needToCopyGameInArchive = z3;
        if (!z3) {
            Intent intent = getIntent();
            handleIntent(intent);
            intent.setData(null);
        }
        super.onCreate(bundle);
        metrics = getResources().getDisplayMetrics();
        nativeSetDefaultStreamValues(getAudioFreq(), getAudioSMP());
        if (Build.VERSION.SDK_INT >= 28) {
            getWindow().getAttributes().layoutInDisplayCutoutMode = 2;
            this.shortEdgesMode = false;
        }
    }

    @Override // org.libsdl.app.SDLActivity, android.app.Activity
    protected void onDestroy() {
        if (vibrator != null) {
            Log.d("GameActivity", "Cancelling vibration");
            vibrator.cancel();
        }
        super.onDestroy();
    }

    @Override // android.app.Activity
    protected void onNewIntent(Intent intent) {
        Log.d("GameActivity", "onNewIntent() with " + intent);
        if (this.embed) {
            return;
        }
        handleIntent(intent);
        resetNative();
        startNative();
    }

    @Override // org.libsdl.app.SDLActivity, android.app.Activity
    protected void onPause() {
        if (vibrator != null) {
            Log.d("GameActivity", "Cancelling vibration");
            vibrator.cancel();
        }
        super.onPause();
    }

    @Override // org.libsdl.app.SDLActivity, android.app.Activity
    public void onRequestPermissionsResult(int i4, String[] strArr, int[] iArr) {
        if (iArr.length > 0) {
            Log.d(c3.d4(807), "Received a request permission result");
            if (i4 == 2) {
                if (iArr[0] == 0) {
                    Log.d("GameActivity", c3.d4(750));
                } else {
                    Log.d(c3.d4(601), "Did not get permission.");
                    if (androidx.core.app.a.f(this, "android.permission.READ_EXTERNAL_STORAGE")) {
                        showExternalStoragePermissionMissingDialog();
                    }
                }
                Log.d(c3.d4(1093), "Unlocking LÖVE thread");
                synchronized (this.externalStorageRequestDummy) {
                    int[] iArr2 = this.externalStorageRequestDummy;
                    iArr2[0] = iArr[0];
                    iArr2.notify();
                }
                return;
            }
            if (i4 != 3) {
                super.onRequestPermissionsResult(i4, strArr, iArr);
                return;
            }
            if (iArr[0] == 0) {
                Log.d("GameActivity", "Mic permission granted");
            } else {
                Log.d("GameActivity", "Did not get mic permission.");
            }
            Log.d(c3.d4(1092), "Unlocking LÖVE thread");
            synchronized (this.recordAudioRequestDummy) {
                int[] iArr3 = this.recordAudioRequestDummy;
                iArr3[0] = iArr[0];
                iArr3.notify();
            }
        }
    }

    @Override // org.libsdl.app.SDLActivity, android.app.Activity
    public void onResume() {
        super.onResume();
    }

    public void requestRecordAudioPermission() {
        if (androidx.core.content.a.a(this, "android.permission.RECORD_AUDIO") == 0) {
            return;
        }
        Log.d("GameActivity", "Requesting mic permission and locking LÖVE thread until we have an answer.");
        androidx.core.app.a.e(this, new String[]{c3.d4(602)}, 3);
        synchronized (this.recordAudioRequestDummy) {
            try {
                this.recordAudioRequestDummy.wait();
            } catch (InterruptedException e4) {
                Log.d("GameActivity", "requesting mic permission", e4);
            }
        }
    }

    public void setImmersiveMode(boolean z3) {
        if (Build.VERSION.SDK_INT >= 28) {
            getWindow().getAttributes().layoutInDisplayCutoutMode = z3 ? 1 : 2;
            this.shortEdgesMode = z3;
        }
        immersiveActive = z3;
    }

    public void showExternalStoragePermissionMissingDialog() {
        new AlertDialog.Builder(SDLActivity.mSingleton).setTitle("Storage Permission Missing").setMessage("LÖVE for Android will not be able to run non-packaged games without storage permission.").setNeutralButton(c3.d4(1434), (DialogInterface.OnClickListener) null).create().show();
    }

    public void showRecordingAudioPermissionMissingDialog() {
        Log.d("GameActivity", "showRecordingAudioPermissionMissingDialog()");
        runOnUiThread(new b());
        synchronized (this.recordAudioRequestDummy) {
            try {
                this.recordAudioRequestDummy.wait();
            } catch (InterruptedException e4) {
                Log.d("GameActivity", "mic permission dialog", e4);
            }
        }
    }
}
