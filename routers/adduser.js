var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var nodemailer = require('nodemailer');

router.get('/',(req,res)=>{
    res.render('adduser.ejs');
})
router.post('/',jsonParser,function(req,res){
    // username: string, email: string, password: string
    console.log("Add User: ")
    console.log(req.body)
    db = req.app.locals.db //access db
    req.body.key = Math.floor((Math.random() * 899999) + 100000);
    req.body.verify = false
    req.body._id = req.body.username
    db.collection("users").find({$or:[{'username': req.body.username},{'email': req.body.email}]}).toArray(function(err, result){
        if(err){
            json = {
                'status': "error",
                'error': err
            }
            console.log(err)
            res.json(json)
        }
        else if(result.length>=1){
            json = {
                'status': "error",
                'error': "Duplicate username or email"
            }
            console.log("Duplicate username or email")
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
            let text = 'key: <' +req.body.key + '>'
            var link = "http://" + req.get('host') + "/verify?email=" + req.body.email + "&key=" + req.body.key;
            var mailOptions = {
                from: 'ubuntu@arknights.com', 
                to: req.body.email,
                subject: 'Twitter Clone: Verify your account',
                text: "Hello! <br> Please verify your email.<br><a href=" + link + ">" + text + "</a>",
            }
            transporter.sendMail(mailOptions, function(err, info){
                if (err) {
                    json = {
                        'status': "error",
                        'error': err
                    }
                    console.log(err)
                    res.json(json)
                } else {
                    console.log('Email sent: ' + info.response);
                    db.collection("users").insertOne(req.body, function(err, result){
                        if(err){
                            json = {
                                'status': "error",
                                'error': err
                            }
                            console.log(err)
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