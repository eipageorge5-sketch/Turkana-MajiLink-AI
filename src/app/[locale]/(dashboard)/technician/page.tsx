import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTechnicianIncidentsAction } from '@/actions/incidents';
import { TechnicianDashboardClient } from '@/components/features/TechnicianDashboardClient';
import { getTranslations } from 'next-intl/server';
import { Wrench } from 'lucide-react';

export default async function TechnicianDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('technician');
  
  const session = await auth();
  if (!session?.user || session.user.role !== 'TECHNICIAN') {
    redirect(`/${locale}/login`);
  }

  const technicianId = session.user?.userId || "tech-001"; 
  const response = await getTechnicianIncidentsAction(technicianId);
  const incidents = response.success ? (response.data as any[]) : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {/* This passes the data to the file we created in Step 1 */}
      <TechnicianDashboardClient initialIncidents={incidents} technicianId={technicianId} />
    </div>
  );
}