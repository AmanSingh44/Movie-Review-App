const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require('../controller/user-controller');
const { userValidator, validate, validatePassword, signInValidator } = require('../middlewares/validator');
const { isValidPassResetToken } = require('../middlewares/user')
const router = express.Router()
const { isAuth } = require('../middlewares/auth')


router.post('/create', userValidator, validate, create)
router.post('/signin', signInValidator, validate, signIn)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-token', resendEmailVerificationToken)
router.post('/forgot-password', forgetPassword)
router.post('/verify-pass-reset-token', isValidPassResetToken, sendResetPasswordTokenStatus)
router.post('/reset-password', validate, validatePassword, isValidPassResetToken, resetPassword)

router.get('/is-auth', isAuth, async(req, res) => {
    const { user } = req

    res.json({ user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } })

})



module.exports = router;