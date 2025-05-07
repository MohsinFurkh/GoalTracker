import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for goal API requests
 * GET: Retrieves all goals for the authenticated user
 * POST: Creates a new goal
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const goalsCollection = await getCollection('goals');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get all goals for the current user
        const goals = await goalsCollection
          .find({ userId: session.user.id })
          .sort({ createdAt: -1 })
          .toArray();
        
        return res.status(200).json(goals);
        
      case 'POST':
        // Create a new goal
        const newGoal = {
          ...req.body,
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const result = await goalsCollection.insertOne(newGoal);
        
        return res.status(201).json({
          _id: result.insertedId,
          ...newGoal,
        });
        
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 