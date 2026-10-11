import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Settings as SettingsIcon } from 'lucide-react';

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect(`/${locale}/login`);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" /> System Settings
      </h1>
      <div className="bg-card border-2 border-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <div>
            <p className="font-bold text-foreground">Offline Sync Interval</p>
            <p className="text-sm text-muted-foreground">How often the app syncs when online</p>
          </div>
          <span className="font-mono bg-muted px-3 py-1 rounded">5 mins</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <div>
            <p className="font-bold text-foreground">AI Prediction Model</p>
            <p className="text-sm text-muted-foreground">Current active machine learning model</p>
          </div>
          <span className="font-mono bg-muted px-3 py-1 rounded">v2.4.1</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-foreground">Maintenance Mode</p>
            <p className="text-sm text-muted-foreground">Disable citizen reporting temporarily</p>
          </div>
          <span className="font-mono bg-red-100 text-red-700 px-3 py-1 rounded border border-red-200">OFF</span>
        </div>
      </div>
    </div>
  );
}