var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

router.post('/',jsonParser,function(req,res){
    console.log("Follow: ")
    console.log(req.session.user, req.body.username)
    if(req.session.user == null || req.body.username == null){
        res.status(500).json({
            'status': 'error',
            'error': 'req.body.username is null'
        })
    }
    else{
        if(req.body.follow == null){
            req.body.follow = true
        }
        var db = req.app.locals.db
        db.collection("users").find({'username':req.body.username}).toArray(function(err, result){
            if(err){
                res.status(500).json({
                    'status': 'error',
                    'error':err
                })
            }
            else if(result.length<=0){
                res.status(400).json({
                    'status': 'error',
                    'error':'User does not exist'
                })
            }
            else{
                if(req.body.follow){
                    db.collection("follow").find({'following': req.body.username, 'follower': req.session.user}).toArray(function(err, result){
                        if(err){
                            res.status(500).json({
                                'status': 'error',
                                'error':err
                            })
                        }
                        else if(result.length>0){
                            res.status(200).json({
                                'status': 'error',
                                'error':'Already followed'
                            })
                        }
                        else{
                            db.collection("follow").insertOne({'following': req.body.username, 'follower': req.session.user}, function(err, result){
                                if(err){
                                    json = {
                                        'status': "error",
                                        'error': err
                                    }
                                    res.status(500).json(json)
                                }
                                else{
                                    json = {'status': "OK"}
                                    res.status(200).json(json)
                                }
                            })
                        }            
            
                    })
                }
                else{
                    
                    db.collection("follow").remove({'following': req.body.username, 'follower': req.session.user}, function(err, obj){
                        if(err){
                            res.status(500).json({
                                status:"error",
                                error:err
                            });
                        }
                        else if(obj.result.n <= 0){
                            res.status(400).json({
                                status:"error",
                                error:"Not followed"
                            });
                        }
                        else{
                            res.status(200).json({
                                status:"OK"
                            });
                        }
                    })
                }
            }
        })
    }
    

})

module.exports = router;