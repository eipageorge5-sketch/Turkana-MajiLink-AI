import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRoles, SupportedLocales } from "@/lib/constants";

declare module "next-auth" {
  interface User {
    userId: string;
    tenantId: string;
    role: string;
    preferredLanguage: string;
    wardId?: string;
  }

  interface Session {
    user: {
      userId: string;
      tenantId: string;
      role: string;
      preferredLanguage: string;
      wardId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    tenantId: string;
    role: string;
    preferredLanguage: string;
    wardId?: string;
  }
}