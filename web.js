// web.js

//CODE BANK

/*
query.on('row', function(row) {
  console.log("the strong hit count is"+row.username);
  hit_count = row.count+1;
  console.log("the hit count is"+hit_count);
});
*/

var express = require("express");
var app = express();
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});
/*
function TestUsers(){
  //UnitTest!!!!
  this.setup = setup;
  function setup(){

  }
  function testAdd1(){

  }
  function testAddExists(){

  }
  function test Add2(){

  }
  function testAddEmptyUsername(){

  }
}

*/

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
    /*
    console.log('add was called');
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            if(user == ""){
                return this.ERR_BAD_USERNAME;
            }
            var row_count = 0;
            client.query("SELECT count FROM login_info WHERE username=\'"+user+"\'AND password=\'" + password+"\';", function(err, result){
                done();
                if(err) return console.error(err);
                row_count = result.rows[0];
            });
            if(row_count > 0){
                return this.ERR_BAD_USER_EXISTS;
            }
            else{
                client.query("INSERT INTO login_info (username, password, count) VALUES (\'"+user+"\', \'"+password+"\',1);");
                return this.SUCCESS;
            }  
      });
      */
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            if(user == ""){
                console.log("got a username thats an empty string");
                return this.ERR_BAD_USERNAME;
            }
           
            console.log('SELECT * FROM login_info WHERE username=\''+user+'\' AND password=\'' + password+'\';');
            client.query('SELECT * FROM login_info WHERE username=\''+user+'\' AND password=\'' + password+'\';', function(err, result){
                done();
                if(err) return console.error(err);
                console.log(result);
                if(result.rows.length > 0){
                    console.log("tried to add already existing user");
                    return this.ERR_BAD_USER_EXISTS;
                }
                else{
                    console.log("INSERT INTO login_info (username, password, count) VALUES (\'"+user+"\', \'"+password+"\',1);");
                    client.query("INSERT INTO login_info (username, password, count) VALUES (\'"+user+"\', \'"+password+"\',1);");
                    return this.SUCCESS;
                }
            });
        });
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
  res.end('<form action="signup" method="post">Username <input type="text" name="username"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/add"></form></body></html>');
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


app.post('/users/login', function(req, res) {
    //console.log(req.body);
    res.write("<html><body>")
    var body = "<button onclick='window.location.assign(\"http://radiant-temple-1017.herokuapp.com/\");'>Click me</button>";
    var username = req.body.username;
    var password = req.body.password;
    //res.end('<html><body>'+username+' and '+password+'</body></html>');
    //var user = req.param("username");
    //var pass = req.param("password")
    console.log("user="+username);
    console.log("pass="+password);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      query = client.query('Select * from login_info where username=\''+username+'\' AND password=\''+password+'\';', function(err, result) {
        //done();
        //query.on('row',function(row) {
        var status = ourUser.login(username,password);
        console.log("The login status is "+status);
        /*
        if (result.rows.length<1) {
            res.write("welcome new user!");
            ourUser.add(username,password);
          }
          else if (username==result.rows[0].username && password==result.rows[0].password){
            console.log("rowuser="+result.rows[0].username);
            console.log("rowpass="+result.rows[0].password);
            var status = ourUser.login(username,password);
          }

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
        //});
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
    res.write(body);
    res.end("we did it</body></html>");
    /*
    User.addUser(username, password, function(err, user) {
        if (err) throw err;
        res.redirect('/form');
    });
    */
});

app.post('/users/add', function(req, res) {
    //console.log(req.body);
    res.write("<html><body>")
    var body = "<button onclick='window.location.assign(\"http://radiant-temple-1017.herokuapp.com/\");'>Click me</button>";
    var username = req.body.username;
    var password = req.body.password;
    //res.end('<html><body>'+username+' and '+password+'</body></html>');
    //var user = req.param("username");
    //var pass = req.param("password")
    console.log("user="+username);
    console.log("pass="+password);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      query = client.query('Select * from login_info where username=\''+username+'\' AND password=\''+password+'\';', function(err, result) {
        //done();
        //query.on('row',function(row) {
        var status = ourUser.add(username,password);
        console.log("The add result is "+status);
        /*
        if (result.rows.length<1) {
            res.write("welcome new user!");
            ourUser.add(username,password);
          }
          else if (username==result.rows[0].username && password==result.rows[0].password){
            console.log("rowuser="+result.rows[0].username);
            console.log("rowpass="+result.rows[0].password);
            var status = ourUser.login(username,password);
          }
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
        //});
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
    res.write(body);
    res.end("we did it</body></html>");
    /*
    User.addUser(username, password, function(err, user) {
        if (err) throw err;
        res.redirect('/form');
    });
    */
});

app.post('/TESTAPI/resetFixture', function(req, res) {
  ourUser.TESTAPI_resetFixture();
});

app.post('/TESTAPI/unitTests', function(req, res) {
  ourUser.TESTAPI_resetFixture();
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



