'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Profils from '../../../views/admin/Profils';

export default function Page() {
  return (
    <GardeRoute menuCode="PROFILS">
      <Profils />
    </GardeRoute>
  );
}
