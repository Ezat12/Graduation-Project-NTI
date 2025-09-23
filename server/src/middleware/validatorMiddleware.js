const {validationResults} = require("express-validator")

const validate = (req, res, next) => {
    const errors = validationResults(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

module.exports = validate