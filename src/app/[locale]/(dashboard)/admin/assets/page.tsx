import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CSVImportWizard } from "@/components/features/CSVImportWizard";
import { WaterPointForm } from "@/components/features/WaterPointForm";
import { getTranslations } from "next-intl/server";
import { Database, PlusCircle } from "lucide-react";

export default async function AdminAssetsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('assets');

  //  Security Check: Ensure only Admins or County Officials can manage assets
  const session = await auth();
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'COUNTY_OFFICIAL')) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manual Entry */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            {t('manualTitle')}
          </h2>
          <WaterPointForm />
        </div>

        {/* CSV Import */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {t('csvTitle')}
          </h2>
          <CSVImportWizard />
        </div>
      </div>
    </div>
  );
}