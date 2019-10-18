var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

module.exports = router;