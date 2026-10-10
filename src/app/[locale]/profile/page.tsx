import { Metadata } from 'next';
import { auth } from '@/auth'; // NextAuth.js auth helper
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile | Turkana MajiLink',
  description: 'Your account settings and profile',
};

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/en/login');
  }

  const user = session.user;
  const role = user.role || 'resident';
  const fullName = user.name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid gap-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">{role}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Email Verified</span>
              <span className={user.emailVerified ? 'text-green-600' : 'text-amber-600'}>
                {user.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">Last Sign In</span>
              <span className="font-medium">
                {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <form action="/api/auth/signout" method="POST">
            <button 
              type="submit"
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}