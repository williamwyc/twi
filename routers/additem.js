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
    addItem(content,childType);
});
function addItem(content,childType){
    var success=false;
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
    if(success){
        //Fill in the id with added item's id.
        res.json({status:"OK",id:""});
    }else{
        //Fill in the error message if error occurs.
        res.json({status:"error",error:""});
    }
}

module.exports = router;