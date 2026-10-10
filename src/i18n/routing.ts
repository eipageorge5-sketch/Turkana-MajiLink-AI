import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'sw'],
  defaultLocale: 'en'
});

// Typed navigation helpers for use in Client Components
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);