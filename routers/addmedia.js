var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({dest:'upload/'})
var uniqid = require("uniqid");
var request = require('request');
var fs      = require('fs');

router.post('/',upload.single('content'),function(req,res){
    if(req.session.user == null){
        res.status(500).json({
            'status':'error',
            'error':'User not login'
        })
    }
    else if(req.file == null){
        res.status(500).json({
            'status':'error',
            'error':'No file uploaded'
        })
    }
    else{
        request({  
            url: "http://192.168.122.28/addmedia",
            method: 'POST',
            formData : {"content":fs.createReadStream(req.file.path)},
            body: {"current_user": req.session.user}
            }, 
        function(err, response, body) {  
            if(err){
                console.log("ERROR")
                console.log(err);
            }
            if(body.status=='error'){
                res.status(404).json(body);
            }else{
                res.json(body);
            }
            
        });
    }
    // else{
    //     req.body.id = uniqid()
    //     req.app.locals.db.collection("medias").insertOne({'id':req.body.id, 'user':req.session.user,'used':false}, function(err, result) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    //     req.body.query= 'INSERT INTO MEDIAS (id, content, type) VALUES (?, ?, ?)';
    //     req.app.locals.client.execute(req.body.query, [req.body.id, req.file.buffer, req.file.originalname.split('.')[1]], function(err, result){
    //         if(err) {
    //             // delete media id from mongodb
    //             req.app.locals.db.collection("medias").deleteOne({'id': req.body.id}, function(err1, obj){
    //                 if(err1) {
    //                     console.log(err1);
    //                     res.status(500).json({'status':'error', 'error':err1});
    //                 }
    //                 else{
    //                     console.log(err);
    //                     res.status(500).json({'status':'error', 'error':err});
    //                 }
    //             })
    //         } else {
    //             res.status(200).json({'status':'OK', 'id':req.body.id});
    //         }
    //     });
    // }

})

module.exports = router;