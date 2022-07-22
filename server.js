const express =  require('express');
const dotenv =  require('dotenv');
const morgan = require('morgan');
// Route files
const bootcamps = require('./routes/bootcamps');

//Load env file
dotenv.config({path: './config/config.env'}) // we are giving the path where to look

const app = express();

// Dev Logging Midleware
if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000

// For run server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));