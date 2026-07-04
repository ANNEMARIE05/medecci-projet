import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import habilitationService, { MesHabilitations } from '../services/habilitationService';

export function usePermissions() {
  const { status } = useSession();

  const { data, isLoading } = useQuery<MesHabilitations>({
    queryKey: ['mes-habilitations'],
    queryFn: habilitationService.recupererMesHabilitations,
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000,
  });

  const permissions = data?.permissions ?? {};
  const menus = data?.menus ?? [];

  function peut(menuCode: string, actionCode: string): boolean {
    return permissions[menuCode]?.includes(actionCode) ?? false;
  }

  return {
    isLoading: status === 'loading' || (status === 'authenticated' && isLoading),
    profilId: data?.profilId ?? null,
    profilLibelle: data?.profilLibelle,
    menus,
    permissions,
    peut,
  };
}

export default usePermissions;
