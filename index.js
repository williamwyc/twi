var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var cookieSession = require('cookie-session');
app.use(express.static(__dirname));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cookieSession({
    name: 'session',
    keys: ['amiya'],
  }))

var adduser = require("./routers/adduser.js")
var login = require("./routers/login.js")
var logout = require("./routers/logout.js")
var verify = require("./routers/verify.js")
var additem = require("./routers/additem.js")
var item = require("./routers/item.js")
var search = require("./routers/search.js")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/adduser", adduser)
app.use("/login", login)
app.use("/logout", logout)
app.use("/verify", verify)
app.use("/additem", additem)
app.use("/item", item)
app.use("/search", search)
app.use(express.static(__dirname));

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname));
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/html/index.html" );
})

MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true, useNewUrlParser: true },function(err,client){
  if (err){
    throw err;
  }
  console.log('Mongodb Connected');
  app.locals.db = client.db('twi');
  app.listen(3000, function(){
    console.log("Listening...")
  })
})