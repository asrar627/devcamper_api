const express = require('express');
const router = express.Router();

// Get All Bootcamps
router.get('/', (req, res) => {
    res.status(200).json({success: true, msg: "Show all Bootcamps" });
});
// Get singel Bootcamp
router.get('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `get Bootcamp ${req.params.id}` });
});
// Create Bootcamp
router.post('/', (req, res) => {
    res.status(201).json({success: true, msg: "Create New Bootcamp" });
});
// Update singel Bootcamp
router.put('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Update existing Bootcamp ${req.params.id}` });
});
// Delete singel Bootcamp
router.delete('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `delete existing Bootcamp ${req.params.id}` });
});

module.exports = router;