const express = require('express');
const { getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius
} = require('../controller/bootcamps')

const router = express.Router();
// include other resourse router
const courseRouter = require('./courses');
// Re-route into other resourse router
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

module.exports = router;