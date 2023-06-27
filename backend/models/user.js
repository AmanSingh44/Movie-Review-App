const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        rquired: true
    },
    email: {
        type: String,
        trim: true,
        rquired: true,
        unique: true
    },
    password: {
        type: String,
        rquired: true
    }
})

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})


module.exports = mongoose.model("User", userSchema)