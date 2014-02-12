// web.js
var app = require('express').createServer();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(port, function() {
  console.log('Listening on:', port);
});
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
    
    query.on('row',function(row) {
      users = ('our first user is "%s"',row.Username);
    });
    
    users = result.rows[0].Username;
  });
});


app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  //res.write('Goodbye World!');
  res.send("%s",users);
  //res.send('How fancy can we get with this?');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
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