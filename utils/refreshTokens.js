const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session')
const jsonfile = require('jsonfile')

require('dotenv').config

const refreshTokens = function(refreshToken, req) {
    const path = "./models/users.json";
    const users = jsonfile.readFileSync(path)
    const user = users.findIndex(({ refreshToken: token }) => token === refreshToken);

    const newAccessToken = jwt.sign({refreshToken: user.refreshToken}, process.env.TOKEN_SECRET, {
        expiresIn: "15m"
    });

    const newRefreshToken = uuidv4()
    req.session.token = newAccessToken
    req.session.refreshToken = newRefreshToken;
    users[user].accessToken = newAccessToken;
    users[user].refreshToken = newRefreshToken
    
    jsonfile.writeFileSync(path, users, {spaces: 2});
}

module.exports = { refreshTokens } 