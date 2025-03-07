//Includes

//--Network--//
const express = require("express"); // Express web server framework
const cors = require("cors"); // Cross-Origin Resource Sharing

//--System--//
const fs = require("fs"); // File System

//--LangChain--//
const langChain = require("langchain"); // NLP Library

/***************************************
 * Initialize express server           *
****************************************/

//--Main Initialization--
const app = express();

//--Middleware Activation--
app.use(express.json()); 
app.use(cors());





app.listen(3000, () => console.log("Server running on port 3000"));