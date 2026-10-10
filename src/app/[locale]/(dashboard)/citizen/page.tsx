import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AlertTriangle, Droplets, MapPin } from 'lucide-react';

export default function CitizenDashboard() {
  const t = useTranslations('dashboard');
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground">{t('citizenTitle')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/map" className="p-6 bg-primary text-primary-foreground rounded-xl border-2 border-primary shadow-lg hover:opacity-90 transition-opacity flex flex-col items-center text-center gap-3">
          <AlertTriangle className="h-10 w-10" />
          <h2 className="text-xl font-bold">{t('reportIssue')}</h2>
          <p className="text-sm opacity-90">{t('reportIssueDesc')}</p>
        </Link>

        <Link href="/map" className="p-6 bg-card text-foreground rounded-xl border-2 border-border shadow-sm hover:border-primary transition-colors flex flex-col items-center text-center gap-3">
          <MapPin className="h-10 w-10 text-primary" />
          <h2 className="text-xl font-bold">{t('viewMap')}</h2>
          <p className="text-sm text-muted-foreground">{t('viewMapDesc')}</p>
        </Link>
      </div>
    </div>
  );
}