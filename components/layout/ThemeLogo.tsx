import type { ThemeId } from '@/types/themes';

/* ─────────────────────────────────────────────
   Arctic White — aurora borealis over a
   snow-capped mountain in a night sky
───────────────────────────────────────────── */
function ArcticWhiteLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NovaBank logo">
      {/* Night-sky background */}
      <rect width="38" height="38" rx="9" fill="#0b1d3a" />

      {/* Stars */}
      <circle cx="6"  cy="7"  r="0.9" fill="white" opacity="0.9" />
      <circle cx="30" cy="5"  r="1.1" fill="white" opacity="0.8" />
      <circle cx="15" cy="4"  r="0.7" fill="white" opacity="0.7" />
      <circle cx="33" cy="13" r="0.8" fill="white" opacity="0.75" />
      <circle cx="22" cy="8"  r="0.6" fill="white" opacity="0.6" />

      {/* Aurora borealis — two soft sweeping arcs */}
      <path d="M1 17 Q10 10 22 14 Q30 17 37 13"
            stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M1 20 Q10 14 22 17 Q30 20 37 16"
            stroke="#80deea" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" />

      {/* Mountain body */}
      <path d="M3 32 L19 9 L35 32 Z" fill="#1e4080" />

      {/* Snow cap */}
      <path d="M19 9 L13.5 21 L24.5 21 Z" fill="white" />

      {/* Snowfield at base */}
      <path d="M0 31 Q19 28 38 31 L38 38 L0 38 Z" fill="#d6eaf8" opacity="0.18" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Midnight Navy — sailing ship on moonlit
   waters under a crescent moon
───────────────────────────────────────────── */
function MidnightNavyLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Meridian logo">
      {/* Deep night background */}
      <rect width="38" height="38" rx="9" fill="#040e22" />

      {/* Stars */}
      <circle cx="5"  cy="5"  r="0.9" fill="white" opacity="0.95" />
      <circle cx="18" cy="3"  r="1.1" fill="white" opacity="0.85" />
      <circle cx="31" cy="7"  r="0.9" fill="white" opacity="0.9" />
      <circle cx="10" cy="12" r="0.6" fill="white" opacity="0.6" />
      <circle cx="35" cy="15" r="0.8" fill="white" opacity="0.7" />

      {/* Crescent moon — golden disc with a bite taken out */}
      <circle cx="28" cy="10" r="6.5" fill="#ffd54f" />
      <circle cx="31" cy="8"  r="5.5" fill="#040e22" />

      {/* Sea / water */}
      <path d="M0 28 Q9.5 25.5 19 28 Q28.5 30.5 38 28 L38 38 L0 38 Z" fill="#0d2347" />

      {/* Ship hull */}
      <path d="M5 27 L33 27 L30 32 L8 32 Z" fill="#1565c0" />

      {/* Cabin / wheelhouse */}
      <rect x="12" y="20" width="13" height="7" rx="1.5" fill="#1976d2" />
      {/* Portholes */}
      <circle cx="15.5" cy="23.5" r="1.5" fill="#90caf9" opacity="0.8" />
      <circle cx="21.5" cy="23.5" r="1.5" fill="#90caf9" opacity="0.8" />

      {/* Mast */}
      <line x1="18.5" y1="8" x2="18.5" y2="20" stroke="#bbdefb" strokeWidth="1.2" strokeLinecap="round" />

      {/* Sail — filled triangle */}
      <path d="M18.5 9 L27 16 L18.5 19.5 Z" fill="#e3f2fd" opacity="0.92" />

      {/* Wave ripple on water */}
      <path d="M0 29.5 Q6.5 27.5 13 29.5 Q19.5 31.5 26 29.5 Q32.5 27.5 38 29.5"
            stroke="#1e88e5" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Forest Green — twin pine trees at dawn,
   bright sun rising over rolling hills
