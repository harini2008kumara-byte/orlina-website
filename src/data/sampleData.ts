import type { AppNotification, WorkspaceContent } from '@/types/orlina';

const HOUR_MS = 60 * 60_000;

const hoursAgo = (hours: number): string => new Date(Date.now() - hours * HOUR_MS).toISOString();

const daysFromToday = (days: number, hour: number, minute: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Your Lisbon decision is due in five days',
    createdAt: hoursAgo(1),
    href: '/decisions',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Three memories were updated from your review conversation',
    createdAt: hoursAgo(5),
    href: '/memory',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Sam is waiting for your onboarding feedback',
    createdAt: hoursAgo(26),
    href: '/tasks',
    read: true,
  },
];

export function createEmptyContent(): WorkspaceContent {
  return {
    notifications: [],
    conversations: [],
    decisions: [],
    tasks: [],
    memories: [],
    memoryCount: 0,
    memoryMap: { nodes: [], links: [] },
  };
}

export function createDemoContent(): WorkspaceContent {
  return {
    notifications: DEMO_NOTIFICATIONS,
    memoryCount: 128,
    conversations: [
      {
        id: 'conv-1',
        title: 'Choosing between the Lisbon and Toronto offers',
        updatedAt: hoursAgo(2),
        messages: [
          {
            id: 'conv-1-m1',
            role: 'user',
            text: 'The Lisbon and Toronto roles pay about the same. Lisbon keeps me close to family, but Toronto has a clearer growth path. How do I decide?',
            createdAt: hoursAgo(3),
          },
          {
            id: 'conv-1-m2',
            role: 'assistant',
            text: 'Let us start with regret. A year from now, which choice would you be more disappointed to have turned down?',
            createdAt: hoursAgo(3),
          },
          {
            id: 'conv-1-m3',
            role: 'user',
            text: 'Honestly, Lisbon. I keep picturing Sunday calls with Mum and missing them.',
            createdAt: hoursAgo(2),
          },
          {
            id: 'conv-1-m4',
            role: 'assistant',
            text: 'That is a strong signal. Shall I note family proximity as your top priority for this decision?',
            createdAt: hoursAgo(2),
          },
        ],
      },
      {
        id: 'conv-2',
        title: 'Preparing for the quarterly review with Sam',
        updatedAt: hoursAgo(26),
        messages: [
          {
            id: 'conv-2-m1',
            role: 'user',
            text: 'I want to frame the delayed onboarding project as a learning win rather than a miss, without sounding defensive.',
            createdAt: hoursAgo(27),
          },
          {
            id: 'conv-2-m2',
            role: 'assistant',
            text: 'Lead with what the delay revealed about the process, then name the one change you are making. Sam will hear ownership before excuses.',
            createdAt: hoursAgo(26),
          },
        ],
      },
      {
        id: 'conv-3',
        title: 'A morning routine that actually sticks',
        updatedAt: hoursAgo(72),
        messages: [
          {
            id: 'conv-3-m1',
            role: 'user',
            text: 'Three attempts have failed. The common thread seems to be late-night planning.',
            createdAt: hoursAgo(72),
          },
        ],
      },
      {
        id: 'conv-4',
        title: 'Splitting the cost of the new apartment',
        updatedAt: hoursAgo(144),
        messages: [
          {
            id: 'conv-4-m1',
            role: 'user',
            text: 'We need a split that feels fair even though our incomes are different.',
            createdAt: hoursAgo(144),
          },
        ],
      },
    ],
    decisions: [
      {
        id: 'dec-1',
        title: 'Accept the Lisbon role or stay in Toronto',
        context: 'You named family proximity as your top priority. The Toronto team offers a stronger growth path.',
        status: 'pending',
        dueAt: daysFromToday(5, 17, 0),
      },
      {
        id: 'dec-2',
        title: 'Hire a contractor or lead the migration in-house',
        context: 'Two proposals are on the table. The budget favours doing it in-house, but the timeline is tight.',
        status: 'pending',
        dueAt: daysFromToday(2, 12, 0),
      },
      {
        id: 'dec-3',
        title: 'Move the weekly planning session to Monday',
        context: 'Friday planning keeps getting cut short. Monday may give the team more room.',
        status: 'pending',
        dueAt: null,
      },
    ],
    tasks: [
      { id: 'task-1', title: 'Email Sam the revised onboarding timeline', dueAt: daysFromToday(0, 17, 0), completed: false },
      { id: 'task-2', title: 'Book a call with the Lisbon recruiter', dueAt: daysFromToday(1, 10, 0), completed: false },
      { id: 'task-3', title: 'Review the apartment budget spreadsheet', dueAt: daysFromToday(2, 9, 30), completed: false },
      { id: 'task-4', title: 'Send a thank-you note to the design team', dueAt: daysFromToday(-1, 16, 0), completed: true },
      { id: 'task-5', title: 'Draft three questions for the Toronto hiring manager', dueAt: daysFromToday(4, 14, 0), completed: false },
    ],
    memories: [
      { id: 'mem-1', kind: 'person', summary: 'Mum prefers a call on Sunday afternoons.', savedAt: hoursAgo(2), conversationId: 'conv-1' },
      { id: 'mem-2', kind: 'commitment', summary: 'Promised Sam feedback on the onboarding plan by Friday.', savedAt: hoursAgo(26), conversationId: 'conv-2' },
      { id: 'mem-3', kind: 'preference', summary: 'Does their best deep work before 11am and avoids meetings then.', savedAt: hoursAgo(50), conversationId: null },
      { id: 'mem-4', kind: 'fact', summary: 'Current lease ends in March.', savedAt: hoursAgo(96), conversationId: 'conv-4' },
      { id: 'mem-5', kind: 'preference', summary: 'Prefers written summaries over long meetings.', savedAt: hoursAgo(120), conversationId: null },
    ],
    memoryMap: {
      nodes: [
        { id: 'dec-lisbon', label: 'Lisbon or Toronto', kind: 'decision', x: 280, y: 200 },
        { id: 'mum', label: 'Mum', kind: 'person', x: 110, y: 110 },
        { id: 'family', label: 'Family time', kind: 'topic', x: 120, y: 290 },
        { id: 'sam', label: 'Sam', kind: 'person', x: 450, y: 110 },
        { id: 'onboarding', label: 'Onboarding project', kind: 'topic', x: 450, y: 290 },
        { id: 'budget', label: 'Apartment budget', kind: 'topic', x: 280, y: 340 },
      ],
      links: [
        { from: 'dec-lisbon', to: 'mum' },
        { from: 'mum', to: 'family' },
        { from: 'family', to: 'dec-lisbon' },
        { from: 'sam', to: 'onboarding' },
        { from: 'dec-lisbon', to: 'budget' },
      ],
    },
  };
}
