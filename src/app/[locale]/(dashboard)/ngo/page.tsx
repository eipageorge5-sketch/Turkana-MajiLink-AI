import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NGODashboardClient } from '@/components/features/NGODashboardClient';

export default async function NGODashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // 1. Security Check
  const session = await auth();
  if (!session?.user || (session.user.role !== 'NGO_PARTNER' && session.user.role !== 'ADMIN')) {
    redirect(`/${locale}/login`);
  }

  // 2. Mock Data for the Conference Demo
  const demoData = {
    impactStats: {
      totalFundsDeployed: 145000,
      waterpointsFunded: 28,
      peopleImpacted: 12500,
      activeGrants: 4,
    },
    activeProjects: [
      { 
        id: "PRJ-001", 
        name: "Kakuma Borehole Initiative", 
        location: "Kakuma Ward", 
        totalGrant: 50000, 
        utilized: 35000, 
        status: 'ACTIVE' as const 
      },
      { 
        id: "PRJ-002", 
        name: "Lodwar Solar Pump Project", 
        location: "Lodwar Municipality", 
        totalGrant: 75000, 
        utilized: 75000, 
        status: 'COMPLETED' as const 
      },
      { 
        id: "PRJ-003", 
        name: "Lopei Emergency Repair Fund", 
        location: "Lopei Ward", 
        totalGrant: 20000, 
        utilized: 5000, 
        status: 'ACTIVE' as const 
      },
    ]
  };

  return <NGODashboardClient initialData={demoData} />;
}