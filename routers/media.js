var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({dest:'upload/',storage:storage})
var request = require('request');

router.get('/:id',multer().none(),function(req,res){
    // req.app.locals.client.execute('SELECT * FROM MEDIAS WHERE id = ?',[req.params.id],{prepare:true},function(err,result){
    //     if(err){
    //         console.log(err)
    //         res.status(400).json({
    //             'status': 'error',
    //             'error': err
    //         })
    //     }
    //     else{
    //         if(result.first() == null) {
    //             res.status(400).json({
    //                 'status':'error', 
    //                 'error':'No such media'
    //             });
    //         } else{
    //             // for(var i = 0; i < types.length; i++) {
    //             //     if(result.first().type == types[i]) {
    //             //         res.type('video/'+result.first().type);
    //             //         res.send(result.first().content);
    //             //     }
    //             // }
    //             // res.type('image/'+result.first().type);
    //             res.status(200).send(result.first().content);
    //         }
    //     }
    // })
    req.body.current_user = req.session.user
    request({  
        url: "http://192.168.122.28/media/"+req.params.id,
        method: 'GET',
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
})

module.exports = router;