var express = require("express");
var crypto = require("crypto-js")
var validateTime = require("../util/validate-time");
var jsonToken = require("jsonwebtoken");
var settings = require("../settings/settings");
var router = express.Router();


/*
router.get("/", function(req, res, next) {
    var nombre = req.query.nombre;
    var apellido = req.query.apellido;

    res.send({ msg: "metodo get", mombre:nombre+" "+apellido });
});

router.post("/", function(req, res, next) {
    res.send({ msg: "metodo post" });
});

router.get("/:id", function(req, res, next) {
    var id = req.params.id;
    res.send({ msg: "metodo get", id: id });

});//id nombre de la variable

router.put("/:id", function(req, res, next) {
    var id = req.params.id;
    res.send({ msg: "metodo put", id: id });
});

router.delete("/:id", function(req, res, next) {
    var id = req.params.id;
    res.send({ msg: "metodo delete", id: id });
});
*/
router.use(function (req, res, next) {
    req.c = req.db.collection("usuarios");
})

router.post("/signin",function (req, res, next) {
    var body = req.body;
    var auth = body.auth;

    auth = ""+crypto.AES.decrypt(auth, settings.secret);
    auth = auth.split("&&");
    delete body.auth;
    body.usuario = auth[0];
    body.password = ""+crypto.SHA(auth[1]);

    req.c.insert(body, function (err, result) {
        if(err){
            res.send({success:false});
        }
        else{
            res.send({success:true});
        }
    });
});

router.post("/login",function (req, res, next) {
    var body = req.body;
    var auth = body.auth;
    auth = ""+crypto.AES.decrypt(auth,settings.secret);
    auth = auth.split("&&");

    var timestamp = auth[2];

    if(validateTime.validate(timestamp)){
        req.c.find({usuario:auth[0],password:auth[0]},
        function (err, result) {
            if(err || result == null){
                res.send({success:false});
            }
            else{
                var token = jsonToken.sign(result._id,settings.secret);
                res.send({success:true,token:token,usuario:result});
            }
        });
    }
    else{
        res.status(401).send({success:false,msg:"Error en solicitud"});
    }
})

module.exports = router;