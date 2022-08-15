const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../model/User');

// @desc Register User
// @route POST /api/v1/auth/register
// @access public

exports.register = asyncHandler ( async (req, res, next) => {
    
    const { name, email, password, role } = req.body;
    
    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user, 201, res);
});

// @desc Login User
// @route POST /api/v1/auth/login
// @access public

exports.login = asyncHandler ( async (req, res, next) => {
    
    const { email, password} = req.body;
    
    // Validate Email and password
    if (!email || !password){
        return next(new ErrorResponse('please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne( { email } ).select('+password')

    if (!user){
        return next(new ErrorResponse('Invalid credentials', 401)); // 401 means unauthorized
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401)); // 401 means unauthorized
    }

    sendTokenResponse(user, 200, res);
});


// @desc Get Current Logged in User
// @route POST /api/v1/auth/me
// @access private

exports.getMe = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        sucess: true,
        data: user
    });
});

// @desc Log user out / clear cache
// @route GET /api/v1/auth/logout
// @access private

exports.logout = asyncHandler( async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        sucess: true,
        data: {}
    });
});


// @desc Forgot Password
// @route POST /api/v1/auth/forgotpassword
// @access public

exports.forgotPassword = asyncHandler( async (req, res, next) => {
    const user = await User.findOne( { email: req.body.email } );

    if (!user){
        return next (new ErrorResponse(`There is no user with this email`, 404));
    }

    // Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // Create Reset Url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are recieving this email because you( or someone else) has requested the reset of password. please make a PUT request to: \n\n ${resetUrl}`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        res.status(200).json({ sucess: true, data: 'Email Sent'});
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});


// @desc Reset Password
// @route PUT /api/v1/auth/resetpassword/:resettoken
// @access public

exports.resetPassword = asyncHandler( async (req, res, next) => {
    // Get Hashed Token
    console.log("req.params.resettoken is: ", req.params.resettoken)
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne(
        {
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }            
        })

    if (!user){
        return next( new ErrorResponse('Invalid Token', 400) );
    }

    // set new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});

// @desc Update user details
// @route PUT /api/v1/auth/updatedetails
// @access private

exports.updateDetails = asyncHandler( async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        sucess: true,
        data: user
    });
});

// @desc Update Password
// @route PUT /api/v1/auth/updatepassword
// @access private

exports.updatePassword = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check Current Password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});


// Get Token from model, create cookie and secure response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true  
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        sucess: true,
        token
    })
}
