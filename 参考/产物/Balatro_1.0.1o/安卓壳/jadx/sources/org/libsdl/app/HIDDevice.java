package org.libsdl.app;

import android.hardware.usb.UsbDevice;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
interface HIDDevice {
    void close();

    UsbDevice getDevice();

    boolean getFeatureReport(byte[] bArr);

    int getId();

    String getManufacturerName();

    int getProductId();

    String getProductName();

    String getSerialNumber();

    int getVendorId();

    int getVersion();

    boolean open();

    int sendFeatureReport(byte[] bArr);

    int sendOutputReport(byte[] bArr);

    void setFrozen(boolean z3);

    void shutdown();
}
