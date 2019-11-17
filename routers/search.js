var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;

router.post('/',(req,res)=>{
    console.log("Search: ")
    if(req.body.following == null){
        if(req.session.user == null){
            res.json({
                status:"error",
                error:"Login First"
            });
        }
    }
    else if(req.body.following == true){
        if(req.session.user == null){
            res.json({
                status:"error",
                error:"Login First"
            });
        }
    }

    //Default values
    req.body.current = Date.now()
    if(req.body.timestamp == null || req.body.timestamp == '' || req.body.timestamp <= 0){
        req.body.timestamp = req.body.current
    }
    if(req.body.limit == null || req.body.limit == '' ||parseInt(req.body.limit) <= 0){
        req.body.limit = 25
    }
    else if(parseInt(req.body.limit) >= 100){
        req.body.limit = 100
    }
    if(req.body.rank == null){
        req.body.rank = 'interest'
    }
    if(req.body.parent == null){
        req.body.parent = 'none'
    }
    if(req.body.replies == null){
        req.body.replies = true
    }
    if(req.body.hasMedia == null){
        req.body.hasMedia = false
    }

    //query
    req.body.query = {'timestamp':{$lt:req.body.timestamp*1000}}
    if (req.body.q != null && req.body.q != "") {
        req.body.query.$text = {$search: req.body.q}
    }
    if(req.body.username!=null&&req.body.username!=''){
        req.body.query.username = username
    }
    else if(req.following){
        req.app.locals.db.collection("follow").find({'follower':req.session.user}).toArray(function(err, result){
            if(err){
                console.log(err)
                return res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                req.body.query.username = {$in:result}
            }
        })
    }
    if(!req.body.replies){
        req.body.query.parent = {$ne:'reply'}
    }
    else{
        if(req.body.parent!=null && req.body.parent != 'none' && req.body.parent != ''){
            req.body.query.parent = req.body.parent
        }
    }
    if(req.body.hasMedia){
        req.body.query.media = {$ne:[]}
    }
    console.log(req.body.query)
    itemSearch(req,res)
});

function itemSearch(req,res){
    req.app.locals.db.collection("items").find(req.body.query).sort({'timestamp':-1}).limit(parseInt(req.body.limit)).toArray(function(err, result){
        if(err){
            console.log(err)
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            if(req.body.rank == 'interest'){
                result.sort(function(a,b){
                    return (b.property.likes+b.retweeted)/(req.body.current-b.timestamp) - (a.property.likes+a.retweeted)/(req.body.current-a.timestamp)
                })
                console.log(result)
                res.json({
                    status:"OK",
                    items:result
                });
            }
            else{
                console.log(result)
                res.json({
                    status:"OK",
                    items:result
                });
            }
        }
    })
}
module.exports = router;