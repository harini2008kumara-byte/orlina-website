import { useState } from 'react';
import { cn } from '@/lib/cn';
import type { MemoryMapLink, MemoryMapNode, MemoryMapNodeKind } from '@/types/orlina';

const KIND_STYLES: Record<MemoryMapNodeKind, { label: string; fill: string; ring: string }> = {
  person: { label: 'People', fill: 'fill-mint', ring: 'stroke-mint' },
  topic: { label: 'Topics', fill: 'fill-accent', ring: 'stroke-accent' },
  decision: { label: 'Decisions', fill: 'fill-warning', ring: 'stroke-warning' },
};

const NODE_RADIUS = 9;

interface MemoryMapProps {
  nodes: MemoryMapNode[];
  links: MemoryMapLink[];
}

export function MemoryMap({ nodes, links }: MemoryMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isConnected = (nodeId: string) =>
    hoveredId !== null && links.some((link) => (link.from === hoveredId && link.to === nodeId) || (link.to === hoveredId && link.from === nodeId));

  const positionOf = (id: string) => nodes.find((node) => node.id === id);

  return (
    <figure className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
        <svg viewBox="0 40 560 360" role="img" aria-label="Map of connected people, topics and decisions" className="block h-auto w-full">
          {links.map((link) => {
            const from = positionOf(link.from);
            const to = positionOf(link.to);
            if (!from || !to) return null;
            const active = hoveredId !== null && (link.from === hoveredId || link.to === hoveredId);
            return (
              <line
                key={`${link.from}-${link.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={cn('transition-all duration-300', active ? 'stroke-mint' : 'stroke-line')}
                strokeWidth={active ? 2 : 1.25}
                strokeDasharray={active ? undefined : '4 6'}
              />
            );
          })}

          {nodes.map((node) => {
            const style = KIND_STYLES[node.kind];
            const dimmed = hoveredId !== null && hoveredId !== node.id && !isConnected(node.id);
            return (
              <g
                key={node.id}
                tabIndex={0}
                role="img"
                aria-label={`${node.label}, ${style.label.toLowerCase()}`}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(node.id)}
                onBlur={() => setHoveredId(null)}
                className="cursor-pointer outline-none transition-opacity duration-300"
                opacity={dimmed ? 0.35 : 1}
              >
                <circle cx={node.x} cy={node.y} r={NODE_RADIUS + 10} className={cn('fill-transparent', style.ring)} strokeOpacity={hoveredId === node.id ? 0.5 : 0} strokeWidth={1} />
                <circle cx={node.x} cy={node.y} r={NODE_RADIUS} className={style.fill} />
                <text x={node.x} y={node.y + 30} textAnchor="middle" className="fill-ink text-[13px] font-medium">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {(Object.keys(KIND_STYLES) as MemoryMapNodeKind[]).map((kind) => (
          <span key={kind} className="inline-flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-full', KIND_STYLES[kind].fill)} aria-hidden="true" />
            {KIND_STYLES[kind].label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
