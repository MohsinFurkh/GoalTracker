import { MongoClient } from 'mongodb';

/**
 * Global variable to maintain the MongoDB connection across requests
 */
let cachedClient = null;
let cachedDb = null;

/**
 * Connect to MongoDB and return the client and database
 * This function reuses the connection if it already exists
 */
export async function connectToDatabase() {
  // If we have a cached connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no connection exists, create a new one
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const db = client.db();

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

/**
 * Get a collection from the database
 * @param {string} collectionName - The name of the collection
 * @returns {Promise<Collection>} - The MongoDB collection
 */
export async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
} 