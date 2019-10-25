package com.mobile_user;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
	@Override
	protected void onCreate(Bundle state){
		super.onCreate(state);

		SharedPreferences preferences =
			PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
		preferences.edit().putString("debug_http_host", "localhost:8082").apply();
	}
	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
	}
	@Override
	protected String getMainComponentName() {
		return "mobile_user";
	}
}
