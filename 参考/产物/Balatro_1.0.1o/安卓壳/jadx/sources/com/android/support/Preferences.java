package com.android.support;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.LinkedHashSet;
import java.util.Set;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class Preferences {
    private static final boolean DEFAULT_BOOLEAN_VALUE = false;
    private static final double DEFAULT_DOUBLE_VALUE = 0.0d;
    private static final float DEFAULT_FLOAT_VALUE = 0.0f;
    private static final int DEFAULT_INT_VALUE = 0;
    private static final long DEFAULT_LONG_VALUE = 0;
    private static final String DEFAULT_STRING_VALUE = "";
    private static final String LENGTH = "_length";
    public static Context context;
    public static boolean isExpanded;
    public static boolean loadPref;
    private static Preferences prefsInstance;
    private static SharedPreferences sharedPreferences;

    public static native void Changes(Context context2, int i4, String str, int i5, long j4, boolean z3, String str2);

    public static void changeFeatureInt(String featureName, int featureNum, int value) {
        with(context).writeInt(featureNum, value);
        Changes(context, featureNum, featureName, value, DEFAULT_LONG_VALUE, false, null);
    }

    public static void changeFeatureLong(String featureName, int featureNum, long Lvalue) {
        with(context).writeLong(String.valueOf(featureNum), Lvalue);
        Changes(context, featureNum, featureName, DEFAULT_INT_VALUE, Lvalue, false, null);
    }

    public static void changeFeatureString(String featureName, int featureNum, String inputString) {
        with(context).writeString(featureNum, inputString);
        Changes(context, featureNum, featureName, DEFAULT_INT_VALUE, DEFAULT_LONG_VALUE, false, inputString);
    }

    public static void changeFeatureBool(String featureName, int featureNum, boolean bool) {
        with(context).writeBoolean(featureNum, bool);
        Changes(context, featureNum, featureName, DEFAULT_INT_VALUE, DEFAULT_LONG_VALUE, bool, null);
    }

    public static int loadPrefInt(String featureName, int featureNum) {
        if (!loadPref) {
            return DEFAULT_INT_VALUE;
        }
        int value = with(context).readInt(featureNum);
        Changes(context, featureNum, featureName, value, DEFAULT_LONG_VALUE, false, null);
        return value;
    }

    public static long loadPrefLong(String featureName, int featureNum) {
        if (!loadPref) {
            return DEFAULT_LONG_VALUE;
        }
        long Lvalue = with(context).readLong(String.valueOf(featureNum));
        Changes(context, featureNum, featureName, DEFAULT_INT_VALUE, Lvalue, false, null);
        return Lvalue;
    }

    public static boolean loadPrefBool(String featureName, int featureNum, boolean bDef) {
        boolean bool = with(context).readBoolean(featureNum, bDef);
        if (featureNum == -1) {
            loadPref = bool;
        }
        if (featureNum == -3) {
            isExpanded = bool;
        }
        boolean bDef2 = (loadPref || featureNum < 0) ? bool : bDef;
        Changes(context, featureNum, featureName, DEFAULT_INT_VALUE, DEFAULT_LONG_VALUE, bDef2, null);
        return bDef2;
    }

    public static String loadPrefString(String featureName, int featureNum) {
        if (loadPref || featureNum <= 0) {
            String text = with(context).readString(featureNum);
            Changes(context, featureNum, featureName, DEFAULT_INT_VALUE, DEFAULT_LONG_VALUE, false, text);
            return text;
        }
        return DEFAULT_STRING_VALUE;
    }

    private Preferences(Context context2) {
        sharedPreferences = context2.getApplicationContext().getSharedPreferences(context2.getPackageName() + "_preferences", DEFAULT_INT_VALUE);
    }

    private Preferences(Context context2, String preferencesName) {
        sharedPreferences = context2.getApplicationContext().getSharedPreferences(preferencesName, DEFAULT_INT_VALUE);
    }

    public static Preferences with(Context context2) {
        if (prefsInstance == null) {
            prefsInstance = new Preferences(context2);
        }
        return prefsInstance;
    }

    public static Preferences with(Context context2, boolean forceInstantiation) {
        if (forceInstantiation) {
            prefsInstance = new Preferences(context2);
        }
        return prefsInstance;
    }

    public static Preferences with(Context context2, String preferencesName) {
        if (prefsInstance == null) {
            prefsInstance = new Preferences(context2, preferencesName);
        }
        return prefsInstance;
    }

    public static Preferences with(Context context2, String preferencesName, boolean forceInstantiation) {
        if (forceInstantiation) {
            prefsInstance = new Preferences(context2, preferencesName);
        }
        return prefsInstance;
    }

    public String readString(String what) {
        return sharedPreferences.getString(what, DEFAULT_STRING_VALUE);
    }

    public String readString(int what) {
        try {
            return sharedPreferences.getString(String.valueOf(what), DEFAULT_STRING_VALUE);
        } catch (ClassCastException e4) {
            return DEFAULT_STRING_VALUE;
        }
    }

    public String readString(String what, String defaultString) {
        return sharedPreferences.getString(what, defaultString);
    }

    public void writeString(String where, String what) {
        sharedPreferences.edit().putString(where, what).apply();
    }

    public void writeString(int where, String what) {
        sharedPreferences.edit().putString(String.valueOf(where), what).apply();
    }

    public int readInt(String what) {
        return sharedPreferences.getInt(what, DEFAULT_INT_VALUE);
    }

    public int readInt(int what) {
        try {
            return sharedPreferences.getInt(String.valueOf(what), DEFAULT_INT_VALUE);
        } catch (ClassCastException e4) {
            return DEFAULT_INT_VALUE;
        }
    }

    public int readInt(String what, int defaultInt) {
        return sharedPreferences.getInt(what, defaultInt);
    }

    public void writeInt(String where, int what) {
        sharedPreferences.edit().putInt(where, what).apply();
    }

    public void writeInt(int where, int what) {
        sharedPreferences.edit().putInt(String.valueOf(where), what).apply();
    }

    public double readDouble(String what) {
        if (!contains(what)) {
            return DEFAULT_DOUBLE_VALUE;
        }
        return Double.longBitsToDouble(readLong(what));
    }

    public double readDouble(String what, double defaultDouble) {
        if (!contains(what)) {
            return defaultDouble;
        }
        return Double.longBitsToDouble(readLong(what));
    }

    public void writeDouble(String where, double what) {
        writeLong(where, Double.doubleToRawLongBits(what));
    }

    public float readFloat(String what) {
        return sharedPreferences.getFloat(what, DEFAULT_FLOAT_VALUE);
    }

    public float readFloat(String what, float defaultFloat) {
        return sharedPreferences.getFloat(what, defaultFloat);
    }

    public void writeFloat(String where, float what) {
        sharedPreferences.edit().putFloat(where, what).apply();
    }

    public long readLong(String what) {
        return sharedPreferences.getLong(what, DEFAULT_LONG_VALUE);
    }

    public long readLong(String what, long defaultLong) {
        return sharedPreferences.getLong(what, defaultLong);
    }

    public void writeLong(String where, long what) {
        sharedPreferences.edit().putLong(where, what).apply();
    }

    public boolean readBoolean(String what) {
        return sharedPreferences.getBoolean(what, false);
    }

    public boolean readBoolean(int what) {
        return sharedPreferences.getBoolean(String.valueOf(what), false);
    }

    public boolean readBoolean(String what, boolean defaultBoolean) {
        return sharedPreferences.getBoolean(what, defaultBoolean);
    }

    public boolean readBoolean(int what, boolean defaultBoolean) {
        try {
            return sharedPreferences.getBoolean(String.valueOf(what), defaultBoolean);
        } catch (ClassCastException e4) {
            return defaultBoolean;
        }
    }

    public void writeBoolean(String where, boolean what) {
        sharedPreferences.edit().putBoolean(where, what).apply();
    }

    public void writeBoolean(int where, boolean what) {
        sharedPreferences.edit().putBoolean(String.valueOf(where), what).apply();
    }

    public void putStringSet(String key, Set<String> value) {
        sharedPreferences.edit().putStringSet(key, value).apply();
    }

    public void putOrderedStringSet(String key, Set<String> value) {
        int stringSetLength = DEFAULT_INT_VALUE;
        if (sharedPreferences.contains(key + LENGTH)) {
            stringSetLength = readInt(key + LENGTH);
        }
        writeInt(key + LENGTH, value.size());
        int i4 = DEFAULT_INT_VALUE;
        for (String aValue : value) {
            writeString(key + "[" + i4 + "]", aValue);
            i4++;
        }
        while (i4 < stringSetLength) {
            remove(key + "[" + i4 + "]");
            i4++;
        }
    }

    public Set<String> getStringSet(String key, Set<String> defValue) {
        return sharedPreferences.getStringSet(key, defValue);
    }

    public Set<String> getOrderedStringSet(String key, Set<String> defValue) {
        if (contains(key + LENGTH)) {
            LinkedHashSet<String> set = new LinkedHashSet<>();
            int stringSetLength = readInt(key + LENGTH);
            if (stringSetLength >= 0) {
                for (int i4 = DEFAULT_INT_VALUE; i4 < stringSetLength; i4++) {
                    set.add(readString(key + "[" + i4 + "]"));
                }
            }
            return set;
        }
        return defValue;
    }

    public void remove(String key) {
        int stringSetLength;
        if (contains(key + LENGTH) && (stringSetLength = readInt(key + LENGTH)) >= 0) {
            sharedPreferences.edit().remove(key + LENGTH).apply();
            for (int i4 = DEFAULT_INT_VALUE; i4 < stringSetLength; i4++) {
                sharedPreferences.edit().remove(key + "[" + i4 + "]").apply();
            }
        }
        sharedPreferences.edit().remove(key).apply();
    }

    public boolean contains(String key) {
        return sharedPreferences.contains(key);
    }

    public void clear() {
        sharedPreferences.edit().clear().apply();
    }
}
