import { arcticWhite } from './arctic-white';
import { midnightNavy } from './midnight-navy';
import { forestGreen } from './forest-green';
import { warmSandstone } from './warm-sandstone';
import type { Theme, ThemeId } from '@/types/themes';

export const themes: Theme[] = [arcticWhite, midnightNavy, forestGreen, warmSandstone];

export const themeMap: Record<ThemeId, Theme> = {
  'arctic-white': arcticWhite,
  'midnight-navy': midnightNavy,
  'forest-green': forestGreen,
  'warm-sandstone': warmSandstone,
};

export const defaultTheme = arcticWhite;

export { arcticWhite, midnightNavy, forestGreen, warmSandstone };
