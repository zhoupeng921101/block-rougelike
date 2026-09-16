package androidx.core.graphics.drawable;

import a1.b2.c3;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.Shader;
import android.graphics.drawable.AdaptiveIconDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Build;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.Log;
import androidx.versionedparcelable.CustomVersionedParcelable;
import com.android.support.BuildConfig;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.Charset;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class IconCompat extends CustomVersionedParcelable {

    /* renamed from: k, reason: collision with root package name */
    static final PorterDuff.Mode f900k = PorterDuff.Mode.SRC_IN;

    /* renamed from: a, reason: collision with root package name */
    public int f901a;

    /* renamed from: b, reason: collision with root package name */
    Object f902b;

    /* renamed from: c, reason: collision with root package name */
    public byte[] f903c;

    /* renamed from: d, reason: collision with root package name */
    public Parcelable f904d;

    /* renamed from: e, reason: collision with root package name */
    public int f905e;

    /* renamed from: f, reason: collision with root package name */
    public int f906f;

    /* renamed from: g, reason: collision with root package name */
    public ColorStateList f907g;

    /* renamed from: h, reason: collision with root package name */
    PorterDuff.Mode f908h;

    /* renamed from: i, reason: collision with root package name */
    public String f909i;

    /* renamed from: j, reason: collision with root package name */
    public String f910j;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static int a(Object obj) {
            String d4 = c3.d4(414);
            if (Build.VERSION.SDK_INT >= 28) {
                return c.a(obj);
            }
            try {
                return ((Integer) obj.getClass().getMethod("getResId", null).invoke(obj, null)).intValue();
            } catch (IllegalAccessException e4) {
                Log.e("IconCompat", d4, e4);
                return 0;
            } catch (NoSuchMethodException e5) {
                Log.e("IconCompat", d4, e5);
                return 0;
            } catch (InvocationTargetException e6) {
                Log.e("IconCompat", d4, e6);
                return 0;
            }
        }

        static String b(Object obj) {
            String d4 = c3.d4(1018);
            if (Build.VERSION.SDK_INT >= 28) {
                return c.b(obj);
            }
            try {
                return (String) obj.getClass().getMethod("getResPackage", null).invoke(obj, null);
            } catch (IllegalAccessException e4) {
                Log.e(d4, "Unable to get icon package", e4);
                return null;
            } catch (NoSuchMethodException e5) {
                Log.e(d4, "Unable to get icon package", e5);
                return null;
            } catch (InvocationTargetException e6) {
                Log.e(d4, "Unable to get icon package", e6);
                return null;
            }
        }

        static int c(Object obj) {
            if (Build.VERSION.SDK_INT >= 28) {
                return c.c(obj);
            }
            try {
                return ((Integer) obj.getClass().getMethod("getType", null).invoke(obj, null)).intValue();
            } catch (IllegalAccessException e4) {
                Log.e("IconCompat", "Unable to get icon type " + obj, e4);
                return -1;
            } catch (NoSuchMethodException e5) {
                Log.e("IconCompat", "Unable to get icon type " + obj, e5);
                return -1;
            } catch (InvocationTargetException e6) {
                Log.e("IconCompat", "Unable to get icon type " + obj, e6);
                return -1;
            }
        }

        static Uri d(Object obj) {
            if (Build.VERSION.SDK_INT >= 28) {
                return c.d(obj);
            }
            try {
                return (Uri) obj.getClass().getMethod("getUri", null).invoke(obj, null);
            } catch (IllegalAccessException e4) {
                Log.e("IconCompat", "Unable to get icon uri", e4);
                return null;
            } catch (NoSuchMethodException e5) {
                Log.e("IconCompat", "Unable to get icon uri", e5);
                return null;
            } catch (InvocationTargetException e6) {
                Log.e("IconCompat", "Unable to get icon uri", e6);
                return null;
            }
        }

        static Drawable e(Icon icon, Context context) {
            return icon.loadDrawable(context);
        }

        static Icon f(IconCompat iconCompat, Context context) {
            Icon createWithBitmap;
            switch (iconCompat.f901a) {
                case -1:
                    return (Icon) iconCompat.f902b;
                case 0:
                default:
                    throw new IllegalArgumentException("Unknown type");
                case BuildConfig.VERSION_CODE /* 1 */:
                    createWithBitmap = Icon.createWithBitmap((Bitmap) iconCompat.f902b);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    createWithBitmap = Icon.createWithResource(iconCompat.d(), iconCompat.f905e);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    createWithBitmap = Icon.createWithData((byte[]) iconCompat.f902b, iconCompat.f905e, iconCompat.f906f);
                    break;
                case 4:
                    createWithBitmap = Icon.createWithContentUri((String) iconCompat.f902b);
                    break;
                case 5:
                    if (Build.VERSION.SDK_INT < 26) {
                        createWithBitmap = Icon.createWithBitmap(IconCompat.a((Bitmap) iconCompat.f902b, false));
                        break;
                    } else {
                        createWithBitmap = b.b((Bitmap) iconCompat.f902b);
                        break;
                    }
                case 6:
                    int i4 = Build.VERSION.SDK_INT;
                    if (i4 >= 30) {
                        createWithBitmap = d.a(iconCompat.f());
                        break;
                    } else {
                        if (context == null) {
                            throw new IllegalArgumentException(c3.d4(818) + iconCompat.f());
                        }
                        InputStream g4 = iconCompat.g(context);
                        if (g4 == null) {
                            throw new IllegalStateException("Cannot load adaptive icon from uri: " + iconCompat.f());
                        }
                        if (i4 < 26) {
                            createWithBitmap = Icon.createWithBitmap(IconCompat.a(BitmapFactory.decodeStream(g4), false));
                            break;
                        } else {
                            createWithBitmap = b.b(BitmapFactory.decodeStream(g4));
                            break;
                        }
                    }
            }
            ColorStateList colorStateList = iconCompat.f907g;
            if (colorStateList != null) {
                createWithBitmap.setTintList(colorStateList);
            }
            PorterDuff.Mode mode = iconCompat.f908h;
            if (mode != IconCompat.f900k) {
                createWithBitmap.setTintMode(mode);
            }
            return createWithBitmap;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static Drawable a(Drawable drawable, Drawable drawable2) {
            return new AdaptiveIconDrawable(drawable, drawable2);
        }

        static Icon b(Bitmap bitmap) {
            return Icon.createWithAdaptiveBitmap(bitmap);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {
        static int a(Object obj) {
            return ((Icon) obj).getResId();
        }

        static String b(Object obj) {
            return ((Icon) obj).getResPackage();
        }

        static int c(Object obj) {
            return ((Icon) obj).getType();
        }

        static Uri d(Object obj) {
            return ((Icon) obj).getUri();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class d {
        static Icon a(Uri uri) {
            return Icon.createWithAdaptiveBitmapContentUri(uri);
        }
    }

    public IconCompat() {
        this.f901a = -1;
        this.f903c = null;
        this.f904d = null;
        this.f905e = 0;
        this.f906f = 0;
        this.f907g = null;
        this.f908h = f900k;
        this.f909i = null;
    }

    IconCompat(int i4) {
        this.f903c = null;
        this.f904d = null;
        this.f905e = 0;
        this.f906f = 0;
        this.f907g = null;
        this.f908h = f900k;
        this.f909i = null;
        this.f901a = i4;
    }

    static Bitmap a(Bitmap bitmap, boolean z3) {
        int min = (int) (Math.min(bitmap.getWidth(), bitmap.getHeight()) * 0.6666667f);
        Bitmap createBitmap = Bitmap.createBitmap(min, min, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(createBitmap);
        Paint paint = new Paint(3);
        float f4 = min;
        float f5 = 0.5f * f4;
        float f6 = 0.9166667f * f5;
        if (z3) {
            float f7 = 0.010416667f * f4;
            paint.setColor(0);
            paint.setShadowLayer(f7, 0.0f, f4 * 0.020833334f, 1023410176);
            canvas.drawCircle(f5, f5, f6, paint);
            paint.setShadowLayer(f7, 0.0f, 0.0f, 503316480);
            canvas.drawCircle(f5, f5, f6, paint);
            paint.clearShadowLayer();
        }
        paint.setColor(-16777216);
        Shader.TileMode tileMode = Shader.TileMode.CLAMP;
        BitmapShader bitmapShader = new BitmapShader(bitmap, tileMode, tileMode);
        Matrix matrix = new Matrix();
        matrix.setTranslate((-(bitmap.getWidth() - min)) / 2.0f, (-(bitmap.getHeight() - min)) / 2.0f);
        bitmapShader.setLocalMatrix(matrix);
        paint.setShader(bitmapShader);
        canvas.drawCircle(f5, f5, f6, paint);
        canvas.setBitmap(null);
        return createBitmap;
    }

    public static IconCompat b(Resources resources, String str, int i4) {
        androidx.core.util.b.c(str);
        if (i4 == 0) {
            throw new IllegalArgumentException("Drawable resource ID must not be 0");
        }
        IconCompat iconCompat = new IconCompat(2);
        iconCompat.f905e = i4;
        if (resources != null) {
            try {
                iconCompat.f902b = resources.getResourceName(i4);
            } catch (Resources.NotFoundException unused) {
                throw new IllegalArgumentException(c3.d4(717));
            }
        } else {
            iconCompat.f902b = str;
        }
        iconCompat.f910j = str;
        return iconCompat;
    }

    private static String l(int i4) {
        switch (i4) {
            case BuildConfig.VERSION_CODE /* 1 */:
                return "BITMAP";
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                return "RESOURCE";
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                return "DATA";
            case 4:
                return "URI";
            case 5:
                return c3.d4(1351);
            case 6:
                return c3.d4(105);
            default:
                return "UNKNOWN";
        }
    }

    public int c() {
        int i4 = this.f901a;
        if (i4 == -1) {
            return a.a(this.f902b);
        }
        if (i4 == 2) {
            return this.f905e;
        }
        throw new IllegalStateException("called getResId() on " + this);
    }

    public String d() {
        int i4 = this.f901a;
        if (i4 == -1) {
            return a.b(this.f902b);
        }
        if (i4 == 2) {
            String str = this.f910j;
            return (str == null || TextUtils.isEmpty(str)) ? ((String) this.f902b).split(":", -1)[0] : this.f910j;
        }
        throw new IllegalStateException("called getResPackage() on " + this);
    }

    public int e() {
        int i4 = this.f901a;
        return i4 == -1 ? a.c(this.f902b) : i4;
    }

    public Uri f() {
        int i4 = this.f901a;
        if (i4 == -1) {
            return a.d(this.f902b);
        }
        if (i4 == 4 || i4 == 6) {
            return Uri.parse((String) this.f902b);
        }
        throw new IllegalStateException(c3.d4(665) + this);
    }

    public InputStream g(Context context) {
        Uri f4 = f();
        String scheme = f4.getScheme();
        if ("content".equals(scheme) || "file".equals(scheme)) {
            try {
                return context.getContentResolver().openInputStream(f4);
            } catch (Exception e4) {
                Log.w("IconCompat", "Unable to load image from URI: " + f4, e4);
                return null;
            }
        }
        try {
            return new FileInputStream(new File((String) this.f902b));
        } catch (FileNotFoundException e5) {
            Log.w("IconCompat", c3.d4(1059) + f4, e5);
            return null;
        }
    }

    public void h() {
        this.f908h = PorterDuff.Mode.valueOf(this.f909i);
        switch (this.f901a) {
            case -1:
                Parcelable parcelable = this.f904d;
                if (parcelable == null) {
                    throw new IllegalArgumentException("Invalid icon");
                }
                this.f902b = parcelable;
                return;
            case 0:
            default:
                return;
            case BuildConfig.VERSION_CODE /* 1 */:
            case 5:
                Parcelable parcelable2 = this.f904d;
                if (parcelable2 != null) {
                    this.f902b = parcelable2;
                    return;
                }
                byte[] bArr = this.f903c;
                this.f902b = bArr;
                this.f901a = 3;
                this.f905e = 0;
                this.f906f = bArr.length;
                return;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
            case 4:
            case 6:
                String str = new String(this.f903c, Charset.forName("UTF-16"));
                this.f902b = str;
                if (this.f901a == 2 && this.f910j == null) {
                    this.f910j = str.split(":", -1)[0];
                    return;
                }
                return;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                this.f902b = this.f903c;
                return;
        }
    }

    public void i(boolean z3) {
        this.f909i = this.f908h.name();
        switch (this.f901a) {
            case -1:
                if (z3) {
                    throw new IllegalArgumentException("Can't serialize Icon created with IconCompat#createFromIcon");
                }
                this.f904d = (Parcelable) this.f902b;
                return;
            case 0:
            default:
                return;
            case BuildConfig.VERSION_CODE /* 1 */:
            case 5:
                if (!z3) {
                    this.f904d = (Parcelable) this.f902b;
                    return;
                }
                Bitmap bitmap = (Bitmap) this.f902b;
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 90, byteArrayOutputStream);
                this.f903c = byteArrayOutputStream.toByteArray();
                return;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                this.f903c = ((String) this.f902b).getBytes(Charset.forName("UTF-16"));
                return;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                this.f903c = (byte[]) this.f902b;
                return;
            case 4:
            case 6:
                this.f903c = this.f902b.toString().getBytes(Charset.forName("UTF-16"));
                return;
        }
    }

    public Icon j() {
        return k(null);
    }

    public Icon k(Context context) {
        return a.f(this, context);
    }

    public String toString() {
        if (this.f901a == -1) {
            return String.valueOf(this.f902b);
        }
        StringBuilder sb = new StringBuilder("Icon(typ=");
        sb.append(l(this.f901a));
        switch (this.f901a) {
            case BuildConfig.VERSION_CODE /* 1 */:
            case 5:
                sb.append(" size=");
                sb.append(((Bitmap) this.f902b).getWidth());
                sb.append("x");
                sb.append(((Bitmap) this.f902b).getHeight());
                break;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                sb.append(" pkg=");
                sb.append(this.f910j);
                sb.append(" id=");
                sb.append(String.format("0x%08x", Integer.valueOf(c())));
                break;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                sb.append(c3.d4(106));
                sb.append(this.f905e);
                if (this.f906f != 0) {
                    sb.append(" off=");
                    sb.append(this.f906f);
                    break;
                }
                break;
            case 4:
            case 6:
                sb.append(" uri=");
                sb.append(this.f902b);
                break;
        }
        if (this.f907g != null) {
            sb.append(" tint=");
            sb.append(this.f907g);
        }
        if (this.f908h != f900k) {
            sb.append(" mode=");
            sb.append(this.f908h);
        }
        sb.append(")");
        return sb.toString();
    }
}
