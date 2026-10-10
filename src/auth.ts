import NextAuth, { type DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend the session type to include role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified?: boolean;
      lastSignIn?: string;
    } & DefaultSession['user'];
  }
  interface User {
    role: string;
    emailVerified?: boolean;
    lastSignIn?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }, // Optional: for demo/testing
      },
      async authorize(credentials) {
        // 🔹 For demo: accept any email/password and assign a default role
        // 🔹 In production: replace this with your DynamoDB user lookup
        if (credentials?.email && credentials?.password) {
          return {
            id: `user_${Date.now()}`,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: credentials.role || 'resident',
            emailVerified: true,
            lastSignIn: new Date().toISOString(),
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Required for Server Components
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.lastSignIn = user.lastSignIn;
      }
      // Handle session updates (e.g., profile edits)
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.lastSignIn = token.lastSignIn as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/en/login',
    signOut: '/en/login',
    error: '/en/login',
  },
});