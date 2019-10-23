var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.get('/',jsonParser,(req,res)=>{
    res.render('login.ejs',{data:null});
});
router.post('/',jsonParser,function(req,res){
    data = req.body //username: string, password: string
    var db = req.app.locals.db
    db.collection("users").find({'username': data.username}).toArray(function(err, result){
        if(err){
            var json = {
                'status': "error",
                'error': err
            }
            res.json(json)
        }
        else if(result.length<=0){
            //json.error = "No such user"
            var json = {
                'status': "error",
                'error': "No such user"
            }
            res.json(json)
        }
        else{
            user = result[0]
            if(user.password != data.password){
                var json = {
                    'status': "error",
                    'error': "Wrong Password"
                }
                res.json(json)
            }
            else if(user.verify == false){
                var json = {
                    'status': "error",
                    'error': "Not verified"
                }
                res.json(json)
            }
            else{
                req.session.user = data.username
                var json = {'status': "OK"}
                res.json(json)
            }
        }
    })
})

module.exports = router;