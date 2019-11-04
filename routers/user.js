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
    console.log("Get User:")
    console.log(req.params.username)
    req.app.locals.db.collection("users").find({'username':req.params.username}).toArray(function(err, result){
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
            email = result[0].email
            req.app.locals.db.collection("follow").find({'following': req.params.username}).toArray(function(err, result){
                if(err){
                    res.json({
                        status:"error",
                        error:err
                    });
                }
                else{
                    var followers = result.length
                    req.app.locals.db.collection("follow").find({'follower': req.params.username}).toArray(function(err, result){
                        if(err){
                            res.json({
                                status:"error",
                                error:err
                            });
                        }
                        else{
                            var following = result.length
                            res.json({
                                status:"OK",
                                user:{
                                    email: email,
                                    followers: followers,
                                    following: following
                                }
                            })
                        }
                })
                }
            })
        }
    })
});

router.get('/:username/posts',jsonParser,function(req,res){
    console.log("Get Posts:")
    console.log(req.params.username,req.query.limit)
    if(req.query.limit == null || req.query.limit <= 0){
        req.query.limit = 50
    }
    else if(req.query.limit >200){
        req.query.limit = 200
    }
    req.app.locals.db.collection("items").find({'username': req.params.username}).sort({'timestamp':-1}).limit(parseInt(req.query.limit)).toArray(function(err, result){
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
    console.log("Get Followers:")
    console.log(req.params.username,req.query.limit)
    if(req.query.limit == null || req.query.limit <= 0){
        req.query.limit = 50
    }
    else if(req.query.limit >200){
        req.query.limit = 200
    }
    req.app.locals.db.collection("follow").find({"following":req.params.username}).limit(parseInt(req.query.limit)).toArray(function(err,result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            followers = []
            for(var i = 0; i<result.length; i++){
                followers.push(result[i].follower)
            }
            res.json({
                status: "OK",
                users: followers
            })
        }
    })
})

router.get('/:username/following',jsonParser,function(req,res){
    console.log("Get Following:")
    console.log(req.params.username,req.query.limit)
    if(req.query.limit == null || req.query.limit <= 0){
        req.query.limit = 50
    }
    else if(req.query.limit >200){
        req.query.limit = 200
    }
    var db = req.app.locals.db
    db.collection("follow").find({"follower":req.params.username}).limit(parseInt(req.query.limit)).toArray(function(err,result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            followings = []
            for(var i = 0; i<result.length; i++){
                followings.push(result[i].following)
            }
            res.json({
                status: "OK",
                users: followings
            })
        }
    })
})

module.exports = router;