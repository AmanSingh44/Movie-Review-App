const express = require('express')
const morgan = require('morgan')
const cors = require('cors') // Import the cors middleware

require('express-async-errors')
require('dotenv').config()

require('./db')
const userRouter = require('./routes/user')
const { handleNotFound } = require('./utils/helper')


const app = express();

app.use(cors());

app.use(express.json())
app.use(morgan("dev"))
app.use('/api/user', userRouter)

app.use((err, req, res, next) => {
    console.log("err: ", err)
    res.status(500).json({ error: err.message || err })
})

app.use('/*', handleNotFound)

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