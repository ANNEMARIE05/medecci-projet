'use client';

import GardeRoute from '../../../routes/GardeRoute';
import SuggestionsAdmin from '../../../views/admin/SuggestionsAdmin';

export default function Page() {
  return (
    <GardeRoute menuCode="SUGGESTIONS">
      <SuggestionsAdmin />
    </GardeRoute>
  );
}
