const validateForm = (req, res, next) => {
    const fields = ["username", "password", "email"];
    const requestFields = Object.keys(req.body);

    const isEqual = fields.every(field => requestFields.includes(field))
    
    const isEmailCorrect = /[a-z]+@[a-z]+\.[a-z]+/.test(req.body.email);

    if(!isEmailCorrect) {
        return res.status(400).json({
            message: "email is incorrect"
        })
    } else if (isEqual) {
        next(   )
    } else {
        return res.status(400).json({
            message: "Please complete all fields (username, password, email)"
        })
    }
}

module.exports = { validateForm }