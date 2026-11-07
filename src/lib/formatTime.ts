const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

export function formatRelativeTime(iso: string): string {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / MINUTE_MS);
  const absolute = Math.abs(minutes);
  if (absolute < 60) return relativeFormatter.format(minutes, 'minute');
  if (absolute < 60 * 24) return relativeFormatter.format(Math.round(minutes / 60), 'hour');
  return relativeFormatter.format(Math.round(minutes / (60 * 24)), 'day');
}

export function formatDueLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const dayOffset = Math.round((target.getTime() - today.getTime()) / DAY_MS);

  const time = date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
  if (dayOffset === 0) return `Today, ${time}`;
  if (dayOffset === 1) return `Tomorrow, ${time}`;
  const day = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  return `${day}, ${time}`;
}
