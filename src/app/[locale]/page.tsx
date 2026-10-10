import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      {/* Language Switcher positioned top right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
          {tCommon('appName')}
        </h1>
        <h2 className="text-2xl font-semibold text-foreground">
          {t('title')}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            {t('getStarted')}
          </Link>
          <Link 
            href="/map" 
            className="inline-flex items-center justify-center rounded-md border-2 border-primary bg-transparent px-6 py-3 text-base font-medium text-primary shadow-sm hover:bg-primary/10 transition-colors"
          >
            {t('viewMap')}
          </Link>
        </div>
      </div>
    </main>
  );
}