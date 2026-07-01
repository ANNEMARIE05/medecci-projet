'use client';

import GardeRoute from '../../../routes/GardeRoute';
import SuggestionsAdmin from '../../../views/admin/SuggestionsAdmin';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}>
      <SuggestionsAdmin />
    </GardeRoute>
  );
}
