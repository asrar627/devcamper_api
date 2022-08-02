const express = require('express');

const {
    getCourses,
    getCourse,
    addCourse
} = require('../controller/courses');

const router = express.Router({mergeParams: true}); // mergeParams true is used if other resourse want to access in this router

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse);
module.exports = router;