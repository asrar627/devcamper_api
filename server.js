const path = require('path')
const express =  require('express');
const dotenv =  require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const mongoDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//Load env file
dotenv.config({path: './config/config.env'}) // we are giving the path where to look
// Connect to Database
mongoDB();


const app = express();
// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());
// Dev Logging Midleware
if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}
// File Uploading
app.use(fileupload());

// Sanitize Mongoose
app.use(mongoSanitize());

// Set Security Header
app.use(helmet());

// Prevent xss attack
app.use(xss());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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