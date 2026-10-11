'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Droplets, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('login'); 
  const router = useRouter();
  const pathname = usePathname();
  
  const [email, setEmail] = useState('tech@majilink.com'); // Default to tech for easy demo
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Determine the role and target route based on the email for our demo
    let demoRole = 'CITIZEN';
    let targetRoute = '/citizen'; // Fallback

    if (email.includes('admin')) {
      demoRole = 'ADMIN';
      targetRoute = '/admin';
    } else if (email.includes('tech')) {
      demoRole = 'TECHNICIAN';
      targetRoute = '/technician';
    } else if (email.includes('county')) {
      demoRole = 'COUNTY_OFFICIAL';
      targetRoute = '/county';
    }

    // 2. Pass the correct role to NextAuth so the proxy.ts middleware approves it
    const result = await signIn('credentials', {
      email,
      password,
      role: demoRole, 
      redirect: false,
    });

    if (result?.error) {
      console.error("NextAuth Login Error:", result.error);
      setError('Invalid email or password. Please check your credentials.');
      setLoading(false);
    } else {
      // 3. next-intl router automatically adds the '/en' prefix for us!
      // We just give it the clean route name.
      router.push(targetRoute);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-8 p-8 bg-card border-2 border-border rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Droplets className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Turkana MajiLink AI</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="tech@majilink.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign In
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p className="font-semibold mb-1">George Demo Credentials:</p>
          <p>Admin: admin@majilink.com / password</p>
          <p>Tech: tech@majilink.com / password</p>
          <p>Citizen: citizen@majilink.com / password</p>
        </div>
      </div>
    </main>
  );
}