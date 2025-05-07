import { getSession } from 'next-auth/react';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for goal API requests
 * GET: Retrieves all goals for the authenticated user
 * POST: Creates a new goal
 */
export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/goals`);
  
  // Verify session first
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    console.log('Unauthorized: No session found');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  console.log('User authenticated:', session.user.email);
  
  try {
    // Test database connection first
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Database connection successful');
    
    const goalsCollection = await getCollection('goals');
    console.log('Connected to goals collection');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get all goals for the current user
        console.log(`Fetching goals for user: ${session.user.id}`);
        const goals = await goalsCollection
          .find({ userId: session.user.id })
          .sort({ createdAt: -1 })
          .toArray();
        
        console.log(`Found ${goals.length} goals`);
        return res.status(200).json(goals);
        
      case 'POST':
        // Create a new goal
        console.log('Creating new goal with data:', JSON.stringify(req.body));
        const newGoal = {
          ...req.body,
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const result = await goalsCollection.insertOne(newGoal);
        console.log('Goal created with ID:', result.insertedId);
        
        return res.status(201).json({
          _id: result.insertedId,
          ...newGoal,
        });
        
      default:
        console.log(`Method ${req.method} not allowed`);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 