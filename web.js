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
var logfmt = require("logfmt");
var app = express();

var pg = require('pg');
var users;

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM login_info', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log("WE WILL BE STARTING HERE");
    //console.log(result.rows);
    /*    
    query.on('row',function(row) {
      users = ('our first user is "%s"',row.Username);
    });
    */
    
    users = result.rows[0].Username;
  });
});


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

app.post('/signup', function(req, res) {
    //console.log(req.body);
    //var username = req.body.username;
    //var password = req.body.password;
    //res.end('<html><body>'+username+' and '+password+'</body></html>');
  var user = req.param("username");
  var pass = req.param("password")
  console.log("user="+username);
  console.log("pass="+password);
    /*
    User.addUser(username, password, function(err, user) {
        if (err) throw err;
        res.redirect('/form');
    });
    */
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});



