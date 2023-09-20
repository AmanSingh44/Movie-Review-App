const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword } = require('../controller/user-controller');
const { userValidator, validate, validatePassword } = require('../middlewares/validator');
const { isValidPassResetToken } = require('../middlewares/user')
const router = express.Router()



router.post('/create', userValidator, validate, create)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-token', resendEmailVerificationToken)
router.post('/forgot-password', forgetPassword)
router.post('/verify-pass-reset-token', isValidPassResetToken, sendResetPasswordTokenStatus)
router.post('/reset-password', validate, validatePassword, isValidPassResetToken, resetPassword)



module.exports = router;