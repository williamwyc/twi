var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',(req,res)=>{
    if(req.session.user == null){
        res.json({
            status:"error",
            error:"Login Frist"
        });
    }
    else if(req.body.content == null){
        res.json({
            status:"error",
            error:"No content"
        });
    }
    else{
        addItem(req.body.content,req.body.childType,req.session.user, req.app.locals.db, res);
    }
});

function addItem(req, res){
    var timestamp = Date.now()
    db.collection("items").insertOne({
        _id: user + timestamp,
        id: user + timestamp,
        username: req.session.user,
        property: {
            likes: 0
        },
        retweeted: 0,
        content: req.body.content,
        timestamp: timestamp},function(err, result){
        if(err){
            res.json({
                status:"error",
                error: err
            });
        }
        else{
            res.json({
                status:"OK",
                id: id
            });
        }
    })
    //DB operation:Post a new item
    /**
     * item format:
     *  item: {
            id: item ID string
            username: username who sent item
            property: {
            likes: number	
            }
            retweeted: number
            content: body of item, (original content if this item is a retweet)
            timestamp: timestamp, represented as Unix time
        }
     */
}

module.exports = router;