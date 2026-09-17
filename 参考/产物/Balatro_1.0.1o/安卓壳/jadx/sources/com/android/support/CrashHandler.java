package com.android.support;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Process;
import android.util.Log;
import android.widget.Toast;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.Thread;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class CrashHandler {
    private static final String FILE_EXTENSION = ".txt";
    private static final String FILE_PREFIX = "crash_";
    private static final String LOG_DIR = "crash_logs";
    private static final String TAG = "AppCrash";
    private static Context appContext = null;
    private static Thread.UncaughtExceptionHandler defaultHandler = null;
    static final boolean showToasts = true;

    public static void init(Context context) {
        appContext = context.getApplicationContext();
        defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        cleanOldLogs();
        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() { // from class: com.android.support.CrashHandler.1
            @Override // java.lang.Thread.UncaughtExceptionHandler
            public void uncaughtException(Thread thread, Throwable throwable) {
                Log.e(CrashHandler.TAG, "Uncaught exception detected", throwable);
                try {
                    CrashHandler.handleException(thread, throwable);
                } catch (Exception e4) {
                    Log.e(CrashHandler.TAG, "Error in crash handler", e4);
                    if (CrashHandler.defaultHandler != null) {
                        CrashHandler.defaultHandler.uncaughtException(thread, throwable);
                    } else {
                        Process.killProcess(Process.myPid());
                        System.exit(10);
                    }
                }
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void handleException(Thread thread, Throwable throwable) {
        File crashFile = saveCrashLog(throwable);
        if (appContext != null) {
            showCrashNotification(crashFile);
        }
        try {
            Thread.sleep(2000L);
        } catch (InterruptedException e4) {
            Thread.currentThread().interrupt();
        }
        if (defaultHandler != null) {
            defaultHandler.uncaughtException(thread, throwable);
        } else {
            Process.killProcess(Process.myPid());
            System.exit(10);
        }
    }

    private static File saveCrashLog(Throwable throwable) {
        String timeStamp = new SimpleDateFormat("yyyy_MM_dd-HH_mm_ss", Locale.US).format(new Date());
        String fileName = FILE_PREFIX + timeStamp + FILE_EXTENSION;
        File logFile = new File(getLogDirectory(), fileName);
        try {
            writeCrashLog(logFile, throwable);
            Log.i(TAG, "Crash log saved to: " + logFile.getAbsolutePath());
            return logFile;
        } catch (IOException e4) {
            Log.e(TAG, "Failed to save crash log", e4);
            return null;
        }
    }

    private static void writeCrashLog(File file, Throwable throwable) throws IOException {
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists() && !parentDir.mkdirs()) {
            Log.w(TAG, "Failed to create directory: " + parentDir.getAbsolutePath());
        }
        String logContent = buildCrashReport(throwable);
        FileOutputStream fos = new FileOutputStream(file);
        try {
            fos.write(logContent.getBytes(StandardCharsets.UTF_8));
            fos.flush();
            fos.close();
        } catch (Throwable th) {
            try {
                fos.close();
            } catch (Throwable th2) {
                th.addSuppressed(th2);
            }
            throw th;
        }
    }

    private static String buildCrashReport(Throwable throwable) {
        StringBuilder report = new StringBuilder();
        report.append("=============== CRASH REPORT ===============\n");
        report.append("Time: ").append(getCurrentTime()).append("\n");
        report.append("App Version: ").append(getAppVersion()).append("\n");
        report.append("Android API: ").append(Build.VERSION.SDK_INT).append("\n");
        report.append("Android Version: ").append(Build.VERSION.RELEASE).append("\n");
        report.append("Device: ").append(Build.MANUFACTURER).append(" ").append(Build.MODEL).append("\n");
        report.append("Product: ").append(Build.PRODUCT).append("\n");
        report.append("Board: ").append(Build.BOARD).append("\n");
        report.append("Fingerprint: ").append(Build.FINGERPRINT).append("\n");
        report.append("Thread: ").append(Thread.currentThread().getName()).append("\n");
        report.append("=============== STACK TRACE ===============\n");
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        throwable.printStackTrace(pw);
        report.append(sw.toString());
        Throwable cause = throwable.getCause();
        for (int depth = 0; cause != null && depth < 10; depth++) {
            report.append("\nCaused by: ");
            cause.printStackTrace(pw);
            cause = cause.getCause();
        }
        report.append("\n\n=============== ALL THREADS ===============\n");
        Map<Thread, StackTraceElement[]> allThreads = Thread.getAllStackTraces();
        for (Map.Entry<Thread, StackTraceElement[]> entry : allThreads.entrySet()) {
            Thread thread = entry.getKey();
            report.append("\nThread: ").append(thread.getName()).append(" [ID: ").append(thread.getId()).append(", State: ").append(thread.getState()).append(", Priority: ").append(thread.getPriority()).append("]\n");
            StackTraceElement[] value = entry.getValue();
            int length = value.length;
            int i4 = 0;
            while (i4 < length) {
                StackTraceElement element = value[i4];
                report.append("    at ").append(element.toString()).append("\n");
                i4++;
                report = report;
            }
        }
        pw.close();
        return report.toString();
    }

    private static File getLogDirectory() {
        File standardAppDir = appContext.getExternalFilesDir(null);
        if (standardAppDir == null) {
            Log.e(TAG, "Cannot get app directory, using internal storage");
            return new File(appContext.getFilesDir(), LOG_DIR);
        }
        String standardPath = standardAppDir.getAbsolutePath();
        String targetPath = standardPath.replace("Android/data/" + appContext.getPackageName(), "Android/media/" + appContext.getPackageName());
        File logDir = new File(targetPath, LOG_DIR);
        if (!logDir.exists()) {
            if (logDir.mkdirs()) {
                Log.i(TAG, "Created log directory: " + logDir.getAbsolutePath());
            } else {
                Log.e(TAG, "Failed to create Android/media directory, falling back to standard location");
                return new File(standardAppDir, LOG_DIR);
            }
        }
        return logDir;
    }

    private static String getDisplayPath(File file) {
        if (file == null) {
            return null;
        }
        String absolutePath = file.getAbsolutePath();
        int androidIndex = absolutePath.indexOf("/Android/");
        if (androidIndex != -1) {
            return absolutePath.substring(androidIndex + 1);
        }
        return file.getName();
    }

    private static void showCrashNotification(File crashFile) {
        String shortPath;
        if (crashFile != null && crashFile.exists()) {
            String shortPath2 = getDisplayPath(crashFile);
            shortPath = "CRASH! check:\n" + shortPath2;
        } else {
            shortPath = "CRASH! Could not save log.";
        }
        Toast.makeText(appContext, shortPath, 1).show();
    }

    private static String getAppVersion() {
        if (appContext == null) {
            return "unknown";
        }
        try {
            PackageInfo pInfo = appContext.getPackageManager().getPackageInfo(appContext.getPackageName(), 0);
            long versionCode = Build.VERSION.SDK_INT >= 28 ? pInfo.getLongVersionCode() : pInfo.versionCode;
            return pInfo.versionName + " (" + versionCode + ")";
        } catch (PackageManager.NameNotFoundException e4) {
            return "unknown";
        }
    }

    private static String getCurrentTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss Z", Locale.US).format(new Date());
    }

    public static void logException(Throwable throwable) {
        Log.e(TAG, "Manual exception logging", throwable);
        saveCrashLog(throwable);
    }

    public static void cleanOldLogs() {
        File[] logs;
        File logDir = getLogDirectory();
        if (logDir.exists() && logDir.isDirectory() && (logs = logDir.listFiles(new FilenameFilter() { // from class: com.android.support.CrashHandler$$ExternalSyntheticLambda0
            @Override // java.io.FilenameFilter
            public final boolean accept(File file, String str) {
                return CrashHandler.lambda$cleanOldLogs$0(file, str);
            }
        })) != null && logs.length > 5) {
            Arrays.sort(logs, new Comparator() { // from class: com.android.support.CrashHandler$$ExternalSyntheticLambda1
                @Override // java.util.Comparator
                public final int compare(Object obj, Object obj2) {
                    int compare;
                    compare = Long.compare(((File) obj2).lastModified(), ((File) obj).lastModified());
                    return compare;
                }
            });
            for (int i4 = 10; i4 < logs.length; i4++) {
                if (!logs[i4].delete()) {
                    Log.w(TAG, "Failed to delete old log: " + logs[i4].getName());
                }
            }
        }
    }

    static /* synthetic */ boolean lambda$cleanOldLogs$0(File dir, String name) {
        return name.startsWith(FILE_PREFIX) && name.endsWith(FILE_EXTENSION);
    }
}
