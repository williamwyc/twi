var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',(req,res)=>{
    var content=req.body.content;
    var childType=req.body.childType;
    var user = req.session.user
    var db = req.app.locals.db
    if(user == null){
        res.json({
            status:"error",
            error:"Login Frist"
        });
    }
    else{
        addItem(content,childType,user, db, res);
    }
});

function addItem(content,childType,user, db, res){
    var timestamp = Date.now()
    var id = user + timestamp
    var item = {
        id: id,
        username: user,
        property: {
            likes: 0
        },
        retweeted: 0,
        content: content,
        timestamp: timestamp
    }
    db.collection("items").insertOne(item,function(err, result){
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