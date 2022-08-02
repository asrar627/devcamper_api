const NodeGeocoder = require('node-geocoder');

const options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: "AIzaSyCm1sebc-8pTWq7TZV7E7ZDYd3brhL9LFI", 
    formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;