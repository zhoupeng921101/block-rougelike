package androidx.fragment.app;

import android.R;
import android.animation.Animator;
import android.animation.AnimatorInflater;
import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.AnimationUtils;
import android.view.animation.Transformation;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class k {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {

        /* renamed from: a, reason: collision with root package name */
        public final Animation f1510a;

        /* renamed from: b, reason: collision with root package name */
        public final Animator f1511b;

        a(Animator animator) {
            this.f1510a = null;
            this.f1511b = animator;
            if (animator == null) {
                throw new IllegalStateException("Animator cannot be null");
            }
        }

        a(Animation animation) {
            this.f1510a = animation;
            this.f1511b = null;
            if (animation == null) {
                throw new IllegalStateException("Animation cannot be null");
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b extends AnimationSet implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        private final ViewGroup f1512e;

        /* renamed from: f, reason: collision with root package name */
        private final View f1513f;

        /* renamed from: g, reason: collision with root package name */
        private boolean f1514g;

        /* renamed from: h, reason: collision with root package name */
        private boolean f1515h;

        /* renamed from: i, reason: collision with root package name */
        private boolean f1516i;

        b(Animation animation, ViewGroup viewGroup, View view) {
            super(false);
            this.f1516i = true;
            this.f1512e = viewGroup;
            this.f1513f = view;
            addAnimation(animation);
            viewGroup.post(this);
        }

        @Override // android.view.animation.AnimationSet, android.view.animation.Animation
        public boolean getTransformation(long j4, Transformation transformation) {
            this.f1516i = true;
            if (this.f1514g) {
                return !this.f1515h;
            }
            if (!super.getTransformation(j4, transformation)) {
                this.f1514g = true;
                androidx.core.view.t.a(this.f1512e, this);
            }
            return true;
        }

        @Override // android.view.animation.Animation
        public boolean getTransformation(long j4, Transformation transformation, float f4) {
            this.f1516i = true;
            if (this.f1514g) {
                return !this.f1515h;
            }
            if (!super.getTransformation(j4, transformation, f4)) {
                this.f1514g = true;
                androidx.core.view.t.a(this.f1512e, this);
            }
            return true;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (this.f1514g || !this.f1516i) {
                this.f1512e.endViewTransition(this.f1513f);
                this.f1515h = true;
            } else {
                this.f1516i = false;
                this.f1512e.post(this);
            }
        }
    }

    private static int a(Fragment fragment, boolean z3, boolean z4) {
        return z4 ? z3 ? fragment.I() : fragment.J() : z3 ? fragment.u() : fragment.x();
    }

    static a b(Context context, Fragment fragment, boolean z3, boolean z4) {
        int E = fragment.E();
        int a4 = a(fragment, z3, z4);
        fragment.s1(0, 0, 0, 0);
        ViewGroup viewGroup = fragment.H;
        if (viewGroup != null && viewGroup.getTag(u.b.f5009c) != null) {
            fragment.H.setTag(u.b.f5009c, null);
        }
        ViewGroup viewGroup2 = fragment.H;
        if (viewGroup2 != null && viewGroup2.getLayoutTransition() != null) {
            return null;
        }
        Animation n02 = fragment.n0(E, z3, a4);
        if (n02 != null) {
            return new a(n02);
        }
        Animator o02 = fragment.o0(E, z3, a4);
        if (o02 != null) {
            return new a(o02);
        }
        if (a4 == 0 && E != 0) {
            a4 = d(context, E, z3);
        }
        if (a4 != 0) {
            boolean equals = "anim".equals(context.getResources().getResourceTypeName(a4));
            if (equals) {
                try {
                    Animation loadAnimation = AnimationUtils.loadAnimation(context, a4);
                    if (loadAnimation != null) {
                        return new a(loadAnimation);
                    }
                } catch (Resources.NotFoundException e4) {
                    throw e4;
                } catch (RuntimeException unused) {
                }
            }
            try {
                Animator loadAnimator = AnimatorInflater.loadAnimator(context, a4);
                if (loadAnimator != null) {
                    return new a(loadAnimator);
                }
            } catch (RuntimeException e5) {
                if (equals) {
                    throw e5;
                }
                Animation loadAnimation2 = AnimationUtils.loadAnimation(context, a4);
                if (loadAnimation2 != null) {
                    return new a(loadAnimation2);
                }
            }
        }
        return null;
    }

    private static int c(Context context, int i4) {
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(R.style.Animation.Activity, new int[]{i4});
        int resourceId = obtainStyledAttributes.getResourceId(0, -1);
        obtainStyledAttributes.recycle();
        return resourceId;
    }

    private static int d(Context context, int i4, boolean z3) {
        if (i4 == 4097) {
            return z3 ? u.a.f5005e : u.a.f5006f;
        }
        if (i4 == 8194) {
            return z3 ? u.a.f5001a : u.a.f5002b;
        }
        if (i4 == 8197) {
            return z3 ? c(context, R.attr.activityCloseEnterAnimation) : c(context, R.attr.activityCloseExitAnimation);
        }
        if (i4 == 4099) {
            return z3 ? u.a.f5003c : u.a.f5004d;
        }
        if (i4 != 4100) {
            return -1;
        }
        return z3 ? c(context, R.attr.activityOpenEnterAnimation) : c(context, R.attr.activityOpenExitAnimation);
    }
}
