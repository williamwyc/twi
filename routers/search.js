var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',(req,res)=>{
    console.log("Search: ")
    console.log(req.body.timestamp, req.body.limit, req.body.q, req.body.username, req.body.following)
    //Default value
    if(req.body.timestamp == null || req.body.timestamp <= 0){
        req.body.timestamp = Date.now()
    }
    if(req.body.limit == null || parseInt(req.body.limit) <= 0){
        req.body.limit = 25
    }
    else if(parseInt(req.body.limit) >= 100){
        req.body.limit = 100
    }
    if(req.body.following == null){
        if(req.session.user == null){
            res.json({
                status:"error",
                error:"Login First"
            });
        }
        else{
            req.body.following = true
            search(req.body.timestamp,req.body.limit,req.body.q,req.body.username,req.body.following,req.app.locals.db,req,res);
        }
    }
    else if(req.body.following == true){
        if(req.session.user == null){
            res.json({
                status:"error",
                error:"Login First"
            });
        }
        else{
            search(req.body.timestamp,req.body.limit,req.body.q,req.body.username,req.body.following,req.app.locals.db,req,res);
        }
    }
    else{
        search(req.body.timestamp,req.body.limit,req.body.q,req.body.username,req.body.following,req.app.locals.db,req,res);
    }
});

function search(timestamp,limit,q,username,following,db,req,res){
    //q = ('/'+(q.split(' ').join('/ /'))+'/').split(' ')
    var query = {'timestamp':{$lt:timestamp*1000}}
    if (req.body.q != null && req.body.q != "") {
        query.$text = {$search: req.body.q}
    }
    if(username!=null){
        query.username = username
        db.collection("items").find(query).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
            if(err){
                console.log(err)
                res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                console.log(result)
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
                console.log(err)
                res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                query.username = {$in:result}
                db.collection("items").find(query).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
                    if(err){
                        console.log(err)
                        res.json({
                            status:"error",
                            error:err
                        });
                    }
                    else{
                        console.log(result)
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
        db.collection("items").find(query).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
            if(err){
                console.log(err)
                res.json({
                    status:"error",
                    error:err
                });
            }
            else{
                console.log(result)
                res.json({
                    status:"OK",
                    items:result
                });
            }
        })
    }
    // if(username!=null){
    //     db.collection("items").find({'timestamp':{$lt:timestamp*1000},'username':username,'content':{$in:q}}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
    //         if(err){
    //             console.log(err)
    //             res.json({
    //                 status:"error",
    //                 error:err
    //             });
    //         }
    //         else{
    //             console.log(result)
    //             res.json({
    //                 status:"OK",
    //                 items:result
    //             });
    //         }
    //     })
    // }
    // else if(following){
    //     db.collection("follow").find({'follower':req.session.user}).toArray(function(err, result){
    //         if(err){
    //             console.log(err)
    //             res.json({
    //                 status:"error",
    //                 error:err
    //             });
    //         }
    //         else{
    //             db.collection("items").find({'timestamp':{$lt:timestamp*1000},'username':{$in:result},'content':{$in:q}}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
    //                 if(err){
    //                     console.log(err)
    //                     res.json({
    //                         status:"error",
    //                         error:err
    //                     });
    //                 }
    //                 else{
    //                     console.log(result)
    //                     res.json({
    //                         status:"OK",
    //                         items:result
    //                     });
    //                 }
    //             })
    //         }
    //     })
    // }
    // else{
    //     db.collection("items").find({'timestamp':{$lt:timestamp*1000},'content':{$in:q}}).sort({'timestamp':-1}).limit(parseInt(limit)).toArray(function(err, result){
    //         if(err){
    //             console.log(err)
    //             res.json({
    //                 status:"error",
    //                 error:err
    //             });
    //         }
    //         else{
    //             console.log(result)
    //             res.json({
    //                 status:"OK",
    //                 items:result
    //             });
    //         }
    //     })
    // }
}

module.exports = router;