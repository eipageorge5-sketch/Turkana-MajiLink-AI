import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRoles, SupportedLocales } from "./constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/en/login", // Redirect to localized login page
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ==========================================
        // HACKATHON MOCK AUTHENTICATION
        // In production, this will query DynamoDB:
        // const user = await userRepo.findByEmail(credentials.email as string);
        // if (user && await bcrypt.compare(credentials.password, user.passwordHash)) { ... }
        // ==========================================
        
        const mockUsers = [
          { 
            id: "admin-001", email: "admin@majilink.com", password: "password", 
            name: "System Admin", role: UserRoles.ADMIN, tenantId: "turkana", 
            preferredLanguage: SupportedLocales.EN 
          },
          { 
            id: "county-001", email: "county@majilink.com", password: "password", 
            name: "County Official", role: UserRoles.COUNTY_OFFICIAL, tenantId: "turkana", 
            preferredLanguage: SupportedLocales.EN 
          },
          { 
            id: "tech-001", email: "tech@majilink.com", password: "password", 
            name: "John Tech", role: UserRoles.TECHNICIAN, tenantId: "turkana", 
            wardId: "ward-kanamkemer", preferredLanguage: SupportedLocales.SW 
          },
          { 
            id: "citizen-001", email: "citizen@majilink.com", password: "password", 
            name: "Jane Citizen", role: UserRoles.CITIZEN, tenantId: "turkana", 
            preferredLanguage: SupportedLocales.EN 
          }
        ];

        const user = mockUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) return null;

        // Return user object matching our extended types
        return {
          id: user.id,
          userId: user.id,
          tenantId: user.tenantId,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          wardId: user.wardId,
          name: user.name,
          email: user.email,
        } as any;
      }
    })
  ],
  callbacks: {
    // Inject custom fields into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
        token.tenantId = user.tenantId;
        token.role = user.role;
        token.preferredLanguage = user.preferredLanguage;
        token.wardId = user.wardId;
      }
      return token;
    },
    // Inject custom fields into the Session object
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId;
        session.user.tenantId = token.tenantId;
        session.user.role = token.role;
        session.user.preferredLanguage = token.preferredLanguage;
        session.user.wardId = token.wardId;
      }
      return session;
    }
  }
});