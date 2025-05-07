import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for single goal API requests by ID
 * GET: Retrieves a specific goal
 * PUT: Updates a specific goal
 * DELETE: Deletes a specific goal
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get the goal ID from the URL
  const { id } = req.query;
  
  try {
    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid goal ID' });
    }
    
    const goalId = new ObjectId(id);
    const goalsCollection = await getCollection('goals');
    
    // Ensure the goal belongs to the current user
    const goal = await goalsCollection.findOne({ 
      _id: goalId, 
      userId: session.user.id 
    });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return res.status(200).json(goal);
        
      case 'PUT':
        const updatedGoal = {
          ...req.body,
          userId: session.user.id, // Ensure user can't change ownership
          updatedAt: new Date(),
        };
        
        await goalsCollection.updateOne(
          { _id: goalId },
          { $set: updatedGoal }
        );
        
        return res.status(200).json({
          _id: goalId,
          ...updatedGoal,
        });
        
      case 'DELETE':
        await goalsCollection.deleteOne({ _id: goalId });
        
        return res.status(200).json({ message: 'Goal deleted successfully' });
        
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 