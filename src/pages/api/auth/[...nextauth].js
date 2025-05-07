import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Create client promise for MongoDB adapter
const clientPromise = connectToDatabase().then(({ client }) => client);

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
          // Get the users collection
          const usersCollection = await getCollection('users');
          
          // Look up the user in the database
          const user = await usersCollection.findOne({ 
            email: credentials.email 
          });
          
          // If no user found with this email
          if (!user) {
            // Demo user only for specific credentials
            if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
              const hashedPassword = await bcrypt.hash('password123', 10);
              const newUser = {
                name: 'Demo User',
                email: 'user@example.com',
                passwordHash: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              
              const result = await usersCollection.insertOne(newUser);
              
              return {
                id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
              };
            }
            
            return null;
          }
          
          // Verify the password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          
          if (!isPasswordValid) {
            return null;
          }
          
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
      console.log(`New user created: ${user.email}`);
    },
  }
}); 