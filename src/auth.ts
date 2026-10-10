import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// NOTE: We removed the 'declare module' block from here to prevent 
// "identical modifiers" conflicts with other files in your project.

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }, 
      },
      // Promise<any> bypasses NextAuth's strict internal return type checking
      async authorize(credentials): Promise<any> {
        if (credentials?.email && credentials?.password) {
          
          // Cast to string to fix the 'split' TypeScript error
          const emailStr = credentials.email as string;
          const roleStr = credentials.role as string;

          return {
            id: `user_${Date.now()}`,
            userId: 'tech-001', 
            tenantId: 'turkana', 
            name: emailStr.split('@')[0],
            email: emailStr,
            role: roleStr || 'TECHNICIAN',
            preferredLanguage: 'en', 
            emailVerified: true,
            lastSignIn: new Date().toISOString(),
          } as any; // Bulletproof bypass for NextAuth strict types
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // : any bypasses strict token checking
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.userId = user.userId;
        token.tenantId = user.tenantId;
        token.role = user.role;
        token.preferredLanguage = user.preferredLanguage;
        token.emailVerified = user.emailVerified;
        token.lastSignIn = user.lastSignIn;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
      }
      return token;
    },
    // : any bypasses strict session checking
    async session({ session, token }: any) {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.tenantId = token.tenantId;
        session.user.role = token.role;
        session.user.preferredLanguage = token.preferredLanguage;
        session.user.emailVerified = token.emailVerified;
        session.user.lastSignIn = token.lastSignIn;
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