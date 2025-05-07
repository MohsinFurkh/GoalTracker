import { compare } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './mongodb';
import User from '../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const { email, password } = credentials;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if password matches
        const isMatch = await compare(password, user.password);
        
        if (!isMatch) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
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
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

// Fetch the current user's data from the database
export async function getCurrentUser() {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return null;
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return null;
    }

    return {
      ...user.toObject(),
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
} 