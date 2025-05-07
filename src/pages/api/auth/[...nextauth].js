import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { getCollection, connectToDatabase } from '../../../lib/mongodb';

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
          
          // If we don't have a user with this email, create a demo account
          if (!user) {
            // For first-time users, create a demo account
            if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
              const hashedPassword = await bcrypt.hash('password123', 10);
              const newUser = {
                name: 'Demo User',
                email: 'user@example.com',
                passwordHash: hashedPassword,
                createdAt: new Date(),
              };
              
              const result = await usersCollection.insertOne(newUser);
              
              return {
                id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
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
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}); 