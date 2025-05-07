import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

/**
 * API endpoint for user registration
 * POST: Creates a new user account
 */
export default async function handler(req, res) {
  console.log('Signup API called with method:', req.method);
  
  // Only allow POST method
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, password } = req.body;
    console.log('Received signup request for:', email);

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password validation - at least 8 characters
    if (password.length < 8) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    console.log('Input validation passed, connecting to database...');
    
    // Test database connection
    const { db } = await connectToDatabase();
    console.log('Database connection successful');
    
    // Get users collection
    const usersCollection = await getCollection('users');
    console.log('Connected to users collection');

    // Check if user already exists
    console.log('Checking if user already exists with email:', email);
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create new user
    const newUser = {
      name,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      notificationSettings: {
        emailNotifications: true,
        pushNotifications: true,
        taskReminders: true,
        goalUpdates: true,
      },
      displaySettings: {
        darkMode: false,
        compactView: false,
        showCompletedTasks: true,
      }
    };

    // Insert into database
    console.log('Inserting new user into database:', email);
    const result = await usersCollection.insertOne(newUser);
    console.log('User successfully created with ID:', result.insertedId);

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
    console.error('Registration error details:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 