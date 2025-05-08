import { getSession } from 'next-auth/react';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for goal API requests
 * GET: Retrieves all goals for the authenticated user
 * POST: Creates a new goal
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Log that a request is being received to create a new goal
    console.error('Receiving request to create a new goal');

    // Log the request body
    console.log('Request body:', req.body);

    // Retrieve and log the session data
    const session = await getSession({ req });
    console.log('Session data:', session);
    
    // Log if the user is authenticated
    if (session && session.user && session.user.id) {
      console.log(`User is authenticated with id: ${session.user.id}`);
    }

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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

    // Proceed with the rest of the logic for creating a goal
    const { title, description, deadline, priority, categories, status } = req.body;
    const newGoal = {
      userId: new ObjectId(session.user.id),
      title,
      description: description || '',
      targetDate: deadline ? new Date(deadline) : null,
      priority: priority || 'Medium',
      categories: categories || [],
      status: status || 'Not Started',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    //Log that we are creating a new goal
    console.log('Creating a new goal');

    try {
      const result = await goalsCollection.insertOne(newGoal);
      console.log('Insert result:', result);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error inserting goal:', error);
      return res.status(500).json({ error: `Failed to create goal: ${error.message}` });
    }
  } else if (req.method === 'GET') {
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

      // Get all goals for the user
      const goals = await goalsCollection
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();

      console.log(`Found ${goals.length} goals for user ${userId}`);
      return res.status(200).json(goals);
    } catch (error) {
      console.error('Error in goals API:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}