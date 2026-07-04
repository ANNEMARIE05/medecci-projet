'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Membres from '../../../views/admin/Membres';

export default function Page() {
  return (
    <GardeRoute menuCode="MEMBRES">
      <Membres />
    </GardeRoute>
  );
}
