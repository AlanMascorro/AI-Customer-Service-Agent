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
import { v4 as uuid } from "uuid";

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
//app.use(express.static(path.join(__dirname, "frontend", "dist")));

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
                    If the user hints that their order is complete, return "DONE"
                    If the user wants to clear/restart their order, return "CLEAR"
                    If the user wants to view the menu, return "MENU"
                    DO NOT GO OFF TOPIC.
                    ONLY USE ITEMS THAT ARE GIVEN IN CONTEXT FOR ORDERS
                    CLARIFY SIZE IF APPLICIABLE
                    NO NEED TO CONFIRM`;
let chat_history = {};
let currentOrder = {};

//--Page Request--//

/*****************************
 * Initial chat page for the *
 * customer service agent    *
 ****************************/
let orderID = 0;
let historyReach = 3;

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// })

app.get("/api/client", async (req, res) => {
    let id = uuid();
    res.json({clientID: id});
    chat_history[id] = [];
    currentOrder[id] = {order:[]};
})

app.get("/api/query/:id", async (req, res) => {
    try {
        const userText = req.query.userInput;
        const id = req.params.id;
        if(id == undefined) {
            res.send({reply: "id not defined for current session (rebuild dist/)"});
        }
        chat_history[id].push("User: " + userText);
        let inputPrompt = "User Current Prompt: " + userText + "\nChat History: [";
        for(let i = 0; i < historyReach; i++) {
            if(chat_history[i] == undefined) {
                break;
            }
            inputPrompt += `${chat_history[id][i]}\n` ;
        }
        
        inputPrompt += "]";

        /*LIMIT THE INPUT PROMPT HERE*/

        const response = await customerServiceAgent.invoke({
            system: instructions,
            input: inputPrompt,
            currentOrder: JSON.stringify(currentOrder[id])
        })

        console.log(response);
        let responseText = response.answer;
        if(responseText.indexOf("DONE") != -1) {
            try {
                currentOrder[id].orderID = id;
                await orderCollection.insertOne(currentOrder[id]);
                let total = 0.0;
                currentOrder[id].order.forEach((item) => {
                    total += parseFloat(item.price);
                });
                responseText = `Thank you, your order will be ready shortly, your total is ${total}`;
                res.json({ reply: responseText, order: currentOrder[id] });
                return;
            } catch(e) {
                console.log(e);
            }
        } else if(responseText.indexOf("CLEAR") != -1) {
            currentOrder[id]={order: []}
            res.json({reply: "Your order is cleared.", order: currentOrder[id]})
            return;
        } else if(responseText.indexOf("MENU") != -1) {
            res.json({reply: `===============================\n
                                FIREHOUSE SUBS MENU\n
                            ===============================\n

                            *********** SUBS ***********\n
\n
                            🔥 Hook & Ladder\n
                                - Small  | $5.99 | 500 cal\n
                                - Medium | $7.99 | 800 cal\n
                                - Large  | $9.99 | 1100 cal\n
\n
                            🔥 Firehouse Meatball\n
                                - Small  | $5.99 | 520 cal\n
                                - Medium | $7.99 | 820 cal\n
                                - Large  | $9.99 | 1120 cal\n
\n
                            🔥 Club on a Sub\n
                                - Small  | $6.49 | 510 cal\n
                                - Medium | $8.49 | 810 cal\n
                                - Large  | $10.49| 1110 cal\n
\n
                            🔥 Engineer\n
                                - Small  | $6.29 | 505 cal\n
                                - Medium | $8.29 | 805 cal\n
                                - Large  | $10.29| 1105 cal\n
\n
                            🔥 Italian\n
                                - Small  | $6.29 | 515 cal\n
                                - Medium | $8.29 | 815 cal\n
                                - Large  | $10.29| 1115 cal\n
\n
                            🔥 Turkey Bacon Ranch\n
                                - Small  | $6.79 | 525 cal\n
                                - Medium | $8.79 | 825 cal\n
                                - Large  | $10.79| 1125 cal\n
\n
                            🔥 Smokehouse Beef & Cheddar Brisket\n
                                - Small  | $7.29 | 540 cal\n
                                - Medium | $9.29 | 840 cal\n
                                - Large  | $11.29| 1140 cal\n
\n
                            🔥 Veggie\n
                                - Small  | $5.49 | 480 cal\n
                                - Medium | $7.49 | 780 cal\n
                                - Large  | $9.49 | 1080 cal\n
\n
\n
                            *********** SIDES ***********\n
\n
                            🥗 Side Salad ............... $4.49 | 60 cal\n
                            🥣 Loaded Potato Soup\n
                                - Small ................ $3.99 | 240 cal\n
                                - Large ................ $4.99 | 380 cal\n
                            🥣 Firehouse Chili\n
                                - Small ................ $3.99 | 180 cal\n
                                - Large ................ $4.99 | 300 cal\n
                            🧀 Five Cheese Mac & Cheese  $4.49 | 380 cal\n
                            🍫 Brownie ................. $1.99 | 430 cal\n
                            🍪 Cookie (Choc Chip / Oat)  $1.25 | 310 cal\n
\n
                            🥔 Chips:\n
                                - Lay’s Classic ........ $1.89 | 150 cal\n
                                - Flamin’ Hot Cheetos .. $1.89 | 150 cal\n
                                - Jalapeño Cheddar ..... $1.89 | 150 cal\n
                                - Oven Baked BBQ ....... $1.89 | 150 cal\n
                                - Ruffles Cheddar SC ... $1.89 | 150 cal\n
\n
\n
                            ********** DRINKS **********\n
\n
                            🥤 Fountain Drink\n
                                - Small  | $1.99 | 100 cal\n
                                - Medium | $2.29 | 150 cal\n
                                - Large  | $2.59 | 200 cal\n
\n
                            🥤 Bottled Drink\n
                                - One Size | $2.49 | 160 cal\n
\n
                            🥤 Kids Drink\n
                                - One Size | $1.49 | 80 cal`, order: currentOrder[id]});
                            return;
        }

        let sOrderIndx = responseText.indexOf("{");
        let eOrderIndx = responseText.lastIndexOf("}");
        let orderJSON;
        if (sOrderIndx !== -1 && eOrderIndx !== -1) {
            orderJSON = responseText.substring(sOrderIndx, eOrderIndx + 1);
            console.log(orderJSON);
            orderJSON = JSON.parse(orderJSON);
            console.log(orderJSON);
            currentOrder[id] = orderJSON;
            responseText = responseText.substring(0, responseText.indexOf("```"));
        } else {
            console.log("Error: No JSON generated");
        }

        chat_history[id].push("AI: " + responseText);

        console.log(chat_history[id]);
        if(responseText.trim().length == 0) {
            responseText = "Got it, anything else?";
        }
        res.json({ reply: responseText, order: currentOrder[id] });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

//--Gemeni API Tracking--//

// app.listen(parseInt(process.env.HOST_PORT),process.env.HOST_IP, () => console.log(`Server running localhost on port 3000`));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
