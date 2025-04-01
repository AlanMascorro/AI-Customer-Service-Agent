/**
 * This file is meant to store the embeddings for docuements
 * generated from the MongoDB Atlas database
 */

import { MongoClient } from 'mongodb';

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';

import { JSONLoader } from 'langchain/document_loaders/fs/json';
import dotenv from 'dotenv'; // Environment Variables
dotenv.config();

//Embed the documents

const embedder = new GoogleGenerativeAIEmbeddings( {
    apiKey: process.env.GEMENI_API_KEY,
    model: 'gemini-2.0-flash'
});

//--Create MongoDB Client--//

/**
 * Create a connection to Atlas MongoDB host
 */
const dbClient = new MongoClient(process.env.MONGODB_URI);
const vectorStoreCollection = dbClient
    .db(process.env.MONGODB_DATABASE_NAME)
    .collection(process.env.MONGODB_COLLECTION_NAME);

//Grab json from mongodb

/*Use the clientDB*/

//Load data into documents

/*Use langchain JSONLoader*/

//--Embed documents--//

/**
 * Access to the specific collection in the database
 * used for the vector store
 */

/**
 * Set vector to the database collection
 */

const vectorStore = new MongoDBAtlasVectorSearch(embedder, {
    collection: vectorStoreCollection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding"
});

//Store into mongodb the vector store



//Setup retriever

const contextRetriever = vectorStore.asRetriever();

/*Change this in the future to an object which allows to update the vector store and stuff*/
export { contextRetriever }
