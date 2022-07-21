const express =  require('express');
const dotenv =  require('dotenv');


//Load env file
dotenv.config({path: './config/config.env'}) // we are giving the path where to look

const app = express();
// Get All Bootcamps
app.get('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({success: true, msg: "Show all Bootcamps" });
});
// Get singel Bootcamp
app.get('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, msg: `get Bootcamp ${req.params.id}` });
});
// Create Bootcamp
app.post('/api/v1/bootcamps', (req, res) => {
    res.status(201).json({success: true, msg: "Create New Bootcamp" });
});
// Update singel Bootcamp
app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Update existing Bootcamp ${req.params.id}` });
});
// Delete singel Bootcamp
app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, msg: `delete existing Bootcamp ${req.params.id}` });
});
const PORT = process.env.PORT || 5000

// For run server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));