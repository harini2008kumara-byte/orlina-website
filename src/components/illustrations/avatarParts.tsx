import type { AvatarPalette, FigureIds } from '@/components/illustrations/avatarPalettes';

export interface FigureProps {
  palette: AvatarPalette;
  ids: FigureIds;
}

const EYE_Y = 92;
const EYE_LEFT_X = 84;
const EYE_RIGHT_X = 116;
const INK = '#0A0816';

export function FigureDefs({ palette, ids }: FigureProps) {
  return (
    <defs>
      <radialGradient id={ids.halo}>
        <stop offset="0" stopColor={palette.glow} stopOpacity="0.42" />
        <stop offset="0.6" stopColor={palette.glow} stopOpacity="0.1" />
        <stop offset="1" stopColor={palette.glow} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ids.skin} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={palette.skinLight} />
        <stop offset="1" stopColor={palette.skinDark} />
      </linearGradient>
      <linearGradient id={ids.hair} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={palette.hairLight} />
        <stop offset="1" stopColor={palette.hairDark} />
      </linearGradient>
      <linearGradient id={ids.cloth} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={palette.clothLight} />
        <stop offset="1" stopColor={palette.clothDark} />
      </linearGradient>
      <radialGradient id={ids.iris} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor={palette.irisLight} />
        <stop offset="1" stopColor={palette.irisDark} />
      </radialGradient>
    </defs>
  );
}

export function Halo({ ids }: { ids: FigureIds }) {
  return <circle cx="100" cy="96" r="84" fill={`url(#${ids.halo})`} />;
}

export function Neck({ palette, ids }: FigureProps) {
  return (
    <g>
      <rect x="89" y="112" width="22" height="30" fill={`url(#${ids.skin})`} />
      <path d="M89 118 Q100 127 111 118 V124 Q100 133 89 124 Z" fill={palette.skinDark} opacity="0.5" />
    </g>
  );
}

export function Head({ ids }: { ids: FigureIds }) {
  return (
    <g>
      <ellipse cx="100" cy="86" rx="36" ry="40" fill={`url(#${ids.skin})`} />
      <ellipse cx="90" cy="62" rx="14" ry="5" fill="#FFFFFF" opacity="0.14" />
    </g>
  );
}

function Eye({ cx, iris }: { cx: number; iris: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={EYE_Y} rx="6.5" ry="7.5" fill={`url(#${iris})`} />
      <ellipse cx={cx} cy={EYE_Y + 0.5} rx="2.8" ry="3.8" fill={INK} />
      <circle cx={cx - 2} cy={EYE_Y - 3} r="1.9" fill="#FFFFFF" />
      <circle cx={cx + 2} cy={EYE_Y + 3.5} r="0.9" fill="#FFFFFF" opacity="0.85" />
      <path
        d={`M${cx - 8} ${EYE_Y - 2} Q${cx} ${EYE_Y - 12} ${cx + 8} ${EYE_Y - 2}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>
  );
}

interface FaceFeaturesProps extends FigureProps {
  browLeft: string;
  browRight: string;
  mouth: string;
}

export function FaceFeatures({ palette, ids, browLeft, browRight, mouth }: FaceFeaturesProps) {
  return (
    <g>
      <ellipse cx="75" cy="104" rx="6" ry="3.5" fill={palette.blush} opacity="0.35" />
      <ellipse cx="125" cy="104" rx="6" ry="3.5" fill={palette.blush} opacity="0.35" />
      <path d="M99 97 Q100.6 100.5 102 97.5" fill="none" stroke={palette.skinDark} strokeWidth="1.2" strokeLinecap="round" />
      <Eye cx={EYE_LEFT_X} iris={ids.iris} />
      <Eye cx={EYE_RIGHT_X} iris={ids.iris} />
      <path d={browLeft} fill="none" stroke={palette.brow} strokeWidth="2" strokeLinecap="round" />
      <path d={browRight} fill="none" stroke={palette.brow} strokeWidth="2" strokeLinecap="round" />
      <path d={mouth} fill="none" stroke={palette.lip} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}
