const path = require('path')
const express =  require('express');
const dotenv =  require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const mongoDB = require('./config/db');
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

//Load env file
dotenv.config({path: './config/config.env'}) // we are giving the path where to look
// Connect to Database
mongoDB();


const app = express();
// Body parser
app.use(express.json());

// Dev Logging Midleware
if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}
// File Uploading
app.use(fileupload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000

// For run server
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and Exit process
    server.close(() => process.exit(1));
});