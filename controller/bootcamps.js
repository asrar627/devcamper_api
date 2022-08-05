const path = require("path")
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../model/Bootcamp');

// @desc Get All bootcamps
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = asyncHandler ( async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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
    // For diresct delete without deleting associated you need to do findByIdAndDelete directly
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,
                404 )
        );
    }
    // don't delete just find and then remove. In this way we can remove associated records as well
    bootcamp.remove();
    res.status(200).json({success: true, data: bootcamp, msg: `delete existing Bootcamp ${req.params.id}` });    
});


// @desc Get bootcamp within radius
// @route get /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private

exports.getBootcampInRadius = asyncHandler( async (req, res, next) => {
    const {zipcode, distance} = req.params;
    // Get Lat, Lng form GeoCoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude
    const lng = loc[0].longitude
    
    // Calc radius usinf radians
    // Divide distance by radius
    // Earth radius = 3,963 mi / 6378 km

    const radius = distance / 3963
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });

    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
});

// @desc Upload photo for bootcamp
// @route put /api/v1/bootcamp/:id
// @access Private

exports.bootcampPhotoUpload = asyncHandler( async (req, res, next) => {
    // For diresct delete without deleting associated you need to do findByIdAndDelete directly
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,
                404 )
        );
    }
    if (!req.files){
        return next(
            new ErrorResponse(`please upload a file`,
                400 )
        );
    }
    const file = req.files.file
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')){
        return next(
            new ErrorResponse(`please upload an image file`,
                400 )
        );
    }
    // Check File Size
    if (file.size > process.env.MAX_FILE_UPLOAD){
        return next(
            new ErrorResponse(`please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400 )
        );
    }
    // Create Custom File name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPPLOAD_PATH}/${file.name}`, async err => {
        if (err){
            console.log(err);
            return next(
                new ErrorResponse(`Problem with File Upload`,
                    500 )
            );  
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});
