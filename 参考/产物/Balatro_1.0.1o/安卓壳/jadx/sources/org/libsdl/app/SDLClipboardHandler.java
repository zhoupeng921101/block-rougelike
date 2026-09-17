package org.libsdl.app;

import android.content.ClipData;
import android.content.ClipboardManager;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class SDLClipboardHandler implements ClipboardManager.OnPrimaryClipChangedListener {
    protected ClipboardManager mClipMgr;

    SDLClipboardHandler() {
        ClipboardManager clipboardManager = (ClipboardManager) SDL.getContext().getSystemService("clipboard");
        this.mClipMgr = clipboardManager;
        clipboardManager.addPrimaryClipChangedListener(this);
    }

    public String clipboardGetText() {
        ClipData.Item itemAt;
        CharSequence text;
        ClipData primaryClip = this.mClipMgr.getPrimaryClip();
        if (primaryClip == null || (itemAt = primaryClip.getItemAt(0)) == null || (text = itemAt.getText()) == null) {
            return null;
        }
        return text.toString();
    }

    public boolean clipboardHasText() {
        return this.mClipMgr.hasPrimaryClip();
    }

    public void clipboardSetText(String str) {
        this.mClipMgr.removePrimaryClipChangedListener(this);
        this.mClipMgr.setPrimaryClip(ClipData.newPlainText(null, str));
        this.mClipMgr.addPrimaryClipChangedListener(this);
    }

    @Override // android.content.ClipboardManager.OnPrimaryClipChangedListener
    public void onPrimaryClipChanged() {
        SDLActivity.onNativeClipboardChanged();
    }
}
