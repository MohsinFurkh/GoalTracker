import { getSession } from 'next-auth/react';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { initializeDatabase } from '../../../lib/initDb';

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

    // Ensure database is initialized
    await initializeDatabase();

    // Get the goals collection
    const goalsCollection = await getCollection('goals');

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
        const { title, description, targetDate, priority, category } = req.body;
        
        if (!title) {
          console.log('Bad request: Missing required fields');
          return res.status(400).json({ error: 'Title is required' });
        }

        const newGoal = {
          userId: new ObjectId(userId),
          title,
          description: description || '',
          targetDate: targetDate ? new Date(targetDate) : null,
          priority: priority || 'medium',
          category: category || 'personal',
          status: 'active',
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