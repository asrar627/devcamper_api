const express = require('express');

const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controller/reviews');

const Review = require('../model/Review');

const router = express.Router({mergeParams: true}); // mergeParams true is used if other resourse want to access in this router like in this bootcamps

const { protect, authorize  } = require('../middleware/auth');

const advancedResults = require('../middleware/advanceResults');

router.route('/').get(advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description'
}), getReviews).post(protect, authorize('user', 'admin'), addReview);
router.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview);


module.exports = router;