import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise };

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log('Successfully connected to MongoDB.');
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Add a small delay before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Retry the connection
    try {
      const client = await clientPromise;
      const db = client.db();
      console.log('Successfully reconnected to MongoDB after retry.');
      return { client, db };
    } catch (retryError) {
      console.error('Error reconnecting to MongoDB after retry:', retryError);
      throw retryError;
    }
  }
}

/**
 * Get a collection from the database
 * @param {string} collectionName - The name of the collection
 * @returns {Promise<Collection>} - The MongoDB collection
 */
export async function getCollection(collectionName) {
  try {
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
} 