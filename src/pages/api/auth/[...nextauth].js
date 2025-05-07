import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Debug NextAuth setup
console.log('Initializing NextAuth configuration...');

// Create client promise for MongoDB adapter
const clientPromise = connectToDatabase().then(({ client }) => {
  console.log('MongoDB client connected successfully for NextAuth adapter');
  return client;
}).catch(err => {
  console.error('Failed to connect MongoDB for NextAuth adapter:', err);
  throw err;
});

/**
 * NextAuth.js configuration with MongoDB support
 */
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Authorizing user with email:', credentials.email);
          
          // Get the users collection
          const usersCollection = await getCollection('users');
          
          // Look up the user in the database
          const user = await usersCollection.findOne({ 
            email: credentials.email 
          });
          
          // If no user found with this email
          if (!user) {
            console.log('No user found with email:', credentials.email);
            
            // Demo user only for specific credentials
            if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
              console.log('Creating demo user');
              const hashedPassword = await bcrypt.hash('password123', 10);
              const newUser = {
                name: 'Demo User',
                email: 'user@example.com',
                passwordHash: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              
              const result = await usersCollection.insertOne(newUser);
              console.log('Demo user created with ID:', result.insertedId);
              
              return {
                id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
              };
            }
            
            return null;
          }
          
          console.log('User found, verifying password');
          
          // Verify the password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          
          if (!isPasswordValid) {
            console.log('Password validation failed for:', credentials.email);
            return null;
          }
          
          console.log('User authenticated successfully:', credentials.email);
          
          // Return the user without sensitive data
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  // Configure the MongoDB adapter to store sessions and users
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        console.log('Setting JWT token for user:', user.email);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to session
      if (token && session.user) {
        console.log('Setting session data for user:', session.user.email);
        session.user.id = token.id;
        session.user.createdAt = token.createdAt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  debug: process.env.NODE_ENV === 'development',
  // Events allow running code at specific points in the auth flow
  events: {
    async signIn({ user, account, isNewUser }) {
      // This runs when a user signs in
      console.log(`User signed in: ${user.email}`);
    },
    async createUser({ user }) {
      // This runs when a new user is created by NextAuth (not our API endpoint)
      console.log(`New user created by NextAuth: ${user.email}`);
      
      try {
        // Get the users collection
        const usersCollection = await getCollection('users');
        
        // Add default settings if they don't exist
        await usersCollection.updateOne(
          { _id: new ObjectId(user.id) },
          { 
            $set: {
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
              },
              updatedAt: new Date()
            } 
          },
          { upsert: false }
        );
        
        console.log(`Default settings added for new user: ${user.email}`);
      } catch (error) {
        console.error(`Error adding default settings for new user: ${user.email}`, error);
      }
    },
  }
}); 