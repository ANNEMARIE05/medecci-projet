'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Prieres from '../../../views/admin/Prieres';

export default function Page() {
  return (
    <GardeRoute menuCode="PRIERES">
      <Prieres />
    </GardeRoute>
  );
}
