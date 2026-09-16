package com.android.support;

import android.animation.LayoutTransition;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ClipDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.StateListDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.text.Html;
import android.text.InputFilter;
import android.text.TextUtils;
import android.text.method.DigitsKeyListener;
import android.util.Base64;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.SeekBar;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import org.love2d.android.GameActivity;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class Menu {
    public static final String TAG = "Mod_Menu";
    Context getContext;
    LinearLayout mCollapse;
    RelativeLayout mCollapsed;
    LinearLayout mExpanded;
    RelativeLayout mRootContainer;
    LinearLayout mSettings;
    WindowManager mWindowManager;
    LinearLayout mods;
    boolean overlayRequired;
    FrameLayout rootFrame;
    LinearLayout.LayoutParams scrlLL;
    LinearLayout.LayoutParams scrlLLExpanded;
    ScrollView scrollView;
    ImageView startimage;
    boolean stopChecking;
    WindowManager.LayoutParams vmParams;
    int TEXT_COLOR = Color.parseColor("#FFFFFF");
    int TEXT_COLOR_SECONDARY = Color.parseColor("#B0B5C8");
    int MENU_FEATURE_BG_COLOR = 0;
    int BTN_COLOR = Color.parseColor("#663A4050");
    int BTN_BORDER_COLOR = Color.parseColor("#6050586A");
    int MENU_WIDTH = 290;
    int MENU_HEIGHT = 220;
    int POS_X = 0;
    int POS_Y = 100;
    float MENU_CORNER = 30.0f;
    float BTN_CORNER = 12.0f;
    int ICON_SIZE = 50;
    float ICON_ALPHA = 0.5f;
    int ToggleON = Color.parseColor("#EE68AC");
    int ToggleOFF = Color.parseColor("#484D5E");
    int BtnON = Color.parseColor("#EE68AC");
    int BtnOFF = Color.parseColor("#663A4050");
    int CategoryBG = 0;
    int CategoryTextColor = Color.parseColor("#8E94A8");
    int SeekBarColor = Color.parseColor("#EE68AC");
    int SeekBarTrackColor = Color.parseColor("#353A45");
    int SeekBarThumbColor = Color.parseColor("#FFFFFF");
    int CheckBoxColor = Color.parseColor("#EE68AC");
    int RadioColor = Color.parseColor("#FFFFFF");
    int CollapseColor = Color.parseColor("#66252A38");
    String NumberTxtColor = "#EE68AC";
    private View.OnTouchListener mSpringListener = new View.OnTouchListener() { // from class: com.android.support.Menu.1
        @Override // android.view.View.OnTouchListener
        public boolean onTouch(View v3, MotionEvent event) {
            switch (event.getAction()) {
                case 0:
                    v3.animate().scaleX(0.92f).scaleY(0.92f).alpha(0.7f).setDuration(80L).start();
                    break;
                case BuildConfig.VERSION_CODE /* 1 */:
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    v3.animate().scaleX(1.0f).scaleY(1.0f).alpha(1.0f).setDuration(80L).start();
                    break;
            }
            return false;
        }
    };

    native String[] GetFeatureList();

    native String Icon();

    native String IconWebViewData();

    native void Init(Context context, TextView textView, TextView textView2);

    native boolean IsGameLibLoaded();

    native String[] SettingsList();

    public Menu(Context context) {
        this.getContext = context;
        Preferences.context = context;
        this.rootFrame = new FrameLayout(context);
        this.rootFrame.setOnTouchListener(onTouchListener());
        this.mRootContainer = new RelativeLayout(context);
        this.mCollapsed = new RelativeLayout(context);
        this.mCollapsed.setVisibility(0);
        this.mCollapsed.setAlpha(this.ICON_ALPHA);
        this.mExpanded = new LinearLayout(context);
        this.mExpanded.setVisibility(8);
        this.mExpanded.setOrientation(1);
        this.mExpanded.setLayoutParams(new LinearLayout.LayoutParams(dp(this.MENU_WIDTH), -2));
        GradientDrawable gdMenuBody = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{Color.parseColor("#E6232833"), Color.parseColor("#E60F1116")});
        gdMenuBody.setCornerRadius(this.MENU_CORNER);
        gdMenuBody.setStroke(2, Color.parseColor("#50586A"));
        this.mExpanded.setBackground(gdMenuBody);
        this.mExpanded.setPadding(0, 0, 0, 0);
        this.startimage = new ImageView(context);
        this.startimage.setLayoutParams(new RelativeLayout.LayoutParams(-2, -2));
        int applyDimension = (int) TypedValue.applyDimension(1, this.ICON_SIZE, context.getResources().getDisplayMetrics());
        this.startimage.getLayoutParams().height = applyDimension;
        this.startimage.getLayoutParams().width = applyDimension;
        this.startimage.setScaleType(ImageView.ScaleType.FIT_XY);
        byte[] decode = Base64.decode(Icon(), 0);
        this.startimage.setImageBitmap(BitmapFactory.decodeByteArray(decode, 0, decode.length));
        ((ViewGroup.MarginLayoutParams) this.startimage.getLayoutParams()).topMargin = convertDipToPixels(10);
        this.startimage.setOnTouchListener(onTouchListener());
        this.startimage.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.2
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                Menu.this.mCollapsed.setVisibility(8);
                Menu.this.mExpanded.setVisibility(0);
            }
        });
        WebView wView = new WebView(context);
        wView.setLayoutParams(new RelativeLayout.LayoutParams(-2, -2));
        int applyDimension2 = (int) TypedValue.applyDimension(1, this.ICON_SIZE, context.getResources().getDisplayMetrics());
        wView.getLayoutParams().height = applyDimension2;
        wView.getLayoutParams().width = applyDimension2;
        wView.loadData("<html><head></head><body style=\"margin: 0; padding: 0\"><img src=\"" + IconWebViewData() + "\" width=\"" + this.ICON_SIZE + "\" height=\"" + this.ICON_SIZE + "\" ></body></html>", "text/html", "utf-8");
        wView.setBackgroundColor(0);
        wView.setAlpha(this.ICON_ALPHA);
        wView.getSettings().setCacheMode(2);
        wView.setOnTouchListener(onTouchListener());
        TextView settings = new TextView(context);
        settings.setText(Build.VERSION.SDK_INT >= 23 ? "⚙" : "🔧");
        settings.setTextColor(this.TEXT_COLOR_SECONDARY);
        settings.setTypeface(Typeface.DEFAULT_BOLD);
        settings.setTextSize(18.0f);
        RelativeLayout.LayoutParams rlsettings = new RelativeLayout.LayoutParams(-2, -2);
        rlsettings.addRule(11);
        rlsettings.setMargins(0, 5, 20, 0);
        settings.setLayoutParams(rlsettings);
        settings.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.3
            boolean settingsOpen;

            @Override // android.view.View.OnClickListener
            public void onClick(View v3) {
                try {
                    this.settingsOpen = !this.settingsOpen;
                    if (this.settingsOpen) {
                        Menu.this.scrollView.removeView(Menu.this.mods);
                        Menu.this.scrollView.addView(Menu.this.mSettings);
                        Menu.this.scrollView.scrollTo(0, 0);
                    } else {
                        Menu.this.scrollView.removeView(Menu.this.mSettings);
                        Menu.this.scrollView.addView(Menu.this.mods);
                    }
                } catch (IllegalStateException e4) {
                }
            }
        });
        this.mSettings = new LinearLayout(context);
        this.mSettings.setOrientation(1);
        featureList(SettingsList(), this.mSettings);
        RelativeLayout relativeLayout = new RelativeLayout(context);
        relativeLayout.setPadding(35, 30, 35, 15);
        relativeLayout.setVerticalGravity(16);
        TextView title = new TextView(context);
        title.setTextColor(this.TEXT_COLOR);
        title.setTextSize(19.0f);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(16);
        RelativeLayout.LayoutParams rl = new RelativeLayout.LayoutParams(-2, -2);
        rl.addRule(9);
        title.setLayoutParams(rl);
        TextView subTitle = new TextView(context);
        subTitle.setVisibility(8);
        this.scrollView = new ScrollView(context);
        this.scrlLL = new LinearLayout.LayoutParams(-1, dp(this.MENU_HEIGHT));
        this.scrlLLExpanded = new LinearLayout.LayoutParams(this.mExpanded.getLayoutParams());
        this.scrlLLExpanded.weight = 1.0f;
        this.scrollView.setLayoutParams(Preferences.isExpanded ? this.scrlLLExpanded : this.scrlLL);
        this.scrollView.setBackgroundColor(this.MENU_FEATURE_BG_COLOR);
        this.scrollView.setVerticalScrollBarEnabled(false);
        this.mods = new LinearLayout(context);
        this.mods.setOrientation(1);
        this.mods.setPadding(0, 5, 0, 10);
        LayoutTransition transition = new LayoutTransition();
        transition.setDuration(200L);
        transition.enableTransitionType(4);
        this.mods.setLayoutTransition(transition);
        LinearLayout linearLayout = new LinearLayout(context);
        linearLayout.setOrientation(0);
        linearLayout.setWeightSum(2.0f);
        linearLayout.setPadding(20, 10, 20, 20);
        GradientDrawable footerBtnStyle = new GradientDrawable();
        footerBtnStyle.setColor(this.BTN_COLOR);
        footerBtnStyle.setCornerRadius(this.BTN_CORNER);
        footerBtnStyle.setStroke(2, this.BTN_BORDER_COLOR);
        LinearLayout hideContainer = new LinearLayout(context);
        LinearLayout.LayoutParams hideParams = new LinearLayout.LayoutParams(0, -2, 1.0f);
        hideParams.setMargins(0, 0, 10, 0);
        hideContainer.setLayoutParams(hideParams);
        hideContainer.setGravity(17);
        hideContainer.setPadding(0, 20, 0, 20);
        hideContainer.setBackground(footerBtnStyle);
        TextView hideBtn = new TextView(context);
        hideBtn.setText("CLOSE");
        hideBtn.setTextSize(12.0f);
        hideBtn.setTypeface(Typeface.DEFAULT_BOLD);
        hideBtn.setTextColor(Color.parseColor("#8E94A8"));
        hideContainer.addView(hideBtn);
        hideContainer.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.4
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                Menu.this.mCollapsed.setVisibility(0);
                Menu.this.mCollapsed.setAlpha(0.0f);
                Menu.this.mExpanded.setVisibility(8);
                Toast.makeText(view.getContext(), "Menu Hidden", 1).show();
            }
        });
        hideContainer.setOnLongClickListener(new View.OnLongClickListener() { // from class: com.android.support.Menu.5
            @Override // android.view.View.OnLongClickListener
            public boolean onLongClick(View view) {
                Toast.makeText(view.getContext(), "Menu killed", 1).show();
                Menu.this.rootFrame.removeView(Menu.this.mRootContainer);
                Menu.this.mWindowManager.removeView(Menu.this.rootFrame);
                return false;
            }
        });
        hideContainer.setOnTouchListener(this.mSpringListener);
        LinearLayout minContainer = new LinearLayout(context);
        LinearLayout.LayoutParams minParams = new LinearLayout.LayoutParams(0, -2, 1.0f);
        minParams.setMargins(10, 0, 0, 0);
        minContainer.setLayoutParams(minParams);
        minContainer.setGravity(17);
        minContainer.setPadding(0, 20, 0, 20);
        minContainer.setBackground(footerBtnStyle);
        TextView closeBtn = new TextView(context);
        closeBtn.setText("MINIMIZE");
        closeBtn.setTextSize(12.0f);
        closeBtn.setTypeface(Typeface.DEFAULT_BOLD);
        closeBtn.setTextColor(this.TEXT_COLOR);
        minContainer.addView(closeBtn);
        minContainer.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.6
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                Menu.this.mCollapsed.setVisibility(0);
                Menu.this.mCollapsed.setAlpha(Menu.this.ICON_ALPHA);
                Menu.this.mExpanded.setVisibility(8);
            }
        });
        minContainer.setOnTouchListener(this.mSpringListener);
        linearLayout.addView(hideContainer);
        linearLayout.addView(minContainer);
        this.mRootContainer.addView(this.mCollapsed);
        this.mRootContainer.addView(this.mExpanded);
        if (IconWebViewData() == null) {
            this.mCollapsed.addView(this.startimage);
        } else {
            this.mCollapsed.addView(wView);
        }
        relativeLayout.addView(title);
        relativeLayout.addView(settings);
        this.mExpanded.addView(relativeLayout);
        this.scrollView.addView(this.mods);
        this.mExpanded.addView(this.scrollView);
        this.mExpanded.addView(linearLayout);
        Init(context, title, subTitle);
    }

    public void ShowMenu() {
        this.rootFrame.addView(this.mRootContainer);
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() { // from class: com.android.support.Menu.7
            boolean viewLoaded = false;

            @Override // java.lang.Runnable
            public void run() {
                if (Preferences.loadPref && !Menu.this.IsGameLibLoaded() && !Menu.this.stopChecking) {
                    if (!this.viewLoaded) {
                        Menu.this.Category(Menu.this.mods, "Waiting for game...");
                        this.viewLoaded = true;
                    }
                    handler.postDelayed(this, 600L);
                    return;
                }
                Menu.this.mods.removeAllViews();
                Menu.this.featureList(Menu.this.GetFeatureList(), Menu.this.mods);
            }
        }, 500L);
    }

    public void SetWindowManagerWindowService() {
        int iparams = Build.VERSION.SDK_INT >= 26 ? 2038 : 2002;
        this.vmParams = new WindowManager.LayoutParams(-2, -2, iparams, 67108872, -3);
        this.vmParams.gravity = 51;
        this.vmParams.x = this.POS_X;
        this.vmParams.y = this.POS_Y;
        this.mWindowManager = (WindowManager) this.getContext.getSystemService("window");
        this.mWindowManager.addView(this.rootFrame, this.vmParams);
        this.overlayRequired = true;
    }

    public void SetWindowManagerActivity() {
        this.vmParams = new WindowManager.LayoutParams(-2, -2, this.POS_X, this.POS_Y, 2, 41943304, -2);
        this.vmParams.gravity = 51;
        this.vmParams.x = this.POS_X;
        this.vmParams.y = this.POS_Y;
        this.mWindowManager = ((Activity) this.getContext).getWindowManager();
        this.mWindowManager.addView(this.rootFrame, this.vmParams);
    }

    private View.OnTouchListener onTouchListener() {
        return new View.OnTouchListener() { // from class: com.android.support.Menu.8
            final View collapsedView;
            final View expandedView;
            private float initialTouchX;
            private float initialTouchY;
            private int initialX;
            private int initialY;

            {
                this.collapsedView = Menu.this.mCollapsed;
                this.expandedView = Menu.this.mExpanded;
            }

            @Override // android.view.View.OnTouchListener
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch (motionEvent.getAction()) {
                    case 0:
                        this.initialX = Menu.this.vmParams.x;
                        this.initialY = Menu.this.vmParams.y;
                        this.initialTouchX = motionEvent.getRawX();
                        this.initialTouchY = motionEvent.getRawY();
                        return true;
                    case BuildConfig.VERSION_CODE /* 1 */:
                        int rawX = (int) (motionEvent.getRawX() - this.initialTouchX);
                        int rawY = (int) (motionEvent.getRawY() - this.initialTouchY);
                        Menu.this.mExpanded.setAlpha(1.0f);
                        Menu.this.mCollapsed.setAlpha(Menu.this.ICON_ALPHA);
                        if (rawX < 10 && rawY < 10 && Menu.this.isViewCollapsed()) {
                            try {
                                this.collapsedView.setVisibility(8);
                                this.expandedView.setVisibility(0);
                            } catch (NullPointerException e4) {
                            }
                        }
                        return true;
                    case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                        Menu.this.mExpanded.setAlpha(0.6f);
                        Menu.this.mCollapsed.setAlpha(0.6f);
                        Menu.this.vmParams.x = this.initialX + ((int) (motionEvent.getRawX() - this.initialTouchX));
                        Menu.this.vmParams.y = this.initialY + ((int) (motionEvent.getRawY() - this.initialTouchY));
                        Menu.this.mWindowManager.updateViewLayout(Menu.this.rootFrame, Menu.this.vmParams);
                        return true;
                    default:
                        return false;
                }
            }
        };
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    public void featureList(String[] listFT, LinearLayout linearLayout) {
        boolean switchedOn;
        int subFeat;
        int subFeat2;
        String feature;
        char c4;
        Menu menu = this;
        int i4 = 0;
        int featNum = 0;
        while (i4 < listFT.length) {
            String feature2 = listFT[i4];
            if (!feature2.contains("_True")) {
                switchedOn = false;
            } else {
                feature2 = feature2.replaceFirst("_True", "");
                switchedOn = true;
            }
            LinearLayout linearLayout2 = linearLayout;
            if (feature2.contains("CollapseAdd_")) {
                linearLayout2 = menu.mCollapse;
                feature2 = feature2.replaceFirst("CollapseAdd_", "");
            }
            String[] str = feature2.split("_");
            if (TextUtils.isDigitsOnly(str[0]) || str[0].matches("-[0-9]*")) {
                int featNum2 = Integer.parseInt(str[0]);
                int subFeat3 = featNum + 1;
                subFeat = subFeat3;
                subFeat2 = featNum2;
                feature = feature2.replaceFirst(str[0] + "_", "");
            } else {
                subFeat = featNum;
                subFeat2 = i4 - featNum;
                feature = feature2;
            }
            String[] strSplit = feature.split("_");
            String str2 = strSplit[0];
            switch (str2.hashCode()) {
                case -1943191956:
                    if (str2.equals("ButtonLink")) {
                        c4 = 11;
                        break;
                    }
                    c4 = 65535;
                    break;
                case -1784436876:
                    if (str2.equals("Toggle")) {
                        c4 = 0;
                        break;
                    }
                    c4 = 65535;
                    break;
                case -923700249:
                    if (str2.equals("InputValue")) {
                        c4 = 6;
                        break;
                    }
                    c4 = 65535;
                    break;
                case -658531749:
                    if (str2.equals("SeekBar")) {
                        c4 = 1;
                        break;
                    }
                    c4 = 65535;
                    break;
                case -584041481:
                    if (str2.equals("InputText")) {
                        c4 = 5;
                        break;
                    }
                    c4 = 65535;
                    break;
                case -567441459:
                    if (str2.equals("Collapse")) {
                        c4 = '\n';
                        break;
                    }
                    c4 = 65535;
                    break;
                case -339785223:
                    if (str2.equals("Spinner")) {
                        c4 = 4;
                        break;
                    }
                    c4 = 65535;
                    break;
                case -106518818:
                    if (str2.equals("ButtonOnOff")) {
                        c4 = 3;
                        break;
                    }
                    c4 = 65535;
                    break;
                case 82909838:
                    if (str2.equals("RichTextView")) {
                        c4 = '\r';
                        break;
                    }
                    c4 = 65535;
                    break;
                case 115155230:
                    if (str2.equals("Category")) {
                        c4 = '\f';
                        break;
                    }
                    c4 = 65535;
                    break;
                case 427235197:
                    if (str2.equals("RichWebView")) {
                        c4 = 14;
                        break;
                    }
                    c4 = 65535;
                    break;
                case 776382189:
                    if (str2.equals("RadioButton")) {
                        c4 = '\t';
                        break;
                    }
                    c4 = 65535;
                    break;
                case 1133277359:
                    if (str2.equals("InputLValue")) {
                        c4 = 7;
                        break;
                    }
                    c4 = 65535;
                    break;
                case 1601505219:
                    if (str2.equals("CheckBox")) {
                        c4 = '\b';
                        break;
                    }
                    c4 = 65535;
                    break;
                case 2001146706:
                    if (str2.equals("Button")) {
                        c4 = 2;
                        break;
                    }
                    c4 = 65535;
                    break;
                default:
                    c4 = 65535;
                    break;
            }
            switch (c4) {
                case 0:
                    menu.Switch(linearLayout2, subFeat2, strSplit[1], switchedOn);
                    break;
                case BuildConfig.VERSION_CODE /* 1 */:
                    menu.SeekBar(linearLayout2, subFeat2, strSplit[1], Integer.parseInt(strSplit[2]), Integer.parseInt(strSplit[3]));
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    menu.Button(linearLayout2, subFeat2, strSplit[1]);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    menu.ButtonOnOff(linearLayout2, subFeat2, strSplit[1], switchedOn);
                    break;
                case 4:
                    menu.TextView(linearLayout2, strSplit[1]);
                    menu.Spinner(linearLayout2, subFeat2, strSplit[1], strSplit[2]);
                    break;
                case 5:
                    menu.InputText(linearLayout2, subFeat2, strSplit[1]);
                    break;
                case 6:
                    if (strSplit.length == 3) {
                        menu.InputNum(linearLayout2, subFeat2, strSplit[2], Integer.parseInt(strSplit[1]));
                    }
                    if (strSplit.length != 2) {
                        break;
                    } else {
                        menu.InputNum(linearLayout2, subFeat2, strSplit[1], 0);
                        break;
                    }
                case 7:
                    if (strSplit.length == 3) {
                        menu.InputLNum(linearLayout2, subFeat2, strSplit[2], Long.parseLong(strSplit[1]));
                    }
                    if (strSplit.length != 2) {
                        menu = this;
                        break;
                    } else {
                        menu = this;
                        menu.InputLNum(linearLayout2, subFeat2, strSplit[1], 0L);
                        break;
                    }
                case '\b':
                    menu.CheckBox(linearLayout2, subFeat2, strSplit[1], switchedOn);
                    break;
                case '\t':
                    menu.RadioButton(linearLayout2, subFeat2, strSplit[1], strSplit[2]);
                    break;
                case '\n':
                    menu.Collapse(linearLayout2, strSplit[1], switchedOn);
                    subFeat++;
                    break;
                case 11:
                    subFeat++;
                    menu.ButtonLink(linearLayout2, strSplit[1], strSplit[2]);
                    break;
                case '\f':
                    subFeat++;
                    menu.Category(linearLayout2, strSplit[1]);
                    break;
                case '\r':
                    subFeat++;
                    menu.TextView(linearLayout2, strSplit[1]);
                    break;
                case 14:
                    subFeat++;
                    menu.WebTextView(linearLayout2, strSplit[1]);
                    break;
            }
            i4++;
            featNum = subFeat;
        }
    }

    private void Switch(LinearLayout linearLayout, final int featNum, final String featName, boolean swiOn) {
        LinearLayout linearLayout2 = new LinearLayout(this.getContext);
        linearLayout2.setOrientation(0);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -2);
        layoutParams.setMargins(20, 10, 20, 10);
        linearLayout2.setLayoutParams(layoutParams);
        linearLayout2.setGravity(16);
        GradientDrawable gd = new GradientDrawable();
        gd.setColor(this.BTN_COLOR);
        gd.setCornerRadius(this.BTN_CORNER);
        gd.setStroke(2, this.BTN_BORDER_COLOR);
        linearLayout2.setBackground(gd);
        linearLayout2.setPadding(30, 20, 30, 20);
        TextView txt = new TextView(this.getContext);
        txt.setText(Html.fromHtml(featName));
        txt.setTextColor(this.TEXT_COLOR);
        txt.setTypeface(Typeface.DEFAULT_BOLD);
        txt.setTextSize(13.0f);
        LinearLayout.LayoutParams txtParams = new LinearLayout.LayoutParams(0, -2, 1.0f);
        txt.setLayoutParams(txtParams);
        final Switch r7 = new Switch(this.getContext);
        r7.setBackground(null);
        r7.setStateListAnimator(null);
        GradientDrawable thumb = new GradientDrawable();
        thumb.setShape(1);
        thumb.setSize(dp(20), dp(20));
        thumb.setColor(-1);
        thumb.setStroke(2, 0);
        StateListDrawable track = new StateListDrawable();
        GradientDrawable trackOn = new GradientDrawable();
        trackOn.setShape(0);
        trackOn.setCornerRadius(dp(20));
        trackOn.setColor(this.ToggleON);
        GradientDrawable trackOff = new GradientDrawable();
        trackOff.setShape(0);
        trackOff.setCornerRadius(dp(20));
        trackOff.setColor(this.ToggleOFF);
        track.addState(new int[]{android.R.attr.state_checked}, trackOn);
        track.addState(new int[]{-16842912}, trackOff);
        r7.setThumbDrawable(thumb);
        r7.setTrackDrawable(track);
        r7.setChecked(Preferences.loadPrefBool(featName, featNum, swiOn));
        r7.setOnTouchListener(this.mSpringListener);
        r7.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() { // from class: com.android.support.Menu.9
            @Override // android.widget.CompoundButton.OnCheckedChangeListener
            public void onCheckedChanged(CompoundButton compoundButton, boolean bool) {
                Preferences.changeFeatureBool(featName, featNum, bool);
                switch (featNum) {
                    case -3:
                        Preferences.isExpanded = bool;
                        ScrollView scrollView = Menu.this.scrollView;
                        Menu menu = Menu.this;
                        scrollView.setLayoutParams(bool ? menu.scrlLLExpanded : menu.scrlLL);
                        break;
                    case -1:
                        Preferences.with(r7.getContext()).writeBoolean(-1, bool);
                        if (!bool) {
                            Preferences.with(r7.getContext()).clear();
                            break;
                        }
                        break;
                }
            }
        });
        linearLayout2.addView(txt);
        linearLayout2.addView(r7);
        linearLayout.addView(linearLayout2);
    }

    private void SeekBar(LinearLayout linearLayout, final int featNum, final String featName, final int min, int max) {
        int i4;
        int loadedProg = Preferences.loadPrefInt(featName, featNum);
        LinearLayout linearLayout2 = new LinearLayout(this.getContext);
        linearLayout2.setPadding(25, 15, 25, 15);
        linearLayout2.setOrientation(1);
        linearLayout2.setGravity(17);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -2);
        layoutParams.setMargins(20, 10, 20, 10);
        linearLayout2.setLayoutParams(layoutParams);
        GradientDrawable gd = new GradientDrawable();
        gd.setColor(this.BTN_COLOR);
        gd.setCornerRadius(this.BTN_CORNER);
        gd.setStroke(2, this.BTN_BORDER_COLOR);
        linearLayout2.setBackground(gd);
        final TextView textView = new TextView(this.getContext);
        textView.setText(Html.fromHtml(featName + ": <font color='" + this.NumberTxtColor + "'>" + (loadedProg == 0 ? min : loadedProg)));
        textView.setTextColor(this.TEXT_COLOR);
        textView.setTextSize(13.0f);
        textView.setTypeface(Typeface.DEFAULT_BOLD);
        textView.setGravity(3);
        textView.setPadding(dp(10), 0, 0, 0);
        textView.setLayoutParams(new LinearLayout.LayoutParams(-1, -2));
        SeekBar seekBar = new SeekBar(this.getContext);
        seekBar.setLayoutParams(new LinearLayout.LayoutParams(-1, -2));
        seekBar.setPadding(dp(10), dp(5), dp(10), dp(5));
        seekBar.setMax(max);
        if (Build.VERSION.SDK_INT < 26) {
            i4 = min;
        } else {
            i4 = min;
            seekBar.setMin(i4);
        }
        seekBar.setProgress(loadedProg == 0 ? i4 : loadedProg);
        seekBar.setBackground(null);
        seekBar.setStateListAnimator(null);
        seekBar.setSplitTrack(false);
        GradientDrawable track = new GradientDrawable();
        track.setColor(this.SeekBarTrackColor);
        track.setCornerRadius(dp(6));
        track.setSize(-1, dp(6));
        GradientDrawable clip = new GradientDrawable();
        clip.setColor(this.SeekBarColor);
        clip.setCornerRadius(dp(6));
        clip.setSize(-1, dp(6));
        ClipDrawable progress = new ClipDrawable(clip, 3, 1);
        LayerDrawable layerDrawable = new LayerDrawable(new Drawable[]{track, progress});
        layerDrawable.setId(0, android.R.id.background);
        layerDrawable.setId(1, android.R.id.progress);
        seekBar.setProgressDrawable(layerDrawable);
        GradientDrawable thumb = new GradientDrawable();
        thumb.setShape(1);
        thumb.setColor(this.SeekBarThumbColor);
        thumb.setSize(dp(18), dp(18));
        seekBar.setThumb(thumb);
        seekBar.setThumbOffset(dp(9));
        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() { // from class: com.android.support.Menu.10
            @Override // android.widget.SeekBar.OnSeekBarChangeListener
            public void onStartTrackingTouch(SeekBar seekBar2) {
            }

            @Override // android.widget.SeekBar.OnSeekBarChangeListener
            public void onStopTrackingTouch(SeekBar seekBar2) {
            }

            @Override // android.widget.SeekBar.OnSeekBarChangeListener
            public void onProgressChanged(SeekBar seekBar2, int i5, boolean z3) {
                seekBar2.setProgress(i5 < min ? min : i5);
                Preferences.changeFeatureInt(featName, featNum, i5 < min ? min : i5);
                textView.setText(Html.fromHtml(featName + ": <font color='" + Menu.this.NumberTxtColor + "'>" + (i5 < min ? min : i5)));
            }
        });
        linearLayout2.addView(textView);
        linearLayout2.addView(seekBar);
        linearLayout.addView(linearLayout2);
    }

    private void Button(LinearLayout linearLayout, final int featNum, final String featName) {
        Button button = new Button(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1);
        layoutParams.setMargins(20, 10, 20, 10);
        button.setLayoutParams(layoutParams);
        button.setAllCaps(false);
        if (featNum == -6) {
            button.setText("◀  Back to Menu");
            button.setTextColor(this.TEXT_COLOR);
        } else {
            button.setText(Html.fromHtml(featName));
            button.setTextColor(this.TEXT_COLOR);
        }
        button.setTextSize(13.0f);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        GradientDrawable btnDrawable = new GradientDrawable();
        btnDrawable.setColor(this.BTN_COLOR);
        btnDrawable.setCornerRadius(this.BTN_CORNER);
        btnDrawable.setStroke(2, this.BTN_BORDER_COLOR);
        button.setBackground(btnDrawable);
        button.setOnTouchListener(this.mSpringListener);
        button.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.11
            @Override // android.view.View.OnClickListener
            public void onClick(View v3) {
                switch (featNum) {
                    case -100:
                        Menu.this.stopChecking = true;
                        break;
                    case -6:
                        Menu.this.scrollView.removeView(Menu.this.mSettings);
                        Menu.this.scrollView.addView(Menu.this.mods);
                        break;
                }
                Preferences.changeFeatureInt(featName, featNum, 0);
            }
        });
        linearLayout.addView(button);
    }

    private void ButtonLink(LinearLayout linearLayout, String featName, final String url) {
        Button button = new Button(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1);
        layoutParams.setMargins(20, 10, 20, 10);
        button.setLayoutParams(layoutParams);
        button.setAllCaps(false);
        button.setTextColor(this.TEXT_COLOR);
        button.setText(Html.fromHtml(featName));
        button.setTextSize(13.0f);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        GradientDrawable btnDrawable = new GradientDrawable();
        btnDrawable.setColor(this.BTN_COLOR);
        btnDrawable.setCornerRadius(this.BTN_CORNER);
        btnDrawable.setStroke(2, this.BTN_BORDER_COLOR);
        button.setBackground(btnDrawable);
        button.setOnTouchListener(this.mSpringListener);
        button.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.12
            @Override // android.view.View.OnClickListener
            public void onClick(View v3) {
                Intent intent = new Intent("android.intent.action.VIEW");
                intent.setFlags(268435456);
                intent.setData(Uri.parse(url));
                Menu.this.getContext.startActivity(intent);
            }
        });
        linearLayout.addView(button);
    }

    private void ButtonOnOff(LinearLayout linearLayout, final int featNum, String featName, boolean switchedOn) {
        final Button button = new Button(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1);
        layoutParams.setMargins(20, 10, 20, 10);
        button.setLayoutParams(layoutParams);
        button.setTextColor(this.TEXT_COLOR);
        button.setAllCaps(false);
        button.setTextSize(13.0f);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        final String finalfeatName = featName.replace("OnOff_", "");
        final boolean isOn = Preferences.loadPrefBool(featName, featNum, switchedOn);
        final GradientDrawable btnDrawable = new GradientDrawable();
        btnDrawable.setCornerRadius(this.BTN_CORNER);
        btnDrawable.setStroke(2, this.BTN_BORDER_COLOR);
        if (isOn) {
            button.setText(Html.fromHtml(finalfeatName + ": ON"));
            btnDrawable.setColor(this.BtnON);
        } else {
            button.setText(Html.fromHtml(finalfeatName + ": OFF"));
            btnDrawable.setColor(this.BTN_COLOR);
        }
        button.setBackground(btnDrawable);
        button.setOnTouchListener(this.mSpringListener);
        button.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.13
            boolean isOn;

            {
                this.isOn = isOn;
            }

            @Override // android.view.View.OnClickListener
            public void onClick(View v3) {
                this.isOn = !this.isOn;
                Preferences.changeFeatureBool(finalfeatName, featNum, this.isOn);
                if (this.isOn) {
                    button.setText(Html.fromHtml(finalfeatName + ": ON"));
                    btnDrawable.setColor(Menu.this.BtnON);
                    button.setBackground(btnDrawable);
                } else {
                    button.setText(Html.fromHtml(finalfeatName + ": OFF"));
                    btnDrawable.setColor(Menu.this.BTN_COLOR);
                    button.setBackground(btnDrawable);
                }
            }
        });
        linearLayout.addView(button);
    }

    private void Spinner(LinearLayout linearLayout, final int featNum, final String featName, String list) {
        List<String> lists = new LinkedList<>(Arrays.asList(list.split(",")));
        int selectedIndex = Preferences.loadPrefInt(featName, featNum);
        if (selectedIndex >= lists.size()) {
            selectedIndex = 0;
        }
        int selectedIndex2 = selectedIndex;
        String currentSelected = lists.get(selectedIndex2);
        LinearLayout spinnerLayout = new LinearLayout(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -2);
        layoutParams.setMargins(20, 10, 20, 10);
        spinnerLayout.setOrientation(1);
        spinnerLayout.setLayoutParams(layoutParams);
        GradientDrawable gd = new GradientDrawable();
        gd.setColor(this.BTN_COLOR);
        gd.setCornerRadius(this.BTN_CORNER);
        gd.setStroke(2, this.BTN_BORDER_COLOR);
        spinnerLayout.setBackground(gd);
        LinearLayout dropdown = new LinearLayout(this.getContext);
        dropdown.setOrientation(0);
        dropdown.setGravity(16);
        dropdown.setPadding(30, 20, 30, 20);
        TextView headerText = new TextView(this.getContext);
        headerText.setText(Html.fromHtml(featName + ": <font color='" + this.NumberTxtColor + "'>" + currentSelected + "</font>"));
        headerText.setTextColor(this.TEXT_COLOR);
        headerText.setTypeface(Typeface.DEFAULT_BOLD);
        headerText.setTextSize(13.0f);
        headerText.setLayoutParams(new LinearLayout.LayoutParams(0, -2, 1.0f));
        final TextView arrow = new TextView(this.getContext);
        arrow.setText("▼");
        arrow.setTextColor(this.TEXT_COLOR_SECONDARY);
        arrow.setTextSize(12.0f);
        dropdown.addView(headerText);
        dropdown.addView(arrow);
        LinearLayout dropdown2 = new LinearLayout(this.getContext);
        dropdown2.setOrientation(1);
        dropdown2.setVisibility(8);
        dropdown2.setBackgroundColor(Color.parseColor("#30000000"));
        int i4 = 0;
        while (i4 < lists.size()) {
            LinearLayout header = dropdown;
            final LinearLayout header2 = dropdown2;
            final int position = i4;
            final TextView headerText2 = headerText;
            final String itemName = lists.get(i4);
            TextView item = new TextView(this.getContext);
            item.setText(itemName);
            item.setTextColor(this.TEXT_COLOR);
            item.setPadding(40, 25, 30, 25);
            item.setTypeface(Typeface.DEFAULT);
            item.setTextSize(13.0f);
            GradientDrawable gd2 = gd;
            List<String> lists2 = lists;
            int selectedIndex3 = selectedIndex2;
            item.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.14
                @Override // android.view.View.OnClickListener
                public void onClick(View v3) {
                    Preferences.changeFeatureInt(featName, featNum, position);
                    headerText2.setText(Html.fromHtml(featName + ": <font color='" + Menu.this.NumberTxtColor + "'>" + itemName + "</font>"));
                    header2.setVisibility(8);
                    arrow.setText("▼");
                }
            });
            if (i4 > 0) {
                View divider = new View(this.getContext);
                divider.setLayoutParams(new LinearLayout.LayoutParams(-1, 1));
                divider.setBackgroundColor(Color.parseColor("#15FFFFFF"));
                header2.addView(divider);
            }
            header2.addView(item);
            i4++;
            headerText = headerText2;
            dropdown2 = header2;
            dropdown = header;
            gd = gd2;
            lists = lists2;
            selectedIndex2 = selectedIndex3;
        }
        LinearLayout header3 = dropdown;
        final LinearLayout header4 = dropdown2;
        header3.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.15
            @Override // android.view.View.OnClickListener
            public void onClick(View v3) {
                if (header4.getVisibility() == 0) {
                    header4.setVisibility(8);
                    arrow.setText("▼");
                } else {
                    header4.setVisibility(0);
                    arrow.setText("▲");
                }
            }
        });
        spinnerLayout.addView(header3);
        spinnerLayout.addView(header4);
        linearLayout.addView(spinnerLayout);
    }

    private void InputNum(LinearLayout linearLayout, final int featNum, final String featName, final int maxValue) {
        LinearLayout linearLayout2 = new LinearLayout(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1);
        layoutParams.setMargins(20, 10, 20, 10);
        final Button button = new Button(this.getContext);
        int num = Preferences.loadPrefInt(featName, featNum);
        button.setText(Html.fromHtml(featName + ": <font color='" + this.NumberTxtColor + "'>" + num + "</font>"));
        button.setAllCaps(false);
        button.setLayoutParams(layoutParams);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        GradientDrawable btnDrawable = new GradientDrawable();
        btnDrawable.setColor(this.BTN_COLOR);
        btnDrawable.setCornerRadius(this.BTN_CORNER);
        btnDrawable.setStroke(2, this.BTN_BORDER_COLOR);
        button.setBackground(btnDrawable);
        button.setTextColor(this.TEXT_COLOR);
        button.setOnTouchListener(this.mSpringListener);
        button.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.16
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                AlertDialog.Builder alertName = new AlertDialog.Builder(Menu.this.getContext);
                final EditText editText = new EditText(Menu.this.getContext);
                if (maxValue != 0) {
                    editText.setHint("Max value: " + maxValue);
                }
                editText.setInputType(2);
                editText.setKeyListener(DigitsKeyListener.getInstance("0123456789-"));
                InputFilter[] FilterArray = {new InputFilter.LengthFilter(10)};
                editText.setFilters(FilterArray);
                editText.setOnFocusChangeListener(new View.OnFocusChangeListener() { // from class: com.android.support.Menu.16.1
                    @Override // android.view.View.OnFocusChangeListener
                    public void onFocusChange(View v3, boolean hasFocus) {
                        InputMethodManager imm = (InputMethodManager) Menu.this.getContext.getSystemService("input_method");
                        if (hasFocus) {
                            imm.toggleSoftInput(2, 1);
                        } else {
                            imm.toggleSoftInput(1, 0);
                        }
                    }
                });
                editText.requestFocus();
                alertName.setTitle("Input number");
                alertName.setView(editText);
                alertName.setPositiveButton("OK", new DialogInterface.OnClickListener() { // from class: com.android.support.Menu.16.2
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialog, int whichButton) {
                        int num2;
                        try {
                            String inp = editText.getText().toString();
                            num2 = Integer.parseInt(inp.isEmpty() ? "0" : inp);
                            if (maxValue != 0 && num2 >= maxValue) {
                                num2 = maxValue;
                            }
                        } catch (NumberFormatException e4) {
                            num2 = maxValue != 0 ? maxValue : Integer.MAX_VALUE;
                        }
                        button.setText(Html.fromHtml(featName + ": <font color='" + Menu.this.NumberTxtColor + "'>" + num2 + "</font>"));
                        Preferences.changeFeatureInt(featName, featNum, num2);
                    }
                });
                alertName.setNegativeButton("Cancel", new DialogInterface.OnClickListener() { // from class: com.android.support.Menu.16.3
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialog, int whichButton) {
                        InputMethodManager imm = (InputMethodManager) Menu.this.getContext.getSystemService("input_method");
                        imm.toggleSoftInput(1, 0);
                    }
                });
                if (Menu.this.overlayRequired) {
                    AlertDialog dialog = alertName.create();
                    ((Window) Objects.requireNonNull(dialog.getWindow())).setType(Build.VERSION.SDK_INT >= 26 ? 2038 : 2002);
                    dialog.show();
                    return;
                }
                alertName.show();
            }
        });
        linearLayout2.addView(button);
        linearLayout.addView(linearLayout2);
    }

    private void InputLNum(LinearLayout linearLayout, final int featNum, final String featName, final long maxValue) {
        LinearLayout linearLayout2 = new LinearLayout(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1);
        layoutParams.setMargins(20, 10, 20, 10);
        final Button button = new Button(this.getContext);
        long num = Preferences.loadPrefLong(featName, featNum);
        button.setText(Html.fromHtml(featName + ": <font color='" + this.NumberTxtColor + "'>" + num + "</font>"));
        button.setAllCaps(false);
        button.setLayoutParams(layoutParams);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        GradientDrawable btnDrawable = new GradientDrawable();
        btnDrawable.setColor(this.BTN_COLOR);
        btnDrawable.setCornerRadius(this.BTN_CORNER);
        btnDrawable.setStroke(2, this.BTN_BORDER_COLOR);
        button.setBackground(btnDrawable);
        button.setTextColor(this.TEXT_COLOR);
        button.setOnTouchListener(this.mSpringListener);
        button.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.17
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                AlertDialog.Builder alertName = new AlertDialog.Builder(Menu.this.getContext);
                final EditText editText = new EditText(Menu.this.getContext);
                if (maxValue != 0) {
                    editText.setHint("Max value: " + maxValue);
                }
                editText.setInputType(2);
                editText.setKeyListener(DigitsKeyListener.getInstance("0123456789-"));
                InputFilter[] FilterArray = {new InputFilter.LengthFilter(20)};
                editText.setFilters(FilterArray);
                editText.setOnFocusChangeListener(new View.OnFocusChangeListener() { // from class: com.android.support.Menu.17.1
                    @Override // android.view.View.OnFocusChangeListener
                    public void onFocusChange(View v3, boolean hasFocus) {
                        InputMethodManager imm = (InputMethodManager) Menu.this.getContext.getSystemService("input_method");
                        if (hasFocus) {
                            imm.toggleSoftInput(2, 1);
                        } else {
                            imm.toggleSoftInput(1, 0);
                        }
                    }
                });
                editText.requestFocus();
                alertName.setTitle("Input number");
                alertName.setView(editText);
                alertName.setPositiveButton("OK", new DialogInterface.OnClickListener() { // from class: com.android.support.Menu.17.2
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialog, int whichButton) {
                        long num2;
                        try {
                            String inp = editText.getText().toString();
                            num2 = Long.parseLong(inp.isEmpty() ? "0" : inp);
                            if (maxValue != 0 && num2 >= maxValue) {
                                num2 = maxValue;
                            }
                        } catch (NumberFormatException e4) {
                            num2 = maxValue != 0 ? maxValue : Long.MAX_VALUE;
                        }
                        button.setText(Html.fromHtml(featName + ": <font color='" + Menu.this.NumberTxtColor + "'>" + num2 + "</font>"));
                        Preferences.changeFeatureLong(featName, featNum, num2);
                    }
                });
                alertName.setNegativeButton("Cancel", new DialogInterface.OnClickListener() { // from class: com.android.support.Menu.17.3
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialog, int whichButton) {
                        InputMethodManager imm = (InputMethodManager) Menu.this.getContext.getSystemService("input_method");
                        imm.toggleSoftInput(1, 0);
                    }
                });
                if (Menu.this.overlayRequired) {
                    AlertDialog dialog = alertName.create();
                    ((Window) Objects.requireNonNull(dialog.getWindow())).setType(Build.VERSION.SDK_INT >= 26 ? 2038 : 2002);
                    dialog.show();
                    return;
                }
                alertName.show();
            }
        });
        linearLayout2.addView(button);
        linearLayout.addView(linearLayout2);
    }

    private void InputText(LinearLayout linearLayout, final int featNum, final String featName) {
        LinearLayout linearLayout2 = new LinearLayout(this.getContext);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1);
        layoutParams.setMargins(20, 10, 20, 10);
        final Button button = new Button(this.getContext);
        String string = Preferences.loadPrefString(featName, featNum);
        button.setText(Html.fromHtml(featName + ": <font color='" + this.NumberTxtColor + "'>" + string + "</font>"));
        button.setAllCaps(false);
        button.setLayoutParams(layoutParams);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        GradientDrawable btnDrawable = new GradientDrawable();
        btnDrawable.setColor(this.BTN_COLOR);
        btnDrawable.setCornerRadius(this.BTN_CORNER);
        btnDrawable.setStroke(2, this.BTN_BORDER_COLOR);
        button.setBackground(btnDrawable);
        button.setTextColor(this.TEXT_COLOR);
        button.setOnTouchListener(this.mSpringListener);
        button.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.18
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                AlertDialog.Builder alertName = new AlertDialog.Builder(Menu.this.getContext);
                final EditText editText = new EditText(Menu.this.getContext);
                editText.setOnFocusChangeListener(new View.OnFocusChangeListener() { // from class: com.android.support.Menu.18.1
                    @Override // android.view.View.OnFocusChangeListener
                    public void onFocusChange(View v3, boolean hasFocus) {
                        InputMethodManager imm = (InputMethodManager) Menu.this.getContext.getSystemService("input_method");
                        if (hasFocus) {
                            imm.toggleSoftInput(2, 1);
                        } else {
                            imm.toggleSoftInput(1, 0);
                        }
                    }
                });
                editText.requestFocus();
                alertName.setTitle("Input text");
                alertName.setView(editText);
                alertName.setPositiveButton("OK", new DialogInterface.OnClickListener() { // from class: com.android.support.Menu.18.2
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialog, int whichButton) {
                        String str = editText.getText().toString();
                        button.setText(Html.fromHtml(featName + ": <font color='" + Menu.this.NumberTxtColor + "'>" + str + "</font>"));
                        Preferences.changeFeatureString(featName, featNum, str);
                    }
                });
                alertName.setNegativeButton("Cancel", new DialogInterface.OnClickListener() { // from class: com.android.support.Menu.18.3
                    @Override // android.content.DialogInterface.OnClickListener
                    public void onClick(DialogInterface dialog, int whichButton) {
                        InputMethodManager imm = (InputMethodManager) Menu.this.getContext.getSystemService("input_method");
                        imm.toggleSoftInput(1, 0);
                    }
                });
                if (Menu.this.overlayRequired) {
                    AlertDialog dialog = alertName.create();
                    ((Window) Objects.requireNonNull(dialog.getWindow())).setType(Build.VERSION.SDK_INT >= 26 ? 2038 : 2002);
                    dialog.show();
                    return;
                }
                alertName.show();
            }
        });
        linearLayout2.addView(button);
        linearLayout.addView(linearLayout2);
    }

    private void CheckBox(LinearLayout linLayout, final int featNum, final String featName, boolean switchedOn) {
        CheckBox checkBox = new CheckBox(this.getContext);
        checkBox.setText(featName);
        checkBox.setTextColor(this.TEXT_COLOR);
        checkBox.setTypeface(Typeface.DEFAULT_BOLD);
        checkBox.setButtonTintList(ColorStateList.valueOf(this.CheckBoxColor));
        checkBox.setChecked(Preferences.loadPrefBool(featName, featNum, switchedOn));
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() { // from class: com.android.support.Menu.19
            @Override // android.widget.CompoundButton.OnCheckedChangeListener
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                Preferences.changeFeatureBool(featName, featNum, isChecked);
            }
        });
        linLayout.addView(checkBox);
    }

    private void RadioButton(LinearLayout linearLayout, int featNum, final String featName, String list) {
        List<String> lists = new LinkedList<>(Arrays.asList(list.split(",")));
        final TextView textView = new TextView(this.getContext);
        textView.setText(featName + ":");
        textView.setTextColor(this.TEXT_COLOR);
        textView.setTypeface(Typeface.DEFAULT_BOLD);
        final RadioGroup radioGroup = new RadioGroup(this.getContext);
        radioGroup.setPadding(20, 5, 20, 5);
        radioGroup.setOrientation(1);
        radioGroup.addView(textView);
        int i4 = 0;
        while (i4 < lists.size()) {
            final RadioButton Radioo = new RadioButton(this.getContext);
            final String radioName = lists.get(i4);
            final int featNum2 = featNum;
            View.OnClickListener first_radio_listener = new View.OnClickListener() { // from class: com.android.support.Menu.20
                @Override // android.view.View.OnClickListener
                public void onClick(View v3) {
                    textView.setText(Html.fromHtml(featName + ": <font color='" + Menu.this.NumberTxtColor + "'>" + radioName));
                    Preferences.changeFeatureInt(featName, featNum2, radioGroup.indexOfChild(Radioo));
                }
            };
            Radioo.setText(lists.get(i4));
            Radioo.setTextColor(-3355444);
            Radioo.setTypeface(Typeface.DEFAULT_BOLD);
            Radioo.setBackground(null);
            Radioo.setButtonTintList(ColorStateList.valueOf(this.RadioColor));
            Radioo.setOnClickListener(first_radio_listener);
            radioGroup.addView(Radioo);
            i4++;
            featNum = featNum2;
        }
        int index = Preferences.loadPrefInt(featName, featNum);
        if (index > 0) {
            textView.setText(Html.fromHtml(featName + ": <font color='" + this.NumberTxtColor + "'>" + lists.get(index - 1)));
            ((RadioButton) radioGroup.getChildAt(index)).setChecked(true);
        }
        linearLayout.addView(radioGroup);
    }

    private void Collapse(LinearLayout linearLayout, final String text, final boolean expanded) {
        LinearLayout.LayoutParams layoutParamsLL = new LinearLayout.LayoutParams(-1, -1);
        layoutParamsLL.setMargins(20, 10, 20, 5);
        LinearLayout linearLayout2 = new LinearLayout(this.getContext);
        linearLayout2.setLayoutParams(layoutParamsLL);
        linearLayout2.setVerticalGravity(16);
        linearLayout2.setOrientation(1);
        LayoutTransition transition = new LayoutTransition();
        transition.setDuration(200L);
        transition.enableTransitionType(4);
        linearLayout2.setLayoutTransition(transition);
        final LinearLayout collapseSub = new LinearLayout(this.getContext);
        collapseSub.setVerticalGravity(16);
        collapseSub.setPadding(0, 5, 0, 5);
        collapseSub.setOrientation(1);
        collapseSub.setBackgroundColor(0);
        collapseSub.setVisibility(8);
        this.mCollapse = collapseSub;
        final TextView textView = new TextView(this.getContext);
        GradientDrawable gd = new GradientDrawable();
        gd.setColor(this.CollapseColor);
        gd.setCornerRadius(this.BTN_CORNER);
        gd.setStroke(2, this.BTN_BORDER_COLOR);
        textView.setBackground(gd);
        textView.setText("▽ " + text + " ▽");
        textView.setGravity(17);
        textView.setTextColor(this.TEXT_COLOR);
        textView.setTypeface(null, 1);
        textView.setPadding(0, 20, 0, 20);
        if (expanded) {
            collapseSub.setVisibility(0);
            textView.setText("△ " + text + " △");
        }
        textView.setOnTouchListener(this.mSpringListener);
        textView.setOnClickListener(new View.OnClickListener() { // from class: com.android.support.Menu.21
            boolean isChecked;

            {
                this.isChecked = expanded;
            }

            @Override // android.view.View.OnClickListener
            public void onClick(View v3) {
                boolean z3 = !this.isChecked;
                this.isChecked = z3;
                if (z3) {
                    collapseSub.setVisibility(0);
                    textView.setText("△ " + text + " △");
                } else {
                    collapseSub.setVisibility(8);
                    textView.setText("▽ " + text + " ▽");
                }
            }
        });
        linearLayout2.addView(textView);
        linearLayout2.addView(collapseSub);
        linearLayout.addView(linearLayout2);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void Category(LinearLayout linLayout, String text) {
        TextView textView = new TextView(this.getContext);
        textView.setBackgroundColor(this.CategoryBG);
        textView.setText(Html.fromHtml(text.toUpperCase()));
        textView.setGravity(19);
        textView.setTextColor(this.CategoryTextColor);
        textView.setTypeface(null, 1);
        textView.setTextSize(11.0f);
        textView.setPadding(25, 20, 0, 5);
        linLayout.addView(textView);
    }

    private void TextView(LinearLayout linLayout, String text) {
        TextView textView = new TextView(this.getContext);
        textView.setText(Html.fromHtml(text));
        textView.setTextColor(this.TEXT_COLOR);
        textView.setPadding(20, 5, 20, 5);
        linLayout.addView(textView);
    }

    private void WebTextView(LinearLayout linLayout, String text) {
        WebView wView = new WebView(this.getContext);
        wView.loadData(text, "text/html", "utf-8");
        wView.setBackgroundColor(0);
        wView.setPadding(0, 5, 0, 5);
        wView.getSettings().setCacheMode(2);
        linLayout.addView(wView);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean isViewCollapsed() {
        return this.rootFrame == null || this.mCollapsed.getVisibility() == 0;
    }

    private int convertDipToPixels(int i4) {
        return (int) ((i4 * this.getContext.getResources().getDisplayMetrics().density) + 0.5f);
    }

    private int dp(int i4) {
        return (int) TypedValue.applyDimension(1, i4, this.getContext.getResources().getDisplayMetrics());
    }

    public void setVisibility(int view) {
        if (this.rootFrame != null) {
            this.rootFrame.setVisibility(view);
        }
    }

    public void onDestroy() {
        if (this.rootFrame != null) {
            this.mWindowManager.removeView(this.rootFrame);
        }
    }
}
