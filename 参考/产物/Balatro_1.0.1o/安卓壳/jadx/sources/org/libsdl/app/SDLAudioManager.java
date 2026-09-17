package org.libsdl.app;

import a1.b2.c3;
import android.content.Context;
import android.media.AudioDeviceCallback;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.os.Process;
import android.util.Log;
import com.android.support.BuildConfig;
import java.util.Arrays;
import java.util.function.Consumer;
import java.util.function.Predicate;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SDLAudioManager {
    private static final int[] NO_DEVICES = new int[0];
    protected static final String TAG = "SDLAudio";
    private static AudioDeviceCallback mAudioDeviceCallback;
    protected static AudioRecord mAudioRecord;
    protected static AudioTrack mAudioTrack;
    protected static Context mContext;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: org.libsdl.app.SDLAudioManager$1, reason: invalid class name */
    class AnonymousClass1 extends AudioDeviceCallback {
        AnonymousClass1() {
        }

        @Override // android.media.AudioDeviceCallback
        public void onAudioDevicesAdded(AudioDeviceInfo[] audioDeviceInfoArr) {
            Arrays.stream(audioDeviceInfoArr).forEach(new Consumer() { // from class: org.libsdl.app.e
                @Override // java.util.function.Consumer
                public final void accept(Object obj) {
                    SDLAudioManager.addAudioDevice(r1.isSink(), ((AudioDeviceInfo) obj).getId());
                }
            });
        }

        @Override // android.media.AudioDeviceCallback
        public void onAudioDevicesRemoved(AudioDeviceInfo[] audioDeviceInfoArr) {
            Arrays.stream(audioDeviceInfoArr).forEach(new Consumer() { // from class: org.libsdl.app.d
                @Override // java.util.function.Consumer
                public final void accept(Object obj) {
                    SDLAudioManager.removeAudioDevice(r1.isSink(), ((AudioDeviceInfo) obj).getId());
                }
            });
        }
    }

    public static /* synthetic */ boolean a(int i4, AudioDeviceInfo audioDeviceInfo) {
        return audioDeviceInfo.getId() == i4;
    }

    public static native void addAudioDevice(boolean z3, int i4);

    public static void audioClose() {
        AudioTrack audioTrack = mAudioTrack;
        if (audioTrack != null) {
            audioTrack.stop();
            mAudioTrack.release();
            mAudioTrack = null;
        }
    }

    public static int[] audioOpen(int i4, int i5, int i6, int i7, int i8) {
        return open(false, i4, i5, i6, i7, i8);
    }

    public static void audioSetThreadPriority(boolean z3, int i4) {
        try {
            if (z3) {
                Thread.currentThread().setName("SDLAudioC" + i4);
            } else {
                Thread.currentThread().setName("SDLAudioP" + i4);
            }
            Process.setThreadPriority(-16);
        } catch (Exception e4) {
            Log.v(c3.d4(310), "modify thread properties failed " + e4.toString());
        }
    }

    public static void audioWriteByteBuffer(byte[] bArr) {
        if (mAudioTrack == null) {
            Log.e(TAG, "Attempted to make audio call with uninitialized audio!");
            return;
        }
        int i4 = 0;
        while (i4 < bArr.length) {
            int write = mAudioTrack.write(bArr, i4, bArr.length - i4);
            if (write > 0) {
                i4 += write;
            } else {
                if (write != 0) {
                    Log.w(TAG, c3.d4(707));
                    return;
                }
                try {
                    Thread.sleep(1L);
                } catch (InterruptedException unused) {
                }
            }
        }
    }

    public static void audioWriteFloatBuffer(float[] fArr) {
        if (mAudioTrack == null) {
            Log.e(TAG, "Attempted to make audio call with uninitialized audio!");
            return;
        }
        int i4 = 0;
        while (i4 < fArr.length) {
            int write = mAudioTrack.write(fArr, i4, fArr.length - i4, 0);
            if (write > 0) {
                i4 += write;
            } else {
                if (write != 0) {
                    Log.w(TAG, "SDL audio: error return from write(float)");
                    return;
                }
                try {
                    Thread.sleep(1L);
                } catch (InterruptedException unused) {
                }
            }
        }
    }

    public static void audioWriteShortBuffer(short[] sArr) {
        if (mAudioTrack == null) {
            Log.e(TAG, "Attempted to make audio call with uninitialized audio!");
            return;
        }
        int i4 = 0;
        while (i4 < sArr.length) {
            int write = mAudioTrack.write(sArr, i4, sArr.length - i4);
            if (write > 0) {
                i4 += write;
            } else {
                if (write != 0) {
                    Log.w(TAG, "SDL audio: error return from write(short)");
                    return;
                }
                try {
                    Thread.sleep(1L);
                } catch (InterruptedException unused) {
                }
            }
        }
    }

    public static /* synthetic */ boolean b(int i4, AudioDeviceInfo audioDeviceInfo) {
        return audioDeviceInfo.getId() == i4;
    }

    public static void captureClose() {
        AudioRecord audioRecord = mAudioRecord;
        if (audioRecord != null) {
            audioRecord.stop();
            mAudioRecord.release();
            mAudioRecord = null;
        }
    }

    public static int[] captureOpen(int i4, int i5, int i6, int i7, int i8) {
        return open(true, i4, i5, i6, i7, i8);
    }

    public static int captureReadByteBuffer(byte[] bArr, boolean z3) {
        return mAudioRecord.read(bArr, 0, bArr.length, !z3 ? 1 : 0);
    }

    public static int captureReadFloatBuffer(float[] fArr, boolean z3) {
        return mAudioRecord.read(fArr, 0, fArr.length, !z3 ? 1 : 0);
    }

    public static int captureReadShortBuffer(short[] sArr, boolean z3) {
        return mAudioRecord.read(sArr, 0, sArr.length, !z3 ? 1 : 0);
    }

    protected static String getAudioFormatString(int i4) {
        return i4 != 2 ? i4 != 3 ? i4 != 4 ? Integer.toString(i4) : c3.d4(848) : "8-bit" : "16-bit";
    }

    public static int[] getAudioInputDevices() {
        return Arrays.stream(((AudioManager) mContext.getSystemService("audio")).getDevices(1)).mapToInt(new a()).toArray();
    }

    public static int[] getAudioOutputDevices() {
        return Arrays.stream(((AudioManager) mContext.getSystemService(c3.d4(402))).getDevices(2)).mapToInt(new a()).toArray();
    }

    private static AudioDeviceInfo getInputAudioDeviceInfo(final int i4) {
        return (AudioDeviceInfo) Arrays.stream(((AudioManager) mContext.getSystemService(c3.d4(802))).getDevices(1)).filter(new Predicate() { // from class: org.libsdl.app.c
            @Override // java.util.function.Predicate
            public final boolean test(Object obj) {
                return SDLAudioManager.b(i4, (AudioDeviceInfo) obj);
            }
        }).findFirst().orElse(null);
    }

    private static AudioDeviceInfo getOutputAudioDeviceInfo(final int i4) {
        return (AudioDeviceInfo) Arrays.stream(((AudioManager) mContext.getSystemService("audio")).getDevices(2)).filter(new Predicate() { // from class: org.libsdl.app.b
            @Override // java.util.function.Predicate
            public final boolean test(Object obj) {
                return SDLAudioManager.a(i4, (AudioDeviceInfo) obj);
            }
        }).findFirst().orElse(null);
    }

    public static void initialize() {
        mAudioTrack = null;
        mAudioRecord = null;
        mAudioDeviceCallback = null;
        mAudioDeviceCallback = new AnonymousClass1();
    }

    public static native int nativeSetupJNI();

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    protected static int[] open(boolean z3, int i4, int i5, int i6, int i7, int i8) {
        char c4;
        int i9;
        int i10;
        int i11;
        int i12;
        char c5;
        String str;
        int i13;
        int[] iArr;
        int i14 = i6;
        StringBuilder sb = new StringBuilder();
        sb.append("Opening ");
        sb.append(z3 ? "capture" : "playback");
        sb.append(", requested ");
        sb.append(i7);
        sb.append(" frames of ");
        sb.append(i14);
        String d4 = c3.d4(1143);
        sb.append(d4);
        sb.append(getAudioFormatString(i5));
        String d42 = c3.d4(1198);
        sb.append(d42);
        sb.append(i4);
        String d43 = c3.d4(803);
        sb.append(d43);
        Log.v(TAG, sb.toString());
        if (i5 == 2) {
            c4 = 3;
            i9 = i5;
            i10 = 2;
        } else if (i5 == 3) {
            c4 = 3;
            i9 = i5;
            i10 = 1;
        } else if (i5 != 4) {
            c4 = 3;
            Log.v(TAG, "Requested format " + i5 + ", getting ENCODING_PCM_16BIT");
            i10 = 2;
            i9 = 2;
        } else {
            c4 = 3;
            i9 = i5;
            i10 = 4;
        }
        String d44 = c3.d4(1431);
        int i15 = 12;
        if (!z3) {
            i11 = 1;
            switch (i14) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    i12 = 4;
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    i12 = i15;
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    i15 = 28;
                    i12 = i15;
                    break;
                case 4:
                    i15 = 204;
                    i12 = i15;
                    break;
                case 5:
                    i15 = 220;
                    i12 = i15;
                    break;
                case 6:
                    i15 = 252;
                    i12 = i15;
                    break;
                case 7:
                    i15 = 1276;
                    i12 = i15;
                    break;
                case 8:
                    i15 = 6396;
                    i12 = i15;
                    break;
                default:
                    Log.v(TAG, d44 + i14 + " channels, getting stereo");
                    i12 = 12;
                    i14 = 2;
                    break;
            }
        } else {
            if (i14 != 1) {
                i11 = 1;
                if (i14 != 2) {
                    Log.v(TAG, d44 + i14 + " channels, getting stereo");
                    i12 = 12;
                    i14 = 2;
                }
            } else {
                i11 = 1;
                i15 = 16;
            }
            i12 = i15;
        }
        int i16 = i10 * i14;
        int max = Math.max(i7, (((z3 ? AudioRecord.getMinBufferSize(i4, i12, i9) : AudioTrack.getMinBufferSize(i4, i12, i9)) + i16) - 1) / i16);
        int[] iArr2 = new int[4];
        if (z3) {
            if (mAudioRecord == null) {
                c5 = 2;
                AudioRecord audioRecord = new AudioRecord(0, i4, i12, i9, max * i16);
                mAudioRecord = audioRecord;
                if (audioRecord.getState() != i11) {
                    Log.e(TAG, "Failed during initialization of AudioRecord");
                    mAudioRecord.release();
                    mAudioRecord = null;
                    return null;
                }
                if (i8 != 0) {
                    mAudioRecord.setPreferredDevice(getOutputAudioDeviceInfo(i8));
                }
                mAudioRecord.startRecording();
            } else {
                c5 = 2;
            }
            iArr2[0] = mAudioRecord.getSampleRate();
            iArr2[1] = mAudioRecord.getAudioFormat();
            iArr2[c5] = mAudioRecord.getChannelCount();
            str = "playback";
            i13 = 1;
            iArr = iArr2;
        } else {
            int i17 = i12;
            c5 = 2;
            if (mAudioTrack == null) {
                str = "playback";
                i13 = i11;
                iArr = iArr2;
                AudioTrack audioTrack = new AudioTrack(3, i4, i17, i9, max * i16, 1);
                mAudioTrack = audioTrack;
                if (audioTrack.getState() != i13) {
                    Log.e(TAG, "Failed during initialization of Audio Track");
                    mAudioTrack.release();
                    mAudioTrack = null;
                    return null;
                }
                if (i8 != 0) {
                    mAudioTrack.setPreferredDevice(getInputAudioDeviceInfo(i8));
                }
                mAudioTrack.play();
            } else {
                str = "playback";
                i13 = i11;
                iArr = iArr2;
            }
            iArr[0] = mAudioTrack.getSampleRate();
            iArr[i13] = mAudioTrack.getAudioFormat();
            iArr[2] = mAudioTrack.getChannelCount();
        }
        iArr[c4] = max;
        StringBuilder sb2 = new StringBuilder();
        sb2.append("Opening ");
        sb2.append(z3 ? "capture" : str);
        sb2.append(", got ");
        sb2.append(iArr[c4]);
        sb2.append(" frames of ");
        sb2.append(iArr[c5]);
        sb2.append(d4);
        sb2.append(getAudioFormatString(iArr[i13]));
        sb2.append(d42);
        sb2.append(iArr[0]);
        sb2.append(d43);
        Log.v(TAG, sb2.toString());
        return iArr;
    }

    private static void registerAudioDeviceCallback() {
        ((AudioManager) mContext.getSystemService(c3.d4(804))).registerAudioDeviceCallback(mAudioDeviceCallback, null);
    }

    public static void release(Context context) {
        unregisterAudioDeviceCallback(context);
    }

    public static native void removeAudioDevice(boolean z3, int i4);

    public static void setContext(Context context) {
        mContext = context;
        if (context != null) {
            registerAudioDeviceCallback();
        }
    }

    private static void unregisterAudioDeviceCallback(Context context) {
        ((AudioManager) context.getSystemService("audio")).unregisterAudioDeviceCallback(mAudioDeviceCallback);
    }
}
