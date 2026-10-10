import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, Map, Users, Settings, 
  ClipboardList, Droplets, Wrench 
} from 'lucide-react';
import { UserRoles, type UserRole } from '@/lib/constants';

interface SidebarProps {
  userRole: UserRole;
  currentPath: string;
}

export function Sidebar({ userRole, currentPath }: SidebarProps) {
  const t = useTranslations('nav');

  // Define navigation links based on role
  const getNavLinks = () => {
    const baseLinks = [
      { href: '/map', label: t('map'), icon: Map },
    ];

    switch (userRole) {
      case UserRoles.ADMIN:
        return [
          { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
          ...baseLinks,
          { href: '/admin/users', label: t('users'), icon: Users },
          { href: '/admin/assets', label: t('assets'), icon: Droplets },
          { href: '/admin/settings', label: t('settings'), icon: Settings },
        ];
      case UserRoles.TECHNICIAN:
        return [
          { href: '/technician', label: t('jobs'), icon: ClipboardList },
          ...baseLinks,
        ];
      case UserRoles.CITIZEN:
        return [
          { href: '/citizen', label: t('dashboard'), icon: LayoutDashboard },
          ...baseLinks,
          { href: '/citizen/reports', label: t('myReports'), icon: ClipboardList },
        ];
      default:
        // County, NGO, Committee
        return [
          { href: '/county', label: t('dashboard'), icon: LayoutDashboard },
          ...baseLinks,
        ];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r-2 border-border bg-card">
      <div className="p-6 border-b-2 border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Droplets className="h-6 w-6" />
          MajiLink
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = currentPath === link.href || currentPath.startsWith(link.href + '/');
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border'
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}