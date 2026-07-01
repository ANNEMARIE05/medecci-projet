'use client';

import React from 'react';
import LayoutPublic from '../../../src/components/layout/LayoutPublic';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <LayoutPublic>{children}</LayoutPublic>;
}
