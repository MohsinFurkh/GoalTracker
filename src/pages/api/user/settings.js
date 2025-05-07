import { getSession } from 'next-auth/react';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

/**
 * Handler for user settings API
 * GET: Retrieves user settings
 * PUT: Updates user settings (profile, password, notification settings, display settings)
 */
export default async function handler(req, res) {
  // Get session to check authentication
  const session = await getSession({ req });
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Get user collection
  const usersCollection = await getCollection('users');
  
  try {
    // Handle GET request to retrieve user settings
    if (req.method === 'GET') {
      // Get user ID from session
      const userId = session.user.id;
      
      // Convert to ObjectId
      let userObjectId;
      try {
        userObjectId = new ObjectId(userId);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Find user in database
      const user = await usersCollection.findOne({ _id: userObjectId });
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data without password
      const { password, ...userData } = user;
      return res.status(200).json(userData);
    }
    
    // Handle PUT request to update user settings
    if (req.method === 'PUT') {
      // Get user ID from session
      const userId = session.user.id;
      
      // Convert to ObjectId
      let userObjectId;
      try {
        userObjectId = new ObjectId(userId);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Find user in database
      const user = await usersCollection.findOne({ _id: userObjectId });
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const updates = {};
      let updatesMade = false;
      
      // Handle profile updates (name, email)
      if (req.body.name !== undefined) {
        updates.name = req.body.name;
        updatesMade = true;
      }
      
      if (req.body.email !== undefined && req.body.email !== user.email) {
        // Check if email is already in use
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(409).json({ error: 'Email already in use' });
        }
        
        updates.email = req.body.email;
        updatesMade = true;
      }
      
      // Handle password change
      if (req.body.currentPassword && req.body.newPassword) {
        // Verify current password
        const isPasswordValid = await bcrypt.compare(
          req.body.currentPassword,
          user.password
        );
        
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Check if new password meets requirements
        if (req.body.newPassword.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        updates.password = hashedPassword;
        updatesMade = true;
      }
      
      // Handle notification settings update
      if (req.body.notificationSettings) {
        updates.notificationSettings = req.body.notificationSettings;
        updatesMade = true;
      }
      
      // Handle display settings update
      if (req.body.displaySettings) {
        updates.displaySettings = req.body.displaySettings;
        updatesMade = true;
      }
      
      // If no updates were made, return 304 Not Modified
      if (!updatesMade) {
        return res.status(304).json({ message: 'No changes made' });
      }
      
      // Update user in database
      const result = await usersCollection.updateOne(
        { _id: userObjectId },
        { $set: updates }
      );
      
      // Check if update was successful
      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: 'Settings updated successfully' });
      } else {
        return res.status(304).json({ message: 'No changes made' });
      }
    }
    
    // Return 405 Method Not Allowed for other HTTP methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling user settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 