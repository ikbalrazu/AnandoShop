const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../sendEmail');
const crypto = require('node:crypto');

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

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email, password} = req.body;

    //checks if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    //Finding user in database
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email", 400));
    }

    //checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid password',401));
    }

    sendToken(user, 200, res);
});

//logout user
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });
});

//forgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    if(!req.body.email){
        return next(new ErrorHandler('Please enter your email', 400));
    }

    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try{
        await sendEmail({
            email: user.email,
            subject:'ShopIt password recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
    }

});

//Reset password => /password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //Hash URL token
    const resetPasswordToken = crypto
       .createHash('sha256')
       .update(req.params.token)
       .digest('hex');

    console.log(resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    console.log(user);

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match', 400));
    }

    //setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
});