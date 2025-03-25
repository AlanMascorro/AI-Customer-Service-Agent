//Import Langchain Tooling
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser, StructuredOutputParser } = require('@langchain/core/output_parsers');
const { GoogleGenAI } = require('@google/genai');

//const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');


//--Database Data Pull--//



/*************************************
 * Will search environment variables *
 * !!!1,000,000 TOKEN LIMIT!!!       *
 ************************************/
//--Initialize Gemeni API Access--//
const geminiModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMENI_API_KEY,
    temperature: 0.7,
    /*systemInstruction: "You are a customer serivce agent for Firehouse Subs"*/
});

//--context template--//
const queryTemplate = ChatPromptTemplate.fromTemplate(
    `system {context}
    human {input}`
);

//--output parser--//
/****************************************
 * Model output is not clean and has /n *
 * characters. 
 ****************************************/
const queryParser = new StringOutputParser();
const finalizeParser = 0;



//--chain--//
/*****************************************
 * The chain is returned with the output *
 * parsers, so that a different parser   *
 * can be used for ordering and          *
 * finalizing                            *
 *****************************************/
const customerServiceAgent = queryTemplate.pipe(geminiModel);


module.exports.customerServiceAgent = customerServiceAgent;
module.exports.queryParser = queryParser;
module.exports.finalizeParser = finalizeParser;



