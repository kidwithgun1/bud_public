const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
// const leadsRoute = require('./Routes/Leads');
const port = process.env.port || 5000;
const host = '0.0.0.0';
const mongo_atlas_uri = 'mongodb+srv://admin:Ih8you123456@bud.xqer2jf.mongodb.net/?retryWrites=true&w=majority';
const key = "0$m55r1@qf3mqyg";
const client = new mongodb.MongoClient(mongo_atlas_uri);

const app = express();

// app.use('/leads', leadsRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

async function pushLeadDB(req_obj) {
    try{        
        console.log("Connected to Mongo Atlas");

        const db_BUD = client.db("BUD_sale");
        const collectionLeads = db_BUD.collection("Leads");

        console.log(await collectionLeads.insertOne(req_obj));  

        await client.close();
    } catch(e) {
        console.error(e);
    }
}


app.get("/Leads/add", (req, res) => {            
    res.send('Post Lead data here');
});

app.post("/Leads/add", (req, res) => {
    if(req.body.key == key) {
        try {
            let req_obj = {
                name: req.body.name,
                phone: req.body.phone
            }
            pushLeadDB(req_obj);

            res.send({
                status: "OK",
                message: "Success"
            });
        } catch(e) {
            console.error(e);
            res.send({
                status: "ERROR",
                message: "Something went wrong"
            });
        }
    } else {
        res.send('Acess denied');
    }
});

async function StartServer() {

    await client.connect();

    ////////////STARTING SERVER///////////////
    app.listen(port, host, () => {
        console.log('Server started at port ' + port);
    });
    ///////////////////////////////////////
}


StartServer();