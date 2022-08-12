const express = require('express');

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/users');
const User = require('../model/User');

const router = express.Router({mergeParams: true}); // mergeParams true is used if other resourse want to access in this router

const { protect, authorize  } = require('../middleware/auth');
// Any below route will use this protect
router.use(protect);
// Any below route will use this authorize('admin')
router.use(authorize('admin'));

const advancedResults = require('../middleware/advanceResults');
router
    .route('/')
        .get(advancedResults(User), getUsers)
        .post(createUser);
router
    .route('/:id')
        .get(getUser)
        .put(updateUser)
        .delete(deleteUser);



module.exports = router;