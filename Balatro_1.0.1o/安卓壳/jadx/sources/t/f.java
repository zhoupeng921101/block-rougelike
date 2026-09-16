package t;

import a1.b2.c3;
import android.text.InputFilter;
import android.text.method.PasswordTransformationMethod;
import android.text.method.TransformationMethod;
import android.util.SparseArray;
import android.widget.TextView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f {

    /* renamed from: a, reason: collision with root package name */
    private final b f4976a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a extends b {

        /* renamed from: a, reason: collision with root package name */
        private final TextView f4977a;

        /* renamed from: b, reason: collision with root package name */
        private final d f4978b;

        /* renamed from: c, reason: collision with root package name */
        private boolean f4979c = true;

        a(TextView textView) {
            this.f4977a = textView;
            this.f4978b = new d(textView);
        }

        private InputFilter[] d(InputFilter[] inputFilterArr) {
            int length = inputFilterArr.length;
            for (InputFilter inputFilter : inputFilterArr) {
                if (inputFilter == this.f4978b) {
                    return inputFilterArr;
                }
            }
            InputFilter[] inputFilterArr2 = new InputFilter[inputFilterArr.length + 1];
            System.arraycopy(inputFilterArr, 0, inputFilterArr2, 0, length);
            inputFilterArr2[length] = this.f4978b;
            return inputFilterArr2;
        }

        private SparseArray e(InputFilter[] inputFilterArr) {
            SparseArray sparseArray = new SparseArray(1);
            for (int i4 = 0; i4 < inputFilterArr.length; i4++) {
                InputFilter inputFilter = inputFilterArr[i4];
                if (inputFilter instanceof d) {
                    sparseArray.put(i4, inputFilter);
                }
            }
            return sparseArray;
        }

        private InputFilter[] f(InputFilter[] inputFilterArr) {
            SparseArray e4 = e(inputFilterArr);
            if (e4.size() == 0) {
                return inputFilterArr;
            }
            int length = inputFilterArr.length;
            InputFilter[] inputFilterArr2 = new InputFilter[inputFilterArr.length - e4.size()];
            int i4 = 0;
            for (int i5 = 0; i5 < length; i5++) {
                if (e4.indexOfKey(i5) < 0) {
                    inputFilterArr2[i4] = inputFilterArr[i5];
                    i4++;
                }
            }
            return inputFilterArr2;
        }

        private TransformationMethod h(TransformationMethod transformationMethod) {
            return transformationMethod instanceof h ? ((h) transformationMethod).a() : transformationMethod;
        }

        private void i() {
            this.f4977a.setFilters(a(this.f4977a.getFilters()));
        }

        private TransformationMethod k(TransformationMethod transformationMethod) {
            return ((transformationMethod instanceof h) || (transformationMethod instanceof PasswordTransformationMethod)) ? transformationMethod : new h(transformationMethod);
        }

        @Override // t.f.b
        InputFilter[] a(InputFilter[] inputFilterArr) {
            return !this.f4979c ? f(inputFilterArr) : d(inputFilterArr);
        }

        @Override // t.f.b
        void b(boolean z3) {
            if (z3) {
                j();
            }
        }

        @Override // t.f.b
        void c(boolean z3) {
            this.f4979c = z3;
            j();
            i();
        }

        void g(boolean z3) {
            this.f4979c = z3;
        }

        void j() {
            this.f4977a.setTransformationMethod(l(this.f4977a.getTransformationMethod()));
        }

        TransformationMethod l(TransformationMethod transformationMethod) {
            return this.f4979c ? k(transformationMethod) : h(transformationMethod);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        b() {
        }

        abstract InputFilter[] a(InputFilter[] inputFilterArr);

        abstract void b(boolean z3);

        abstract void c(boolean z3);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class c extends b {

        /* renamed from: a, reason: collision with root package name */
        private final a f4980a;

        c(TextView textView) {
            this.f4980a = new a(textView);
        }

        private boolean d() {
            return !androidx.emoji2.text.e.h();
        }

        @Override // t.f.b
        InputFilter[] a(InputFilter[] inputFilterArr) {
            return d() ? inputFilterArr : this.f4980a.a(inputFilterArr);
        }

        @Override // t.f.b
        void b(boolean z3) {
            if (d()) {
                return;
            }
            this.f4980a.b(z3);
        }

        @Override // t.f.b
        void c(boolean z3) {
            if (d()) {
                this.f4980a.g(z3);
            } else {
                this.f4980a.c(z3);
            }
        }
    }

    public f(TextView textView, boolean z3) {
        androidx.core.util.c.e(textView, c3.d4(180));
        if (z3) {
            this.f4976a = new a(textView);
        } else {
            this.f4976a = new c(textView);
        }
    }

    public InputFilter[] a(InputFilter[] inputFilterArr) {
        return this.f4976a.a(inputFilterArr);
    }

    public void b(boolean z3) {
        this.f4976a.b(z3);
    }

    public void c(boolean z3) {
        this.f4976a.c(z3);
    }
}
