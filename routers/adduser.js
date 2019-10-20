var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',jsonParser,function(req,res){
    data = req.body // username: string, email: string, password: string
    db = req.app.locals.db //access db
    json = {'status': "OK"}
    data.key = Math.floor((Math.random() * 899999) + 100000);
    data.verify = false
    db.collection("users").find({$or:[{'username': data.username},{'email': data.email}]}).toArray(function(err, result){
        if(err){
            json.status = "error"
            json.error = err
            res.json(json)
        }
        else if(result.length>=1){
            json.status = "error"
            json.error = "Duplicate username or email"
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
            var mailOptions = {
                from: 'ubuntu@arknights.com', 
                to: data.email,
                subject: 'Twitter Clone: Verify your account',
                text: "Validation key: <" + data.key + ">",
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    json.status = "error"
                    json.error = err
                    res.json(json)
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            db.collection("users").insertOne(data, function(err, result){
                if(err){
                    json.status = "error"
                    json.error = err
                    res.json(json)
                }
                else{
                    res.json(json)
                }
            })
        }
    })
})

module.exports = router;