───────────────────────────────────────────── */
function ForestGreenLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Verdant logo">
      {/* Forest-sky background */}
      <rect width="38" height="38" rx="9" fill="#1a3d1e" />

      {/* Sun disc + soft glow */}
      <circle cx="19" cy="12" r="9" fill="#ffeb3b" opacity="0.15" />
      <circle cx="19" cy="12" r="6"  fill="#ffeb3b" />

      {/* Rolling hill backdrop */}
      <ellipse cx="19" cy="40" rx="24" ry="12" fill="#2d6e30" />

      {/* Left pine — three stacked tiers */}
      <polygon points="11,30 5,30 11,20 17,30"  fill="#145214" />
      <polygon points="11,24 6,24 11,15 16,24"  fill="#1b6e1b" />
      <polygon points="11,18 7,18 11,10 15,18"  fill="#228b22" />
      {/* trunk */}
      <rect x="10" y="30" width="2" height="4" fill="#5d4037" />

      {/* Right pine — three stacked tiers */}
      <polygon points="27,30 21,30 27,20 33,30" fill="#145214" />
      <polygon points="27,24 22,24 27,15 32,24" fill="#1b6e1b" />
      <polygon points="27,18 23,18 27,10 31,18" fill="#228b22" />
      {/* trunk */}
      <rect x="26" y="30" width="2" height="4" fill="#5d4037" />

      {/* Small birds in dawn sky */}
      <path d="M7  7 Q8  6 9  7"  stroke="white" strokeWidth="0.9" fill="none" opacity="0.65" />
      <path d="M10 5 Q11 4 12 5" stroke="white" strokeWidth="0.9" fill="none" opacity="0.55" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Warm Sandstone — desert sunset: golden sun
   with rays, rolling dunes, rock arch
───────────────────────────────────────────── */
function WarmSandstoneLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Aurum logo">
      {/* Sunset sky */}
      <rect width="38" height="38" rx="9" fill="#7b2500" />
      <rect width="38" height="22" rx="0" fill="#e65100" opacity="0.55" />

      {/* Sun disc + glow */}
      <circle cx="19" cy="13" r="10" fill="#ffca28" opacity="0.18" />
      <circle cx="19" cy="13" r="7"  fill="#ffca28" />

      {/* Sun rays */}
      <line x1="19" y1="2"  x2="19" y2="4.5" stroke="#ffca28" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="28" y1="4"  x2="26" y2="6"   stroke="#ffca28" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="33" y1="13" x2="30" y2="13"  stroke="#ffca28" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="28" y1="22" x2="26" y2="20"  stroke="#ffca28" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="4"  x2="12" y2="6"   stroke="#ffca28" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5"  y1="13" x2="8"  y2="13"  stroke="#ffca28" strokeWidth="1.8" strokeLinecap="round" />

      {/* Sand dune layers */}
      <path d="M0 28 Q9 21 18 25 Q27 29 38 23 L38 38 L0 38 Z" fill="#d84315" />
      <path d="M0 32 Q10 26 20 30 Q30 34 38 27 L38 38 L0 38 Z" fill="#bf360c" />
      <path d="M0 35 Q12 30 22 33 Q32 36 38 31 L38 38 L0 38 Z" fill="#8d2000" />

      {/* Rock arch silhouette */}
      <path d="M14 38 L14 30 Q19 22 24 30 L24 38 Z" fill="#6a1400" />
      <path d="M16 38 L16 30 Q19 25 22 30 L22 38 Z" fill="#3e0c00" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Public component — picks the right logo
   from the theme id passed as a prop
───────────────────────────────────────────── */
const logoMap: Record<ThemeId, () => JSX.Element> = {
  'arctic-white':   ArcticWhiteLogo,
  'midnight-navy':  MidnightNavyLogo,
  'forest-green':   ForestGreenLogo,
  'warm-sandstone': WarmSandstoneLogo,
};

export function ThemeLogo({ themeId }: { themeId: ThemeId }) {
  const Logo = logoMap[themeId];
  return <Logo />;
}
