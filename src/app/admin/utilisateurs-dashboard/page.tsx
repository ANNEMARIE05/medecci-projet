'use client';

import GardeRoute from '../../../routes/GardeRoute';
import UtilisateursDashboard from '../../../views/admin/UtilisateursDashboard';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN']}>
      <UtilisateursDashboard />
    </GardeRoute>
  );
}
