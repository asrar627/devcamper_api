const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../model/Course');
const Bootcamp = require('../model/Bootcamp');

// @desc Get Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.getCourses = asyncHandler(async(req, res, next) => {
    let query;
    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId});

    }else{
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        }) // for all courses with populates of bootcamp information
    }

    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
}) 

// @desc Get Single Course
// @route GET /api/v1/courses/:id
// @access public

exports.getCourse = asyncHandler(async(req, res, next) => {
    let query;
    query = Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    const course = await query;
    if (!course){
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404);
    }
    res.status(200).json({
        success: true,
        data: course
    })
}) 


// @desc Add Course
// @route Post /api/v1/bootcamps/:bootcampId/courses
// @access private

exports.addCourse = asyncHandler(async(req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    console.log(req.body)
    const bootcamp = Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp){
        return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`), 404);
    }

    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    })
}) 