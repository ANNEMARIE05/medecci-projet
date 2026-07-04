'use client';

import GardeRoute from '../../../routes/GardeRoute';
import DonsAdmin from '../../../views/admin/DonsAdmin';

export default function Page() {
  return (
    <GardeRoute menuCode="DONS">
      <DonsAdmin />
    </GardeRoute>
  );
}
