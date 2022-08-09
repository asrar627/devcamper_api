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
const advancedResults = require('../middleware/advanceResults');

const router = express.Router();
const { protect } = require('../middleware/auth');
// include other resourse router
const courseRouter = require('./courses');
// Re-route into other resourse router
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(protect, bootcampPhotoUpload);

module.exports = router;