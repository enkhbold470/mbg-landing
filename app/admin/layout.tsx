// app/admin/layout.tsx
import AuthWrapper from '@/components/admin/auth-wrapper';
import { getAdminSession } from '@/lib/auth';

// Force dynamic rendering to prevent static generation issues with cookies
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  
  return <AuthWrapper isAuthenticated={!!session} session={session}>{children}</AuthWrapper>
}
