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
    getItem(id,db);
});

function getItem(id,db){
    var success=false;
    var item;
    var err;
    //DB operation:Get contents of a single <id> item
    db.collection("items").find({'id': id}).toArray(function(err, result){
        if(err){
            err = err;
        }
        else if(result.length<=0){
            err = "No such tweet"
        }
        else{
            item = result[0]
            success = true
        }
    })
    if(success){
        //Fill in the item with item found
        res.json({
            status:"OK",
            item:item
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