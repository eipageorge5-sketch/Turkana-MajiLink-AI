'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'en' | 'sw') => {
    // Replaces the current URL with the new locale prefix
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-md border border-border bg-card shadow-sm">
      <Globe className="h-4 w-4 text-muted-foreground ml-2" />
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
          locale === 'en' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('sw')}
        className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
          locale === 'sw' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        SW
      </button>
    </div>
  );
}