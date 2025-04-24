import { vectorStore, generateVectorStore } from "./embeddings.js";
import { MongoClient } from 'mongodb';

import "../config.js";

const dbClient = new MongoClient(process.env.MONGODB_URI);
await dbClient.connect();
const firehouseDB = dbClient.db(process.env.MONGODB_DATABASE_NAME);
console.log("Generating Vector Store");

await generateVectorStore(vectorStore, firehouseDB);

dbClient.close();