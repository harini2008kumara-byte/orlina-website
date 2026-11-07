import { useId } from 'react';
import { SceneGlyph } from '@/components/illustrations/SceneGlyph';
import { CharacterFigure } from '@/components/illustrations/OrlinaCharacter';
import { useWorkspace } from '@/hooks/useWorkspace';
import { cn } from '@/lib/cn';

export type CompanionSceneName = 'welcome' | 'conversations' | 'decisions' | 'tasks' | 'memory' | 'error';

interface CompanionSceneProps {
  scene: CompanionSceneName;
  className?: string;
}

export function CompanionScene({ scene, className }: CompanionSceneProps) {
  const { avatar } = useWorkspace();
  const clipId = `companion-clip-${useId().replace(/:/g, '')}`;

  return (
    <svg viewBox="0 0 200 180" role="img" aria-hidden="true" className={cn('h-auto w-full', className)}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="98" r="80" />
        </clipPath>
      </defs>
      <circle cx="100" cy="98" r="80" fill="#16332F" stroke="#315B52" strokeWidth="1.5" />
      <circle cx="30" cy="34" r="2" fill="#8BE3C5" opacity="0.7" />
      <circle cx="176" cy="122" r="1.6" fill="#8BE3C5" opacity="0.6" />
      <g clipPath={`url(#${clipId})`}>
        <CharacterFigure avatar={avatar} />
      </g>
      <g className="animate-float">
        <rect x="136" y="4" width="54" height="46" rx="16" fill="#183B35" stroke="#315B52" strokeWidth="1.5" />
        <path d="M150 48 L146 58 L160 48 Z" fill="#183B35" stroke="#315B52" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="150" y="46" width="14" height="3" fill="#183B35" />
        <g transform="translate(143 7)">
          <SceneGlyph scene={scene} />
        </g>
      </g>
    </svg>
  );
}
