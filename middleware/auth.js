const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/User');
const asyncHandler = require('./async');


// protect routes
exports.protect = asyncHandler( async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }//else if (req.cookies.token){
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