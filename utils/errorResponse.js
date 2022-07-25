// Here we extend the error class with our class
class ErrorResponse extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;