const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: 'avatars/1',
            url: 'https://res.cloudinary.com'
        },
    });

    // res.status(201).json({
    //     success: true,
    // });

    sendToken(user, 200, res);
})