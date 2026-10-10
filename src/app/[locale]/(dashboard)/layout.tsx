import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { UserMenu } from '@/components/layout/UserMenu';
import { OfflineIndicator } from '@/components/layout/OfflineIndicator';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Double-check authentication (Middleware should catch this, but defense-in-depth)
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // We need the current path to highlight active nav links.
  // In a real app, you'd pass this down or use a client hook. 
  // For simplicity in the layout, we pass a placeholder, and the components will handle it.
  // Actually, to get the exact path in a Server Component, we use headers().
  // But for nav highlighting, it's easier to let the client handle it or pass a generic active state.
  // Let's just pass the role. The active state will be a visual enhancement.
  
  const currentPath = ''; // We will improve active state in a later substep using a client hook

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Offline Banner */}
      <OfflineIndicator />

      {/* Desktop Sidebar */}
      <Sidebar userRole={session?.user?.role as any} currentPath={currentPath} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b-2 border-border bg-card sticky top-0 z-30">
          <h2 className="text-lg font-bold text-foreground hidden sm:block">
            Turkana MajiLink AI
          </h2>
          
          <div className="flex items-center gap-3 ml-auto">
            <LanguageSwitcher />
            <UserMenu session={session} locale={locale} />
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          {/* Add padding to top if offline banner is showing (handled by CSS or just let it overlap slightly for now) */}
          <div className="mt-8 lg:mt-0">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={session?.user?.role as any} currentPath={currentPath} />
    </div>
  );
}