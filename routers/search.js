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
    search(timestamp,limit,db,res);
});

function search(timestamp,limit,db,res){
    //DB operation:Gets a list of the latest <limit> number of items prior to (and including) the provided <timestamp>
    db.collection("items").find({'timestamp':{$lt:timestamp*1000}}).sort({'timestamp':-1}).limit(limit).toArray(function(err, result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else{
            res.json({
                status:"OK",
                items:result
            });
        }
    })
}

module.exports = router;