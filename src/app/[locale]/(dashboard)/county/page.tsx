import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CountyDashboardClient } from '@/components/features/CountyDashboardClient';

export default async function CountyDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // 1. Security Check: Only County Officials and Admins can see this
  const session = await auth();
  if (!session?.user || (session.user.role !== 'COUNTY_OFFICIAL' && session.user.role !== 'ADMIN')) {
    redirect(`/${locale}/login`);
  }

  // 2. Mock Data for the Conference Demo
  const demoData = {
    wardStats: [
      { ward: 'Kanamkemer', totalPumps: 45, brokenPumps: 3, health: 93 },
      { ward: 'Lopei', totalPumps: 32, brokenPumps: 1, health: 97 },
      { ward: 'Lokichar', totalPumps: 28, brokenPumps: 5, health: 82 },
      { ward: 'Kakuma', totalPumps: 50, brokenPumps: 2, health: 96 },
    ],
    escalations: [
      // The "as const" tells TypeScript this is exactly 'PENDING', not just any string
      { id: "ESC-001", location: "Lokichar - Borehole 4", issue: "Total pump failure, no water for 3 days", priority: "CRITICAL", daysOpen: 3, status: 'PENDING' as const },
      { id: "ESC-002", location: "Kanamkemer - Tank 2", issue: "Severe leakage reported by 5 citizens", priority: "HIGH", daysOpen: 2, status: 'PENDING' as const },
    ],
    leaderboard: [
      { rank: 1, name: 'John Tech', ward: 'Kanamkemer', resolved: 14 },
      { rank: 2, name: 'Mary Engineer', ward: 'Kakuma', resolved: 11 },
      { rank: 3, name: 'Peter Fixer', ward: 'Lopei', resolved: 9 },
    ]
  };

  // 3. Pass data to the Client Component
  return <CountyDashboardClient initialData={demoData} />;
}