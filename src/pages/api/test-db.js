import { connectToDatabase, getCollection } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const { client, db } = await connectToDatabase();
    console.log('Successfully connected to MongoDB');
    
    // Get collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    
    // Test access to specific collections
    const usersCollection = await getCollection('users');
    const goalsCollection = await getCollection('goals');
    const tasksCollection = await getCollection('tasks');
    const journalsCollection = await getCollection('journals');
    
    // Count documents in each collection
    const userCount = await usersCollection.countDocuments();
    const goalCount = await goalsCollection.countDocuments();
    const taskCount = await tasksCollection.countDocuments();
    const journalCount = await journalsCollection.countDocuments();
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      collections: collectionNames,
      counts: {
        users: userCount,
        goals: goalCount,
        tasks: taskCount,
        journals: journalCount
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
} 