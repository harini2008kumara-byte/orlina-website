import { FaceFeatures, Head, Halo, Neck, type FigureProps } from '@/components/illustrations/avatarParts';

export function GirlFigure({ palette, ids }: FigureProps) {
  const hair = `url(#${ids.hair})`;
  return (
    <g>
      <Halo ids={ids} />
      <path d="M62 80 C58 44 74 30 100 30 C126 30 142 44 138 80 L146 150 C128 146 116 138 112 128 L88 128 C84 138 72 146 54 150 Z" fill={hair} />
      <Neck palette={palette} ids={ids} />
      <path d="M40 180 C42 146 62 132 100 132 C138 132 158 146 160 180 Z" fill={`url(#${ids.cloth})`} />
      <path d="M82 134 L100 156 L118 134" fill="none" stroke={palette.trim} strokeWidth="2.4" strokeLinejoin="round" />
      <Head ids={ids} />
      <FaceFeatures
        palette={palette}
        ids={ids}
        browLeft="M77 80 Q84 76.5 91 79"
        browRight="M109 79 Q116 76.5 123 80"
        mouth="M94 110 Q100 114 106 110"
      />
      <path
        d="M63 84 C60 56 74 42 100 42 C126 42 140 56 137 84 C130 70 122 62 110 60 C100 68 84 68 74 62 C68 68 65 76 63 84 Z"
        fill={hair}
      />
      <path d="M74 60 C86 50 104 48 122 54" fill="none" stroke={palette.trim} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <path d="M118 50 L132 46 L134 52 L120 56 Z" fill={palette.trim} />
    </g>
  );
}

export function BoyFigure({ palette, ids }: FigureProps) {
  const hair = `url(#${ids.hair})`;
  return (
    <g>
      <Halo ids={ids} />
      <path d="M62 86 C58 50 74 34 100 34 C126 34 142 50 138 86 C137 94 134 98 131 100 L69 100 C66 98 63 94 62 86 Z" fill={hair} />
      <Neck palette={palette} ids={ids} />
      <path d="M40 180 C42 146 64 132 100 132 C136 132 158 146 160 180 Z" fill={`url(#${ids.cloth})`} />
      <path d="M86 133 L100 160 L114 133 Z" fill={palette.trim} />
      <path d="M76 134 L96 164 L88 133 Z" fill={palette.clothDark} />
      <path d="M124 134 L104 164 L112 133 Z" fill={palette.clothDark} />
      <circle cx="88" cy="148" r="1.8" fill={palette.glow} />
      <Head ids={ids} />
      <FaceFeatures
        palette={palette}
        ids={ids}
        browLeft="M78 80 L90 78.5"
        browRight="M110 78.5 L122 80"
        mouth="M95 110 Q100 112.5 105 110"
      />
      <path d="M63 80 C61 54 78 42 100 42 C124 42 139 54 137 80 C127 66 116 60 98 60 C86 60 72 66 63 80 Z" fill={hair} />
      <path d="M97 46 L92 62" fill="none" stroke={palette.trim} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <path d="M74 62 C88 52 106 50 124 56" fill="none" stroke={palette.trim} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    </g>
  );
}

export function NeutralFigure({ palette, ids }: FigureProps) {
  const hair = `url(#${ids.hair})`;
  return (
    <g>
      <Halo ids={ids} />
      <path d="M60 90 C54 46 74 28 100 28 C126 28 146 46 140 90 C140 110 134 120 126 122 C122 108 114 100 100 100 C86 100 78 108 74 122 C66 120 60 110 60 90 Z" fill={hair} />
      <Neck palette={palette} ids={ids} />
      <path d="M40 180 C40 150 62 134 100 134 C138 134 160 150 160 180 Z" fill={`url(#${ids.cloth})`} />
      <path d="M84 135 L100 158 L116 135 Z" fill={palette.trim} />
      <Head ids={ids} />
      <FaceFeatures
        palette={palette}
        ids={ids}
        browLeft="M79 80 Q85 78 91 80"
        browRight="M109 80 Q115 78 121 80"
        mouth="M96 110 Q100 111.5 104 110"
      />
      <path d="M62 82 C62 54 80 44 100 44 C120 44 138 54 138 82 C128 68 116 62 100 62 C90 66 74 70 62 82 Z" fill={hair} />
      <path d="M76 58 C86 50 104 48 120 56" fill="none" stroke={palette.trim} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}
