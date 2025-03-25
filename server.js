//Includes

//--Network--//
const express = require("express"); // Express web server framework
const cors = require("cors"); // Cross-Origin Resource Sharing

const { MongoClient } = require("mongodb");


//--System--//
const fs = require("fs"); // File System
require("dotenv").config(); // Environment Variables
const path = require("path"); // Path Manipulation for Portability

//--Customer Service Bot--//
const { customerServiceAgent, queryParser } = require("./langchain/agent");

/***************************************
 * Initialize express server           *
****************************************/

//--Main Initialization--//
const app = express();

//--Middleware Activation--//
app.use(express.json()); 
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend", "dist", "js")));
app.use(express.static(path.join(__dirname, "frontend", "dist", "css")));

//--MongoDB Request--//

//--Query Request--//

/*****************************
 * Used to access the        *
 * users requests and interct*
 * with the chatbot          *
 ****************************/
app.get("/api/query", async (req, res) => {
    const response = await customerServiceAgent.pipe(queryParser).invoke({
        input: req.query.query,
        context: ""
    })
    console.log(response);

    res.send(`Text Sent: ${response}`);
});

app.get("/api/finalizeOrder", (req, res) => {

});

//--Page Request--//

/*****************************
 * Initial chat page for the *
 * customer service agent    *
 ****************************/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "test", "test.html"));
})

//--Gemeni Functions--//

//--Gemeni API Tracking--//

app.listen(parseInt(process.env.HOST_PORT), process.env.HOST_IP, () => console.log(`Server running ${process.env.HOST_IP} on port ${process.env.HOST_PORT}`));