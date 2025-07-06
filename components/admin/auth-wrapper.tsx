'use client';

import { useState, useEffect, useTransition } from 'react';
import { authenticateAdmin, logout } from '@/app/actions/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
interface AuthWrapperProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function AuthWrapper({ children, isAuthenticated }: AuthWrapperProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    // Check if we're on localhost
    const checkHost = () => {
      const host = window.location.host;
      const localhost = host.startsWith('localhost:') || host.startsWith('127.0.0.1:') || host.startsWith('mbg-landing.vercel.app');
      setIsLocalhost(localhost);
      
      if (!localhost) {
        setError('Админ панель зөвхөн localhost-ээс хандаж болно');
      }
    };

    checkHost();
  }, []);

  const handleLogin = async (formData: FormData) => {
    setError('');
    startTransition(async () => {
      try {
        await authenticateAdmin(formData);
        toast({
          title: "Admin Page",
              description: "Нэвтрэх амжилттай",
        })  
      } catch (err) {
        setError('Invalid credentials');
        toast({
          title: "Admin Page",
          description: "Нэвтрэх үед алдаа гарлаа",
        })  
        }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
      toast({
        title: "Admin Page",
        description: "Гарах амжилттай",
      })  
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image src="https://placekeanu.com/100/100" alt="MBG Logo" width={100} height={100} className="rounded-full" />
              <CardTitle>MBG Админ нэвтрэх</CardTitle>
            </div>
            
            
          </CardHeader>
          <CardContent>
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Админ нэр</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
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
                {isPending ? 'Нэвтрэх...' : 'Нэвтрэх'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-4">Шинэ админ нэвтрэх эрхийг үүсгэх бол: <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline">enkhbold470@gmail.com</Link></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">MBG Админ Панель</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Гарах...' : 'Гарах'}
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  );
} 