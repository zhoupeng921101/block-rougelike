package com.playstack.balatro.android;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class App extends Application {
    @Override // android.content.ContextWrapper
    protected void attachBaseContext(Context context) {
        super.attachBaseContext(context);
        SharedPreferences.Editor edit = context.getSharedPreferences("test_key", 0).edit();
        edit.putBoolean("first", false);
        edit.apply();
    }
}
