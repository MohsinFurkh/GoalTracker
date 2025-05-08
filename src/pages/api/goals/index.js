import { getToken } from 'next-auth/jwt';
import { jwt } from 'next-auth/jwt';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for goal API requests
 * GET: Retrieves all goals for the authenticated user
 * POST: Creates a new goal
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('POST method called');

    // Log that a request is being received to create a new goal
    console.error('Receiving request to create a new goal');

    // Log the request body
    console.log('Request body:', req.body);
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    let session = null;
    if (token) {
      session = {
        user: {
          id: token.id,
          email: token.email,
        },
      };
      console.log("Token is available: ", token);
    } else {
      console.log("Token is not available");
    }
    console.log('Session data:', session);
      
    
      

    if (!session || !session.user) {
      console.error("Session is null");

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
    try{
      console.log("session.user.id", session.user.id);
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
      }
      console.log('newGoal object created');
      
      //Log that we are creating a new goal
      console.log('Creating a new goal');
      const result = await goalsCollection.insertOne(newGoal);
      console.log('Insert result:', result);
      return res.status(201).json(result);
    } catch (error) {
      console.error("There was an error with ObjectId", error);
      if (error.message.includes("Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer")) {
        return res.status(400).json({ error: `Failed to create goal: Invalid user Id` });
      }
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