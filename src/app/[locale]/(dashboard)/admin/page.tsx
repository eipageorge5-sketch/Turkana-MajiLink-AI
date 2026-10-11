import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from '@/components/features/AdminDashboardClient';

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // 1. Security Check: Ensure the user is an Admin or County Official
  const session = await auth();
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'COUNTY_OFFICIAL')) {
    redirect(`/${locale}/login`);
  }

  // 2. Mock Data for the Conference Demo
  // In production, this would come from DynamoDB analytics
  const demoData = {
    stats: {
      totalWaterpoints: 142,
      activeTechnicians: 12,
      openIncidents: 5,
      resolutionRate: 85,
    },
    aiAlert: {
      title: "AI Predictive Maintenance Alert",
      message: "3 pumps in Ward Kanamkemer are showing early signs of mechanical failure based on recent vibration reports.",
    },
    recentReports: [
      { id: "RPT-001", location: "Ward Kanamkemer - Pump 12", issue: "Low Water Pressure", time: "10 mins ago", status: "OPEN", priority: "HIGH" },
      { id: "RPT-002", location: "Ward Lopei - Borehole 4", issue: "Unusual Pump Noise", time: "1 hour ago", status: "IN_PROGRESS", priority: "MEDIUM" },
      { id: "RPT-003", location: "Ward Lokichar - Tank 2", issue: "Pipe Leakage", time: "3 hours ago", status: "RESOLVED", priority: "LOW" },
    ]
  };

  // 3. Pass data to the Client Component
  return <AdminDashboardClient initialData={demoData} />;
}