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
        setError('Админ хяналтын самбар зөвхөн localhost-с хандах боломжтой');
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
          title: "Админ хуудас",
          description: "Амжилттай нэвтэрлээ",
        });
      } catch (err) {
        // Check if it's a redirect error (which is expected on successful login)
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
          // This is expected - the redirect will happen automatically
          toast({
            title: "Админ хуудас",
            description: "Амжилттай нэвтэрлээ",
          });
          return;
        }
        
        setError(err as string);
        console.log('Нэвтрэх амжилтгүй', err);
        toast({
          title: "Админ хуудас",
          description: "Нэвтрэх амжилтгүй. Нэвтрэх мэдээллээ шалгана уу.",
        });
      }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
      toast({
        title: "Admin Page",
        description: "Logout successful",
      });
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Админ нэвтрэх
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Админ хяналтын самбарт хандах
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Нэвтрэх амжилтгүй. Нэвтрэх мэдээллээ шалгана уу.
                </AlertDescription>
              </Alert>
            )}

            <form action={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="admin"
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="password">Нууц үг</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-4">
          Шинэ админ хандалт үүсгэхэд: <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline">enkhbold470@gmail.com</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-20">
          <Link href="/admin" className="text-xl font-semibold hover:text-gray-700 transition-colors">
            MBG Админ самбар
          </Link>
          {/* Logout UI removed as per instructions */}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Гараж байна...' : 'Гарах'}
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {!isLocalhost && (
          <Alert className="max-w-md mb-4">
            <Server className="h-4 w-4" />
            <AlertDescription>
              Админ самбар нь аюулгүй байдлын үүднээс зөвхөн localhost-оос хандах боломжтой.
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated ? (
          <>
            {/* "Logged in as admin" and Logout UI removed as per instructions */}
            {children}
          </>
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Админ нэвтрэх
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Админ хяналтын самбарт хандах
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4">
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Нэвтрэх амжилтгүй. Нэвтрэх мэдээллээ шалгана уу.
                    </AlertDescription>
                  </Alert>
                )}

                <form action={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="admin"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Нууц үг</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}