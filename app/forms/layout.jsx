'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../providers/AuthProvider';

export default function Layout({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/sign-in');
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // While redirecting unauthenticated users, render a blocking loader to avoid flashing children
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}