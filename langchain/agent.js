//--Import Langchain Tooling--//
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';


import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

import { contextRetriever } from './embeddings.js';

import "../config.js";



/*************************************
 * Will search environment variables *
 * !!!1,000,000 TOKEN LIMIT!!!       *
 ************************************/
//--Initialize Gemeni API Access--//
const geminiModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMENI_API_KEY,
    temperature: 0.7,
});

//--context template--//
const queryTemplate = ChatPromptTemplate.fromTemplate(
    `
    System Instructions {system}
    Context: {context}
    Human: {input}
    `
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
const logicChain = await createStuffDocumentsChain( {
    llm: geminiModel,
    prompt: queryTemplate,
});

const customerServiceAgent = await createRetrievalChain( {
    combineDocsChain: logicChain,
    retriever: contextRetriever
})


export { logicChain, queryParser, finalizeParser };



