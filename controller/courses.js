const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../model/Course');
const Bootcamp = require('../model/Bootcamp');

// @desc Get Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.getCourses = asyncHandler(async(req, res, next) => {
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }else{
        res.status(200).json(res.advancedResults);
    }
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
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp){
        return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`), 404);
    }
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next( new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    };
    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    })
}) 

// @desc Update Course
// @route Put /api/v1/courses/:id
// @access private

exports.updateCourse = asyncHandler(async(req, res, next) => {
    // Here variable made with let type because we need it to update
    let course = await Course.findById(req.params.id);

    if (!course){
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404);
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next( new ErrorResponse(`User ${req.user.id} is not authorized to update a course ${course._id}`, 401));
    };

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: course
    })
}) 

// @desc Delete Course
// @route delete /api/v1/courses/:id
// @access private

exports.deleteCourse = asyncHandler(async(req, res, next) => {
    // Here variable made with let type because we dont need it to update
    const course = await Course.findById(req.params.id);

    if (!course){
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404);
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next( new ErrorResponse(`User ${req.user.id} is not authorized to delete a course ${course._id}`, 401));
    };

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
}) 