import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// Points to our i18n request configuration
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Future Next.js configs go here
};

export default withNextIntl(nextConfig);