import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for single task API requests by ID
 * GET: Retrieves a specific task
 * PUT: Updates a specific task
 * DELETE: Deletes a specific task
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get the task ID from the URL
  const { id } = req.query;
  
  try {
    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskId = new ObjectId(id);
    const tasksCollection = await getCollection('tasks');
    
    // Ensure the task belongs to the current user
    const task = await tasksCollection.findOne({ 
      _id: taskId, 
      userId: session.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return res.status(200).json(task);
        
      case 'PUT':
        const updatedTask = {
          ...req.body,
          userId: session.user.id, // Ensure user can't change ownership
          updatedAt: new Date(),
        };
        
        // If completing the task, add completedAt timestamp
        if (updatedTask.completed && !task.completed) {
          updatedTask.completedAt = new Date();
        } else if (!updatedTask.completed) {
          // If uncompleting the task, remove completedAt timestamp
          updatedTask.completedAt = null;
        }
        
        // If task has a goalId, convert it to ObjectId if it's valid
        if (updatedTask.goalId && ObjectId.isValid(updatedTask.goalId)) {
          updatedTask.goalId = new ObjectId(updatedTask.goalId);
        }
        
        await tasksCollection.updateOne(
          { _id: taskId },
          { $set: updatedTask }
        );
        
        return res.status(200).json({
          _id: taskId,
          ...updatedTask,
        });
        
      case 'DELETE':
        await tasksCollection.deleteOne({ _id: taskId });
        
        return res.status(200).json({ message: 'Task deleted successfully' });
        
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 