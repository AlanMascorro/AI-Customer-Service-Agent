//Includes

//--Network--//
import express from "express"; // Express web server framework
import cors from "cors"; // Cross-Origin Resource Sharing

//import { MongoClient } from "mongodb";


//--System--//
import fs from "fs"; // File System
import "./config.js"; // Environment Variables
import path from "path"; // Path Manipulation for Portability
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


//--Customer Service Bot--//
import { customerServiceAgent } from "./langchain/agent.js";

/***************************************
 * Initialize express server           *
****************************************/

//--Main Initialization--//
const app = express();

//--Middleware Activation--//
app.use(express.json()); 
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend", "dist")));

//--MongoDB Request--//

//--Query Request--//

/*****************************
 * Used to access the        *
 * users requests and interct*
 * with the chatbot          *
 ****************************/
let instructions = "Use context info & Human's request to track order and answer questions as a firehouse subs employee.";

//--Page Request--//

/*****************************
 * Initial chat page for the *
 * customer service agent    *
 ****************************/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

app.get("/api/query", async (req, res) => {
    try {
        const userText = req.query.userInput;
        const response = await customerServiceAgent.invoke({
            system: instructions,
            input: userText,
        })
        console.log(response);
        res.json({ reply: response.answer });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});


//--Gemeni Functions--//

//--Gemeni API Tracking--//

app.listen(parseInt(process.env.HOST_PORT),process.env.HOST_IP, () => console.log(`Server running localhost on port 3000`));