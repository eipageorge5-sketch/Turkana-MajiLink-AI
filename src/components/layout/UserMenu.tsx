'use client';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Session } from 'next-auth';

interface UserMenuProps {
  session: Session;
  locale: string;
}

export function UserMenu({ session, locale }: UserMenuProps) {
  const t = useTranslations('layout');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Redirect to the localized login page after signing out
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors border border-transparent hover:border-border"
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          {session.user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-foreground leading-none">{session.user.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{session.user.role.replace('_', ' ')}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border-2 border-border bg-card shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/50">
            <p className="text-sm font-semibold text-foreground">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}