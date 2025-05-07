import { getCollection } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

/**
 * API endpoint for user registration
 * POST: Creates a new user account
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password validation - at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Get users collection
    const usersCollection = await getCollection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await usersCollection.insertOne(newUser);

    // Return success but don't include password hash
    return res.status(201).json({
      success: true,
      user: {
        id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 