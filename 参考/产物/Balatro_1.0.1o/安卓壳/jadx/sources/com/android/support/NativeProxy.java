package com.android.support;

import android.app.Dialog;
import android.content.Context;
import android.view.View;
import np.dcc.protect.EntryPoint;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class NativeProxy implements View.OnClickListener, Runnable {
    private final Context ctx;
    private final Dialog dialog;

    static {
        EntryPoint.stub(6);
    }

    private native void onAction(int i4, Context context, Dialog dialog);

    @Override // android.view.View.OnClickListener
    public native void onClick(View view);

    @Override // java.lang.Runnable
    public native void run();

    public NativeProxy(Context ctx, Dialog dialog) {
        this.ctx = ctx;
        this.dialog = dialog;
    }
}
