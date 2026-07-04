'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Parametres from '../../../views/admin/Parametres';

export default function Page() {
  return (
    <GardeRoute menuCode="PARAMETRES">
      <Parametres />
    </GardeRoute>
  );
}
