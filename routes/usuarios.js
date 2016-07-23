var express = require("express");
var router = express.Router();

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



module.exports = router;