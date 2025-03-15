//Environment Setup
require('dotenv').config();
//Import Langchain Tooling
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");


//Initialize Gemeni API Access
const customerServiceAgent = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMENI_API_KEY,
    temperature: 0.2,
    /*systemInstruction: "You are a customer serivce agent for Firehouse Subs"*/
});

module.exports = { customerServiceAgent };