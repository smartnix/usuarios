var express = require("express");
var router = express.Router();
var mId = require("mondodb").ObjectId;

router.param("collection", function (req, res, next, c) {
    req.c = req.db.collection(c);
    next();
});

router.post("/:collection", function (req, res, next) {
    var obj = req.body;
    req.c.insert(obj, {w:1},function (error, ressult) {
        if(error){
            res.send({success:false});
        }
        else{
            res.send({success:true, id:result.insertedIds[0]});
        }
    });
});

router.delete("/:collection/:id", function (req, res, next) {
    var id = new mId(req.params.id);
    req.c.delete({_id:id}, function (error, ressult) {
        if(error){
            res.send({success:false});
        }
        else{
            res.send({success:true});
        }
    });
});

router.get("/collection", function (req, res, next){
    req.c.find().toArray(function(error, result){
        if(error){
            res.send([]);
        }
        else{
            res.send(result);
        }
    });
})

router.get("/:collection:id", function(req, res, next){
    var id = new mId(req.params.id);
    req.c.findOne({_id:id}, function(error, result){
        if(error || result == null){
            res.status(404).send({msg:"No encontrado"})
        }
        else{
            res.send(result);
        }
    });
});

module.exports = router;