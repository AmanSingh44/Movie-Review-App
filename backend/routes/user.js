const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword } = require('../controller/user-controller');
const { userValidator, validate } = require('../middlewares/validator');
const { isValidPassResetToken } = require('../middlewares/user')
const router = express.Router()



router.post('/create', userValidator, validate, create)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-token', resendEmailVerificationToken)
router.post('/forgot-password', forgetPassword)
router.post('/verify-pass-reset-token', isValidPassResetToken, (req, res) => {
    res.json({ valid: true })
})



module.exports = router;