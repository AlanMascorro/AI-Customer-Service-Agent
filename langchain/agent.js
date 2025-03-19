//Import Langchain Tooling
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

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
const query = ChatPromptTemplate.fromMessages([
    ["system", "{context}"],
    ["human", "{input}"]
]);

//--output parser--//
/****************************************
 * Model output is not clean and has /n *
 * characters. 
 ****************************************/
const queryParser = new StringOutputParser();
const finalizeParser = 0;

//--chain--//
const customerServiceAgent = query.pipe(geminiModel);


/*****************************************
 * The chain is returned with the output *
 * parsers, so that a different parser   *
 * can be used for ordering and          *
 * finalizing                            *
 *****************************************/

module.exports = { customerServiceAgent, queryParser, finalizeParser };