import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth/admin';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'SilverLine Studio Admin CMS',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminRootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthenticatedAdmin();

  // If unauthorized and not on login page, middleware or getAuthenticatedAdmin redirects
  // For the login/reset pages, we render bare children without the admin chrome
  if (!auth) {
    return <>{children}</>;
  }

  return (
    <AdminLayout adminUser={auth.adminUser}>
      {children}
    </AdminLayout>
  );
}
