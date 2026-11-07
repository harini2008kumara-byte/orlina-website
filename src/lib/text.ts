const TITLE_MAX_LENGTH = 60;

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? '';
}

export function titleFromText(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  return trimmed.length > TITLE_MAX_LENGTH ? `${trimmed.slice(0, TITLE_MAX_LENGTH - 1)}…` : trimmed;
}
