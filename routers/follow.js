var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

router.post('/',jsonParser,function(req,res){
    console.log("Follow:")
    console.log(req.session.user)
    console.log(req.body)
    if(req.session.user == null){
        console.log('User not login')
        res.status(400).json({
            'status': 'error',
            'error': 'User not login'
        })
    }
    else if(req.body.username == null){
        console.log('Following not specified.')
        res.status(400).json({
            'status': 'error',
            'error': 'User not login'
        })
    }
    else{
        if(req.body.follow == null){
            req.body.follow = true
        }
        var db = req.app.locals.db
        db.collection("users").find({'username':req.body.username}).toArray(function(err, result){
            if(err){
                console.log(err)
                res.status(500).json({
                    'status': 'error',
                    'error':err
                })
            }
            else if(result.length<=0){
                console.log('User does not exist')
                res.status(400).json({
                    'status': 'error',
                    'error':'User does not exist'
                })
            }
            else{
                if(req.body.follow == true){
                    db.collection("follow").find({'following': req.body.username, 'follower': req.session.user}).toArray(function(err, result){
                        if(err){
                            console.log(err)
                            res.status(500).json({
                                'status': 'error',
                                'error':err
                            })
                        }
                        else if(result.length>0){
                            console.log('Already followed')
                            res.status(200).json({
                                'status': 'error',
                                'error':'Already followed'
                            })
                        }
                        else{
                            db.collection("follow").insertOne({'following': req.body.username, 'follower': req.session.user}, function(err, result){
                                if(err){
                                    console.log(err)
                                    res.status(500).json({
                                        'status': "error",
                                        'error': err
                                    })
                                }
                                else{
                                    res.status(200).json({'status': "OK"})
                                }
                            })
                        }            
            
                    })
                }
                else{
                    
                    db.collection("follow").remove({'following': req.body.username, 'follower': req.session.user}, function(err, obj){
                        if(err){
                            console.log(err)
                            res.status(500).json({
                                status:"error",
                                error:err
                            });
                        }
                        else if(obj.result.n <= 0){
                            console.log("Not followed")
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