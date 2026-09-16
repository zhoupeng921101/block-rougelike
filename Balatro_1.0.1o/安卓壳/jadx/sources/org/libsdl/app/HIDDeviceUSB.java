package org.libsdl.app;

import a1.b2.c3;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.util.Log;
import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class HIDDeviceUSB implements HIDDevice {
    private static final String TAG = "hidapi";
    protected UsbDeviceConnection mConnection;
    protected UsbDevice mDevice;
    protected int mDeviceId;
    protected boolean mFrozen;
    protected UsbEndpoint mInputEndpoint;
    protected InputThread mInputThread;
    protected int mInterface;
    protected int mInterfaceIndex;
    protected HIDDeviceManager mManager;
    protected UsbEndpoint mOutputEndpoint;
    protected boolean mRunning = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    protected class InputThread extends Thread {
        protected InputThread() {
        }

        @Override // java.lang.Thread, java.lang.Runnable
        public void run() {
            int maxPacketSize = HIDDeviceUSB.this.mInputEndpoint.getMaxPacketSize();
            byte[] bArr = new byte[maxPacketSize];
            while (true) {
                HIDDeviceUSB hIDDeviceUSB = HIDDeviceUSB.this;
                if (!hIDDeviceUSB.mRunning) {
                    return;
                }
                try {
                    int bulkTransfer = hIDDeviceUSB.mConnection.bulkTransfer(hIDDeviceUSB.mInputEndpoint, bArr, maxPacketSize, 1000);
                    if (bulkTransfer > 0) {
                        byte[] copyOfRange = bulkTransfer == maxPacketSize ? bArr : Arrays.copyOfRange(bArr, 0, bulkTransfer);
                        HIDDeviceUSB hIDDeviceUSB2 = HIDDeviceUSB.this;
                        if (!hIDDeviceUSB2.mFrozen) {
                            hIDDeviceUSB2.mManager.HIDDeviceInputReport(hIDDeviceUSB2.mDeviceId, copyOfRange);
                        }
                    }
                } catch (Exception e4) {
                    Log.v(HIDDeviceUSB.TAG, c3.d4(799) + e4);
                    return;
                }
            }
        }
    }

    public HIDDeviceUSB(HIDDeviceManager hIDDeviceManager, UsbDevice usbDevice, int i4) {
        this.mManager = hIDDeviceManager;
        this.mDevice = usbDevice;
        this.mInterfaceIndex = i4;
        this.mInterface = usbDevice.getInterface(i4).getId();
        this.mDeviceId = hIDDeviceManager.getDeviceIDForIdentifier(getIdentifier());
    }

    @Override // org.libsdl.app.HIDDevice
    public void close() {
        this.mRunning = false;
        if (this.mInputThread != null) {
            while (this.mInputThread.isAlive()) {
                this.mInputThread.interrupt();
                try {
                    this.mInputThread.join();
                } catch (InterruptedException unused) {
                }
            }
            this.mInputThread = null;
        }
        if (this.mConnection != null) {
            this.mConnection.releaseInterface(this.mDevice.getInterface(this.mInterfaceIndex));
            this.mConnection.close();
            this.mConnection = null;
        }
    }

    @Override // org.libsdl.app.HIDDevice
    public UsbDevice getDevice() {
        return this.mDevice;
    }

    public String getDeviceName() {
        return getManufacturerName() + c3.d4(954) + getProductName() + "(0x" + String.format("%x", Integer.valueOf(getVendorId())) + c3.d4(1005) + String.format("%x", Integer.valueOf(getProductId())) + c3.d4(598);
    }

    @Override // org.libsdl.app.HIDDevice
    public boolean getFeatureReport(byte[] bArr) {
        int i4;
        int i5;
        int length = bArr.length;
        byte b4 = bArr[0];
        if (b4 == 0) {
            i4 = length - 1;
            i5 = 1;
        } else {
            i4 = length;
            i5 = 0;
        }
        int controlTransfer = this.mConnection.controlTransfer(161, 1, b4 | 768, this.mInterface, bArr, i5, i4, 1000);
        if (controlTransfer >= 0) {
            if (i5 != 0) {
                controlTransfer++;
                i4++;
            }
            this.mManager.HIDDeviceFeatureReport(this.mDeviceId, controlTransfer == i4 ? bArr : Arrays.copyOfRange(bArr, 0, controlTransfer));
            return true;
        }
        Log.w(c3.d4(307), "getFeatureReport() returned " + controlTransfer + " on device " + getDeviceName());
        return false;
    }

    @Override // org.libsdl.app.HIDDevice
    public int getId() {
        return this.mDeviceId;
    }

    public String getIdentifier() {
        return String.format(c3.d4(705), this.mDevice.getDeviceName(), Integer.valueOf(this.mDevice.getVendorId()), Integer.valueOf(this.mDevice.getProductId()), Integer.valueOf(this.mInterfaceIndex));
    }

    @Override // org.libsdl.app.HIDDevice
    public String getManufacturerName() {
        String manufacturerName = this.mDevice.getManufacturerName();
        return manufacturerName == null ? String.format("%x", Integer.valueOf(getVendorId())) : manufacturerName;
    }

    @Override // org.libsdl.app.HIDDevice
    public int getProductId() {
        return this.mDevice.getProductId();
    }

    @Override // org.libsdl.app.HIDDevice
    public String getProductName() {
        String productName = this.mDevice.getProductName();
        if (productName != null) {
            return productName;
        }
        return String.format(c3.d4(1249), Integer.valueOf(getProductId()));
    }

    @Override // org.libsdl.app.HIDDevice
    public String getSerialNumber() {
        String str;
        try {
            str = this.mDevice.getSerialNumber();
        } catch (SecurityException unused) {
            str = null;
        }
        return str == null ? "" : str;
    }

    @Override // org.libsdl.app.HIDDevice
    public int getVendorId() {
        return this.mDevice.getVendorId();
    }

    @Override // org.libsdl.app.HIDDevice
    public int getVersion() {
        return 0;
    }

    @Override // org.libsdl.app.HIDDevice
    public boolean open() {
        UsbDeviceConnection openDevice = this.mManager.getUSBManager().openDevice(this.mDevice);
        this.mConnection = openDevice;
        if (openDevice == null) {
            Log.w(TAG, "Unable to open USB device " + getDeviceName());
            return false;
        }
        UsbInterface usbInterface = this.mDevice.getInterface(this.mInterfaceIndex);
        if (!this.mConnection.claimInterface(usbInterface, true)) {
            Log.w(TAG, "Failed to claim interfaces on USB device " + getDeviceName());
            close();
            return false;
        }
        for (int i4 = 0; i4 < usbInterface.getEndpointCount(); i4++) {
            UsbEndpoint endpoint = usbInterface.getEndpoint(i4);
            int direction = endpoint.getDirection();
            if (direction != 0) {
                if (direction == 128 && this.mInputEndpoint == null) {
                    this.mInputEndpoint = endpoint;
                }
            } else if (this.mOutputEndpoint == null) {
                this.mOutputEndpoint = endpoint;
            }
        }
        if (this.mInputEndpoint != null && this.mOutputEndpoint != null) {
            this.mRunning = true;
            InputThread inputThread = new InputThread();
            this.mInputThread = inputThread;
            inputThread.start();
            return true;
        }
        Log.w(TAG, "Missing required endpoint on USB device " + getDeviceName());
        close();
        return false;
    }

    @Override // org.libsdl.app.HIDDevice
    public int sendFeatureReport(byte[] bArr) {
        int length = bArr.length;
        int i4 = 0;
        byte b4 = bArr[0];
        if (b4 == 0) {
            length--;
            i4 = 1;
        }
        int i5 = length;
        int controlTransfer = this.mConnection.controlTransfer(33, 9, b4 | 768, this.mInterface, bArr, i4, i5, 1000);
        if (controlTransfer >= 0) {
            return i4 != 0 ? i5 + 1 : i5;
        }
        Log.w(c3.d4(397), "sendFeatureReport() returned " + controlTransfer + c3.d4(706) + getDeviceName());
        return -1;
    }

    @Override // org.libsdl.app.HIDDevice
    public int sendOutputReport(byte[] bArr) {
        int bulkTransfer = this.mConnection.bulkTransfer(this.mOutputEndpoint, bArr, bArr.length, 1000);
        if (bulkTransfer != bArr.length) {
            Log.w(TAG, "sendOutputReport() returned " + bulkTransfer + " on device " + getDeviceName());
        }
        return bulkTransfer;
    }

    @Override // org.libsdl.app.HIDDevice
    public void setFrozen(boolean z3) {
        this.mFrozen = z3;
    }

    @Override // org.libsdl.app.HIDDevice
    public void shutdown() {
        close();
        this.mManager = null;
    }
}
