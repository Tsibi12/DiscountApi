const jwt = require("jsonwebtoken");
require("dotenv/config");
const db = require("../models");
const User = db.User;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    const auth  = token.split(' ')[1];
    jwt.verify(auth,process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};

isSmeOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            req.isAdmin = false;
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "sme") {
                    next();
                    return;
                }

                if (roles[i].name === "admin") {
                    req.isAdmin = true;
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Moderator or Admin Role!"
            });
        });
    });
};



const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isSmeOrAdmin: isSmeOrAdmin
};
module.exports = authJwt;