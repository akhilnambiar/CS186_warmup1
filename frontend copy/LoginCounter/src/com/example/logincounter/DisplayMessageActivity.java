package com.example.logincounter;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.NavUtils;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class DisplayMessageActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_display_message);
		// Show the Up button in the action bar.
		Intent intent = getIntent();
		String message = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
		//creating textView
		
		TextView textView = (TextView) findViewById(R.id.sent_message);
		textView.setTextSize(10);
		textView.setText(message);
		
		/*
		Button backButton = new Button(this);
		//Set the text view as the activity layout
		setContentView(textView);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Perform action on click
            }
        });
		*/
		setupActionBar();
	}
	public void goBack(View view){
    	Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

	/**
	 * Set up the {@link android.app.ActionBar}, if the API is available.
	 */
	@TargetApi(Build.VERSION_CODES.HONEYCOMB)
	private void setupActionBar() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
			getActionBar().setDisplayHomeAsUpEnabled(true);
		}
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case android.R.id.home:
			// This ID represents the Home or Up button. In the case of this
			// activity, the Up button is shown. Use NavUtils to allow users
			// to navigate up one level in the application structure. For
			// more details, see the Navigation pattern on Android Design:
			//
			// http://developer.android.com/design/patterns/navigation.html#up-vs-back
			//
			NavUtils.navigateUpFromSameTask(this);
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

}
