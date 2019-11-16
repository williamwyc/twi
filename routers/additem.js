var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()

router.post('/',(req,res)=>{
    if(req.session.user == null){
        res.json({
            status:"error",
            error:"Login Frist"
        });
    }
    else if(req.body.content == null){
        res.json({
            status:"error",
            error:"No content"
        });
    }
    else if(req.body.parent == null && req.body.childtype != null){
        res.json({
            status:"error",
            error:"Undefined parent"
        });
    }
    else{
        req.body.timestamp = Date.now()
        req.body.itemId = req.session.user + req.timestamp
        addItem(req, res);
    }
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
        childtype: req.body.childtype,
        parent: req.body.parent,
        media: req.body.media
    },function(err, result){
        if(err){
            res.json({
                status:"error",
                error: err
            });
        }
        else{
            if(req.body.childtype == 'retweet'){
                req.app.locals.db.collection("items").update({'id':req.body.parent},{
                    $inc: { retweeted: 1 }
                })
            }
            res.json({
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