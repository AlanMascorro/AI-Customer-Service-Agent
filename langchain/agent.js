//Import Langchain Tooling
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import { GoogleGenAI } from '@google/genai';
 
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

import dotenv from "dotenv"; // Environment Variables
dotenv.config();

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


export { customerServiceAgent, queryParser, finalizeParser };



