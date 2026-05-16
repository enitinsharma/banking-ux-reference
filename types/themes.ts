export type ThemeId = 'midnight-navy' | 'arctic-white' | 'forest-green' | 'warm-sandstone';

export interface ThemeVars {
  '--accent': string;
  '--accent-hover': string;
  '--accent-foreground': string;
  '--bg-sidebar': string;
  '--header-bg': string;
  '--bg-page': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--border': string;
  '--card-bg': string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  bankName: string;
  legalName: string;
  vars: ThemeVars;
}
