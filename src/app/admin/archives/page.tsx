'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Archives from '../../../views/admin/Archives';

export default function Page() {
  return (
    <GardeRoute menuCode="ARCHIVES">
      <Archives />
    </GardeRoute>
  );
}
