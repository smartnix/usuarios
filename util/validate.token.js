var jsonToken = require("jsonwebtoken");
var validateTime = require("./validate-time");
var settings = require("../settings/settings");
var crypto = require("crypto-js");

var validate = function (req, res, next ){
    var token = req.get("Authorization");
    token = ""+crypto.AES.decrypt(token,settings.secret);

    token = token.split("&&");

    if (validateTime.validate(token[1])) {
        jsonToken.verify(token[0], settings.secret,function (err, decoded) {
            if (err) {
                res.status(401).send({msg:"No autorizado"});        
            } else {
                req.id = decoded;
                next();
            }
        });
    } else {
        res.status(401).send({msg:"No autorizado"});
    }
};

module.exports = validate;