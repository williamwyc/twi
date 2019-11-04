var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
//var request = require('request');

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
    console.log("Verify a user:")
    console.log(data)
    data = req.body //email: string, key: string
    var db = req.app.locals.db
    db.collection("users").find({'email': data.email}).toArray(function(err,result){
        if(err){
            json = {
                'status': "error",
                'error': err
            }
            console.log(err)
            res.json(json)
        }
        else if(result.length<=0){
            json = {
                'status': "error",
                'error': "No such user"
            }
            console.log("No such user")
            res.json(json)
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
                res.json(json)
            }
            else{
                json = {
                    'status': "error",
                    'error': "Wrong key"
                }
                console.log("Wrong key")
                res.json(json)
            }
        }
    })
})

module.exports = router;