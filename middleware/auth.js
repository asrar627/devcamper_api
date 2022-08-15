const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/User');
const asyncHandler = require('./async');


// protect routes
exports.protect = asyncHandler( async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // Set Token from  Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Set Token from  cookie
    // else if (req.cookies.token){
    //     token = req.cookies.token
    // }

    // Make sure token exist
    if (!token){
        return next(new ErrorResponse('Not authorized to access this route', 401)); // 401 for not authorized
    }

    try{
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();

    }catch(err){
        return next(new ErrorResponse('Not authorized to access this route', 401)); // 401 for not authorized
    }

});

// Grant access to specific roles

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)); // 403 is a forbidden error // forbidden means not allowed
        }
        next();
    }
}