import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Map, ClipboardList, User } from 'lucide-react';
import { UserRoles, type UserRole } from '@/lib/constants';

interface BottomNavProps {
  userRole: UserRole;
  currentPath: string;
}

export function BottomNav({ userRole, currentPath }: BottomNavProps) {
  const t = useTranslations('nav');

  // Simplified links for mobile bottom bar
  const getMobileLinks = () => {
    if (userRole === UserRoles.TECHNICIAN) {
      return [
        { href: '/technician', label: t('jobs'), icon: ClipboardList },
        { href: '/map', label: t('map'), icon: Map },
        { href: '/technician/profile', label: t('profile'), icon: User },
      ];
    }
    
    // Default for Citizen, Admin, County, etc.
    return [
      { href: userRole === UserRoles.CITIZEN ? '/citizen' : '/admin', label: t('home'), icon: LayoutDashboard },
      { href: '/map', label: t('map'), icon: Map },
      { href: userRole === UserRoles.CITIZEN ? '/citizen/reports' : '/admin/assets', label: t('assets'), icon: ClipboardList },
      { href: '/profile', label: t('profile'), icon: User },
    ];
  };

  const links = getMobileLinks();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t-2 border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const isActive = currentPath === link.href || currentPath.startsWith(link.href + '/');
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[60px] rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}