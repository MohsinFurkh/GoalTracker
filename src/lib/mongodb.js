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
    console.log('Using cached MongoDB connection');
    return { client: cachedClient, db: cachedDb };
  }

  // If no connection exists, create a new one
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not defined');
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  console.log('Creating new MongoDB connection');
  
  try {
    // Connection URI masking for security in logs
    const maskedURI = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log('Connecting to MongoDB with URI:', maskedURI);
    
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Establishing MongoDB connection...');
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db();
    console.log('Database selected:', db.databaseName);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Get a collection from the database
 * @param {string} collectionName - The name of the collection
 * @returns {Promise<Collection>} - The MongoDB collection
 */
export async function getCollection(collectionName) {
  try {
    console.log(`Getting collection: ${collectionName}`);
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
} 