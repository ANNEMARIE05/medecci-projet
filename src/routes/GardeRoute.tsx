'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';

interface GardeRouteProps {
  children: React.ReactNode;
  rolesAutorises?: Array<'ADMIN' | 'PASTEUR' | 'TRESORIER'>;
}

export const GardeRoute: React.FC<GardeRouteProps> = ({ children, rolesAutorises }) => {
  const estConnecte = useAuthStore((state) => state.estConnecte);
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const router = useRouter();

  useEffect(() => {
    if (!estConnecte) {
      router.push('/connexion');
    } else if (rolesAutorises && (!utilisateur || !rolesAutorises.includes(utilisateur.role))) {
      router.push('/admin');
    }
  }, [estConnecte, utilisateur, rolesAutorises, router]);

  if (!estConnecte) {
    return null;
  }

  if (rolesAutorises && (!utilisateur || !rolesAutorises.includes(utilisateur.role))) {
    return null;
  }

  return <>{children}</>;
};

export default GardeRoute;
