//Includes

//--Network--//
import express from "express"; // Express web server framework
import cors from "cors"; // Cross-Origin Resource Sharing

import { MongoClient } from "mongodb";


//--System--//
import fs from "fs"; // File System
import dotenv from "dotenv"; // Environment Variables
dotenv.config();
import path from "path"; // Path Manipulation for Portability
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//--Customer Service Bot--//
import { customerServiceAgent, queryParser } from "./langchain/agent.js";

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