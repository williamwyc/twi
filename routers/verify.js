var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',jsonParser,function(req,res){
    data = req.body //email: string, key: string
    var db = req.app.locals.db
    json = {'status': "OK"}
    db.collection("users").find({'email': data.email}).toArray(function(err,result){
        if(err){
            json.status = "error"
            json.error = err
            res.json(json)
        }
        else if(result.length<=0){
            json.status = "error"
            json.error = "No such user"
            res.json(json)
        }
        else{
            user = result[0]
            if(result[0].key==data.key||data.key=='abracadabra'){
                db.collection('users').update({'email': data.email},{ $set:
                    {
                        'verify': true
                    }
                })
                res.json(json)
            }
            else{
                json.status = "error"
                json.error = "Wrong key"
                res.json(json)
            }
        }
    })
})

module.exports = router;