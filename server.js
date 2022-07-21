const express =  require('express');
const dotenv =  require('dotenv');


//Load env file
dotenv.config({path: './config/config.env'}) // we are giving the path where to look

const app = express();
app.get('/', (req, res) => {
    // res.send( { name: "Asrar" } ); // here express auto convert into json by detecting
    // res.json( { name: "Asrar" } ); // this is specifically for json 
    // res.sendStatus(400); // just send status 
    // res.status(400).json({success: false});
    res.status(200).json({success: true, data: {name: "Asrar"}});
});
const PORT = process.env.PORT || 5000

// For run server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));