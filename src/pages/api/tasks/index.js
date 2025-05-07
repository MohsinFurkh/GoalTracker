import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for task API requests
 * GET: Retrieves all tasks for the authenticated user
 * POST: Creates a new task
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const tasksCollection = await getCollection('tasks');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get query parameters for filtering
        const { goalId, status, priority } = req.query;
        
        // Build the query object
        const query = { userId: session.user.id };
        
        if (goalId) {
          query.goalId = goalId;
        }
        
        if (status) {
          if (status === 'completed') {
            query.completed = true;
          } else if (status === 'pending') {
            query.completed = false;
          }
        }
        
        if (priority) {
          query.priority = priority;
        }
        
        // Get all tasks for the current user with applied filters
        const tasks = await tasksCollection
          .find(query)
          .sort({ dueDate: 1, createdAt: -1 })
          .toArray();
        
        return res.status(200).json(tasks);
        
      case 'POST':
        // Create a new task
        const newTask = {
          ...req.body,
          userId: session.user.id,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // If task has a goalId, convert it to ObjectId if it's valid
        if (newTask.goalId && ObjectId.isValid(newTask.goalId)) {
          newTask.goalId = new ObjectId(newTask.goalId);
        }
        
        const result = await tasksCollection.insertOne(newTask);
        
        return res.status(201).json({
          _id: result.insertedId,
          ...newTask,
        });
        
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 