var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',(req,res)=>{
    var timestamp=req.body.timestamp;
    var limit=req.body.limit;
    var q = req.body.q;//search query
    var username = req.body.username;//username
    var following = req.body.following;
    var db = req.app.locals.db
    var user = req.session.user
    //Default value
    if(timestamp == null || timestamp <= 0){
        timestamp = Date.now()
    }
    if(limit == null || parseInt(limit) <= 0){
        limit = 25
    }
    else if(parseInt(limit) >= 100){
        limit = 100
    }
    if(following == null){
        if(user == null){
            res.json({
                status:"error",
                error:"Login First"
            });
        }
        else{
            following = true
        }
    }
    else if(following == true){
        if(user == null){
            res.json({
                status:"error",
                error:"Login First"
            });
        }
    }
    search(timestamp,limit,q,username,following,db,req,res);
});

function search(timestamp,limit,q,username,following,db,req,res){
    if(username!=null){
        db.collection("items").find({'timestamp':{$lt:timestamp*1000},'username':username,'content':{$regex:q+".*"}}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
            if(err){
                res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                res.json({
                    status:"OK",
                    items:result
                });
            }
        })
    }
    else if(following){
        db.collection("follow").find({'follower':req.session.user}).toArray(function(err, result){
            if(err){
                res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                db.collection("items").find({'timestamp':{$lt:timestamp*1000},'username':{$in:result},'content':{$regex:q+".*"}}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
                    if(err){
                        res.json({
                            status:"error",
                            error:err
                        });
                    }
                    else{
                        res.json({
                            status:"OK",
                            items:result
                        });
                    }
                })
            }
        })
    }
    else{
        db.collection("items").find({'timestamp':{$lt:timestamp*1000},'content':{$regex:q+".*"}}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
            if(err){
                res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                res.json({
                    status:"OK",
                    items:result
                });
            }
        })
    }
}

module.exports = router;