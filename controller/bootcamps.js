const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../model/Bootcamp');

// @desc Get All bootcamps
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = asyncHandler ( async (req, res, next) => {
    console.log(req.query);
    let query;
    // Create request query
    let reqQuery = {...req.query};
    console.log("before reqQuery is: ", reqQuery);

    // Field to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log("After reqQuery is: ", reqQuery);

    // Create query string
    let queryStr = JSON.stringify(req.query);
    // Create Operator ($gt, $gte, $lt, $lte)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log("query string is: ", queryStr);
    console.log("after parse: ", JSON.parse(queryStr) )
    // Find Bootcamp
    query = Bootcamp.find(JSON.parse(queryStr))
    // Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort Fields
    console.log(req.query.sort)
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25; // by default limit is 25
    const startIndex = (page - 1) * limit; // limitize first total
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments(); // total is all the bootcamps in the database
    query = query.skip(startIndex).limit(limit);

    // Executing Query
    const bootcamps = await query;

    //Pagination Result
    const pagination = {}
    //if there are some records are remaining to show then it will show next page counter
    if (endIndex < total){
        pagination.next = {
            page: page + 1,
            limit // when key and value are same then we dont need to do this
        }
    }
    // if there are some records which are skipped at start
    if (startIndex > 0 ){
        pagination.prev = {
            page: page - 1,
            limit // when key and value are same then we dont need to do this
        }
    }

    res.status(200).json({success: true, count: bootcamps.length, pagination, data: bootcamps });
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

