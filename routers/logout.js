var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');

router.post('/',jsonParser,function(req,res){
    req.session = null;
    req.cookies.session = null
    res.status(200).json({'status':'OK'});
})

module.exports = router;