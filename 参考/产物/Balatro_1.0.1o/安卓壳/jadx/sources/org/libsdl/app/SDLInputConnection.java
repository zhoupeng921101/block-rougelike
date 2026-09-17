package org.libsdl.app;

import android.os.Build;
import android.text.Editable;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.BaseInputConnection;
import android.widget.EditText;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLInputConnection extends BaseInputConnection {
    protected String mCommittedText;
    protected EditText mEditText;

    public SDLInputConnection(View view, boolean z3) {
        super(view, z3);
        this.mCommittedText = "";
        this.mEditText = new EditText(SDL.getContext());
    }

    public static native void nativeCommitText(String str, int i4);

    public static native void nativeGenerateScancodeForUnichar(char c4);

    @Override // android.view.inputmethod.BaseInputConnection, android.view.inputmethod.InputConnection
    public boolean commitText(CharSequence charSequence, int i4) {
        if (!super.commitText(charSequence, i4)) {
            return false;
        }
        updateText();
        return true;
    }

    @Override // android.view.inputmethod.BaseInputConnection, android.view.inputmethod.InputConnection
    public boolean deleteSurroundingText(int i4, int i5) {
        if (Build.VERSION.SDK_INT > 29 || i4 <= 0 || i5 != 0) {
            if (!super.deleteSurroundingText(i4, i5)) {
                return false;
            }
            updateText();
            return true;
        }
        while (true) {
            int i6 = i4 - 1;
            if (i4 <= 0) {
                return true;
            }
            nativeGenerateScancodeForUnichar('\b');
            i4 = i6;
        }
    }

    @Override // android.view.inputmethod.BaseInputConnection
    public Editable getEditable() {
        return this.mEditText.getEditableText();
    }

    @Override // android.view.inputmethod.BaseInputConnection, android.view.inputmethod.InputConnection
    public boolean sendKeyEvent(KeyEvent keyEvent) {
        if (keyEvent.getKeyCode() == 66 && SDLActivity.onNativeSoftReturnKey()) {
            return true;
        }
        return super.sendKeyEvent(keyEvent);
    }

    @Override // android.view.inputmethod.BaseInputConnection, android.view.inputmethod.InputConnection
    public boolean setComposingText(CharSequence charSequence, int i4) {
        if (!super.setComposingText(charSequence, i4)) {
            return false;
        }
        updateText();
        return true;
    }

    protected void updateText() {
        Editable editable = getEditable();
        if (editable == null) {
            return;
        }
        String obj = editable.toString();
        int min = Math.min(obj.length(), this.mCommittedText.length());
        int i4 = 0;
        while (i4 < min) {
            int codePointAt = this.mCommittedText.codePointAt(i4);
            if (codePointAt != obj.codePointAt(i4)) {
                break;
            } else {
                i4 += Character.charCount(codePointAt);
            }
        }
        int i5 = i4;
        while (i5 < this.mCommittedText.length()) {
            int codePointAt2 = this.mCommittedText.codePointAt(i5);
            nativeGenerateScancodeForUnichar('\b');
            i5 += Character.charCount(codePointAt2);
        }
        if (i4 < obj.length()) {
            String charSequence = obj.subSequence(i4, obj.length()).toString();
            int i6 = 0;
            while (i6 < charSequence.length()) {
                int codePointAt3 = charSequence.codePointAt(i6);
                if (codePointAt3 == 10 && SDLActivity.onNativeSoftReturnKey()) {
                    return;
                }
                if (codePointAt3 < 128) {
                    nativeGenerateScancodeForUnichar((char) codePointAt3);
                }
                i6 += Character.charCount(codePointAt3);
            }
            nativeCommitText(charSequence, 0);
        }
        this.mCommittedText = obj;
    }
}
