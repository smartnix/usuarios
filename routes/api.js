var express = require("express");
var router = express.Router();
var mId = require("mongodb").ObjectId;

router.param("collection", function (req, res, next, c) {
    req.c = req.db.collection(c);
    next();
});

router.post("/:collection", function (req, res, next) {
    var obj = req.body;
    req.c.insert(obj, {w:1},function (error, result) {
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
    req.c.deleteOne({_id:id}, function (error, result) {
        if(error){
            res.send({success:false});
        }
        else{
            res.send({success:true});
        }
    });
});

router.get("/:collection", function (req, res, next){
    var q = req.query.q;
    var limit = req.query.limit;
    var skip = req.query.skip;
    var sort = req.query.sort;

    if(q){
        q = JSON.parse(q);
    }

    if(limit){
        limit = parseInt(limit);
    }
    else{
        limit = 0;
    }

    if(skip){
        skip = parseInt(skip);
    }
    else{
        skip = 0;
    }

    if(sort){
        sort = JSON.parse(sort);
    }

    req.c.find(q).limit(limit).skip(skip).sort(sort).toArray(function(error, result){
        if(error){
            res.send([]);
        }
        else{
            res.send(result);
        }
    });
});

router.get("/:collection/:id", function(req, res, next){
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

router.put(":/collection/:id",function(req, res, next){
    var id = new mId(req.params.id);
    var obj = req.body;
    req.c.update({_id:id},{$set:obj}, function(error, result){
        if(error){
            res.send({success:false});
        }
        else{
            res.send({success:true});
        }
    });
});
//agregar item a un arreglo
//Body: {campo:obj} o  {campo:[objs]}
//Ejemplo: {"celulares":"454"}
router.put("/:collection/:id/push", function(req, res, next){
    var id = new mId(req.params.id);
    var obj = req.body;

    req.c.update({_id:id},{$push:obj}, function(err, result){
        if(err){
            res.send({success:false});
        }else{
            res.send({success:true});
        }
    });

});
//eliminar item de un arreglo
//Body: {campo:{criterio}} o  {campo:valor}
//Ejemplo: {"celulares":"454"}, {"mascotas":{"nombre":"luna"}}
router.put("/:collection/:id/pull", function(req, res, next){
    var id = new mId(req.params.id);
    var obj = req.body;

    req.c.update({_id:id}, {$pull:obj}, function(err, result){
        if(err){
            res.send({success:false});
        }else{
            res.send({success:true});
        }
    });
});

module.exports = router;