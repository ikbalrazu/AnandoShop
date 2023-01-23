const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

//Import all routes
const user = require('./routes/userRoute');

// Error Handler

app.get("/",(req,res)=>{
    res.send("Welcome to Anando Shop");
})

app.use('/user',user);

module.exports = app;