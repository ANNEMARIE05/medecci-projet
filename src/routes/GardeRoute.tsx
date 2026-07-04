'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePermissions } from '../hooks/usePermissions';

interface GardeRouteProps {
  children: React.ReactNode;
  menuCode?: string;
  actionCode?: string;
}

export const GardeRoute: React.FC<GardeRouteProps> = ({ children, menuCode, actionCode = 'VOIR' }) => {
  const { status } = useSession();
  const { isLoading, peut } = usePermissions();
  const router = useRouter();

  const estAutorise = !menuCode || peut(menuCode, actionCode);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    } else if (status === 'authenticated' && !isLoading && !estAutorise) {
      router.push('/admin');
    }
  }, [status, isLoading, estAutorise, router]);

  if (status !== 'authenticated' || isLoading) {
    return null;
  }

  if (!estAutorise) {
    return null;
  }

  return <>{children}</>;
};

export default GardeRoute;
