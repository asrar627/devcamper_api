const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../model/Bootcamp');

// @desc Get All bootcamps
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = asyncHandler ( async (req, res, next) => {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps });
});

// @desc Get bootcamp
// @route GET /api/v1/bootcamp/:id
// @access public

exports.getBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        //return next(error)
        return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,
                404 )
        );
    }
    res.status(200).json({success: true, data: bootcamp, msg: `get Bootcamp ${req.params.id}` });
});

// @desc Create bootcamp
// @route Post /api/v1/bootcamp
// @access private

exports.createBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true, data: bootcamp, msg: "Create New Bootcamp" });    
});

// @desc Update bootcamp
// @route Put /api/v1/bootcamp/:id
// @access Private

exports.updateBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,
                404 )
        );
    }
    res.status(200).json({success: true, data: bootcamp, msg: `Update existing Bootcamp ${req.params.id}` });    
});

// @desc Delete bootcamp
// @route delete /api/v1/bootcamp/:id
// @access Private

exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,
                404 )
        );
    }
    res.status(200).json({success: true, data: bootcamp, msg: `delete existing Bootcamp ${req.params.id}` });    
});