'use client';

import GardeRoute from '../../../routes/GardeRoute';
import MeditationsAdmin from '../../../views/admin/MeditationsAdmin';

export default function Page() {
  return (
    <GardeRoute menuCode="MEDITATIONS">
      <MeditationsAdmin />
    </GardeRoute>
  );
}
