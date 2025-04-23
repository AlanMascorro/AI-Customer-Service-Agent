//Includes

//--Database--//
import { MongoClient } from "mongodb"

//--Network--//
import express from "express"; // Express web server framework
import cors from "cors"; // Cross-Origin Resource Sharing

//--System--//
import fs from "fs"; // File System
import "./config.js"; // Environment Variables
import path from "path"; // Path Manipulation for Portability
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


//--Initialize MongoDB Connection--//
const dbClient = new MongoClient(process.env.MONGODB_URI);
await dbClient.connect();
const firehouseDB = dbClient.db(process.env.MONGODB_DATABASE_NAME);

const orderCollection = firehouseDB.collection(process.env.ORDER_COLLECTION_NAME)

//--Customer Service Bot--//
import { customerServiceAgent } from "./langchain/agent.js";

/***************************************
 * Initialize express server           *
****************************************/

//--Main Initialization--//
const app = express();

//--Middleware Activation--//
app.use(express.json()); 
app.use(cors({
  origin: 'https://ai-customer-service-agent-1.onrender.com',
  credentials: true
}));
// app.use(express.static(path.join(__dirname, "frontend", "dist")));

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
                    If the user indicates they have completed their order, return "DONE"
                    If the user wants to clear/restart their order, return "CLEAR"
                    DO NOT GO OFF TOPIC.
                    NO NEED TO CONFIRM
                    ONLY USE CONTEXT INFORMATION`;
const chat_history = [];
let currentOrder;

//--Page Request--//

/*****************************
 * Initial chat page for the *
 * customer service agent    *
 ****************************/
let orderID = 0;
let historyReach = 3;

// app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// })

app.get("/api/query", async (req, res) => {
    try {
        const userText = req.query.userInput;
        chat_history.push("User: " + userText);
        let inputPrompt = "] User: " + userText;
        for(let i = 0; i < historyReach; i++) {
            inputPrompt = `${chat_history[i]}\n` + inputPrompt;
        }

        inputPrompt = "Chat History: [" + inputPrompt;

        /*LIMIT THE INPUT PROMPT HERE*/

        const response = await customerServiceAgent.invoke({
            system: instructions,
            input: inputPrompt,
            currentOrder: JSON.stringify(currentOrder)
        })

        console.log(response);
        let responseText = response.answer;
        if(responseText.indexOf("DONE") != -1) {
            try {
                currentOrder.orderID = orderID;
                await orderCollection.insertOne(currentOrder)
                orderID++;
            } catch(e) {
                console.log(e);
            }
        } else if(responseText.indexOf("CLEAR") != -1) {
            currentOrder={}
        }

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
        res.json({ reply: responseText, order: currentOrder });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

//--Gemeni API Tracking--//

// app.listen(parseInt(process.env.HOST_PORT),process.env.HOST_IP, () => console.log(`Server running localhost on port 3000`));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});
