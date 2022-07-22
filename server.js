const express =  require('express');
const dotenv =  require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const mongoDB = require('./config/db');
// Route files
const bootcamps = require('./routes/bootcamps');

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

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000

// For run server
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and Exit process
    server.close(() => process.exit(1));
});