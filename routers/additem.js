var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var uniqid = require("uniqid");
var request = require('request');
var cookieParser = require('cookie-parser');

router.post('/',(req,res)=>{
    // if(req.session.user == null){
    //     res.status(400).json({
    //         status:"error",
    //         error:"Login Frist"
    //     });
    // }
    // else if(req.body.content == null){
    //     res.status(400).json({
    //         status:"error",
    //         error:"No content"
    //     });
    // }
    // else if(req.body.parent == null && req.body.childType != null){
    //     res.status(400).json({
    //         status:"error",
    //         error:"Undefined parent"
    //     });
    // }
    // else{
    //     if(req.body.media != null && req.body.media.length>0){
    //         req.app.locals.db.collection("medias").find({'id':{$in:req.body.media},'user':req.session.user,'used':false}).toArray(function(err,result){
    //             if(err){
    //                 res.status(500).json({
    //                     status:"error",
    //                     error:err
    //                 });
    //             }
    //             else if(result.length!=req.body.media.length){
    //                 res.status(400).json({
    //                     status:"error",
    //                     error:"Used media or Unexisted media"
    //                 });
    //             }
    //             else{
    //                 req.body.timestamp = Date.now()
    //                 req.body.itemId = uniqid()
    //                 addItem(req, res);
    //             }
    //         })
    //     }
    //     else{
    //         req.body.media = []
    //         req.body.timestamp = Date.now()
    //         req.body.itemId = uniqid()
    //         addItem(req, res)
    //     }
    // }
    req.body.current_user = req.cookies.session.user
    request({  
        url: "http://192.168.122.28/additem",
        method: 'POST',
        json: req.body
    }, 
    function(err, response, body) {  
        if(err){
            console.log(err);
        }
        else if(body.status=='error'){
            res.status(404).json(body);
        }else{
            res.json(body);
        }
    });
});

function addItem(req, res){
    req.app.locals.db.collection("items").insertOne({
        _id: req.body.itemId,
        id: req.body.itemId,
        username: req.session.user,
        property: {
            likes: 0,
            likers: []
        },
        retweeted: 0,
        content: req.body.content,
        timestamp: req.body.timestamp,
        childType: req.body.childType,
        parent: req.body.parent,
        media: req.body.media
    },function(err, result){
        if(err){
            console.log(err)
            res.status(500).json({
                status:"error",
                error: err
            });
        }
        else{
            if(req.body.media != null && req.body.media.length>0){
                req.app.locals.db.collection("medias").updateMany({'id':{$in:req.body.media}},{$set:{'used':true}})
            }
            if(req.body.childType == 'retweet'){
                req.app.locals.db.collection("items").update({'id':req.body.parent},{
                    $inc: { 'retweeted': 1 }
                })
            }
            res.status(200).json({
                status:"OK",
                id: req.body.itemId
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