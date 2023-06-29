const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken } = require('../controller/user-controller');
const { userValidator, validate } = require('../middlewares/validator');
const router = express.Router()



router.post('/create', userValidator, validate, create)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-token', resendEmailVerificationToken)



module.exports = router;