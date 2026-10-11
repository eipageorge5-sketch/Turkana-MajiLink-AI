import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Users as UsersIcon } from 'lucide-react';

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect(`/${locale}/login`);

  const mockUsers = [
    { name: 'John Tech', role: 'TECHNICIAN', ward: 'Kanamkemer', status: 'Active' },
    { name: 'Jane Admin', role: 'ADMIN', ward: 'Headquarters', status: 'Active' },
    { name: 'Peter County', role: 'COUNTY_OFFICIAL', ward: 'Lodwar', status: 'Active' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <UsersIcon className="h-8 w-8 text-primary" /> User Management
      </h1>
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
        {mockUsers.map((user, i) => (
          <div key={i} className="p-4 flex justify-between items-center border-b border-border last:border-0">
            <div>
              <p className="font-bold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.role.replace('_', ' ')}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">{user.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}