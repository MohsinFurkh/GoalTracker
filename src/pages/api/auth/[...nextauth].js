import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

/**
 * Mock user database for demonstration
 * In production, you would connect to your MongoDB database
 */
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    // Password: "password123"
    passwordHash: '$2a$10$X7qUSfJM3/OwS6yl15h2tuXEKF7JnGDV9q84jQsj81T90JuVBLoJy',
  },
];

/**
 * NextAuth.js configuration
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
        // In production, you would look up the user in your database
        const user = users.find(u => u.email === credentials.email);
        
        if (!user) {
          return null;
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        
        if (!isPasswordValid) {
          return null;
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
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