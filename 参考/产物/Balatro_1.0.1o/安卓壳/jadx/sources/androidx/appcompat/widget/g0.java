package androidx.appcompat.widget;

import a1.b2.c3;
import android.R;
import android.app.SearchableInfo;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.TextUtils;
import android.text.style.TextAppearanceSpan;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class g0 extends q.c implements View.OnClickListener {

    /* renamed from: l, reason: collision with root package name */
    private final SearchView f551l;

    /* renamed from: m, reason: collision with root package name */
    private final SearchableInfo f552m;

    /* renamed from: n, reason: collision with root package name */
    private final Context f553n;

    /* renamed from: o, reason: collision with root package name */
    private final WeakHashMap f554o;

    /* renamed from: p, reason: collision with root package name */
    private final int f555p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f556q;

    /* renamed from: r, reason: collision with root package name */
    private int f557r;

    /* renamed from: s, reason: collision with root package name */
    private ColorStateList f558s;

    /* renamed from: t, reason: collision with root package name */
    private int f559t;

    /* renamed from: u, reason: collision with root package name */
    private int f560u;

    /* renamed from: v, reason: collision with root package name */
    private int f561v;

    /* renamed from: w, reason: collision with root package name */
    private int f562w;

    /* renamed from: x, reason: collision with root package name */
    private int f563x;

    /* renamed from: y, reason: collision with root package name */
    private int f564y;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class a {

        /* renamed from: a, reason: collision with root package name */
        public final TextView f565a;

        /* renamed from: b, reason: collision with root package name */
        public final TextView f566b;

        /* renamed from: c, reason: collision with root package name */
        public final ImageView f567c;

        /* renamed from: d, reason: collision with root package name */
        public final ImageView f568d;

        /* renamed from: e, reason: collision with root package name */
        public final ImageView f569e;

        public a(View view) {
            this.f565a = (TextView) view.findViewById(R.id.text1);
            this.f566b = (TextView) view.findViewById(R.id.text2);
            this.f567c = (ImageView) view.findViewById(R.id.icon1);
            this.f568d = (ImageView) view.findViewById(R.id.icon2);
            this.f569e = (ImageView) view.findViewById(c.e.f1903k);
        }
    }

    public g0(Context context, SearchView searchView, SearchableInfo searchableInfo, WeakHashMap weakHashMap) {
        super(context, searchView.getSuggestionRowLayout(), null, true);
        this.f556q = false;
        this.f557r = 1;
        this.f559t = -1;
        this.f560u = -1;
        this.f561v = -1;
        this.f562w = -1;
        this.f563x = -1;
        this.f564y = -1;
        this.f551l = searchView;
        this.f552m = searchableInfo;
        this.f555p = searchView.getSuggestionCommitIconResId();
        this.f553n = context;
        this.f554o = weakHashMap;
    }

    private void A(String str, Drawable drawable) {
        if (drawable != null) {
            this.f554o.put(str, drawable.getConstantState());
        }
    }

    private void B(Cursor cursor) {
        Bundle extras = cursor != null ? cursor.getExtras() : null;
        if (extras != null) {
            extras.getBoolean("in_progress");
        }
    }

    private Drawable k(String str) {
        Drawable.ConstantState constantState = (Drawable.ConstantState) this.f554o.get(str);
        if (constantState == null) {
            return null;
        }
        return constantState.newDrawable();
    }

    private CharSequence l(CharSequence charSequence) {
        if (this.f558s == null) {
            TypedValue typedValue = new TypedValue();
            this.f553n.getTheme().resolveAttribute(c.a.f1845q, typedValue, true);
            this.f558s = this.f553n.getResources().getColorStateList(typedValue.resourceId);
        }
        SpannableString spannableString = new SpannableString(charSequence);
        spannableString.setSpan(new TextAppearanceSpan(null, 0, 0, this.f558s, null), 0, charSequence.length(), 33);
        return spannableString;
    }

    private Drawable m(ComponentName componentName) {
        String d4 = c3.d4(1016);
        PackageManager packageManager = this.f553n.getPackageManager();
        try {
            ActivityInfo activityInfo = packageManager.getActivityInfo(componentName, 128);
            int iconResource = activityInfo.getIconResource();
            if (iconResource == 0) {
                return null;
            }
            Drawable drawable = packageManager.getDrawable(componentName.getPackageName(), iconResource, activityInfo.applicationInfo);
            if (drawable != null) {
                return drawable;
            }
            Log.w(d4, c3.d4(317) + iconResource + " for " + componentName.flattenToShortString());
            return null;
        } catch (PackageManager.NameNotFoundException e4) {
            Log.w(d4, e4.toString());
            return null;
        }
    }

    private Drawable n(ComponentName componentName) {
        String flattenToShortString = componentName.flattenToShortString();
        if (!this.f554o.containsKey(flattenToShortString)) {
            Drawable m3 = m(componentName);
            this.f554o.put(flattenToShortString, m3 != null ? m3.getConstantState() : null);
            return m3;
        }
        Drawable.ConstantState constantState = (Drawable.ConstantState) this.f554o.get(flattenToShortString);
        if (constantState == null) {
            return null;
        }
        return constantState.newDrawable(this.f553n.getResources());
    }

    public static String o(Cursor cursor, String str) {
        return w(cursor, cursor.getColumnIndex(str));
    }

    private Drawable p() {
        Drawable n3 = n(this.f552m.getSearchActivity());
        return n3 != null ? n3 : this.f553n.getPackageManager().getDefaultActivityIcon();
    }

    private Drawable q(Uri uri) {
        try {
            if ("android.resource".equals(uri.getScheme())) {
                try {
                    return r(uri);
                } catch (Resources.NotFoundException unused) {
                    throw new FileNotFoundException("Resource does not exist: " + uri);
                }
            }
            InputStream openInputStream = this.f553n.getContentResolver().openInputStream(uri);
            if (openInputStream == null) {
                throw new FileNotFoundException("Failed to open " + uri);
            }
            try {
                Drawable createFromStream = Drawable.createFromStream(openInputStream, null);
                try {
                    return createFromStream;
                } catch (IOException e4) {
                    return createFromStream;
                }
            } finally {
                try {
                    openInputStream.close();
                } catch (IOException e42) {
                    Log.e("SuggestionsAdapter", "Error closing icon stream for " + uri, e42);
                }
            }
        } catch (FileNotFoundException e5) {
            Log.w("SuggestionsAdapter", "Icon not found: " + uri + c3.d4(183) + e5.getMessage());
            return null;
        }
        Log.w("SuggestionsAdapter", "Icon not found: " + uri + c3.d4(183) + e5.getMessage());
        return null;
    }

    private Drawable s(String str) {
        if (str == null || str.isEmpty() || "0".equals(str)) {
            return null;
        }
        try {
            int parseInt = Integer.parseInt(str);
            String str2 = "android.resource://" + this.f553n.getPackageName() + "/" + parseInt;
            Drawable k4 = k(str2);
            if (k4 != null) {
                return k4;
            }
            Drawable c4 = androidx.core.content.a.c(this.f553n, parseInt);
            A(str2, c4);
            return c4;
        } catch (Resources.NotFoundException unused) {
            Log.w("SuggestionsAdapter", "Icon resource not found: " + str);
            return null;
        } catch (NumberFormatException unused2) {
            Drawable k5 = k(str);
            if (k5 != null) {
                return k5;
            }
            Drawable q3 = q(Uri.parse(str));
            A(str, q3);
            return q3;
        }
    }

    private Drawable t(Cursor cursor) {
        int i4 = this.f562w;
        if (i4 == -1) {
            return null;
        }
        Drawable s3 = s(cursor.getString(i4));
        return s3 != null ? s3 : p();
    }

    private Drawable u(Cursor cursor) {
        int i4 = this.f563x;
        if (i4 == -1) {
            return null;
        }
        return s(cursor.getString(i4));
    }

    private static String w(Cursor cursor, int i4) {
        if (i4 == -1) {
            return null;
        }
        try {
            return cursor.getString(i4);
        } catch (Exception e4) {
            Log.e("SuggestionsAdapter", "unexpected error retrieving valid column from cursor, did the remote process die?", e4);
            return null;
        }
    }

    private void y(ImageView imageView, Drawable drawable, int i4) {
        imageView.setImageDrawable(drawable);
        if (drawable == null) {
            imageView.setVisibility(i4);
            return;
        }
        imageView.setVisibility(0);
        drawable.setVisible(false, false);
        drawable.setVisible(true, false);
    }

    private void z(TextView textView, CharSequence charSequence) {
        textView.setText(charSequence);
        if (TextUtils.isEmpty(charSequence)) {
            textView.setVisibility(8);
        } else {
            textView.setVisibility(0);
        }
    }

    @Override // q.a, q.b.a
    public void a(Cursor cursor) {
        if (this.f556q) {
            Log.w("SuggestionsAdapter", "Tried to change cursor after adapter was closed.");
            if (cursor != null) {
                cursor.close();
                return;
            }
            return;
        }
        try {
            super.a(cursor);
            if (cursor != null) {
                this.f559t = cursor.getColumnIndex("suggest_text_1");
                this.f560u = cursor.getColumnIndex("suggest_text_2");
                this.f561v = cursor.getColumnIndex("suggest_text_2_url");
                this.f562w = cursor.getColumnIndex("suggest_icon_1");
                this.f563x = cursor.getColumnIndex("suggest_icon_2");
                this.f564y = cursor.getColumnIndex("suggest_flags");
            }
        } catch (Exception e4) {
            Log.e("SuggestionsAdapter", c3.d4(318), e4);
        }
    }

    @Override // q.a, q.b.a
    public CharSequence c(Cursor cursor) {
        String o3;
        String o4;
        if (cursor == null) {
            return null;
        }
        String o5 = o(cursor, "suggest_intent_query");
        if (o5 != null) {
            return o5;
        }
        if (this.f552m.shouldRewriteQueryFromData() && (o4 = o(cursor, "suggest_intent_data")) != null) {
            return o4;
        }
        if (!this.f552m.shouldRewriteQueryFromText() || (o3 = o(cursor, c3.d4(815))) == null) {
            return null;
        }
        return o3;
    }

    @Override // q.b.a
    public Cursor d(CharSequence charSequence) {
        String d4 = charSequence == null ? c3.d4(715) : charSequence.toString();
        if (this.f551l.getVisibility() == 0 && this.f551l.getWindowVisibility() == 0) {
            try {
                Cursor v3 = v(this.f552m, d4, 50);
                if (v3 != null) {
                    v3.getCount();
                    return v3;
                }
            } catch (RuntimeException e4) {
                Log.w("SuggestionsAdapter", "Search suggestions query threw an exception.", e4);
            }
        }
        return null;
    }

    @Override // q.a
    public void e(View view, Context context, Cursor cursor) {
        a aVar = (a) view.getTag();
        int i4 = this.f564y;
        int i5 = i4 != -1 ? cursor.getInt(i4) : 0;
        if (aVar.f565a != null) {
            z(aVar.f565a, w(cursor, this.f559t));
        }
        if (aVar.f566b != null) {
            String w3 = w(cursor, this.f561v);
            CharSequence l3 = w3 != null ? l(w3) : w(cursor, this.f560u);
            if (TextUtils.isEmpty(l3)) {
                TextView textView = aVar.f565a;
                if (textView != null) {
                    textView.setSingleLine(false);
                    aVar.f565a.setMaxLines(2);
                }
            } else {
                TextView textView2 = aVar.f565a;
                if (textView2 != null) {
                    textView2.setSingleLine(true);
                    aVar.f565a.setMaxLines(1);
                }
            }
            z(aVar.f566b, l3);
        }
        ImageView imageView = aVar.f567c;
        if (imageView != null) {
            y(imageView, t(cursor), 4);
        }
        ImageView imageView2 = aVar.f568d;
        if (imageView2 != null) {
            y(imageView2, u(cursor), 8);
        }
        int i6 = this.f557r;
        if (i6 != 2 && (i6 != 1 || (i5 & 1) == 0)) {
            aVar.f569e.setVisibility(8);
            return;
        }
        aVar.f569e.setVisibility(0);
        aVar.f569e.setTag(aVar.f565a.getText());
        aVar.f569e.setOnClickListener(this);
    }

    @Override // q.a, android.widget.BaseAdapter, android.widget.SpinnerAdapter
    public View getDropDownView(int i4, View view, ViewGroup viewGroup) {
        try {
            return super.getDropDownView(i4, view, viewGroup);
        } catch (RuntimeException e4) {
            Log.w("SuggestionsAdapter", "Search suggestions cursor threw exception.", e4);
            View g4 = g(this.f553n, b(), viewGroup);
            if (g4 != null) {
                ((a) g4.getTag()).f565a.setText(e4.toString());
            }
            return g4;
        }
    }

    @Override // q.a, android.widget.Adapter
    public View getView(int i4, View view, ViewGroup viewGroup) {
        try {
            return super.getView(i4, view, viewGroup);
        } catch (RuntimeException e4) {
            Log.w("SuggestionsAdapter", "Search suggestions cursor threw exception.", e4);
            View h4 = h(this.f553n, b(), viewGroup);
            if (h4 != null) {
                ((a) h4.getTag()).f565a.setText(e4.toString());
            }
            return h4;
        }
    }

    @Override // q.c, q.a
    public View h(Context context, Cursor cursor, ViewGroup viewGroup) {
        View h4 = super.h(context, cursor, viewGroup);
        h4.setTag(new a(h4));
        ((ImageView) h4.findViewById(c.e.f1903k)).setImageResource(this.f555p);
        return h4;
    }

    @Override // android.widget.BaseAdapter, android.widget.Adapter
    public boolean hasStableIds() {
        return false;
    }

    @Override // android.widget.BaseAdapter
    public void notifyDataSetChanged() {
        super.notifyDataSetChanged();
        B(b());
    }

    @Override // android.widget.BaseAdapter
    public void notifyDataSetInvalidated() {
        super.notifyDataSetInvalidated();
        B(b());
    }

    @Override // android.view.View.OnClickListener
    public void onClick(View view) {
        Object tag = view.getTag();
        if (tag instanceof CharSequence) {
            this.f551l.R((CharSequence) tag);
        }
    }

    Drawable r(Uri uri) {
        int parseInt;
        String authority = uri.getAuthority();
        if (TextUtils.isEmpty(authority)) {
            throw new FileNotFoundException("No authority: " + uri);
        }
        try {
            Resources resourcesForApplication = this.f553n.getPackageManager().getResourcesForApplication(authority);
            List<String> pathSegments = uri.getPathSegments();
            if (pathSegments == null) {
                throw new FileNotFoundException(c3.d4(3) + uri);
            }
            int size = pathSegments.size();
            if (size == 1) {
                try {
                    parseInt = Integer.parseInt(pathSegments.get(0));
                } catch (NumberFormatException unused) {
                    throw new FileNotFoundException("Single path segment is not a resource ID: " + uri);
                }
            } else {
                if (size != 2) {
                    throw new FileNotFoundException("More than two path segments: " + uri);
                }
                parseInt = resourcesForApplication.getIdentifier(pathSegments.get(1), pathSegments.get(0), authority);
            }
            if (parseInt != 0) {
                return resourcesForApplication.getDrawable(parseInt);
            }
            throw new FileNotFoundException(c3.d4(319) + uri);
        } catch (PackageManager.NameNotFoundException unused2) {
            throw new FileNotFoundException("No package found for authority: " + uri);
        }
    }

    Cursor v(SearchableInfo searchableInfo, String str, int i4) {
        String suggestAuthority;
        String[] strArr = null;
        if (searchableInfo == null || (suggestAuthority = searchableInfo.getSuggestAuthority()) == null) {
            return null;
        }
        Uri.Builder fragment = new Uri.Builder().scheme("content").authority(suggestAuthority).query("").fragment("");
        String suggestPath = searchableInfo.getSuggestPath();
        if (suggestPath != null) {
            fragment.appendEncodedPath(suggestPath);
        }
        fragment.appendPath("search_suggest_query");
        String suggestSelection = searchableInfo.getSuggestSelection();
        if (suggestSelection != null) {
            strArr = new String[]{str};
        } else {
            fragment.appendPath(str);
        }
        String[] strArr2 = strArr;
        if (i4 > 0) {
            fragment.appendQueryParameter("limit", String.valueOf(i4));
        }
        return this.f553n.getContentResolver().query(fragment.build(), null, suggestSelection, strArr2, null);
    }

    public void x(int i4) {
        this.f557r = i4;
    }
}
