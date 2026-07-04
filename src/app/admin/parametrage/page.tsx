'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Parametrage from '../../../views/admin/Parametrage';

export default function Page() {
  return (
    <GardeRoute menuCode="PARAMETRAGE">
      <Parametrage />
    </GardeRoute>
  );
}
