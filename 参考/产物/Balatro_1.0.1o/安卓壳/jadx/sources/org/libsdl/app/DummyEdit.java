package org.libsdl.app;

import android.content.Context;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class DummyEdit extends View implements View.OnKeyListener {
    InputConnection ic;

    public DummyEdit(Context context) {
        super(context);
        setFocusableInTouchMode(true);
        setFocusable(true);
        setOnKeyListener(this);
    }

    @Override // android.view.View
    public boolean onCheckIsTextEditor() {
        return true;
    }

    @Override // android.view.View
    public InputConnection onCreateInputConnection(EditorInfo editorInfo) {
        SDLInputConnection sDLInputConnection = new SDLInputConnection(this, true);
        this.ic = sDLInputConnection;
        editorInfo.inputType = 131073;
        editorInfo.imeOptions = 301989888;
        return sDLInputConnection;
    }

    @Override // android.view.View.OnKeyListener
    public boolean onKey(View view, int i4, KeyEvent keyEvent) {
        return SDLActivity.handleKeyEvent(view, i4, keyEvent, this.ic);
    }

    @Override // android.view.View
    public boolean onKeyPreIme(int i4, KeyEvent keyEvent) {
        DummyEdit dummyEdit;
        if (keyEvent.getAction() == 1 && i4 == 4 && (dummyEdit = SDLActivity.mTextEdit) != null && dummyEdit.getVisibility() == 0) {
            SDLActivity.onNativeKeyboardFocusLost();
        }
        return super.onKeyPreIme(i4, keyEvent);
    }
}
