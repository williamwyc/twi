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
            console.log(err)
            res.status(500).json({
                'status': "error",
                'error': err
            })
        }
        else if(result.length>=1){
            console.log("Duplicate username or email")
            res.status(400).json({
                'status': "error",
                'error': "Duplicate username or email"
            })
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
                to: req.body.email,
                subject: 'Twitter Clone: Verify your account',
                text: "Hello! Please verify your email.<" + "http://" + req.get('host') + "/verify?email=" + req.body.email + "&key=" + req.body.key + ">" + 'key: <' +req.body.key + '>',
            }
            transporter.sendMail(mailOptions, function(err, info){
                console.log(mailOptions)
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        'status': "error",
                        'error': err
                    })
                } else {
                    console.log('Email sent: ' + info.response);
                    db.collection("users").insertOne(req.body, function(err, result){
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
            });
        }
    })
})

module.exports = router;