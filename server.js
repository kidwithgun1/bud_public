const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
// const leadsRoute = require('./Routes/Leads');
const port = process.env.port || 5000;
const host = '0.0.0.0';
const mongo_atlas_uri = 'mongodb+srv://admin:Ih8you123456@bud.xqer2jf.mongodb.net/?retryWrites=true&w=majority';
const key = "0$m55r1@qf3mqyg";
const client = new mongodb.MongoClient(mongo_atlas_uri);

const countrysList = ["France","Portugal","Finland","Denmark","Latvia","Lithuania","Estonia","Czech","Israel","Greece","Germany","Italy","Turkey"];
let Alpha2ListRU = {};
const app = express();

// app.use('/leads', leadsRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

async function pushLeadDB(req, res) {
    try{        
        console.log("Connected to Mongo Atlas");

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        const db_Service = client.db("Service_DB");
        const collectionService = db_Service.collection("Service");

        let temp_obj = await collectionService.findOne({
            name: "serviceList"
        });

        Object.assign(Alpha2ListRU, temp_obj.countrys);

        let req_obj = {
            name: req.body.name,
            phone: req.body.phone,
            country: Alpha2ListRU[req.body.country][0],
            timezone: Alpha2ListRU[req.body.country][1],
            ftd: false,
            status: "New",
            // date: `${year}-${month}-${date}T${hours}:${minutes}:${seconds}+`,
            // date: new Date(),
            date: moment().tz("Ukraine").format(),
            campaign: req.body.campaign,
            problem: req.body.problem
        }

        const db_BUD = client.db("BUD_sale");
        const collectionLeads = db_BUD.collection("Leads");

        

        console.log(await collectionLeads.insertMany([req_obj]));  

        let res_obj = await collectionLeads.findOne({
            name: req.body.name,
            phone: req.body.phone,
            campaign: req.body.campaign,
            problem: req.body.problem
        });

        console.log(res_obj);

        await res.send({
            status: "OK",
            message: "Success",
            inserted_object: res_obj
        });        

    } catch(e) {
        console.error(e);
        res.send({
            status: "ERROR",
            message: "Something went wrong"
        });
    }
}

app.get("/", (req, res) => {
    res.send("<h1 style='text-align:center; width:100%; margin-top: 20%'>404 NOT FOUND</h1>")
});

app.get("/Leads/add", (req, res) => {            
    res.send('Post Lead data here');
});

app.post("/Leads/add", (req, res) => {
    if(req.body.key == key) {
        try {
            pushLeadDB(req, res);
        } catch(e) {
            console.error(e);
        }
    } else {
        res.send('Access denied');
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