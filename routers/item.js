var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var request = require('request');
var cookieParser = require('cookie-parser');

router.get('/:id',(req,res)=>{
    // getItem(req.params.id,req.app.locals.db,res);
    request({  
        url: "http://152.44.32.147/item/"+req.params.id,
        method: 'GET',
        json: req.body
    }, 
    function(err, response, body) {  
        if(err){
            console.log(err);
        }
        else if(body.status=='error'){
            res.status(404).json(body);
        }else{
            res.json(body);
        }
    });
});

router.delete('/:id',(req,res)=>{
    //deleteItem(req.params.id,req.app.locals.db,req,res);
    if(req.cookies.a == null || req.cookies.a.user == null){
        res.status(400).json({
            'status': 'error',
            'error': 'User not login'
        })
    }
    else{
        req.body.current_user = req.cookies.a.user
        request({  
            url: "http://152.44.32.147/item/"+req.params.id,
            method: 'DELETE',
            json: req.body
        }, 
        function(err, response, body) {  
            if(err){
                console.log(err);
            }
            else if(body.status=='error'){
                res.status(404).json(body);
            }else{
                res.json(body);
            }
        });
    }
});

router.post('/:id/like',(req,res)=>{
    if(req.cookies.a == null || req.cookies.a.user == null){
        res.status(400).json({
            'status': 'error',
            'error': 'User not login'
        })
    }
    else{
        if(req.body.like == null){
            req.body.like = true
        }
        req.body.current_user = req.cookies.a.user
        request({  
            url: "http://152.44.32.147/item/"+req.params.id+"/like",
            method: 'POST',
            json: req.body
        }, 
        function(err, response, body) {  
            if(err){
                console.log(err);
            }
            else if(body.status=='error'){
                res.status(400).json(body);
            }else{
                res.json(body);
            }
        });
    }
});

function likeItem(id,req,res){
    req.app.locals.db.collection("items").find({'id':id}).toArray(function(err,result){
        if(err){
            console.log(err)
            res.status(500).json({
                status:"error",
                error:err
            });
        }
        else if(result.length<=0){
            res.status(400).json({
                status:"error",
                error:"No such tweet"
            });
        }
        else{
            if(req.body.like==true||req.body.like=="true"){
                if(result[0].property.likers.find(element => element == req.session.user) == null){
                    req.app.locals.db.collection("items").update({'id':id},{$inc: { 'property.likes': 1 }})
                    req.app.locals.db.collection("items").update({'id':id},{$push:{'property.likers':req.session.user}})
                    res.status(200).json({
                        status:"OK"
                    });
                }
                else{
                    res.status(400).json({
                        status:"error",
                        error:"Already liked"
                    });
                }
            }else{
                if(result[0].property.likers.find(element => element == req.session.user) == null){
                    res.status(400).json({
                        status:"error",
                        error:"Unliked before"
                    });
                }
                else{
                    req.app.locals.db.collection("items").update({'id':id},{$inc: { 'property.likes': -1 }})
                    req.app.locals.db.collection("items").update({'id':id},{$pull:{'property.likers':req.session.user}})
                    res.status(200).json({
                        status:"OK"
                    });
                }
            }
        }
    })
}

function getItem(id,db,res){
    //DB operation:Get contents of a single <id> item
    db.collection("items").find({'id': id}).toArray(function(err, result){
        if(err){
            console.log(err)
            res.status(500).json({
                status:"error",
                error:err
            });
        }
        else if(result.length<=0){
            res.status(400).json({
                status:"error",
                error:"No such tweet"
            });
        }
        else{
            res.status(200).json({
                status:"OK",
                item:result[0]
            });
        }
    })
}

function deleteItem(id,db,req,res){
    //DB operation: Delete contents of a single <id> item
    db.collection("items").find({'id': id, 'username': req.session.user}).toArray(function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({
                status:"error",
                error:err
            });
        }
        else if(result.length<=0){
            res.status(400).json({
                status:"error",
                error:"No such item"
            });
        }
        else if(result[0].media!=null && result[0].media.length>0){
            db.collection("medias").deleteMany({'id':{$in: result[0].media}},function(err,obj){
                if(err){
                    console.log(err)
                    res.status(400).json({
                        status:"error",
                        error:err
                    });
                }
                else{
                    db.collection("items").remove({'id': id, 'username': req.session.user}, function(err, obj){
                        if(err){
                            console.log(err)
                            res.status(400).json({
                                status:"error",
                                error:err
                            });
                        }
                        else{
                            req.body.query= 'DELETE FROM medias WHERE id in (\'';
                            for(var i=0; i< result[0].media.length-1; i++) {
                                req.body.query += result[0].media[i] + "\', \'";
                            }
                            req.body.query += result[0].media[result[0].media.length-1]+"\');"
                            req.app.locals.client.execute(req.body.query, {prepare :true}, function(err, result){
                                if(err){
                                    console.log(err)
                                    res.status(400).json({
                                        status:"error",
                                        error:err
                                    })
                                }
                                else{
                                    res.status(200).json({
                                        status:"OK"
                                    })
                                }
                            });
                        }
                    })
                }
            })
        }
        else{
            db.collection("items").remove({'id': id, 'username': req.session.user}, function(err, obj){
                if(err){
                    console.log(err)
                    res.status(400).json({
                        status:"error",
                        error:err
                    });
                }
                else{
                    res.status(200).json({
                        status:"OK"
                    });
                }
            })
        }
        
    })
}

module.exports = router;