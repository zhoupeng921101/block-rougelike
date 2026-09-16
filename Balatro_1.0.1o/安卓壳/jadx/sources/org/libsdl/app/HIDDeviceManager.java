package org.libsdl.app;

import a1.b2.c3;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class HIDDeviceManager {
    private static final String ACTION_USB_PERMISSION = "org.libsdl.app.USB_PERMISSION";
    private static final String TAG = "hidapi";
    private static HIDDeviceManager sManager;
    private static int sManagerRefCount;
    private BluetoothManager mBluetoothManager;
    private Context mContext;
    private Handler mHandler;
    private boolean mIsChromebook;
    private List<BluetoothDevice> mLastBluetoothDevices;
    private int mNextDeviceId;
    private SharedPreferences mSharedPreferences;
    private UsbManager mUsbManager;
    private HashMap<Integer, HIDDevice> mDevicesById = new HashMap<>();
    private HashMap<BluetoothDevice, HIDDeviceBLESteamController> mBluetoothDevices = new HashMap<>();
    private final BroadcastReceiver mUsbBroadcast = new BroadcastReceiver() { // from class: org.libsdl.app.HIDDeviceManager.1
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
        }
    };
    private final BroadcastReceiver mBluetoothBroadcast = new BroadcastReceiver() { // from class: org.libsdl.app.HIDDeviceManager.2
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
        }
    };

    private HIDDeviceManager(Context context) {
        this.mNextDeviceId = 0;
        this.mSharedPreferences = null;
        this.mIsChromebook = false;
        this.mContext = context;
        HIDDeviceRegisterCallback();
        this.mSharedPreferences = this.mContext.getSharedPreferences(c3.d4(219), 0);
        this.mIsChromebook = this.mContext.getPackageManager().hasSystemFeature("org.chromium.arc.device_management");
        this.mNextDeviceId = this.mSharedPreferences.getInt(c3.d4(905), 0);
    }

    private native void HIDDeviceRegisterCallback();

    private native void HIDDeviceReleaseCallback();

    public static HIDDeviceManager acquire(Context context) {
        if (sManagerRefCount == 0) {
            sManager = new HIDDeviceManager(context);
        }
        sManagerRefCount++;
        return sManager;
    }

    private void close() {
        shutdownUSB();
        shutdownBluetooth();
        synchronized (this) {
            try {
                Iterator<HIDDevice> it = this.mDevicesById.values().iterator();
                while (it.hasNext()) {
                    it.next().shutdown();
                }
                this.mDevicesById.clear();
                this.mBluetoothDevices.clear();
                HIDDeviceReleaseCallback();
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    private void connectHIDDeviceUSB(UsbDevice usbDevice) {
        HIDDeviceManager hIDDeviceManager = this;
        synchronized (this) {
            int i4 = 0;
            int i5 = 0;
            while (i5 < usbDevice.getInterfaceCount()) {
                try {
                    UsbInterface usbInterface = usbDevice.getInterface(i5);
                    if (hIDDeviceManager.isHIDDeviceInterface(usbDevice, usbInterface)) {
                        int id = 1 << usbInterface.getId();
                        if ((i4 & id) == 0) {
                            int i6 = i4 | id;
                            HIDDeviceUSB hIDDeviceUSB = new HIDDeviceUSB(hIDDeviceManager, usbDevice, i5);
                            int id2 = hIDDeviceUSB.getId();
                            hIDDeviceManager.mDevicesById.put(Integer.valueOf(id2), hIDDeviceUSB);
                            hIDDeviceManager.HIDDeviceConnected(id2, hIDDeviceUSB.getIdentifier(), hIDDeviceUSB.getVendorId(), hIDDeviceUSB.getProductId(), hIDDeviceUSB.getSerialNumber(), hIDDeviceUSB.getVersion(), hIDDeviceUSB.getManufacturerName(), hIDDeviceUSB.getProductName(), usbInterface.getId(), usbInterface.getInterfaceClass(), usbInterface.getInterfaceSubclass(), usbInterface.getInterfaceProtocol());
                            i4 = i6;
                        }
                    }
                    i5++;
                    hIDDeviceManager = this;
                } catch (Throwable th) {
                    throw th;
                }
            }
        }
    }

    private HIDDevice getDevice(int i4) {
        HIDDevice hIDDevice;
        synchronized (this) {
            try {
                hIDDevice = this.mDevicesById.get(Integer.valueOf(i4));
                if (hIDDevice == null) {
                    Log.v(TAG, "No device for id: " + i4);
                    Log.v(TAG, "Available devices: " + this.mDevicesById.keySet());
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return hIDDevice;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void handleUsbDeviceAttached(UsbDevice usbDevice) {
        connectHIDDeviceUSB(usbDevice);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void handleUsbDeviceDetached(UsbDevice usbDevice) {
        ArrayList arrayList = new ArrayList();
        for (HIDDevice hIDDevice : this.mDevicesById.values()) {
            if (usbDevice.equals(hIDDevice.getDevice())) {
                arrayList.add(Integer.valueOf(hIDDevice.getId()));
            }
        }
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            Integer num = (Integer) obj;
            int intValue = num.intValue();
            HIDDevice hIDDevice2 = this.mDevicesById.get(num);
            this.mDevicesById.remove(num);
            hIDDevice2.shutdown();
            HIDDeviceDisconnected(intValue);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void handleUsbDevicePermission(UsbDevice usbDevice, boolean z3) {
        for (HIDDevice hIDDevice : this.mDevicesById.values()) {
            if (usbDevice.equals(hIDDevice.getDevice())) {
                HIDDeviceOpenResult(hIDDevice.getId(), z3 ? hIDDevice.open() : false);
            }
        }
    }

    private void initializeBluetooth() {
        BluetoothAdapter adapter;
        Log.d(TAG, "Initializing Bluetooth");
        if (Build.VERSION.SDK_INT <= 30 && this.mContext.getPackageManager().checkPermission("android.permission.BLUETOOTH", this.mContext.getPackageName()) != 0) {
            Log.d(TAG, "Couldn't initialize Bluetooth, missing android.permission.BLUETOOTH");
            return;
        }
        if (!this.mContext.getPackageManager().hasSystemFeature("android.hardware.bluetooth_le")) {
            Log.d(TAG, "Couldn't initialize Bluetooth, this version of Android does not support Bluetooth LE");
            return;
        }
        BluetoothManager bluetoothManager = (BluetoothManager) this.mContext.getSystemService("bluetooth");
        this.mBluetoothManager = bluetoothManager;
        if (bluetoothManager == null || (adapter = bluetoothManager.getAdapter()) == null) {
            return;
        }
        for (BluetoothDevice bluetoothDevice : adapter.getBondedDevices()) {
            Log.d(TAG, "Bluetooth device available: " + bluetoothDevice);
            if (isSteamController(bluetoothDevice)) {
                connectBluetoothDevice(bluetoothDevice);
            }
        }
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.bluetooth.device.action.ACL_CONNECTED");
        intentFilter.addAction(c3.d4(597));
        this.mContext.registerReceiver(this.mBluetoothBroadcast, intentFilter, 4);
        if (this.mIsChromebook) {
            this.mHandler = new Handler(Looper.getMainLooper());
            this.mLastBluetoothDevices = new ArrayList();
        }
    }

    private void initializeUSB() {
        UsbManager usbManager = (UsbManager) this.mContext.getSystemService("usb");
        this.mUsbManager = usbManager;
        if (usbManager == null) {
            return;
        }
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.hardware.usb.action.USB_DEVICE_ATTACHED");
        intentFilter.addAction("android.hardware.usb.action.USB_DEVICE_DETACHED");
        intentFilter.addAction(c3.d4(1139));
        this.mContext.registerReceiver(this.mUsbBroadcast, intentFilter, 4);
        Iterator<UsbDevice> it = this.mUsbManager.getDeviceList().values().iterator();
        while (it.hasNext()) {
            handleUsbDeviceAttached(it.next());
        }
    }

    private boolean isHIDDeviceInterface(UsbDevice usbDevice, UsbInterface usbInterface) {
        return usbInterface.getInterfaceClass() == 3 || isXbox360Controller(usbDevice, usbInterface) || isXboxOneController(usbDevice, usbInterface);
    }

    private boolean isXbox360Controller(UsbDevice usbDevice, UsbInterface usbInterface) {
        int[] iArr = {121, 1103, 1118, 1133, 1390, 1699, 1848, 2047, 3695, 3853, 4152, 4553, 4779, 5168, 5227, 5426, 5604, 5678, 5769, 6473, 7085, 8406, 9414, 11298, 11720, 39046};
        if (usbInterface.getInterfaceClass() == 255 && usbInterface.getInterfaceSubclass() == 93 && (usbInterface.getInterfaceProtocol() == 1 || usbInterface.getInterfaceProtocol() == 129)) {
            int vendorId = usbDevice.getVendorId();
            for (int i4 = 0; i4 < 26; i4++) {
                if (vendorId == iArr[i4]) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean isXboxOneController(UsbDevice usbDevice, UsbInterface usbInterface) {
        int[] iArr = {1008, 1103, 1118, 1848, 3695, 3853, 4341, 5426, 8406, 9414, 11720, 11812};
        if (usbInterface.getId() == 0 && usbInterface.getInterfaceClass() == 255 && usbInterface.getInterfaceSubclass() == 71 && usbInterface.getInterfaceProtocol() == 208) {
            int vendorId = usbDevice.getVendorId();
            for (int i4 = 0; i4 < 12; i4++) {
                if (vendorId == iArr[i4]) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void release(HIDDeviceManager hIDDeviceManager) {
        HIDDeviceManager hIDDeviceManager2 = sManager;
        if (hIDDeviceManager == hIDDeviceManager2) {
            int i4 = sManagerRefCount - 1;
            sManagerRefCount = i4;
            if (i4 == 0) {
                hIDDeviceManager2.close();
                sManager = null;
            }
        }
    }

    private void shutdownBluetooth() {
        try {
            this.mContext.unregisterReceiver(this.mBluetoothBroadcast);
        } catch (Exception unused) {
        }
    }

    private void shutdownUSB() {
        try {
            this.mContext.unregisterReceiver(this.mUsbBroadcast);
        } catch (Exception unused) {
        }
    }

    native void HIDDeviceConnected(int i4, String str, int i5, int i6, String str2, int i7, String str3, String str4, int i8, int i9, int i10, int i11);

    native void HIDDeviceDisconnected(int i4);

    native void HIDDeviceFeatureReport(int i4, byte[] bArr);

    native void HIDDeviceInputReport(int i4, byte[] bArr);

    native void HIDDeviceOpenPending(int i4);

    native void HIDDeviceOpenResult(int i4, boolean z3);

    public void chromebookConnectionHandler() {
        if (this.mIsChromebook) {
            ArrayList arrayList = new ArrayList();
            ArrayList arrayList2 = new ArrayList();
            List<BluetoothDevice> connectedDevices = this.mBluetoothManager.getConnectedDevices(7);
            for (BluetoothDevice bluetoothDevice : connectedDevices) {
                if (!this.mLastBluetoothDevices.contains(bluetoothDevice)) {
                    arrayList2.add(bluetoothDevice);
                }
            }
            for (BluetoothDevice bluetoothDevice2 : this.mLastBluetoothDevices) {
                if (!connectedDevices.contains(bluetoothDevice2)) {
                    arrayList.add(bluetoothDevice2);
                }
            }
            this.mLastBluetoothDevices = connectedDevices;
            int size = arrayList.size();
            int i4 = 0;
            int i5 = 0;
            while (i5 < size) {
                Object obj = arrayList.get(i5);
                i5++;
                disconnectBluetoothDevice((BluetoothDevice) obj);
            }
            int size2 = arrayList2.size();
            while (i4 < size2) {
                Object obj2 = arrayList2.get(i4);
                i4++;
                connectBluetoothDevice((BluetoothDevice) obj2);
            }
            this.mHandler.postDelayed(new Runnable() { // from class: org.libsdl.app.HIDDeviceManager.3
                @Override // java.lang.Runnable
                public void run() {
                    this.chromebookConnectionHandler();
                }
            }, 10000L);
        }
    }

    public void closeDevice(int i4) {
        String d4 = c3.d4(172);
        try {
            Log.v(d4, "closeDevice deviceID=" + i4);
            HIDDevice device = getDevice(i4);
            if (device == null) {
                HIDDeviceDisconnected(i4);
            } else {
                device.close();
            }
        } catch (Exception e4) {
            Log.e(d4, "Got exception: " + Log.getStackTraceString(e4));
        }
    }

    public boolean connectBluetoothDevice(BluetoothDevice bluetoothDevice) {
        Log.v(TAG, c3.d4(455) + bluetoothDevice);
        synchronized (this) {
            try {
                if (!this.mBluetoothDevices.containsKey(bluetoothDevice)) {
                    HIDDeviceBLESteamController hIDDeviceBLESteamController = new HIDDeviceBLESteamController(this, bluetoothDevice);
                    int id = hIDDeviceBLESteamController.getId();
                    this.mBluetoothDevices.put(bluetoothDevice, hIDDeviceBLESteamController);
                    this.mDevicesById.put(Integer.valueOf(id), hIDDeviceBLESteamController);
                    return true;
                }
                Log.v(TAG, "Steam controller with address " + bluetoothDevice + " already exists, attempting reconnect");
                this.mBluetoothDevices.get(bluetoothDevice).reconnect();
                return false;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public void disconnectBluetoothDevice(BluetoothDevice bluetoothDevice) {
        synchronized (this) {
            try {
                HIDDeviceBLESteamController hIDDeviceBLESteamController = this.mBluetoothDevices.get(bluetoothDevice);
                if (hIDDeviceBLESteamController == null) {
                    return;
                }
                int id = hIDDeviceBLESteamController.getId();
                this.mBluetoothDevices.remove(bluetoothDevice);
                this.mDevicesById.remove(Integer.valueOf(id));
                hIDDeviceBLESteamController.shutdown();
                HIDDeviceDisconnected(id);
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public Context getContext() {
        return this.mContext;
    }

    public int getDeviceIDForIdentifier(String str) {
        SharedPreferences.Editor edit = this.mSharedPreferences.edit();
        int i4 = this.mSharedPreferences.getInt(str, 0);
        if (i4 == 0) {
            i4 = this.mNextDeviceId;
            int i5 = i4 + 1;
            this.mNextDeviceId = i5;
            edit.putInt(c3.d4(1140), i5);
        }
        edit.putInt(str, i4);
        edit.commit();
        return i4;
    }

    public boolean getFeatureReport(int i4, byte[] bArr) {
        try {
            HIDDevice device = getDevice(i4);
            if (device != null) {
                return device.getFeatureReport(bArr);
            }
            HIDDeviceDisconnected(i4);
            return false;
        } catch (Exception e4) {
            Log.e(c3.d4(220), "Got exception: " + Log.getStackTraceString(e4));
            return false;
        }
    }

    UsbManager getUSBManager() {
        return this.mUsbManager;
    }

    public boolean initialize(boolean z3, boolean z4) {
        Log.v(TAG, c3.d4(1194) + z3 + ", " + z4 + ")");
        if (z3) {
            initializeUSB();
        }
        if (!z4) {
            return true;
        }
        initializeBluetooth();
        return true;
    }

    public boolean isSteamController(BluetoothDevice bluetoothDevice) {
        return (bluetoothDevice == null || bluetoothDevice.getName() == null || !bluetoothDevice.getName().equals("SteamController") || (bluetoothDevice.getType() & 2) == 0) ? false : true;
    }

    public boolean openDevice(int i4) {
        String str = c3.d4(1472) + i4;
        String d4 = c3.d4(1195);
        Log.v(d4, str);
        HIDDevice device = getDevice(i4);
        if (device == null) {
            HIDDeviceDisconnected(i4);
            return false;
        }
        UsbDevice device2 = device.getDevice();
        if (device2 == null || this.mUsbManager.hasPermission(device2)) {
            try {
                return device.open();
            } catch (Exception e4) {
                Log.e(d4, c3.d4(845) + Log.getStackTraceString(e4));
                return false;
            }
        }
        HIDDeviceOpenPending(i4);
        try {
            this.mUsbManager.requestPermission(device2, PendingIntent.getBroadcast(this.mContext, 0, new Intent(ACTION_USB_PERMISSION), Build.VERSION.SDK_INT >= 31 ? 33554432 : 0));
        } catch (Exception unused) {
            Log.v(d4, "Couldn't request permission for USB device " + device2);
            HIDDeviceOpenResult(i4, false);
        }
        return false;
    }

    public int sendFeatureReport(int i4, byte[] bArr) {
        try {
            HIDDevice device = getDevice(i4);
            if (device != null) {
                return device.sendFeatureReport(bArr);
            }
            HIDDeviceDisconnected(i4);
            return -1;
        } catch (Exception e4) {
            Log.e(c3.d4(1473), "Got exception: " + Log.getStackTraceString(e4));
            return -1;
        }
    }

    public int sendOutputReport(int i4, byte[] bArr) {
        try {
            HIDDevice device = getDevice(i4);
            if (device != null) {
                return device.sendOutputReport(bArr);
            }
            HIDDeviceDisconnected(i4);
            return -1;
        } catch (Exception e4) {
            Log.e(TAG, "Got exception: " + Log.getStackTraceString(e4));
            return -1;
        }
    }

    public void setFrozen(boolean z3) {
        synchronized (this) {
            try {
                Iterator<HIDDevice> it = this.mDevicesById.values().iterator();
                while (it.hasNext()) {
                    it.next().setFrozen(z3);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
