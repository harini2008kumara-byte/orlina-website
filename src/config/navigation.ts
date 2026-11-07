import { Compass, LayoutGrid, Library, ListChecks, MessageSquareText, Network, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: 'overview',
    label: 'Overview',
    description: 'Your conversations, decisions and commitments at a glance.',
    icon: LayoutGrid,
  },
  {
    path: 'conversations',
    label: 'Conversations',
    description: 'Every conversation you have had with ORLINA, ready to pick up where you left off.',
    icon: MessageSquareText,
  },
  {
    path: 'memory',
    label: 'Memory',
    description: 'What ORLINA has learned about you, the people you care about and what matters to you.',
    icon: Library,
  },
  {
    path: 'decisions',
    label: 'Decisions',
    description: 'The choices you are weighing, the context behind them and the outcome you chose.',
    icon: Compass,
  },
  {
    path: 'tasks',
    label: 'Tasks',
    description: 'Commitments that came out of your conversations, with due dates you can rely on.',
    icon: ListChecks,
  },
  {
    path: 'memory-map',
    label: 'Connected Memory Map',
    description: 'See how people, projects and moments in your life connect to one another.',
    icon: Network,
  },
  {
    path: 'settings',
    label: 'Settings',
    description: 'Your profile, privacy preferences and how ORLINA works for you.',
    icon: Settings,
  },
];

export function viewHref(path: string): string {
  return path === 'overview' ? '/' : `/${path}`;
}

export function findNavItem(path: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.path === path);
}
