var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.get('/:id',(req,res)=>{
    var id=req.param.id;
    var db = req.app.locals.db
    getItem(id,db,res);
});

function getItem(id,db,res){
    //DB operation:Get contents of a single <id> item
    db.collection("items").find({'id': id}).toArray(function(err, result){
        if(err){
            res.json({
                status:"error",
                error:err
            });
        }
        else if(result.length<=0){
            res.json({
                status:"error",
                error:"No such tweet"
            });
        }
        else{
            res.json({
                status:"OK",
                item:result[0]
            });
        }
    })
}


module.exports = router;