import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request (Next.js 15 pattern)
  let locale = await requestLocale;

  // Fallback to default locale if invalid or missing
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Dynamically import the correct JSON dictionary
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});