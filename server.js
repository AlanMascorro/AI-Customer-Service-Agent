//Includes

//--Network--//
const express = require("express"); // Express web server framework
const cors = require("cors"); // Cross-Origin Resource Sharing

//--System--//
const fs = require("fs"); // File System
require("dotenv").config(); // Environment Variables

//--LangChain--//
const { customerServiceAgent } = require("./langchain/agent");

/***************************************
 * Initialize express server           *
****************************************/

//--Main Initialization--//
const app = express();

//--Middleware Activation--//
app.use(express.json()); 
app.use(cors());

//--Page Request--//

//--Query Request--//

//Test Request
customerServiceAgent.invoke([["human", "Hello world!"]])
    .then(response => console.log(response))
    .catch(error => console.error(error));

//--Gemeni API Tracking--//

app.listen(3000, () => console.log("Server running on port 3000"));