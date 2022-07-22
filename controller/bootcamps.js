const Bootcamp = require('../model/Bootcamp');

// @desc Get All bootcamps
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: "Show all Bootcamps" });
}

// @desc Get bootcamp
// @route GET /api/v1/bootcamp/:id
// @access public

exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `get Bootcamp ${req.params.id}` });
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

exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update existing Bootcamp ${req.params.id}` });
}

// @desc Delete bootcamp
// @route delete /api/v1/bootcamp/:id
// @access Private

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `delete existing Bootcamp ${req.params.id}` });
}