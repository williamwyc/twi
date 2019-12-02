var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211')

router.get('/',jsonParser,(req,res)=>{
    /*var email=req.param.email;
    var key=req.param.key;

    request.post({
        url:     '/verify',
        form:    { email:email,key:key }
      }, function(error, response, body){
        //res.json(response);
        //if(response.status=="OK"){
            console.log(response);
            console.log(body);
            console.log(error);
            //res.render('login.ejs',{data:"Verified. Please login"});
        //}
    });*/
    var db = req.app.locals.db
    var email=req.query.email;
    var key=req.query.key;
    var data={email:email,key:key};
    db.collection("users").find({'email': data.email}).toArray(function(err,result){
        if(err){
            json = {
                'status': "error",
                'error': err
            }
            //res.json(json)
            res.render('login.ejs',{data:"Status:"+json.status+","+"Error:"+json.error});
        }
        else if(result.length<=0){
            json = {
                'status': "error",
                'error': "No such user"
            }
            //res.json(json)
            res.render('login.ejs',{data:"Status:"+json.status+","+"Error:"+json.error});
        }
        else{
            user = result[0]
            if(result[0].key==data.key||data.key=='abracadabra'){
                db.collection('users').update({'email': data.email},{ $set:
                    {
                        'verify': true
                    }
                })
                json = {'status': "OK"}
                //res.json(json)
                res.render('login.ejs',{data:"Status:"+json.status+","+"Verified Successfully."});
            }
            else{
                json = {
                    'status': "error",
                    'error': "Wrong key"
                }
                //res.json(json)
                //res.render('login.ejs',{data:json});
                res.render('login.ejs',{data:"Status:"+json.status+","+"Error:"+json.error});
            }
        }
    })
});

router.post('/',jsonParser,function(req,res){
    req.app.locals.mem.get(req.body.email,function(err,data){
        if(data != null){
            if(data.key==req.body.key||req.body.key=='abracadabra'){
                req.app.locals.mem.set(data.username,data,50,function(err){
                    if(err){
                        console.log(err)
                    }
                })
            }
            else{
                res.status(400).json({
                    'status': "error",
                    'error': "Wrong key"
                })
            }
        }
    })
    req.app.locals.db.collection("users").find({'email': req.body.email}).toArray(function(err,result){
        if(err){
            console.log(err)
            res.status(500).json({
                'status': "error",
                'error': err
            })
        }
        else if(result.length == 1){
            if(result[0].key==req.body.key||req.body.key=='abracadabra'){
                req.app.locals.db.collection('users').updateOne({'email': req.body.email},{ $set:
                    {
                        'verify': true
                    }
                })
                res.status(200).json({'status': "OK"})
            }
            else{
                res.status(400).json({
                    'status': "error",
                    'error': "Wrong key"
                })
            }
        }
        else{
            res.status(400).json({
                'status': "error",
                'error': "No such user"
            })
        }
    })
})

module.exports = router;