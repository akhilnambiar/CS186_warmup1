package com.example.logincounter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends Activity {
	public final static String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
	

    @Override
    protected void onCreate(Bundle savedInstanceState) {
    	//next two lines could spell trouble
    	super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    	Intent intent = getIntent();
    	String message = "Please enter your credentials below";
    	message = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
    	
    	if (message!="Please enter your credentials below"){
    		TextView textView = (TextView) findViewById(R.id.status);
    		if (textView!=null){
    			textView.setText(message);
    		}
    	}
        
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    public void sendLogin(View view) {
    	//Intent intent = new Intent(this, DisplayMessageActivity.class);
        EditText user = (EditText) findViewById(R.id.mail_message);
        EditText password = (EditText) findViewById(R.id.pass_message);
        String userString = user.getText().toString();
        String passwordString = password.getText().toString();
        TaskExec runner = new TaskExec();
        runner.execute(userString, passwordString, "login");
        
    }
    public void sendAdd(View view) {
    	//Intent intent = new Intent(this, DisplayMessageActivity.class);
        EditText user = (EditText) findViewById(R.id.mail_message);
        EditText password = (EditText) findViewById(R.id.pass_message);
        String userString = user.getText().toString();
        String passwordString = password.getText().toString();
        TaskExec runner = new TaskExec();
        //we only change the last line, we could write the code better,
        //but we just want to finish the app
        runner.execute(userString, passwordString, "add");
    }
    private class TaskExec extends AsyncTask<String, String, String> {
        @Override
        protected String doInBackground(String... params){
                try{
                        //String urlParameters = "username="+params[0]+"a&password="+params[1];
                       
                        String reqServer = "http://radiant-temple-1017.herokuapp.com/users/"+params[2];
                        //what is passed in?
                        System.out.println(params[0] + " " + params[1]);
                        //we will make this string into a URL
                        URL url = new URL(reqServer);
                        //create an httpURLConnection, other mehtods are outdated
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();          
                        connection.setDoOutput(true);
                        connection.setDoInput(true);
                        //We will use the standard in stackoverflow to create it
                        connection.setRequestMethod("POST");
                        connection.setRequestProperty("Content-Type", "application/json");
                        connection.setRequestProperty("charset", "utf-8");
                        connection.connect();
                       
                        JSONObject json = new JSONObject();
                        try{
                                json.put("user", params[0]);
                                json.put("password", params[1]);
                        }
                        catch(Exception e1){
                                System.out.println("json add failed" + e1);
                        }
                       
                        byte[] outputBytes = json.toString().getBytes("UTF-8");
                        OutputStream os = connection.getOutputStream();
                        os.write(outputBytes);
                        os.flush();
                        os.close();
                       
                        StringBuilder builder = new StringBuilder();
                        InputStream myIS = connection.getInputStream();
                       
                        BufferedReader buffRead = new BufferedReader( new InputStreamReader(myIS) );
                        String output;
                        while((output = buffRead.readLine()) != null){
                        		System.out.println(output);
                                builder.append(output);
                        }
                        String result = builder.toString();
                        System.out.println(result);
                        
                        
                        //This Code will be used to Determine the Error Code
                		String testWord = "\"errCode\":";
                		int wordLen = testWord.length();
                		int a = result.indexOf("\"errCode\":")+wordLen;
                		System.out.println(a);
                		char temp = result.charAt(a);
                		int errCode;
                		if (temp=='-'){
                			errCode = Integer.parseInt(result.substring(a,a+2));
                		}
                		else{
                			errCode = Character.getNumericValue(result.charAt(a));
                		}
                		testWord = "{\"errCode\":xxx}";
                		int maxLen = testWord.length();
                		//We are seeing if count is also included by comparing length
                		//we could also do this by checking if count is present
                		int count = 0;
                		if (result.length()>maxLen){
                			testWord = "\"count\":";
                			wordLen = testWord.length();
                			int b = result.indexOf("\"count\":")+wordLen;
                			System.out.println("b is "+b);
                    		count = Integer.parseInt(result.substring(b,result.length()-1));
                		}
                		else{
                			count = 0;
                		}
                		System.out.println("errCode is"+String.valueOf(errCode));
                		System.out.println("count is "+String.valueOf(count));
                		generateNewPage(errCode,count);
                		
                		
                		
                        return result;
                }
                catch(Exception e1){
                        System.out.println(e1);
                }
                return "exception out";
        }
    }
    
    
    public void generateNewPage(int errCode,int loginCount){
    	Intent intent = new Intent(this, DisplayMessageActivity.class);
    	//String message = editText.getText().toString();
    	//String message = "errorcode is "+ String.valueOf(errCode);
    	System.out.println("the login count is "+String.valueOf(loginCount));
    	String message = "If this isn't changed there is an ERROR!";
    	if (errCode==1) {
    		message = "Welcome! You have logged in "+String.valueOf(loginCount)+" times";
    		intent.putExtra(EXTRA_MESSAGE, message);
        	startActivity(intent);
    	}
    	else if (errCode==-1) {
    		message = "Invalid username and password combination. Please try again.";
    		intent = new Intent(this, MainActivity.class);
    		intent.putExtra(EXTRA_MESSAGE, message);
        	startActivity(intent);
    	}
    	else if (errCode==-2) {
    		message = "The user name should be non-empty and at most 128 characters long. Please try again.";
    		intent = new Intent(this, MainActivity.class);
    		intent.putExtra(EXTRA_MESSAGE, message);
        	startActivity(intent);
    	}
    	else if (errCode==-3) {
    		message = "You have tried an invalid username";
    		intent = new Intent(this, MainActivity.class);
    		intent.putExtra(EXTRA_MESSAGE, message);
        	startActivity(intent);
    	}
    	else if (errCode==-4) {
    		message = "You have tried an invalid password";
    		intent = new Intent(this, MainActivity.class);
    		intent.putExtra(EXTRA_MESSAGE, message);
        	startActivity(intent);
    	}
    	intent.putExtra(EXTRA_MESSAGE, message);
    	startActivity(intent);
    }
    
    public void goBack(View view){
    	Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
    
    public void sendLoginWrong(View view) {
    	try {
    		  URL url = new URL("http://www.vogella.com");
    		  HttpURLConnection con = (HttpURLConnection) url
    		    .openConnection();
    		  readStream(con.getInputStream());
    		  } 
    	catch (Exception e) {
    		  e.printStackTrace();
    		}
    }
	private void readStream(InputStream in) {
	  BufferedReader reader = null;
	  try {
	    reader = new BufferedReader(new InputStreamReader(in));
	    String line = "";
	    while ((line = reader.readLine()) != null) {
	      System.out.println(line);
	    }
	  } catch (IOException e) {
	    e.printStackTrace();
	  } finally {
	    if (reader != null) {
	      try {
	        reader.close();
	      } catch (IOException e) {
	        e.printStackTrace();
	        }
	    }
	  }
	} 
    
}
