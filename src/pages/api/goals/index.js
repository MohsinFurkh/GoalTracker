import { getSession } from 'next-auth/react';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for goal API requests
 * GET: Retrieves all goals for the authenticated user
 * POST: Creates a new goal
 */
export default async function handler(req, res) {
  try {
    // Get the user's session
    const session = await getSession({ req });
    
    // Check if user is authenticated
    if (!session || !session.user) {
      console.log('Unauthorized: No valid session found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;
    console.log('Processing request for user:', userId);

    // Connect to database and get the goals collection
    const { db } = await connectToDatabase();
    const goalsCollection = db.collection('goals');

    // Ensure the collection exists
    try {
      await db.createCollection('goals');
      console.log('Goals collection created or already exists');
    } catch (error) {
      // Collection might already exist, which is fine
      console.log('Goals collection already exists or error:', error.message);
    }

    // Create indexes if they don't exist
    try {
      await goalsCollection.createIndex({ userId: 1 });
      await goalsCollection.createIndex({ createdAt: -1 });
      console.log('Created indexes for goals collection');
    } catch (error) {
      console.log('Indexes might already exist:', error.message);
    }

    switch (req.method) {
      case 'GET':
        // Get all goals for the user
        const goals = await goalsCollection
          .find({ userId: new ObjectId(userId) })
          .sort({ createdAt: -1 })
          .toArray();
        
        console.log(`Found ${goals.length} goals for user ${userId}`);
        return res.status(200).json(goals);

      case 'POST':
        // Create a new goal
        const { title, description, deadline, priority, categories, status } = req.body;
        
        if (!title) {
          console.log('Bad request: Missing required fields');
          return res.status(400).json({ error: 'Title is required' });
        }

        const newGoal = {
          userId: new ObjectId(userId),
          title,
          description: description || '',
          targetDate: deadline ? new Date(deadline) : null,
          priority: (priority || 'medium').toLowerCase(),
          category: categories?.[0] || 'personal', // Use first category or default
          status: status || 'active',
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await goalsCollection.insertOne(newGoal);
        console.log('Created new goal with ID:', result.insertedId);
        
        return res.status(201).json({
          ...newGoal,
          _id: result.insertedId,
        });

      default:
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in goals API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 