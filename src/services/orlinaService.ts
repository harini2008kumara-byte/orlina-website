import { createDemoContent, createEmptyContent } from '@/data/sampleData';
import { loadProfile } from '@/lib/profileStorage';
import { listConversations } from '@/services/conversationApi';
import type { OrlinaWorkspace } from '@/types/orlina';

export function isDemoMode(): boolean {
  return new URLSearchParams(window.location.search).get('demo') === 'true';
}

export async function fetchWorkspace(): Promise<OrlinaWorkspace> {
  if (isDemoMode()) {
    return { ...createDemoContent(), profile: loadProfile(), isSample: true };
  }
  const conversations = await listConversations();
  return { ...createEmptyContent(), conversations, profile: loadProfile(), isSample: false };
}
