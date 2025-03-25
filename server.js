//Includes

//--Network--//
const express = require("express"); // Express web server framework
const cors = require("cors"); // Cross-Origin Resource Sharing

const { MongoClient } = require("mongodb");


//--System--//
const fs = require("fs"); // File System
require("dotenv").config(); // Environment Variables

//--Customer Service Bot--//
const { customerServiceAgent } = require("./langchain/agent");

/***************************************
 * Initialize express server           *
****************************************/

//--Main Initialization--//
const app = express();

//--Middleware Activation--//
app.use(express.json()); 
app.use(cors());

//--MongoDB Request--//
const uri = process.env.MONGO_URI; // most likely a uri, could be a url not sure how mongodb works (ask Jacob), either way store in .env

const client = new MongoClient(uri);
let db;

async function connectToMongo()
{
  try {
    await client.connect();
    db = client.db("firehouseSubs"); // Ask Jacob for database name
    console.log("MongoDB connected!"); // test
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

connectToMongo();

//--Page Request--//



//--Query Request--//



//Test Request
// customerServiceAgent.invoke([["human", "Hello world!"]])
//     .then(response => console.log(response))
//     .catch(error => console.error(error));

//--Gemeni API Tracking--//

app.listen(3000, () => console.log("Server running on port 3000"));