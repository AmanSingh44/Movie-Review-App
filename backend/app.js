const express = require('express')
const morgan = require('morgan')
require('express-async-errors')
require('dotenv').config()

require('./db')
const userRouter = require('./routes/user')


const app = express();


app.use(express.json())
app.use(morgan("dev"))
app.use('/api/user', userRouter)

app.use((err, req, res, next) => {
    console.log("err: ", err)
    res.status(500).json({ error: err.message || err })
})

/*app.post('/sign-in', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.json({ error: "Email/password missing" })
    next();
}, (req, res) => {
    res.send("<h1>Hello from backend about</h1>")
})*/

app.listen(7000, () => {
    console.log("Server running on port 7000")
})