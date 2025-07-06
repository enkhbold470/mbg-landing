'use client';

import { useState, useEffect, useTransition } from 'react';
import { authenticateAdmin, logout } from '@/app/actions/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, Server } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function AuthWrapper({ children, isAuthenticated }: AuthWrapperProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if we're on localhost
    const checkHost = () => {
      const host = window.location.host;
      const localhost = host.startsWith('localhost:') || host.startsWith('127.0.0.1:') || host.startsWith('mbg-landing.vercel.app');
      setIsLocalhost(localhost);
      
      if (!localhost) {
        setError('Admin panel is only accessible from localhost');
      }
    };

    checkHost();
  }, []);

  const handleLogin = async (formData: FormData) => {
    setError('');
    startTransition(async () => {
      try {
        await authenticateAdmin(formData);
      } catch (err) {
        setError('Invalid credentials');
      }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isPending}
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">MBG Admin Panel</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Signing out...' : 'Logout'}
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  );
} 