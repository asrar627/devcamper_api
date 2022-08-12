const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;
    // Log to console for dev 
    console.log(err);

    // Monoose bad objectId
    if (err.name === 'CastError'){
        const message = `Record not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    //Mongoose duplicate key error
    if (err.code === 11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }
    // Mongoose validation error
    // How he found it is validation error
    if (err.name === "ValidationError"){
        const message = Object.values(err.errors).map(obj => obj.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.stateCode || 500).json({
        success: false,
        error: error.message || 'Server Error' 
    });
}

module.exports = errorHandler;