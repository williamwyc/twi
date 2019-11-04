var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.get('/',(req,res)=>{
    res.render('adduser.ejs');
})
router.post('/',jsonParser,function(req,res){
    data = req.body // username: string, email: string, password: string
    console.log("Add User: ")
    console.log(data)
    db = req.app.locals.db //access db
    data.key = Math.floor((Math.random() * 899999) + 100000);
    data.verify = false
    // data.followers = 0
    // data.following = 0
    // data.followers_list = []
    // data.following_list = []
    db.collection("users").find({$or:[{'username': data.username},{'email': data.email}]}).toArray(function(err, result){
        if(err){
            json = {
                'status': "error",
                'error': err
            }
            res.json(json)
        }
        else if(result.length>=1){
            json = {
                'status': "error",
                'error': "Duplicate username or email"
            }
            res.json(json)
        }
        else{
            var transporter = nodemailer.createTransport({
                host: 'localhost',
                port: 25,
                tls: {
                    rejectUnauthorized: false
                }
            }); 
            let text = 'key: <' +data.key + '>'
            var link = "http://" + req.get('host') + "/verify?email=" + data.email + "&key=" + data.key;
            var mailOptions = {
                from: 'ubuntu@arknights.com', 
                to: data.email,
                subject: 'Twitter Clone: Verify your account',
                text: "Hello! <br> Please verify your email.<br><a href=" + link + ">" + text + "</a>",
            }
            transporter.sendMail(mailOptions, function(err, info){
                if (err) {
                    json = {
                        'status': "error",
                        'error': err
                    }
                    res.json(json)
                } else {
                    console.log('Email sent: ' + info.response);
                    db.collection("users").insertOne(data, function(err, result){
                        if(err){
                            json = {
                                'status': "error",
                                'error': err
                            }
                            res.json(json)
                        }
                        else{
                            json = {'status': "OK"}
                            res.json(json)
                        }
                    })
                }
            });
        }
    })
})

module.exports = router;