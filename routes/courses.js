const express = require('express');

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controller/courses');

const Course = require('../model/Course');

const router = express.Router({mergeParams: true}); // mergeParams true is used if other resourse want to access in this router

const { protect, authorize  } = require('../middleware/auth');

const advancedResults = require('../middleware/advanceResults');
router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(protect, authorize('publisher', 'admin'), addCourse);
router.route('/:id').get(getCourse).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse);
module.exports = router;