const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongodb = require('mongodb');

const mongo_atlas_uri = 'mongodb+srv://admin:Ih8you123456@bud.xqer2jf.mongodb.net/?retryWrites=true&w=majority';
const key = "0$m55r1@qf3mqyg";

const client = new mongodb.MongoClient(mongo_atlas_uri);


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
  }));
  

async function pushLeadDB(req_obj) {
    
    try{        
        await client.connect();

        console.log("Connected to Mongo Atlas");

        const db_BUD = client.db("BUD_sale");
        const collectionLeads = db_BUD.collection("Leads");

        console.log(await collectionLeads.insertOne(req_obj));  

        await client.close();
    } catch(e) {
        console.error(e);
    }
}

router.get("/add", (req, res) => {            
    res.send('Post Lead data here');
});

router.post("/add", (req, res) => {
    if(req.body.key == key) {
        try {
            let req_obj = {
                name: req.body.name,
                phone: req.body.phone
            }
            pushLeadDB(req_obj);

            res.send({
                status: "OK",
                message: "Seccess"
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

module.exports = router;