var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',jsonParser,function(req,res){
    var username = req.body.username
    var follow = req.body.follow
    var user = req.session.user
    if(user == null || username == null){
        res.json({
            'status': 'error',
            'error': 'username is null'
        })
    }
    if(follow == null){
        follow = true
    }
    if(follow){
        db.collection("follow").find({'following': username, 'follower': user}).toArray(function(err, result){
            if(err){
                res.json({
                    'status': 'error',
                    'error':err
                })
            }
            else if(result.length>0){
                res.json({
                    'status': 'error',
                    'error':'Already followed'
                })
            }
            else{
                db.collection("follow").insertOne({'following': username, 'follower': user}, function(err, result){
                    if(err){
                        json = {
                            'status': "error",
                            'error': err
                        }
                        res.json(json)
                    }
                    else{
                        json = {'status': "OK"}
                        res.json(json)
                    }
                })
            }            

        })
    }
    else{
        db.collection("follow").remove({'following': username, 'follower': user}, function(err, obj){
            if(err){
                res.json({
                    status:"error",
                    error:err
                });
            }
            else if(obj.result.n <= 0){
                res.json({
                    status:"error",
                    error:"Not followed"
                });
            }
            else{
                res.json({
                    status:"OK"
                });
            }
        })
    }

})

module.exports = router;