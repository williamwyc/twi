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
    search(timestamp,limit);
});
function search(timestamp,limit){
    var success=false;
    //DB operation:Gets a list of the latest <limit> number of items prior to (and including) the provided <timestamp>

    
    if(success){
        //Fill in the items with list of items found
        res.json({status:"OK",items:[]});
    }else{
        //Fill in the error message if error occurs.
        res.json({status:"error",error:""});
    }
}

module.exports = router;