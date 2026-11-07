import type { CompanionSceneName } from '@/components/illustrations/CompanionScene';

const STROKE = '#B9EDDE';
const ACCENT = '#8BE3C5';

export function SceneGlyph({ scene }: { scene: CompanionSceneName }) {
  const common = { fill: 'none', stroke: STROKE, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (scene) {
    case 'welcome':
      return (
        <g>
          <path d="M20 6 L23 17 L34 20 L23 23 L20 34 L17 23 L6 20 L17 17 Z" fill={ACCENT} />
          <circle cx="33" cy="8" r="2" fill={STROKE} />
        </g>
      );
    case 'conversations':
      return (
        <g>
          <rect x="6" y="9" width="20" height="14" rx="4" {...common} />
          <rect x="14" y="19" width="20" height="13" rx="4" fill={ACCENT} />
        </g>
      );
    case 'decisions':
      return (
        <g>
          <path d="M20 34 V22 M20 22 L10 12 M20 22 L30 12" {...common} />
          <circle cx="10" cy="10" r="3" fill={ACCENT} />
          <circle cx="30" cy="10" r="3" fill={ACCENT} />
          <circle cx="20" cy="35" r="2.5" fill={STROKE} />
        </g>
      );
    case 'tasks':
      return (
        <g>
          <rect x="8" y="8" width="24" height="24" rx="6" {...common} />
          <path d="M13 20 L18 25 L27 15" stroke={ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'memory':
      return (
        <g>
          <path d="M12 14 L28 12 L22 28 Z" {...common} />
          <circle cx="12" cy="14" r="3.5" fill={ACCENT} />
          <circle cx="28" cy="12" r="3.5" fill={STROKE} />
          <circle cx="22" cy="28" r="3.5" fill={ACCENT} />
        </g>
      );
    case 'error':
      return (
        <g>
          <circle cx="20" cy="20" r="12" {...common} />
          <path d="M20 14 V22" {...common} />
          <circle cx="20" cy="27" r="1.8" fill={ACCENT} />
        </g>
      );
  }
}
