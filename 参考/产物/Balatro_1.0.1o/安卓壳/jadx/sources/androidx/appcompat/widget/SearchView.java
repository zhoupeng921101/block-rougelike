package androidx.appcompat.widget;

import a1.b2.c3;
import android.app.PendingIntent;
import android.app.SearchableInfo;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;
import android.text.Editable;
import android.text.SpannableStringBuilder;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.text.style.ImageSpan;
import android.util.AttributeSet;
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.TouchDelegate;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.AutoCompleteTextView;
import android.widget.ImageView;
import android.widget.TextView;
import java.lang.reflect.Method;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SearchView extends y implements h.b {

    /* renamed from: n0, reason: collision with root package name */
    static final o f381n0;
    private Rect A;
    private int[] B;
    private int[] C;
    private final ImageView D;
    private final Drawable E;
    private final int F;
    private final int G;
    private final Intent H;
    private final Intent I;
    private final CharSequence J;
    View.OnFocusChangeListener K;
    private View.OnClickListener L;
    private boolean M;
    private boolean N;
    q.a O;
    private boolean P;
    private CharSequence Q;
    private boolean R;
    private boolean S;
    private int T;
    private boolean U;
    private CharSequence V;
    private CharSequence W;

    /* renamed from: a0, reason: collision with root package name */
    private boolean f382a0;

    /* renamed from: b0, reason: collision with root package name */
    private int f383b0;

    /* renamed from: c0, reason: collision with root package name */
    SearchableInfo f384c0;

    /* renamed from: d0, reason: collision with root package name */
    private Bundle f385d0;

    /* renamed from: e0, reason: collision with root package name */
    private final Runnable f386e0;

    /* renamed from: f0, reason: collision with root package name */
    private Runnable f387f0;

    /* renamed from: g0, reason: collision with root package name */
    private final WeakHashMap f388g0;

    /* renamed from: h0, reason: collision with root package name */
    private final View.OnClickListener f389h0;

    /* renamed from: i0, reason: collision with root package name */
    View.OnKeyListener f390i0;

    /* renamed from: j0, reason: collision with root package name */
    private final TextView.OnEditorActionListener f391j0;

    /* renamed from: k0, reason: collision with root package name */
    private final AdapterView.OnItemClickListener f392k0;

    /* renamed from: l0, reason: collision with root package name */
    private final AdapterView.OnItemSelectedListener f393l0;

    /* renamed from: m0, reason: collision with root package name */
    private TextWatcher f394m0;

    /* renamed from: p, reason: collision with root package name */
    final SearchAutoComplete f395p;

    /* renamed from: q, reason: collision with root package name */
    private final View f396q;

    /* renamed from: r, reason: collision with root package name */
    private final View f397r;

    /* renamed from: s, reason: collision with root package name */
    private final View f398s;

    /* renamed from: t, reason: collision with root package name */
    final ImageView f399t;

    /* renamed from: u, reason: collision with root package name */
    final ImageView f400u;

    /* renamed from: v, reason: collision with root package name */
    final ImageView f401v;

    /* renamed from: w, reason: collision with root package name */
    final ImageView f402w;

    /* renamed from: x, reason: collision with root package name */
    private final View f403x;

    /* renamed from: y, reason: collision with root package name */
    private q f404y;

    /* renamed from: z, reason: collision with root package name */
    private Rect f405z;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class SearchAutoComplete extends androidx.appcompat.widget.d {

        /* renamed from: e, reason: collision with root package name */
        private int f406e;

        /* renamed from: f, reason: collision with root package name */
        private SearchView f407f;

        /* renamed from: g, reason: collision with root package name */
        private boolean f408g;

        /* renamed from: h, reason: collision with root package name */
        final Runnable f409h;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Runnable {
            a() {
            }

            @Override // java.lang.Runnable
            public void run() {
                SearchAutoComplete.this.d();
            }
        }

        public SearchAutoComplete(Context context, AttributeSet attributeSet) {
            this(context, attributeSet, c.a.f1835g);
        }

        public SearchAutoComplete(Context context, AttributeSet attributeSet, int i4) {
            super(context, attributeSet, i4);
            this.f409h = new a();
            this.f406e = getThreshold();
        }

        private int getSearchViewTextMinWidthDp() {
            Configuration configuration = getResources().getConfiguration();
            int i4 = configuration.screenWidthDp;
            int i5 = configuration.screenHeightDp;
            if (i4 >= 960 && i5 >= 720 && configuration.orientation == 2) {
                return 256;
            }
            if (i4 < 600) {
                return (i4 < 640 || i5 < 480) ? 160 : 192;
            }
            return 192;
        }

        void b() {
            if (Build.VERSION.SDK_INT < 29) {
                SearchView.f381n0.c(this);
                return;
            }
            k.b(this, 1);
            if (enoughToFilter()) {
                showDropDown();
            }
        }

        boolean c() {
            return TextUtils.getTrimmedLength(getText()) == 0;
        }

        void d() {
            if (this.f408g) {
                ((InputMethodManager) getContext().getSystemService("input_method")).showSoftInput(this, 0);
                this.f408g = false;
            }
        }

        @Override // android.widget.AutoCompleteTextView
        public boolean enoughToFilter() {
            return this.f406e <= 0 || super.enoughToFilter();
        }

        @Override // androidx.appcompat.widget.d, android.widget.TextView, android.view.View
        public InputConnection onCreateInputConnection(EditorInfo editorInfo) {
            InputConnection onCreateInputConnection = super.onCreateInputConnection(editorInfo);
            if (this.f408g) {
                removeCallbacks(this.f409h);
                post(this.f409h);
            }
            return onCreateInputConnection;
        }

        @Override // android.view.View
        protected void onFinishInflate() {
            super.onFinishInflate();
            setMinWidth((int) TypedValue.applyDimension(1, getSearchViewTextMinWidthDp(), getResources().getDisplayMetrics()));
        }

        @Override // android.widget.AutoCompleteTextView, android.widget.TextView, android.view.View
        protected void onFocusChanged(boolean z3, int i4, Rect rect) {
            super.onFocusChanged(z3, i4, rect);
            this.f407f.W();
        }

        @Override // android.widget.AutoCompleteTextView, android.widget.TextView, android.view.View
        public boolean onKeyPreIme(int i4, KeyEvent keyEvent) {
            if (i4 == 4) {
                if (keyEvent.getAction() == 0 && keyEvent.getRepeatCount() == 0) {
                    KeyEvent.DispatcherState keyDispatcherState = getKeyDispatcherState();
                    if (keyDispatcherState != null) {
                        keyDispatcherState.startTracking(keyEvent, this);
                    }
                    return true;
                }
                if (keyEvent.getAction() == 1) {
                    KeyEvent.DispatcherState keyDispatcherState2 = getKeyDispatcherState();
                    if (keyDispatcherState2 != null) {
                        keyDispatcherState2.handleUpEvent(keyEvent);
                    }
                    if (keyEvent.isTracking() && !keyEvent.isCanceled()) {
                        this.f407f.clearFocus();
                        setImeVisibility(false);
                        return true;
                    }
                }
            }
            return super.onKeyPreIme(i4, keyEvent);
        }

        @Override // android.widget.AutoCompleteTextView, android.widget.TextView, android.view.View
        public void onWindowFocusChanged(boolean z3) {
            super.onWindowFocusChanged(z3);
            if (z3 && this.f407f.hasFocus() && getVisibility() == 0) {
                this.f408g = true;
                if (SearchView.J(getContext())) {
                    b();
                }
            }
        }

        @Override // android.widget.AutoCompleteTextView
        public void performCompletion() {
        }

        @Override // android.widget.AutoCompleteTextView
        protected void replaceText(CharSequence charSequence) {
        }

        void setImeVisibility(boolean z3) {
            InputMethodManager inputMethodManager = (InputMethodManager) getContext().getSystemService("input_method");
            if (!z3) {
                this.f408g = false;
                removeCallbacks(this.f409h);
                inputMethodManager.hideSoftInputFromWindow(getWindowToken(), 0);
            } else {
                if (!inputMethodManager.isActive(this)) {
                    this.f408g = true;
                    return;
                }
                this.f408g = false;
                removeCallbacks(this.f409h);
                inputMethodManager.showSoftInput(this, 0);
            }
        }

        void setSearchView(SearchView searchView) {
            this.f407f = searchView;
        }

        @Override // android.widget.AutoCompleteTextView
        public void setThreshold(int i4) {
            super.setThreshold(i4);
            this.f406e = i4;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements TextWatcher {
        a() {
        }

        @Override // android.text.TextWatcher
        public void afterTextChanged(Editable editable) {
        }

        @Override // android.text.TextWatcher
        public void beforeTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
        }

        @Override // android.text.TextWatcher
        public void onTextChanged(CharSequence charSequence, int i4, int i5, int i6) {
            SearchView.this.V(charSequence);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            SearchView.this.c0();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements Runnable {
        c() {
        }

        @Override // java.lang.Runnable
        public void run() {
            q.a aVar = SearchView.this.O;
            if (aVar instanceof g0) {
                aVar.a(null);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements View.OnFocusChangeListener {
        d() {
        }

        @Override // android.view.View.OnFocusChangeListener
        public void onFocusChange(View view, boolean z3) {
            SearchView searchView = SearchView.this;
            View.OnFocusChangeListener onFocusChangeListener = searchView.K;
            if (onFocusChangeListener != null) {
                onFocusChangeListener.onFocusChange(searchView, z3);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class e implements View.OnLayoutChangeListener {
        e() {
        }

        @Override // android.view.View.OnLayoutChangeListener
        public void onLayoutChange(View view, int i4, int i5, int i6, int i7, int i8, int i9, int i10, int i11) {
            SearchView.this.y();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class f implements View.OnClickListener {
        f() {
        }

        @Override // android.view.View.OnClickListener
        public void onClick(View view) {
            SearchView searchView = SearchView.this;
            if (view == searchView.f399t) {
                searchView.S();
                return;
            }
            if (view == searchView.f401v) {
                searchView.O();
                return;
            }
            if (view == searchView.f400u) {
                searchView.T();
            } else if (view == searchView.f402w) {
                searchView.X();
            } else if (view == searchView.f395p) {
                searchView.E();
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class g implements View.OnKeyListener {
        g() {
        }

        @Override // android.view.View.OnKeyListener
        public boolean onKey(View view, int i4, KeyEvent keyEvent) {
            SearchView searchView = SearchView.this;
            if (searchView.f384c0 == null) {
                return false;
            }
            if (searchView.f395p.isPopupShowing() && SearchView.this.f395p.getListSelection() != -1) {
                return SearchView.this.U(view, i4, keyEvent);
            }
            if (SearchView.this.f395p.c() || !keyEvent.hasNoModifiers() || keyEvent.getAction() != 1 || i4 != 66) {
                return false;
            }
            view.cancelLongPress();
            SearchView searchView2 = SearchView.this;
            searchView2.M(0, null, searchView2.f395p.getText().toString());
            return true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class h implements TextView.OnEditorActionListener {
        h() {
        }

        @Override // android.widget.TextView.OnEditorActionListener
        public boolean onEditorAction(TextView textView, int i4, KeyEvent keyEvent) {
            SearchView.this.T();
            return true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class i implements AdapterView.OnItemClickListener {
        i() {
        }

        @Override // android.widget.AdapterView.OnItemClickListener
        public void onItemClick(AdapterView adapterView, View view, int i4, long j4) {
            SearchView.this.P(i4, 0, null);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class j implements AdapterView.OnItemSelectedListener {
        j() {
        }

        @Override // android.widget.AdapterView.OnItemSelectedListener
        public void onItemSelected(AdapterView adapterView, View view, int i4, long j4) {
            SearchView.this.Q(i4);
        }

        @Override // android.widget.AdapterView.OnItemSelectedListener
        public void onNothingSelected(AdapterView adapterView) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class k {
        static void a(AutoCompleteTextView autoCompleteTextView) {
            autoCompleteTextView.refreshAutoCompleteResults();
        }

        static void b(SearchAutoComplete searchAutoComplete, int i4) {
            searchAutoComplete.setInputMethodMode(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface l {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface m {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface n {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class o {

        /* renamed from: a, reason: collision with root package name */
        private Method f421a;

        /* renamed from: b, reason: collision with root package name */
        private Method f422b;

        /* renamed from: c, reason: collision with root package name */
        private Method f423c;

        o() {
            this.f421a = null;
            this.f422b = null;
            this.f423c = null;
            d();
            try {
                Method declaredMethod = AutoCompleteTextView.class.getDeclaredMethod("doBeforeTextChanged", null);
                this.f421a = declaredMethod;
                declaredMethod.setAccessible(true);
            } catch (NoSuchMethodException unused) {
            }
            try {
                Method declaredMethod2 = AutoCompleteTextView.class.getDeclaredMethod("doAfterTextChanged", null);
                this.f422b = declaredMethod2;
                declaredMethod2.setAccessible(true);
            } catch (NoSuchMethodException unused2) {
            }
            try {
                Method method = AutoCompleteTextView.class.getMethod("ensureImeVisible", Boolean.TYPE);
                this.f423c = method;
                method.setAccessible(true);
            } catch (NoSuchMethodException unused3) {
            }
        }

        private static void d() {
            if (Build.VERSION.SDK_INT >= 29) {
                throw new UnsupportedClassVersionError("This function can only be used for API Level < 29.");
            }
        }

        void a(AutoCompleteTextView autoCompleteTextView) {
            d();
            Method method = this.f422b;
            if (method != null) {
                try {
                    method.invoke(autoCompleteTextView, null);
                } catch (Exception unused) {
                }
            }
        }

        void b(AutoCompleteTextView autoCompleteTextView) {
            d();
            Method method = this.f421a;
            if (method != null) {
                try {
                    method.invoke(autoCompleteTextView, null);
                } catch (Exception unused) {
                }
            }
        }

        void c(AutoCompleteTextView autoCompleteTextView) {
            d();
            Method method = this.f423c;
            if (method != null) {
                try {
                    method.invoke(autoCompleteTextView, Boolean.TRUE);
                } catch (Exception unused) {
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class p extends r.a {
        public static final Parcelable.Creator<p> CREATOR = new a();

        /* renamed from: g, reason: collision with root package name */
        boolean f424g;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Parcelable.ClassLoaderCreator {
            a() {
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: a, reason: merged with bridge method [inline-methods] */
            public p createFromParcel(Parcel parcel) {
                return new p(parcel, null);
            }

            @Override // android.os.Parcelable.ClassLoaderCreator
            /* renamed from: b, reason: merged with bridge method [inline-methods] */
            public p createFromParcel(Parcel parcel, ClassLoader classLoader) {
                return new p(parcel, classLoader);
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: c, reason: merged with bridge method [inline-methods] */
            public p[] newArray(int i4) {
                return new p[i4];
            }
        }

        public p(Parcel parcel, ClassLoader classLoader) {
            super(parcel, classLoader);
            this.f424g = ((Boolean) parcel.readValue(null)).booleanValue();
        }

        p(Parcelable parcelable) {
            super(parcelable);
        }

        public String toString() {
            return c3.d4(763) + Integer.toHexString(System.identityHashCode(this)) + " isIconified=" + this.f424g + c3.d4(500);
        }

        @Override // r.a, android.os.Parcelable
        public void writeToParcel(Parcel parcel, int i4) {
            super.writeToParcel(parcel, i4);
            parcel.writeValue(Boolean.valueOf(this.f424g));
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class q extends TouchDelegate {

        /* renamed from: a, reason: collision with root package name */
        private final View f425a;

        /* renamed from: b, reason: collision with root package name */
        private final Rect f426b;

        /* renamed from: c, reason: collision with root package name */
        private final Rect f427c;

        /* renamed from: d, reason: collision with root package name */
        private final Rect f428d;

        /* renamed from: e, reason: collision with root package name */
        private final int f429e;

        /* renamed from: f, reason: collision with root package name */
        private boolean f430f;

        public q(Rect rect, Rect rect2, View view) {
            super(rect, view);
            this.f429e = ViewConfiguration.get(view.getContext()).getScaledTouchSlop();
            this.f426b = new Rect();
            this.f428d = new Rect();
            this.f427c = new Rect();
            a(rect, rect2);
            this.f425a = view;
        }

        public void a(Rect rect, Rect rect2) {
            this.f426b.set(rect);
            this.f428d.set(rect);
            Rect rect3 = this.f428d;
            int i4 = this.f429e;
            rect3.inset(-i4, -i4);
            this.f427c.set(rect2);
        }

        @Override // android.view.TouchDelegate
        public boolean onTouchEvent(MotionEvent motionEvent) {
            boolean z3;
            boolean z4;
            int x3 = (int) motionEvent.getX();
            int y3 = (int) motionEvent.getY();
            int action = motionEvent.getAction();
            boolean z5 = true;
            if (action != 0) {
                if (action == 1 || action == 2) {
                    z4 = this.f430f;
                    if (z4 && !this.f428d.contains(x3, y3)) {
                        z5 = z4;
                        z3 = false;
                    }
                } else {
                    if (action == 3) {
                        z4 = this.f430f;
                        this.f430f = false;
                    }
                    z3 = true;
                    z5 = false;
                }
                z5 = z4;
                z3 = true;
            } else {
                if (this.f426b.contains(x3, y3)) {
                    this.f430f = true;
                    z3 = true;
                }
                z3 = true;
                z5 = false;
            }
            if (!z5) {
                return false;
            }
            if (!z3 || this.f427c.contains(x3, y3)) {
                Rect rect = this.f427c;
                motionEvent.setLocation(x3 - rect.left, y3 - rect.top);
            } else {
                motionEvent.setLocation(this.f425a.getWidth() / 2, this.f425a.getHeight() / 2);
            }
            return this.f425a.dispatchTouchEvent(motionEvent);
        }
    }

    static {
        f381n0 = Build.VERSION.SDK_INT < 29 ? new o() : null;
    }

    public SearchView(Context context) {
        this(context, null);
    }

    public SearchView(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, c.a.f1844p);
    }

    public SearchView(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f405z = new Rect();
        this.A = new Rect();
        this.B = new int[2];
        this.C = new int[2];
        this.f386e0 = new b();
        this.f387f0 = new c();
        this.f388g0 = new WeakHashMap();
        f fVar = new f();
        this.f389h0 = fVar;
        this.f390i0 = new g();
        h hVar = new h();
        this.f391j0 = hVar;
        i iVar = new i();
        this.f392k0 = iVar;
        j jVar = new j();
        this.f393l0 = jVar;
        this.f394m0 = new a();
        l0 s3 = l0.s(context, attributeSet, c.i.f2035w1, i4, 0);
        androidx.core.view.v.F(this, context, c.i.f2035w1, attributeSet, s3.o(), i4, 0);
        LayoutInflater.from(context).inflate(s3.l(c.i.G1, c.f.f1930l), (ViewGroup) this, true);
        SearchAutoComplete searchAutoComplete = (SearchAutoComplete) findViewById(c.e.f1912t);
        this.f395p = searchAutoComplete;
        searchAutoComplete.setSearchView(this);
        this.f396q = findViewById(c.e.f1908p);
        View findViewById = findViewById(c.e.f1911s);
        this.f397r = findViewById;
        View findViewById2 = findViewById(c.e.f1918z);
        this.f398s = findViewById2;
        ImageView imageView = (ImageView) findViewById(c.e.f1906n);
        this.f399t = imageView;
        ImageView imageView2 = (ImageView) findViewById(c.e.f1909q);
        this.f400u = imageView2;
        ImageView imageView3 = (ImageView) findViewById(c.e.f1907o);
        this.f401v = imageView3;
        ImageView imageView4 = (ImageView) findViewById(c.e.f1913u);
        this.f402w = imageView4;
        ImageView imageView5 = (ImageView) findViewById(c.e.f1910r);
        this.D = imageView5;
        androidx.core.view.v.J(findViewById, s3.f(c.i.H1));
        androidx.core.view.v.J(findViewById2, s3.f(c.i.L1));
        imageView.setImageDrawable(s3.f(c.i.K1));
        imageView2.setImageDrawable(s3.f(c.i.E1));
        imageView3.setImageDrawable(s3.f(c.i.B1));
        imageView4.setImageDrawable(s3.f(c.i.N1));
        imageView5.setImageDrawable(s3.f(c.i.K1));
        this.E = s3.f(c.i.J1);
        p0.a(imageView, getResources().getString(c.g.f1943l));
        this.F = s3.l(c.i.M1, c.f.f1929k);
        this.G = s3.l(c.i.C1, 0);
        imageView.setOnClickListener(fVar);
        imageView3.setOnClickListener(fVar);
        imageView2.setOnClickListener(fVar);
        imageView4.setOnClickListener(fVar);
        searchAutoComplete.setOnClickListener(fVar);
        searchAutoComplete.addTextChangedListener(this.f394m0);
        searchAutoComplete.setOnEditorActionListener(hVar);
        searchAutoComplete.setOnItemClickListener(iVar);
        searchAutoComplete.setOnItemSelectedListener(jVar);
        searchAutoComplete.setOnKeyListener(this.f390i0);
        searchAutoComplete.setOnFocusChangeListener(new d());
        setIconifiedByDefault(s3.a(c.i.F1, true));
        int e4 = s3.e(c.i.f2043y1, -1);
        if (e4 != -1) {
            setMaxWidth(e4);
        }
        this.J = s3.n(c.i.D1);
        this.Q = s3.n(c.i.I1);
        int i5 = s3.i(c.i.A1, -1);
        if (i5 != -1) {
            setImeOptions(i5);
        }
        int i6 = s3.i(c.i.f2047z1, -1);
        if (i6 != -1) {
            setInputType(i6);
        }
        setFocusable(s3.a(c.i.f2039x1, true));
        s3.t();
        Intent intent = new Intent("android.speech.action.WEB_SEARCH");
        this.H = intent;
        intent.addFlags(268435456);
        intent.putExtra("android.speech.extra.LANGUAGE_MODEL", c3.d4(814));
        Intent intent2 = new Intent(c3.d4(863));
        this.I = intent2;
        intent2.addFlags(268435456);
        View findViewById3 = findViewById(searchAutoComplete.getDropDownAnchor());
        this.f403x = findViewById3;
        if (findViewById3 != null) {
            findViewById3.addOnLayoutChangeListener(new e());
        }
        h0(this.M);
        d0();
    }

    private Intent A(Cursor cursor, int i4, String str) {
        int i5;
        String o3;
        try {
            String o4 = g0.o(cursor, "suggest_intent_action");
            if (o4 == null) {
                o4 = this.f384c0.getSuggestIntentAction();
            }
            if (o4 == null) {
                o4 = "android.intent.action.SEARCH";
            }
            String str2 = o4;
            String o5 = g0.o(cursor, "suggest_intent_data");
            if (o5 == null) {
                o5 = this.f384c0.getSuggestIntentData();
            }
            if (o5 != null && (o3 = g0.o(cursor, "suggest_intent_data_id")) != null) {
                o5 = o5 + "/" + Uri.encode(o3);
            }
            return z(str2, o5 == null ? null : Uri.parse(o5), g0.o(cursor, "suggest_intent_extra_data"), g0.o(cursor, "suggest_intent_query"), i4, str);
        } catch (RuntimeException e4) {
            try {
                i5 = cursor.getPosition();
            } catch (RuntimeException unused) {
                i5 = -1;
            }
            Log.w("SearchView", "Search suggestions cursor at row " + i5 + " returned exception.", e4);
            return null;
        }
    }

    private Intent B(Intent intent, SearchableInfo searchableInfo) {
        ComponentName searchActivity = searchableInfo.getSearchActivity();
        Intent intent2 = new Intent("android.intent.action.SEARCH");
        intent2.setComponent(searchActivity);
        PendingIntent activity = PendingIntent.getActivity(getContext(), 0, intent2, 1107296256);
        Bundle bundle = new Bundle();
        Bundle bundle2 = this.f385d0;
        if (bundle2 != null) {
            bundle.putParcelable(c3.d4(663), bundle2);
        }
        Intent intent3 = new Intent(intent);
        Resources resources = getResources();
        String string = searchableInfo.getVoiceLanguageModeId() != 0 ? resources.getString(searchableInfo.getVoiceLanguageModeId()) : "free_form";
        String string2 = searchableInfo.getVoicePromptTextId() != 0 ? resources.getString(searchableInfo.getVoicePromptTextId()) : null;
        String string3 = searchableInfo.getVoiceLanguageId() != 0 ? resources.getString(searchableInfo.getVoiceLanguageId()) : null;
        int voiceMaxResults = searchableInfo.getVoiceMaxResults() != 0 ? searchableInfo.getVoiceMaxResults() : 1;
        intent3.putExtra("android.speech.extra.LANGUAGE_MODEL", string);
        intent3.putExtra("android.speech.extra.PROMPT", string2);
        intent3.putExtra("android.speech.extra.LANGUAGE", string3);
        intent3.putExtra(c3.d4(864), voiceMaxResults);
        intent3.putExtra("calling_package", searchActivity != null ? searchActivity.flattenToShortString() : null);
        intent3.putExtra("android.speech.extra.RESULTS_PENDINGINTENT", activity);
        intent3.putExtra("android.speech.extra.RESULTS_PENDINGINTENT_BUNDLE", bundle);
        return intent3;
    }

    private Intent C(Intent intent, SearchableInfo searchableInfo) {
        Intent intent2 = new Intent(intent);
        ComponentName searchActivity = searchableInfo.getSearchActivity();
        intent2.putExtra("calling_package", searchActivity == null ? null : searchActivity.flattenToShortString());
        return intent2;
    }

    private void D() {
        this.f395p.dismissDropDown();
    }

    private void F(View view, Rect rect) {
        view.getLocationInWindow(this.B);
        getLocationInWindow(this.C);
        int[] iArr = this.B;
        int i4 = iArr[1];
        int[] iArr2 = this.C;
        int i5 = i4 - iArr2[1];
        int i6 = iArr[0] - iArr2[0];
        rect.set(i6, i5, view.getWidth() + i6, view.getHeight() + i5);
    }

    private CharSequence G(CharSequence charSequence) {
        if (!this.M || this.E == null) {
            return charSequence;
        }
        int textSize = (int) (this.f395p.getTextSize() * 1.25d);
        this.E.setBounds(0, 0, textSize, textSize);
        SpannableStringBuilder spannableStringBuilder = new SpannableStringBuilder("   ");
        spannableStringBuilder.setSpan(new ImageSpan(this.E), 1, 2, 33);
        spannableStringBuilder.append(charSequence);
        return spannableStringBuilder;
    }

    private boolean H() {
        SearchableInfo searchableInfo = this.f384c0;
        if (searchableInfo != null && searchableInfo.getVoiceSearchEnabled()) {
            Intent intent = this.f384c0.getVoiceSearchLaunchWebSearch() ? this.H : this.f384c0.getVoiceSearchLaunchRecognizer() ? this.I : null;
            if (intent != null && getContext().getPackageManager().resolveActivity(intent, 65536) != null) {
                return true;
            }
        }
        return false;
    }

    static boolean J(Context context) {
        return context.getResources().getConfiguration().orientation == 2;
    }

    private boolean K() {
        return (this.P || this.U) && !I();
    }

    private void L(Intent intent) {
        if (intent == null) {
            return;
        }
        try {
            getContext().startActivity(intent);
        } catch (RuntimeException e4) {
            Log.e("SearchView", "Failed launch activity: " + intent, e4);
        }
    }

    private boolean N(int i4, int i5, String str) {
        Cursor b4 = this.O.b();
        if (b4 == null || !b4.moveToPosition(i4)) {
            return false;
        }
        L(A(b4, i5, str));
        return true;
    }

    private void Y() {
        post(this.f386e0);
    }

    private void Z(int i4) {
        Editable text = this.f395p.getText();
        Cursor b4 = this.O.b();
        if (b4 == null) {
            return;
        }
        if (!b4.moveToPosition(i4)) {
            setQuery(text);
            return;
        }
        CharSequence c4 = this.O.c(b4);
        if (c4 != null) {
            setQuery(c4);
        } else {
            setQuery(text);
        }
    }

    private void b0() {
        boolean isEmpty = TextUtils.isEmpty(this.f395p.getText());
        this.f401v.setVisibility(!isEmpty || (this.M && !this.f382a0) ? 0 : 8);
        Drawable drawable = this.f401v.getDrawable();
        if (drawable != null) {
            drawable.setState(!isEmpty ? ViewGroup.ENABLED_STATE_SET : ViewGroup.EMPTY_STATE_SET);
        }
    }

    private void d0() {
        CharSequence queryHint = getQueryHint();
        SearchAutoComplete searchAutoComplete = this.f395p;
        if (queryHint == null) {
            queryHint = "";
        }
        searchAutoComplete.setHint(G(queryHint));
    }

    private void e0() {
        this.f395p.setThreshold(this.f384c0.getSuggestThreshold());
        this.f395p.setImeOptions(this.f384c0.getImeOptions());
        int inputType = this.f384c0.getInputType();
        if ((inputType & 15) == 1) {
            inputType &= -65537;
            if (this.f384c0.getSuggestAuthority() != null) {
                inputType |= 589824;
            }
        }
        this.f395p.setInputType(inputType);
        q.a aVar = this.O;
        if (aVar != null) {
            aVar.a(null);
        }
        if (this.f384c0.getSuggestAuthority() != null) {
            g0 g0Var = new g0(getContext(), this, this.f384c0, this.f388g0);
            this.O = g0Var;
            this.f395p.setAdapter(g0Var);
            ((g0) this.O).x(this.R ? 2 : 1);
        }
    }

    private void f0() {
        this.f398s.setVisibility((K() && (this.f400u.getVisibility() == 0 || this.f402w.getVisibility() == 0)) ? 0 : 8);
    }

    private void g0(boolean z3) {
        this.f400u.setVisibility((this.P && K() && hasFocus() && (z3 || !this.U)) ? 0 : 8);
    }

    private int getPreferredHeight() {
        return getContext().getResources().getDimensionPixelSize(c.c.f1858e);
    }

    private int getPreferredWidth() {
        return getContext().getResources().getDimensionPixelSize(c.c.f1859f);
    }

    private void h0(boolean z3) {
        this.N = z3;
        int i4 = 8;
        int i5 = z3 ? 0 : 8;
        boolean isEmpty = TextUtils.isEmpty(this.f395p.getText());
        this.f399t.setVisibility(i5);
        g0(!isEmpty);
        this.f396q.setVisibility(z3 ? 8 : 0);
        if (this.D.getDrawable() != null && !this.M) {
            i4 = 0;
        }
        this.D.setVisibility(i4);
        b0();
        i0(isEmpty);
        f0();
    }

    private void i0(boolean z3) {
        int i4 = 8;
        if (this.U && !I() && z3) {
            this.f400u.setVisibility(8);
            i4 = 0;
        }
        this.f402w.setVisibility(i4);
    }

    private void setQuery(CharSequence charSequence) {
        this.f395p.setText(charSequence);
        this.f395p.setSelection(TextUtils.isEmpty(charSequence) ? 0 : charSequence.length());
    }

    private Intent z(String str, Uri uri, String str2, String str3, int i4, String str4) {
        Intent intent = new Intent(str);
        intent.addFlags(268435456);
        if (uri != null) {
            intent.setData(uri);
        }
        intent.putExtra("user_query", this.W);
        if (str3 != null) {
            intent.putExtra("query", str3);
        }
        if (str2 != null) {
            intent.putExtra("intent_extra_data_key", str2);
        }
        Bundle bundle = this.f385d0;
        if (bundle != null) {
            intent.putExtra("app_data", bundle);
        }
        if (i4 != 0) {
            intent.putExtra("action_key", i4);
            intent.putExtra("action_msg", str4);
        }
        intent.setComponent(this.f384c0.getSearchActivity());
        return intent;
    }

    void E() {
        if (Build.VERSION.SDK_INT >= 29) {
            k.a(this.f395p);
            return;
        }
        o oVar = f381n0;
        oVar.b(this.f395p);
        oVar.a(this.f395p);
    }

    public boolean I() {
        return this.N;
    }

    void M(int i4, String str, String str2) {
        getContext().startActivity(z(c3.d4(910), null, null, str2, i4, str));
    }

    void O() {
        if (!TextUtils.isEmpty(this.f395p.getText())) {
            this.f395p.setText("");
            this.f395p.requestFocus();
            this.f395p.setImeVisibility(true);
        } else if (this.M) {
            clearFocus();
            h0(true);
        }
    }

    boolean P(int i4, int i5, String str) {
        N(i4, 0, null);
        this.f395p.setImeVisibility(false);
        D();
        return true;
    }

    boolean Q(int i4) {
        Z(i4);
        return true;
    }

    protected void R(CharSequence charSequence) {
        setQuery(charSequence);
    }

    void S() {
        h0(false);
        this.f395p.requestFocus();
        this.f395p.setImeVisibility(true);
        View.OnClickListener onClickListener = this.L;
        if (onClickListener != null) {
            onClickListener.onClick(this);
        }
    }

    void T() {
        Editable text = this.f395p.getText();
        if (text == null || TextUtils.getTrimmedLength(text) <= 0) {
            return;
        }
        if (this.f384c0 != null) {
            M(0, null, text.toString());
        }
        this.f395p.setImeVisibility(false);
        D();
    }

    boolean U(View view, int i4, KeyEvent keyEvent) {
        if (this.f384c0 != null && this.O != null && keyEvent.getAction() == 0 && keyEvent.hasNoModifiers()) {
            if (i4 == 66 || i4 == 84 || i4 == 61) {
                return P(this.f395p.getListSelection(), 0, null);
            }
            if (i4 == 21 || i4 == 22) {
                this.f395p.setSelection(i4 == 21 ? 0 : this.f395p.length());
                this.f395p.setListSelection(0);
                this.f395p.clearListSelection();
                this.f395p.b();
                return true;
            }
            if (i4 == 19) {
                this.f395p.getListSelection();
                return false;
            }
        }
        return false;
    }

    void V(CharSequence charSequence) {
        Editable text = this.f395p.getText();
        this.W = text;
        boolean isEmpty = TextUtils.isEmpty(text);
        g0(!isEmpty);
        i0(isEmpty);
        b0();
        f0();
        this.V = charSequence.toString();
    }

    void W() {
        h0(I());
        Y();
        if (this.f395p.hasFocus()) {
            E();
        }
    }

    void X() {
        SearchableInfo searchableInfo = this.f384c0;
        if (searchableInfo == null) {
            return;
        }
        try {
            if (searchableInfo.getVoiceSearchLaunchWebSearch()) {
                getContext().startActivity(C(this.H, searchableInfo));
            } else if (searchableInfo.getVoiceSearchLaunchRecognizer()) {
                getContext().startActivity(B(this.I, searchableInfo));
            }
        } catch (ActivityNotFoundException unused) {
            Log.w("SearchView", "Could not find voice search activity");
        }
    }

    public void a0(CharSequence charSequence, boolean z3) {
        this.f395p.setText(charSequence);
        if (charSequence != null) {
            SearchAutoComplete searchAutoComplete = this.f395p;
            searchAutoComplete.setSelection(searchAutoComplete.length());
            this.W = charSequence;
        }
        if (!z3 || TextUtils.isEmpty(charSequence)) {
            return;
        }
        T();
    }

    @Override // h.b
    public void b() {
        if (this.f382a0) {
            return;
        }
        this.f382a0 = true;
        int imeOptions = this.f395p.getImeOptions();
        this.f383b0 = imeOptions;
        this.f395p.setImeOptions(imeOptions | 33554432);
        this.f395p.setText(c3.d4(865));
        setIconified(false);
    }

    @Override // h.b
    public void c() {
        a0("", false);
        clearFocus();
        h0(true);
        this.f395p.setImeOptions(this.f383b0);
        this.f382a0 = false;
    }

    void c0() {
        int[] iArr = this.f395p.hasFocus() ? ViewGroup.FOCUSED_STATE_SET : ViewGroup.EMPTY_STATE_SET;
        Drawable background = this.f397r.getBackground();
        if (background != null) {
            background.setState(iArr);
        }
        Drawable background2 = this.f398s.getBackground();
        if (background2 != null) {
            background2.setState(iArr);
        }
        invalidate();
    }

    @Override // android.view.ViewGroup, android.view.View
    public void clearFocus() {
        this.S = true;
        super.clearFocus();
        this.f395p.clearFocus();
        this.f395p.setImeVisibility(false);
        this.S = false;
    }

    public int getImeOptions() {
        return this.f395p.getImeOptions();
    }

    public int getInputType() {
        return this.f395p.getInputType();
    }

    public int getMaxWidth() {
        return this.T;
    }

    public CharSequence getQuery() {
        return this.f395p.getText();
    }

    public CharSequence getQueryHint() {
        CharSequence charSequence = this.Q;
        if (charSequence != null) {
            return charSequence;
        }
        SearchableInfo searchableInfo = this.f384c0;
        return (searchableInfo == null || searchableInfo.getHintId() == 0) ? this.J : getContext().getText(this.f384c0.getHintId());
    }

    int getSuggestionCommitIconResId() {
        return this.G;
    }

    int getSuggestionRowLayout() {
        return this.F;
    }

    public q.a getSuggestionsAdapter() {
        return this.O;
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onDetachedFromWindow() {
        removeCallbacks(this.f386e0);
        post(this.f387f0);
        super.onDetachedFromWindow();
    }

    @Override // androidx.appcompat.widget.y, android.view.ViewGroup, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        super.onLayout(z3, i4, i5, i6, i7);
        if (z3) {
            F(this.f395p, this.f405z);
            Rect rect = this.A;
            Rect rect2 = this.f405z;
            rect.set(rect2.left, 0, rect2.right, i7 - i5);
            q qVar = this.f404y;
            if (qVar != null) {
                qVar.a(this.A, this.f405z);
                return;
            }
            q qVar2 = new q(this.A, this.f405z, this.f395p);
            this.f404y = qVar2;
            setTouchDelegate(qVar2);
        }
    }

    @Override // androidx.appcompat.widget.y, android.view.View
    protected void onMeasure(int i4, int i5) {
        int i6;
        if (I()) {
            super.onMeasure(i4, i5);
            return;
        }
        int mode = View.MeasureSpec.getMode(i4);
        int size = View.MeasureSpec.getSize(i4);
        if (mode == Integer.MIN_VALUE) {
            int i7 = this.T;
            size = i7 > 0 ? Math.min(i7, size) : Math.min(getPreferredWidth(), size);
        } else if (mode == 0) {
            size = this.T;
            if (size <= 0) {
                size = getPreferredWidth();
            }
        } else if (mode == 1073741824 && (i6 = this.T) > 0) {
            size = Math.min(i6, size);
        }
        int mode2 = View.MeasureSpec.getMode(i5);
        int size2 = View.MeasureSpec.getSize(i5);
        if (mode2 == Integer.MIN_VALUE) {
            size2 = Math.min(getPreferredHeight(), size2);
        } else if (mode2 == 0) {
            size2 = getPreferredHeight();
        }
        super.onMeasure(View.MeasureSpec.makeMeasureSpec(size, 1073741824), View.MeasureSpec.makeMeasureSpec(size2, 1073741824));
    }

    @Override // android.view.View
    protected void onRestoreInstanceState(Parcelable parcelable) {
        if (!(parcelable instanceof p)) {
            super.onRestoreInstanceState(parcelable);
            return;
        }
        p pVar = (p) parcelable;
        super.onRestoreInstanceState(pVar.o());
        h0(pVar.f424g);
        requestLayout();
    }

    @Override // android.view.View
    protected Parcelable onSaveInstanceState() {
        p pVar = new p(super.onSaveInstanceState());
        pVar.f424g = I();
        return pVar;
    }

    @Override // android.view.View
    public void onWindowFocusChanged(boolean z3) {
        super.onWindowFocusChanged(z3);
        Y();
    }

    @Override // android.view.ViewGroup, android.view.View
    public boolean requestFocus(int i4, Rect rect) {
        if (this.S || !isFocusable()) {
            return false;
        }
        if (I()) {
            return super.requestFocus(i4, rect);
        }
        boolean requestFocus = this.f395p.requestFocus(i4, rect);
        if (requestFocus) {
            h0(false);
        }
        return requestFocus;
    }

    public void setAppSearchData(Bundle bundle) {
        this.f385d0 = bundle;
    }

    public void setIconified(boolean z3) {
        if (z3) {
            O();
        } else {
            S();
        }
    }

    public void setIconifiedByDefault(boolean z3) {
        if (this.M == z3) {
            return;
        }
        this.M = z3;
        h0(z3);
        d0();
    }

    public void setImeOptions(int i4) {
        this.f395p.setImeOptions(i4);
    }

    public void setInputType(int i4) {
        this.f395p.setInputType(i4);
    }

    public void setMaxWidth(int i4) {
        this.T = i4;
        requestLayout();
    }

    public void setOnCloseListener(l lVar) {
    }

    public void setOnQueryTextFocusChangeListener(View.OnFocusChangeListener onFocusChangeListener) {
        this.K = onFocusChangeListener;
    }

    public void setOnQueryTextListener(m mVar) {
    }

    public void setOnSearchClickListener(View.OnClickListener onClickListener) {
        this.L = onClickListener;
    }

    public void setOnSuggestionListener(n nVar) {
    }

    public void setQueryHint(CharSequence charSequence) {
        this.Q = charSequence;
        d0();
    }

    public void setQueryRefinementEnabled(boolean z3) {
        this.R = z3;
        q.a aVar = this.O;
        if (aVar instanceof g0) {
            ((g0) aVar).x(z3 ? 2 : 1);
        }
    }

    public void setSearchableInfo(SearchableInfo searchableInfo) {
        this.f384c0 = searchableInfo;
        if (searchableInfo != null) {
            e0();
            d0();
        }
        boolean H = H();
        this.U = H;
        if (H) {
            this.f395p.setPrivateImeOptions("nm");
        }
        h0(I());
    }

    public void setSubmitButtonEnabled(boolean z3) {
        this.P = z3;
        h0(I());
    }

    public void setSuggestionsAdapter(q.a aVar) {
        this.O = aVar;
        this.f395p.setAdapter(aVar);
    }

    void y() {
        if (this.f403x.getWidth() > 1) {
            Resources resources = getContext().getResources();
            int paddingLeft = this.f397r.getPaddingLeft();
            Rect rect = new Rect();
            boolean a4 = v0.a(this);
            int dimensionPixelSize = this.M ? resources.getDimensionPixelSize(c.c.f1856c) + resources.getDimensionPixelSize(c.c.f1857d) : 0;
            this.f395p.getDropDownBackground().getPadding(rect);
            this.f395p.setDropDownHorizontalOffset(a4 ? -rect.left : paddingLeft - (rect.left + dimensionPixelSize));
            this.f395p.setDropDownWidth((((this.f403x.getWidth() + rect.left) + rect.right) + dimensionPixelSize) - paddingLeft);
        }
    }
}
