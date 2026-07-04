'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Historique from '../../../views/admin/Historique';

export default function Page() {
  return (
    <GardeRoute menuCode="HISTORIQUE">
      <Historique />
    </GardeRoute>
  );
}
