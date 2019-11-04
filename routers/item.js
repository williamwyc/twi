var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.get('/:id',(req,res)=>{
    console.log("Get item:")
    console.log(req.params)
    getItem(req.params.id,db,res);
});

router.delete('/:id',(req,res)=>{
    console.log("Delete item:")
    console.log(req.params)
    deleteItem(req.params.id,req.app.locals.db,req,res);
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

function deleteItem(id,db,req,res){
    //DB operation: Delete contents of a single <id> item
    db.collection("items").remove({'id': id, 'username': req.session.user}, function(err, obj){
        if(err){
            res.status(400).json({
                status:"error",
                error:err
            });
        }
        else if(obj.result.n <= 0){
            res.status(400).json({
                status:"error",
                error:"No such item"
            });
        }
        else{
            res.status(200).json({
                status:"OK"
            });
        }
    })
}

module.exports = router;