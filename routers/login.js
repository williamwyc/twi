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
    //username: string, password: string
    var db = req.app.locals.db
    db.collection("users").find({'username': req.body.username}).toArray(function(err, result){
        if(err){
            console.log(err)
            res.status(500).json({
                'status': "error",
                'error': err
            })
        }
        else if(result.length<=0){
            res.status(400).json({
                'status': "error",
                'error': "No such user"
            })
        }
        else{
            user = result[0]
            if(user.password != req.body.password){
                res.status(400).json({
                    'status': "error",
                    'error': "Wrong Password"
                })
            }
            else if(user.verify == false){
                res.status(400).json({
                    'status': "error",
                    'error': "Not verified"
                })
            }
            else{
                req.session.user = req.body.username
                res.status(200).json({'status': "OK"})
            }
        }
    })
})

module.exports = router;