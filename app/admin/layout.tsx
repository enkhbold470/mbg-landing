// app/admin/layout.tsx
import AuthWrapper from '@/components/admin/auth-wrapper';
import { isAuthenticated } from '@/app/actions/config';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();
  
  return <AuthWrapper isAuthenticated={authenticated}>{children}</AuthWrapper>
}
