'use client';

import GardeRoute from '../../../routes/GardeRoute';
import UtilisateursDashboard from '../../../views/admin/UtilisateursDashboard';

export default function Page() {
  return (
    <GardeRoute menuCode="UTILISATEURS">
      <UtilisateursDashboard />
    </GardeRoute>
  );
}
