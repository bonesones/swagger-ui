const jwt = require('jsonwebtoken')
const session = require('express-session')
const { TokenExpiredError } = jwt;
const { refreshTokens } = require('./../utils/refreshTokens')


module.exports = (req, res, next) => {
    const token = req.session.token;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
            if (err) {
                if (err instanceof TokenExpiredError){
                    refreshTokens(req.session.refreshToken, req); 
                    next()
                    return
                }
                return res.status(403).json({
                    message: "invalid token"
                });
            }
            next();
        });
    } else {
        res.status(401).json({
            message: "No any token"
        });
    }
};
