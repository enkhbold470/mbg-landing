'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, Server, User, Users as UsersIcon, FileText, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminSession {
  id: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

interface AuthWrapperProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  session: AdminSession | null;
}

export default function AuthWrapper({ children, isAuthenticated, session }: AuthWrapperProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        toast({
          title: "Admin Page | 管理页面",
          description: "Login successful | 登录成功",
        });

        // Refresh the page to update the session
        router.refresh();
      } catch (err) {
        setError('Invalid credentials | 凭据无效');
        toast({
          title: "Error | 错误",
          description: "Login failed. Please check your credentials. | 登录失败，请检查您的凭据。",
          variant: "destructive"
        });
      }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        
        toast({
          title: "Admin Page | 管理页面",
          description: "Logout successful | 已成功退出",
        });

        // Refresh to show login page
        router.refresh();
      } catch (err) {
        console.error('Logout error:', err);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Card className="w-full max-w-md bg-background rounded-2xl">
          <CardHeader className="text-center space-y-4 bg-background rounded-2xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-primary-foreground" />
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
          <CardContent className="bg-background rounded-2xl">
            {error && (
              <Alert className="mb-4 bg-background rounded-2xl">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Login failed. Please check your credentials. | 登录失败，请检查您的凭据。
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4 bg-background p-6 rounded-2xl">
              <div>
                <Label htmlFor="username">Username | 用户名</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="admin"
                  required
                  disabled={isPending}
                  className="rounded-2xl"
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
                  className="rounded-2xl"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-2xl"
                disabled={isPending}
              >
                {isPending ? 'Logging in... | 正在登录...' : 'Login | 登录'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-4 bg-background">
          Request new admin access: | 申请新的管理员访问： <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline">enkhbold470@gmail.com</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background shadow-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-8 max-w-[1920px] mx-auto border-y border-slate-200">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors whitespace-nowrap">
              MBG Landing Admin
            </Link>
            {session && (
              <nav className="flex items-center gap-1 border-l pl-6 ml-2">
           
                {session.role === 'SUPER_ADMIN' && (
                  <Link 
                    href="/admin/users" 
                    className="px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors bg-background"
                  >
                    <UsersIcon className="w-4 h-4" />
                    Users
                  </Link>
                )}
                <Link 
                  href="/admin/audit-logs" 
                  className="px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors bg-background"
                >
                  <FileText className="w-4 h-4" />
                  Audit Logs
                </Link>
              </nav>
            )}
          </div>
          
          {session && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 ">
                <User className="w-4 h-4 text-gray-500" />
                <div className="flex gap-4 items-center">
                  <span className="text-sm font-semibold text-gray-900">{session.username}</span>
                  <Badge 
                    variant={session.role === 'SUPER_ADMIN' ? 'default' : 'secondary'} 
                    className="text-xs w-fit mt-0.5"
                  >
                    {session.role === 'SUPER_ADMIN' ? (
                      <><Shield className="w-3 h-3 mr-1 inline" />Super Admin</>
                    ) : (
                      'Admin'
                    )}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                disabled={isPending}
                className="border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50 bg-background rounded-full hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto p-6">
        {!isLocalhost && (
          <Alert className="max-w-md mb-4 bg-background rounded-2xl">
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
          <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Card className="w-full max-w-md bg-background rounded-2xl">
              <CardHeader className="text-center space-y-4 bg-background rounded-2xl">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-primary-foreground" />
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
              <CardContent className="bg-background rounded-2xl">
                {error && (
                  <Alert className="mb-4 bg-background rounded-2xl">
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Login failed. Please check your credentials. | 登录失败，请检查您的凭据。
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-4 bg-background p-6 rounded-2xl">
                  <div>
                    <Label htmlFor="username">Username | 用户名</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="admin"
                      required
                      disabled={isPending}
                      className="rounded-2xl"
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
                      className="rounded-2xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-2xl"
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