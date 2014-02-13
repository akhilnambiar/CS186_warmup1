// web.js
/*
var express = require("express");
var http = require('http'),
    fs = require('fs');
var app = express();


fs.readFile('./client.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    });

});
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
*/
/*
var app = require('express').createServer();

app.get('/', function(req, res){
    res.render('index.jade', { title: 'My Site' });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
*/
/*
var http = require('http'),
    fs = require('fs');


fs.readFile('./client.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});
*/

/*
var express = require('express');

var app = express.createServer();

app.use(express.staticProvider(__dirname + '/public'));

app.get('/', function(req, res) {

    res.render('client.html');
});



app.listen(port, function() {
  console.log('Listening on:', port);
});
*/













/*
var express = require('express')
  , app = express.createServer(express.logger())
  , pg = require('pg').native
  , connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dailyjs'
  , start = new Date()
  , port = process.env.PORT || 3000
  , client;

  client new pg.Client(connectionString);
  client.connect();

app.get('/', function(req, res) {
  var date = new Date();

  client.query('INSERT INTO visits(date) VALUES($1)', [date]);

  query = client.query('SELECT COUNT(date) AS count FROM visits WHERE date = $1', [date]);
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
      return res.send('No data found');
    } else {
      res.send('Visits today: ' + result.count);
    }
  });
});

app.listen(port, function() {
  console.log('Listening on:', port);
});
*/
var express = require("express");
var app = express();
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});



function UserModel(){

  /* THIS FUNCTION DOES ONE OF THREE THINGS
  1) Updates the counts of the logins in the database
  2) Returns the counts of the logins including this one
  3) Or else it will return an error code which we have to check for
  */
  this.login = login;
  var hit_count=0;
  function login(user,password){
    var row_count = 0;
    var update_query;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      console.log('the first query is: Select * from login_info where username=\''+user+'\' AND password=\''+password+'\';');
      var query = client.query('Select * from login_info where username=\''+user+'\' AND password=\''+password+'\';', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log("rows length is "+result.rows.length);
        row_count = result.rows.length;
        if (row_count<1) {
         return UserModel.ERR_BAD_CREDENTIALS;
        }
        console.log(result.rows[0].count);
        console.log("hit_count is %d",hit_count);
        /*
        query.on('row', function(row) {
          console.log("the strong hit count is"+row.username);
          hit_count = row.count+1;
          console.log("the hit count is"+hit_count);
        });
*/
        console.log('the second query is UPDATE login_info SET count='+(result.rows[0].count+1)+' WHERE username =\''+user+'\' AND password=\''+password+'\';');
        client.query('UPDATE login_info SET count='+(result.rows[0].count+1)+' WHERE username =\''+user+'\' AND password=\''+password+'\';', function(err, result) {
          done();
          if(err) return console.error(err);
          return row_count;
        });
      });
    });
  }
  this.add = add;
  function add(user,password){

  }
  /*
  This method will delete all the database rows and return SUCCESS
  */
  this.TESTAPI_resetFixture = TESTAPI_resetFixture;
  function TESTAPI_resetFixture(){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('DELETE * from login_info', function(err, result) {
        done();
        if(err) return console.error(err);
        return UserModel.SUCCESS;
      });
    });
  }

}
UserModel.ERR_BAD_CREDENTIALS = -1;
UserModel.ERR_BAD_PASSWORD = -4;
UserModel.ERR_BAD_USERNAME = -3;
UserModel.ERR_BAD_USER_EXISTS = -2;
UserModel.MAX_PASSWORD_LENGTH = 128;
UserModel.MAX_USERNAME_LENGTH = 128;
UserModel.SUCCESS = 1;







var logfmt = require("logfmt");


var pg = require('pg');
var users;
var ourUser = new UserModel();






app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  var body="";
  //res.write('Goodbye World!');
  
  //res.send('How fancy can we get with this?');
  res.writeHead(200);
  res.write('<html><body>'+body+'<br>')
  res.end('<form action="signup" method="post">Username <input type="text" name="username"><br>Password <input type="text" name="password"><input type="submit" value="Submit"></form></body></html>');
  /*
  req.on('data',function(chunk) {
    body+= chunk;
    //res.write('<html><body>'+body+'<br>')
    //res.end('<form method="post">Username <input type="text" name="firstname"><br>Password <input type="text" name="lastname"><input type="submit" value="Submit"></form></body></html>');
    console.log(body)
  });
  */
  //WE SHOULD USE POST INSTEAD 
});

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});


app.post('/signup', function(req, res) {
    //console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    //res.end('<html><body>'+username+' and '+password+'</body></html>');
    //var user = req.param("username");
    //var pass = req.param("password")
    console.log("user="+username);
    console.log("pass="+password);
    var body = "";

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      var query = client.query("SELECT * FROM login_info");
      
      query.on('row',function(row) {
        ourUser.login(username,password);
        console.log("the row is "+row.username);
        /*
        if (username.length==0 || username.length > 128 ){
          body="This is an invalid username!"
        }
        if (row.username==username){
          body="You have already been here before!"
          client.query('UPDATE login_info SET', function(err, result) {
            done();
            if(err) return console.error(err);
            console.log("WE ARE CALLING FROM WITHIN THE POST");
          });
        }
        */
      });
    /*
      client.query('SELECT * FROM login_info', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log("WE ARE CALLING FROM WITHIN THE POST");
      });
      client.query('INSERT INTO login_info VALUES (1,\''+username+'\',\''+password+'\')', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log("WE ARE CALLING FROM WITHIN THE POST AGAIN");
        //console.log(result.rows);    
        query.on('row',function(row) {
          users = ('our first user is "%s"',row.Username);
        });
      });
*/
    });




    res.end("we did it");
    /*
    User.addUser(username, password, function(err, user) {
        if (err) throw err;
        res.redirect('/form');
    });
    */
});
/*

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM login_info', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log("WE WILL BE STARTING HERE");
    //console.log(result.rows);
    query.on('row',function(row) {
      users = ('our first user is "%s"',row.Username);
    });
    
    //users = result.rows[0].Username;
  });
});
*/

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});



