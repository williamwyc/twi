var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',jsonParser,function(req,res){
    data = req.body //username: string, password: string
    var db = req.app.locals.db
    json = {'status': "OK"}
    db.collection("users").find({'username': data.username}).toArray(function(err, result){
        if(err){
            json.status = "error"
            json.error = err
        }
        else if(result.length<=0){
            json.status = "error"
            json.error = "No such user"
        }
        else{
            user = result[0]
            if(user.password != data.password){
                json.status = "error"
                json.error = "Wrong Password"
            }
            else if(user.verify == false){
                json.status = "error"
                json.error = "Not verified"
            }
            else{
                req.session.user = data.username
            }
        }
    })
    res.json(json)
})

module.exports = router;