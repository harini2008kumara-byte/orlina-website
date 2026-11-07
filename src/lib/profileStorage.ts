import { AVATAR_OPTIONS } from '@/config/avatars';
import type { AvatarId, UserProfile } from '@/types/orlina';

const STORAGE_KEY = 'orlina.profile';
const DEFAULT_PROFILE: UserProfile = { name: '', avatar: 'neutral' };

function isAvatarId(value: unknown): value is AvatarId {
  return AVATAR_OPTIONS.some((option) => option.id === value);
}

export function loadProfile(): UserProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PROFILE;
    const { name, avatar } = parsed as Record<string, unknown>;
    return {
      name: typeof name === 'string' ? name : '',
      avatar: isAvatarId(avatar) ? avatar : DEFAULT_PROFILE.avatar,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
