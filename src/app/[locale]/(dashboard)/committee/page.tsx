import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CommitteeDashboardClient } from '@/components/features/CommitteeDashboardClient';

export default async function CommitteeDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // 1. Security Check
  const session = await auth();
  if (!session?.user || (session.user.role !== 'COMMITTEE_LEADER' && session.user.role !== 'ADMIN')) {
    redirect(`/${locale}/login`);
  }

  // 2. Mock Data for the Conference Demo (Localized to a specific village)
  const demoData = {
    villageName: "Kakuma Ward - Zone 4",
    localStats: {
      totalWaterpoints: 12,
      pendingReports: 3,
      verifiedThisMonth: 18,
    },
    pendingVerifications: [
      { 
        id: "RPT-101", 
        citizenName: "Anonymous Citizen", 
        location: "Community Borehole #4", 
        issue: "Water tastes salty and has a strong odor.", 
        reportedAt: "2 hours ago",
        status: 'PENDING' as const 
      },
      { 
        id: "RPT-102", 
        citizenName: "Mary E.", 
        location: "School Pump #2", 
        issue: "Handle is broken, children cannot pump water.", 
        reportedAt: "5 hours ago",
        status: 'PENDING' as const 
      },
      { 
        id: "RPT-103", 
        citizenName: "Anonymous Citizen", 
        location: "Market Square Tank", 
        issue: "Minor leak at the base of the tank.", 
        reportedAt: "1 day ago",
        status: 'PENDING' as const 
      },
    ]
  };

  return <CommitteeDashboardClient initialData={demoData} />;
}