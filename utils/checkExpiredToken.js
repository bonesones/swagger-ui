module.exports = (user) => {
    return new Date > user.expiresIn ? true : false;
}