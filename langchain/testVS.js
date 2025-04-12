import { MongoClient } from 'mongodb';
import "../config.js";

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';

//--Create MongoDB Client--//

/**
 * Create a connection to Atlas MongoDB host
 */
const dbClient = new MongoClient(process.env.MONGODB_URI);
await dbClient.connect();
const firehouseDB = dbClient.db(process.env.MONGODB_DATABASE_NAME);

//--Create Vector Store Object--//

const embedder = new GoogleGenerativeAIEmbeddings( {
    apiKey: process.env.GEMENI_API_KEY,
    model: 'text-embedding-004'
});

/**
 * Connect to vector store collection
 */
const vectorStoreCollection = firehouseDB.collection(process.env.MONGODB_COLLECTION_NAME);

/**
 * Create Langchain vectorstore MongoDB Atlas integration
 */

const vectorStore = new MongoDBAtlasVectorSearch(embedder, {
    collection: vectorStoreCollection,
    indexName: "vindex",
    textKey: "text",
    embeddingKey: "embedding"
});


vectorStore.similaritySearch("What is a Hook & Ladder", 1).then((results) => {
    console.log(results);
})