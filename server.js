const express =  require('express');
const dotenv =  require('dotenv');


//Load env file
dotenv.config({path: './config/config.env'}) // we are giving the path where to look

const app = express();
const PORT = process.env.PORT || 5000

// For run server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));