'use client';
import type {ReactNode} from 'react';
import {LanshangProvider} from '@lanshang-labs/ui';
import '@lanshang-labs/ui/styles.css';

/** Mount once at the application root. Business state remains in the application. */
export function AppUIProvider({children}: {children: ReactNode}) {
  return <LanshangProvider storageKey="lanshang-app.theme">{children}</LanshangProvider>;
}
