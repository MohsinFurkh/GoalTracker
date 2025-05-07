import { connectToDatabase, getCollection } from '../../lib/mongodb';

/**
 * API endpoint to test MongoDB connection and operations
 * This helps diagnose issues with MongoDB connectivity
 */
export default async function handler(req, res) {
  console.log('Running MongoDB connection check...');
  
  const results = {
    connection: { success: false, error: null },
    databases: [],
    collections: [],
    write_test: { success: false, error: null },
    environment: {
      mongodb_uri: process.env.MONGODB_URI ? 'Set (masked)' : 'Not set',
      node_env: process.env.NODE_ENV,
    }
  };
  
  try {
    // Test 1: Database Connection
    console.log('Step 1: Testing database connection...');
    const { client, db } = await connectToDatabase();
    results.connection.success = true;
    console.log('MongoDB connection successful');
    
    // Test 2: List Databases
    console.log('Step 2: Listing databases...');
    const adminDb = client.db().admin();
    const dbInfo = await adminDb.listDatabases();
    results.databases = dbInfo.databases.map(db => db.name);
    console.log('Found databases:', results.databases);
    
    // Test 3: List Collections
    console.log('Step 3: Listing collections...');
    const collections = await db.listCollections().toArray();
    results.collections = collections.map(col => col.name);
    console.log('Found collections:', results.collections);
    
    // Test 4: Write Test
    console.log('Step 4: Testing write capability...');
    const testCollection = await getCollection('test_collection');
    
    // Create a test document with timestamp
    const testDocument = {
      test: true,
      message: 'MongoDB connection test',
      timestamp: new Date(),
    };
    
    const writeResult = await testCollection.insertOne(testDocument);
    console.log('Write test result:', writeResult);
    
    if (writeResult.acknowledged) {
      // Try to read it back
      const readResult = await testCollection.findOne({ _id: writeResult.insertedId });
      console.log('Read test result:', readResult);
      
      // Try to delete it (cleanup)
      await testCollection.deleteOne({ _id: writeResult.insertedId });
      
      results.write_test = {
        success: true,
        document_id: writeResult.insertedId.toString(),
        read_success: !!readResult
      };
    } else {
      results.write_test.error = 'Write operation not acknowledged';
    }
    
    // Test 5: Check users collection
    if (results.collections.includes('users')) {
      console.log('Step 5: Checking users collection...');
      const usersCollection = await getCollection('users');
      const userCount = await usersCollection.countDocuments();
      results.users = {
        count: userCount,
        sample: userCount > 0 ? await usersCollection.find({}).limit(1).toArray() : []
      };
      
      // Protect sensitive data
      if (results.users.sample && results.users.sample.length > 0) {
        results.users.sample = results.users.sample.map(user => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          has_password: !!user.passwordHash,
          created_at: user.createdAt
        }));
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'MongoDB connection and operations successful',
      results
    });
  } catch (error) {
    console.error('MongoDB check failed:', error);
    
    // Determine at which step the error occurred
    if (!results.connection.success) {
      results.connection.error = error.message;
    } else if (results.databases.length === 0) {
      results.databases = { error: error.message };
    } else if (results.collections.length === 0) {
      results.collections = { error: error.message };
    } else {
      results.write_test.error = error.message;
    }
    
    return res.status(500).json({
      success: false,
      message: 'MongoDB check failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      results
    });
  }
} 