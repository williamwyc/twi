var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');


//Gets user profile information for <username> (user doesn’t need to be signed in)
router.get('/:username',(req,res)=>{
    var username=req.params.username;
    db.collection("users").find({'username':username}).toArray(function(err, result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else if(result.length<=0){
            res.json({
                status:"error",
                error:"No such user"
            });
        }
        else{
            var u = result[0]
            var email = u.email
            var followers = db.collection("follow").find({'following': username}).count()
            var following = db.collection("follow").find({'follower': username}).count()
            res.json({
                status:"OK",
                user:{
                    email: email,
                    followers: followers,
                    following: following
                }
            });
        }
    })
});

router.get('/:username/posts',jsonParser,function(req,res){
    var username=req.params.username;
    var limit = req.body.limit
    if(limit == null || limit <= 0){
        limit = 50
    }
    else if(limit >200){
        limit = 200
    }
    var db = req.app.locals.db
    db.collection("items").find({'username': username}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            items = []
            for(var i = 0; i<result.length; i++){
                items.push(result[i].id)
            }
            res.json({
                status: "OK",
                items: items
            })
        }

    })
})

router.get('/:username/followers',jsonParser,function(req,res){
    var username=req.params.username;
    var limit = req.body.limit
    if(limit == null || limit <= 0){
        limit = 50
    }
    else if(limit >200){
        limit = 200
    }
    var db = req.app.locals.db
    db.collection("follow").find({"following":username}).limit(parseInt(limit)).toArray(function(err,result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            res.json({
                status: "OK",
                users: result
            })
        }
    })
})

router.get('/:username/following',jsonParser,function(req,res){
    var username=req.params.username;
    var limit = req.body.limit
    if(limit == null || limit <= 0){
        limit = 50
    }
    else if(limit >200){
        limit = 200
    }
    var db = req.app.locals.db
    db.collection("follow").find({"follower":username}).limit(parseInt(limit)).toArray(function(err,result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            res.json({
                status: "OK",
                users: result
            })
        }
    })
})

module.exports = router;