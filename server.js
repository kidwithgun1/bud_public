const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const express = require('express');
const leadsRoute = require('./Routes/Leads');
const port = process.env.port || 5000;

const app = express();

app.use('/leads', leadsRoute);

async function StartServer() {
    ////////////STARTING SERVER///////////////
    app.listen(port, () => {
        console.log('Server started at port ' + port);
    });
    ///////////////////////////////////////
}


StartServer();