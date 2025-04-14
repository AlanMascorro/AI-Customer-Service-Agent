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
let instructions = `Use context info, chat_history, current order, & Human's request to track order and answer questions as a firehouse subs employee, briefly provide information & don't repeat information in "Chat History:".
                    Generate a json file at the end with the users current order in the following schema: 
                    {"order": [{"item: "item name","size": "item size (if applicable)","price": "price on single item","quantity": "item quantity","instructions": "any special instructions"}]}
                    DO NOT GO OFF TOPIC.`;
const chat_history = [];
let currentOrder;

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
        chat_history.push("User: " + userText);
        let inputPrompt = "] User: " + userText;
        chat_history.forEach((message) => {
            inputPrompt = `${message}\n` + inputPrompt;
        });

        inputPrompt = "Chat History: [" + inputPrompt;

        /*LIMIT THE INPUT PROMPT HERE*/

        const response = await customerServiceAgent.invoke({
            system: instructions,
            input: inputPrompt,
            currentOrder: JSON.stringify(currentOrder)
        })

        console.log(response);
        let responseText = response.answer;

        let sOrderIndx = responseText.indexOf("{");
        let eOrderIndx = responseText.lastIndexOf("}");
        let orderJSON;
        if (sOrderIndx !== -1 && eOrderIndx !== -1) {
            orderJSON = responseText.substring(sOrderIndx, eOrderIndx + 1);
            console.log(orderJSON);
            orderJSON = JSON.parse(orderJSON);
            console.log(orderJSON);
            currentOrder = orderJSON;
            responseText = responseText.substring(0, responseText.indexOf("```"));
        } else {
            console.log("Error: No JSON generated");
        }

        chat_history.push("AI: " + responseText);

        console.log(chat_history);
        res.json({ reply: responseText });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});


//--Gemeni Functions--//

//--Gemeni API Tracking--//

app.listen(parseInt(process.env.HOST_PORT),process.env.HOST_IP, () => console.log(`Server running localhost on port 3000`));