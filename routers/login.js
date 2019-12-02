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
    req.app.locals.mem.get(req.body.username,function(err,data){
        if(err){
            console.log(err)
            res.status(500).json({
                'status': "error",
                'error': err
            })
        }
        else if(data != null){
            if(data.password != req.body.password){
                console.log("Wrong Password")
                res.status(402).json({
                    'status': "error",
                    'error': "Wrong Password"
                })
            }
            else{
                req.session.user = req.body.username
                res.status(200).json({'status': "OK"})
            }
        }
        else{
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
                    console.log("No such user")
                    console.log(req.body)
                    res.status(401).json({
                        'status': "error",
                        'error': "No such user"
                    })
                }
                else{
                    if(result[0].password != req.body.password){
                        console.log("Wrong Password")
                        console.log(req.body)
                        console.log(result[0])
                        res.status(402).json({
                            'status': "error",
                            'error': "Wrong Password"
                        })
                    }
                    else if(result[0].verify == false){
                        console.log("No such user")
                        console.log(req.body)
                        console.log(result[0])
                        res.status(403).json({
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
        }
    })

})

module.exports = router;