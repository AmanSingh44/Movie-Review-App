const { check, validationResult } = require('express-validator');


const userValidator = [
    check('name').trim().not().isEmpty().withMessage('Name is empty'),
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
    check('password').trim().not().isEmpty().withMessage('Password is Empty').isLength({ min: 8, max: 20 }).withMessage('Password must be 8 to 10 characters long')
]

const validatePassword = [
    check('newPassword').trim().not().isEmpty().withMessage('Password is Empty').isLength({ min: 8, max: 20 }).withMessage('Password must be 8 to 10 characters long')

]

const signInValidator = [
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
    check('password').trim().not().isEmpty().withMessage('Password is Empty')

]

const validate = (req, res, next) => {
    const error = validationResult(req).array()
    if (error.length) {
        return res.json({ error: error[0].msg })
    }
    next()
}

module.exports = { userValidator, validate, validatePassword, signInValidator }