package androidx.activity;

import a1.b2.c3;
import android.app.Dialog;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.window.OnBackInvokedDispatcher;
import androidx.lifecycle.c0;
import androidx.lifecycle.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g extends Dialog implements androidx.lifecycle.k, l {

    /* renamed from: a, reason: collision with root package name */
    private androidx.lifecycle.l f68a;

    /* renamed from: b, reason: collision with root package name */
    private final OnBackPressedDispatcher f69b;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public g(Context context, int i4) {
        super(context, i4);
        b3.f.e(context, c3.d4(227));
        this.f69b = new OnBackPressedDispatcher(new Runnable() { // from class: androidx.activity.f
            @Override // java.lang.Runnable
            public final void run() {
                g.f(g.this);
            }
        });
    }

    private final androidx.lifecycle.l d() {
        androidx.lifecycle.l lVar = this.f68a;
        if (lVar != null) {
            return lVar;
        }
        androidx.lifecycle.l lVar2 = new androidx.lifecycle.l(this);
        this.f68a = lVar2;
        return lVar2;
    }

    private final void e() {
        Window window = getWindow();
        b3.f.b(window);
        c0.a(window.getDecorView(), this);
        Window window2 = getWindow();
        b3.f.b(window2);
        View decorView = window2.getDecorView();
        b3.f.d(decorView, "window!!.decorView");
        n.a(decorView, this);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void f(g gVar) {
        b3.f.e(gVar, c3.d4(275));
        super.onBackPressed();
    }

    @Override // android.app.Dialog
    public void addContentView(View view, ViewGroup.LayoutParams layoutParams) {
        b3.f.e(view, "view");
        e();
        super.addContentView(view, layoutParams);
    }

    @Override // androidx.activity.l
    public final OnBackPressedDispatcher b() {
        return this.f69b;
    }

    @Override // android.app.Dialog
    public void onBackPressed() {
        this.f69b.e();
    }

    @Override // android.app.Dialog
    protected void onCreate(Bundle bundle) {
        OnBackInvokedDispatcher onBackInvokedDispatcher;
        super.onCreate(bundle);
        if (Build.VERSION.SDK_INT >= 33) {
            OnBackPressedDispatcher onBackPressedDispatcher = this.f69b;
            onBackInvokedDispatcher = getOnBackInvokedDispatcher();
            onBackPressedDispatcher.f(onBackInvokedDispatcher);
        }
        d().h(g.b.ON_CREATE);
    }

    @Override // android.app.Dialog
    protected void onStart() {
        super.onStart();
        d().h(g.b.ON_RESUME);
    }

    @Override // android.app.Dialog
    protected void onStop() {
        d().h(g.b.ON_DESTROY);
        this.f68a = null;
        super.onStop();
    }

    @Override // androidx.lifecycle.k
    public final androidx.lifecycle.g q() {
        return d();
    }

    @Override // android.app.Dialog
    public void setContentView(int i4) {
        e();
        super.setContentView(i4);
    }

    @Override // android.app.Dialog
    public void setContentView(View view) {
        b3.f.e(view, c3.d4(314));
        e();
        super.setContentView(view);
    }

    @Override // android.app.Dialog
    public void setContentView(View view, ViewGroup.LayoutParams layoutParams) {
        b3.f.e(view, "view");
        e();
        super.setContentView(view, layoutParams);
    }
}
