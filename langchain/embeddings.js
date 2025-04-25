/**
 * This file is meant to store the embeddings for docuements
 * generated from the MongoDB Atlas database
 */

import { MongoClient } from 'mongodb';

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';

import { JSONLoader } from 'langchain/document_loaders/fs/json';
import fs from 'fs';
import "../config.js";


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
const vectorStoreCollection = firehouseDB.collection(process.env.VECTOR_COLLECTION_NAME);

/**
 * Create Langchain vectorstore MongoDB Atlas integration
 */

const vectorStore = new MongoDBAtlasVectorSearch(embedder, {
    collection: vectorStoreCollection,
    indexName: "vindex",
    textKey: "text",
    embeddingKey: "embedding"
});

/**
 * Generates the vector store from MongoDB based on the other collections
 * @param {GoogleGenerativeAIEmbeddings} vectorStore - Vector store object from this module
 * @param {Collection} firehouseDB - The reference to the MongoDB vector store collection
 */
async function generateVectorStore(vectorStore, db) {

    //--Load JSON Data from MongoDB Collections--//

    /**
     * Aggregate data variable from collections
     */
    let data = [];

    /**
     * Loading all the MongoDB documents
     */
    data.push(...data.concat(await firehouseDB.collection("Subs").find({}).toArray(),
                await firehouseDB.collection("Sides").find({}).toArray(),
                await firehouseDB.collection("Drinks").find({}).toArray(),
                await firehouseDB.collection("Slides").find({}).toArray(),
                await firehouseDB.collection("Menus").find({}).toArray()));

    data.forEach((doc, index) => {
        doc._id = "";
        data[index] = JSON.stringify(doc);
    });

    data = { texts: data };

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error stroing data.json: ', err);
        }
    })

    //--Convert JSON to Langchain Documents--//

    /*Use langchain JSONLoader*/

    const loader = new JSONLoader("./data.json");
    const data_docs = await loader.load();

    //--Store Embeddings in MongoDB--//
    vectorStore.addDocuments(data_docs);
    console.log("Vector store generated");
}

//Setup retriever

const contextRetriever = vectorStore.asRetriever({
    searchType: "mmr",
    k: 7,
    searchKwargs: {
        fetchK: 20,
        lambda: 0.8
    }
});

/*Change this in the future to an object which allows to update the vector store and stuff*/
export { contextRetriever, generateVectorStore, vectorStore }
