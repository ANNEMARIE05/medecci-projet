'use client';

import React from 'react';
import GardeRoute from '../../routes/GardeRoute';
import LayoutAdmin from '../../components/layout/LayoutAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <GardeRoute>
      <LayoutAdmin>{children}</LayoutAdmin>
    </GardeRoute>
  );
}
