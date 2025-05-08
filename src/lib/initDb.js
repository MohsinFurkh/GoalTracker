import { connectToDatabase } from './mongodb';

export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();
    console.log('Initializing database collections...');

    // Create collections if they don't exist
    const collections = ['users', 'goals', 'tasks', 'journals'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      } catch (error) {
        // Collection might already exist, which is fine
        console.log(`Collection ${collectionName} already exists or error:`, error.message);
      }
    }

    // Create indexes for better query performance
    const goalsCollection = db.collection('goals');
    await goalsCollection.createIndex({ userId: 1 });
    await goalsCollection.createIndex({ createdAt: -1 });
    console.log('Created indexes for goals collection');

    const tasksCollection = db.collection('tasks');
    await tasksCollection.createIndex({ userId: 1 });
    await tasksCollection.createIndex({ goalId: 1 });
    await tasksCollection.createIndex({ createdAt: -1 });
    console.log('Created indexes for tasks collection');

    const journalsCollection = db.collection('journals');
    await journalsCollection.createIndex({ userId: 1 });
    await journalsCollection.createIndex({ createdAt: -1 });
    console.log('Created indexes for journals collection');

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 