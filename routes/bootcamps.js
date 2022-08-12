const express = require('express');
const { getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
} = require('../controller/bootcamps')
const Bootcamp = require('../model/Bootcamp');


const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
// include other resourse router
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Re-route into other resourse router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

const advancedResults = require('../middleware/advanceResults');
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;