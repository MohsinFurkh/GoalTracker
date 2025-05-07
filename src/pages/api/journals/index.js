import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for journal API requests
 * GET: Retrieves all journal entries for the authenticated user
 * POST: Creates a new journal entry
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const journalsCollection = await getCollection('journals');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get query parameters for filtering
        const { startDate, endDate, mood, tag } = req.query;
        
        // Build the query object
        const query = { userId: session.user.id };
        
        // Date range filtering
        if (startDate || endDate) {
          query.date = {};
          
          if (startDate) {
            query.date.$gte = new Date(startDate);
          }
          
          if (endDate) {
            query.date.$lte = new Date(endDate);
          }
        }
        
        // Mood filtering
        if (mood) {
          query.mood = mood;
        }
        
        // Tag filtering
        if (tag) {
          query.tags = tag;
        }
        
        // Get all journal entries for the current user with applied filters
        const journals = await journalsCollection
          .find(query)
          .sort({ date: -1, createdAt: -1 })
          .toArray();
        
        return res.status(200).json(journals);
        
      case 'POST':
        // Create a new journal entry
        const newJournal = {
          ...req.body,
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Ensure date is a Date object
        if (newJournal.date && typeof newJournal.date === 'string') {
          newJournal.date = new Date(newJournal.date);
        } else if (!newJournal.date) {
          newJournal.date = new Date();
        }
        
        const result = await journalsCollection.insertOne(newJournal);
        
        return res.status(201).json({
          _id: result.insertedId,
          ...newJournal,
        });
        
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 