const nodemailer = require('nodemailer')
const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')
const { isValidObjectId } = require('mongoose')
const { generateOTP, generateMailTranporter } = require('../utils/mail')

const create = async(req, res) => {
    const { name, email, password } = req.body

    const oldUser = await User.findOne({ email })
    if (oldUser) return res.status(401).json({ error: "This email is already in use" })
    const newUser = new User({ name, email, password })
    await newUser.save()


    //generating 6 digit OTP
    let OTP = generateOTP()

    //store OTP inside database
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP
    })

    await newEmailVerificationToken.save()


    //send otp to user
    var transport = generateMailTranporter()

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
        <p>Your Verification OTP</p>
        <h1>${OTP}</h1>
    
      `
    })

    res.status(201).json({
        message: "Please verify your email. OTP has been sent to your email account"
    })
}

const verifyEmail = async(req, res) => {
    const { userId, OTP } = req.body

    if (!isValidObjectId(userId)) {
        return res.json({ error: "Invalid User" })
    }
    const user = await User.findById(userId)
    if (!user) {
        return res.json({ error: "User not found" })
    }
    if (user.isVerified) {
        return res.json({ error: "User is already verified" })
    }

    const token = await EmailVerificationToken.findOne({ owner: userId })
    if (!token) {
        return res.json({ error: "Token not found" })
    }

    const isMatched = await token.compareToken(OTP)
    if (!isMatched) {
        return res.json({ error: "Please submit a valid OTP" })
    }
    user.isVerified = true
    await user.save()

    await EmailVerificationToken.findByIdAndDelete(token._id)

    var transport = generateMailTranporter()

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email',
        html: "<h1>Welcome to our App</h1>"
    })

    res.json({ message: "Your email is verified" })
}


const resendEmailVerificationToken = async(req, res) => {
    const { userId } = req.body
    const user = await User.findById(userId)
    if (!user) {
        return res.json({ error: "User not found" })
    }
    if (user.isVerified) {
        return res.json({ error: "User is already verified" })
    }
    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId })
    if (alreadyHasToken) {
        return res.json({ error: "You can request for another token after one hour" })
    }

    //generating 6 digit OTP
    let OTP = generateOTP()

    //store OTP inside database
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: user._id,
        token: OTP
    })

    await newEmailVerificationToken.save()


    //send otp to user
    var transport = generateMailTranporter()

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
        <p>Your Verification OTP</p>
        <h1>${OTP}</h1>
    
      `
    })

    res.status(201).json({
        message: "New OTP has been sent to your email"
    })
}

module.exports = { create, verifyEmail, resendEmailVerificationToken }