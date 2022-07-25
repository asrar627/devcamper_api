const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../model/Bootcamp');

// @desc Get All bootcamps
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        res.status(400).json({success: false});
    }
}

// @desc Get bootcamp
// @route GET /api/v1/bootcamp/:id
// @access public

exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            //return next(error)
            return next(
                 new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,
                  404 )
            );
        }
        res.status(200).json({success: true, data: bootcamp, msg: `get Bootcamp ${req.params.id}` });
    } catch (error) {
        //next(error);
        next( new ErrorResponse(
            `Bootcamp not found with id of ${req.params.id}`,
             404)
        );
    }
}

// @desc Create bootcamp
// @route Post /api/v1/bootcamp
// @access private

exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({success: true, data: bootcamp, msg: "Create New Bootcamp" });    
    } catch (error) {
        res.status(400).json({success: false });    
    }
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true, data: bootcamp, msg: "Create New Bootcamp" });
}

// @desc Update bootcamp
// @route Put /api/v1/bootcamp/:id
// @access Private

exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!bootcamp){
            return res.status(400).json({success: false});    
        }
        res.status(200).json({success: true, data: bootcamp, msg: `Update existing Bootcamp ${req.params.id}` });    
    } catch (error) {
        return res.status(400).json({success: false});    
    }
}

// @desc Delete bootcamp
// @route delete /api/v1/bootcamp/:id
// @access Private

exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp){
            return res.status(400).json({success: false});    
        }
        res.status(200).json({success: true, data: bootcamp, msg: `delete existing Bootcamp ${req.params.id}` });    
    } catch (error) {
        return res.status(400).json({success: false});    
    }
}