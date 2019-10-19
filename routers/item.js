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
    getItem(id);
});

function getItem(id){
    var success=false;
    //DB operation:Get contents of a single <id> item
    
    if(success){
        //Fill in the item with item found
        res.json({status:"OK",item:{}});
    }else{
        //Fill in the error message if error occurs.
        res.json({status:"error",error:""});
    }
}


module.exports = router;