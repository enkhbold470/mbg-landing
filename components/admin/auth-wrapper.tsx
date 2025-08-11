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
        setError('Admin panel is accessible only from localhost | 管理面板仅可从本地访问');
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
          title: "Admin Page | 管理页面",
          description: "Login successful | 登录成功",
        });
      } catch (err) {
        // Check if it's a redirect error (which is expected on successful login)
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
          // This is expected - the redirect will happen automatically
          toast({
            title: "Admin Page | 管理页面",
            description: "Login successful | 登录成功",
          });
          return;
        }
        
        setError(err as string);
        console.log('Login failed | 登录失败', err);
        toast({
          title: "Admin Page | 管理页面",
          description: "Login failed. Please check your credentials. | 登录失败，请检查您的凭据。",
        });
      }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
      toast({
        title: "Admin Page | 管理页面",
        description: "Logout successful | 已成功退出",
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
                Admin Login | 管理员登录
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Access the admin panel | 访问管理面板
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Login failed. Please check your credentials. | 登录失败，请检查您的凭据。
                </AlertDescription>
              </Alert>
            )}

            <form action={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username | 用户名</Label>
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
                <Label htmlFor="password">Password | 密码</Label>
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
                {isPending ? 'Logging in... | 正在登录...' : 'Login | 登录'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-4">
          Request new admin access: | 申请新的管理员访问： <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline">enkhbold470@gmail.com</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-20">
          <Link href="/admin" className="text-xl font-semibold hover:text-gray-700 transition-colors">
            MBG Admin Panel | MBG 管理面板
          </Link>
          {/* Logout UI removed as per instructions */}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Logging out... | 正在退出...' : 'Logout | 退出'}
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {!isLocalhost && (
          <Alert className="max-w-md mb-4">
            <Server className="h-4 w-4" />
            <AlertDescription>
              For security, the admin panel is only accessible from localhost. | 出于安全考虑，管理面板仅能从本地访问。
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
                    Admin Login | 管理员登录
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Access the admin panel | 访问管理面板
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4">
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Login failed. Please check your credentials. | 登录失败，请检查您的凭据。
                    </AlertDescription>
                  </Alert>
                )}

                <form action={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username | 用户名</Label>
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
                    <Label htmlFor="password">Password | 密码</Label>
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
                    {isPending ? 'Logging in... | 正在登录...' : 'Login | 登录'}
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