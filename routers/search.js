var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.post('/',(req,res)=>{
    var timestamp=req.body.timestamp;
    var limit=req.body.limit;
    var db = req.app.locals.db
    search(timestamp,limit,db);
});

function search(timestamp,limit,db){
    var success=false;
    var items;
    var err;
    //DB operation:Gets a list of the latest <limit> number of items prior to (and including) the provided <timestamp>
    db.collection("items").find({'timestamp':{$lt:timestamp}}).sort({'timestamp':-1}).limit(limit).toArray(function(err, result){
        if(err){
            err = err;
        }
        else{
            items = result
            success = true
        }
    })
    if(success){
        //Fill in the items with list of items found
        res.json({
            status:"OK",
            items:items
        });
    }else{
        //Fill in the error message if error occurs.
        res.json({
            status:"error",
            error:err
        });
    }
}

module.exports = router;