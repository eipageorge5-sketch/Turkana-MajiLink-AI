import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const t = useTranslations('dashboard');
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-foreground">{t('adminTitle')}</h1>
      <p className="text-muted-foreground">{t('adminDesc')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-6 bg-card border-2 border-border rounded-xl">
          <p className="text-sm font-medium text-muted-foreground">Active Incidents</p>
          <p className="text-4xl font-bold text-primary mt-2">24</p>
        </div>
        <div className="p-6 bg-card border-2 border-border rounded-xl">
          <p className="text-sm font-medium text-muted-foreground">Healthy Water Points</p>
          <p className="text-4xl font-bold text-success mt-2">85%</p>
        </div>
        <div className="p-6 bg-card border-2 border-border rounded-xl">
          <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
          <p className="text-4xl font-bold text-warning mt-2">7</p>
        </div>
      </div>
    </div>
  );
}