'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { loadSavedTheme } from '@/lib/colors'

// Component to load saved custom colors on mount
const CustomThemeLoader = () => {
  React.useEffect(() => {
    // Load saved theme colors after component mounts
    const savedColors = loadSavedTheme();
    if (savedColors) {
      console.log('Loaded saved theme colors:', savedColors);
    }
  }, []);

  return null; // This component doesn't render anything
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <CustomThemeLoader />
      {children}
    </NextThemesProvider>
  )
}
