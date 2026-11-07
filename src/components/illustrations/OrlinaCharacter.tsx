import { useId, type ComponentType } from 'react';
import { BoyFigure, GirlFigure, NeutralFigure } from '@/components/illustrations/avatarFigures';
import { AVATAR_PALETTES, createFigureIds } from '@/components/illustrations/avatarPalettes';
import { FigureDefs, type FigureProps } from '@/components/illustrations/avatarParts';
import type { AvatarId } from '@/types/orlina';

const FIGURES: Record<AvatarId, ComponentType<FigureProps>> = {
  girl: GirlFigure,
  boy: BoyFigure,
  neutral: NeutralFigure,
};

interface CharacterFigureProps {
  avatar: AvatarId;
}

export function CharacterFigure({ avatar }: CharacterFigureProps) {
  const instanceId = useId().replace(/:/g, '');
  const ids = createFigureIds(`orlina-${instanceId}`);
  const palette = AVATAR_PALETTES[avatar];
  const Figure = FIGURES[avatar];

  return (
    <g>
      <FigureDefs palette={palette} ids={ids} />
      <Figure palette={palette} ids={ids} />
    </g>
  );
}

interface OrlinaCharacterProps {
  avatar: AvatarId;
  className?: string;
}

export function OrlinaCharacter({ avatar, className }: OrlinaCharacterProps) {
  return (
    <svg viewBox="0 0 200 180" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <CharacterFigure avatar={avatar} />
    </svg>
  );
}
