import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for individual journal entry API requests
 * GET: Retrieves a specific journal entry
 * PUT: Updates a specific journal entry
 * DELETE: Deletes a specific journal entry
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get journal ID from the request
  const { id } = req.query;
  
  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid journal ID' });
  }
  
  const journalId = new ObjectId(id);
  
  try {
    const journalsCollection = await getCollection('journals');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get the journal entry
        const journal = await journalsCollection.findOne({
          _id: journalId,
          userId: session.user.id,
        });
        
        if (!journal) {
          return res.status(404).json({ error: 'Journal entry not found' });
        }
        
        return res.status(200).json(journal);
        
      case 'PUT':
        // Update the journal entry
        const updateData = {
          ...req.body,
          updatedAt: new Date(),
        };
        
        // Handle date conversion if it's a string
        if (updateData.date && typeof updateData.date === 'string') {
          updateData.date = new Date(updateData.date);
        }
        
        // Prevent modification of userId and createdAt
        delete updateData.userId;
        delete updateData.createdAt;
        
        const updateResult = await journalsCollection.updateOne(
          { _id: journalId, userId: session.user.id },
          { $set: updateData }
        );
        
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Journal entry not found' });
        }
        
        // Get the updated journal entry
        const updatedJournal = await journalsCollection.findOne({ _id: journalId });
        
        return res.status(200).json(updatedJournal);
        
      case 'DELETE':
        // Delete the journal entry
        const deleteResult = await journalsCollection.deleteOne({
          _id: journalId,
          userId: session.user.id,
        });
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Journal entry not found' });
        }
        
        return res.status(200).json({ message: 'Journal entry deleted successfully' });
        
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 