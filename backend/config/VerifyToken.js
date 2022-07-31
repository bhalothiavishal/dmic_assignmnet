var jwt = require('jsonwebtoken');
const fs = require('fs');
var config = require('./config');
var publicKEY = fs.readFileSync('./config/public.key', 'utf8');
const Users = require('../models/users.model');

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];

    if (!token) {
        var response = { "success": false, auth: false, "msg": "No token provided" };
        return res.status(403).send(response);
    }
    jwt.verify(token, publicKEY, config.signOptions, async function (err, decoded) {
        if (err) {
            var response1 = { "success": false, auth: false, "msg": "Failed to authenticate token" };
            return res.status(403).send(response1);
        }
        Users.findOne({ _id: decoded._id }, { status: 1 }).then((result) => {
            if (result.status === "deleted") {
                var response2 = { "success": false, auth: false, "msg": "User is deleted or not found" };
                return res.status(403).send(response2);
            } else if (result.status === "inactive") {
                var response3 = { "success": false, auth: false, "msg": "User is inactive now. Contact to admin." };
                return res.status(403).send(response3);
            } else {
                req.userId = decoded._id;
                req.user_type = decoded.user_type;
                next();
            }
        });

    });
}
module.exports = verifyToken;