import { useState } from 'react';
import { AvatarPicker } from '@/components/settings/AvatarPicker';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { fieldClassName, labelClassName } from '@/components/ui/formStyles';
import { useWorkspace } from '@/hooks/useWorkspace';
import type { UserProfile } from '@/types/orlina';

const NAME_MAX_LENGTH = 40;
const NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;

function validateName(value: string): string | null {
  if (value.length === 0) return null;
  if (value.length > NAME_MAX_LENGTH) return `Keep your name to ${NAME_MAX_LENGTH} characters or fewer.`;
  if (!NAME_PATTERN.test(value)) return 'Use letters, spaces, apostrophes, hyphens or full stops only.';
  return null;
}

interface ProfileFormProps {
  profile: UserProfile;
  onSaveName: (name: string) => void;
  onChangeAvatar: (avatar: UserProfile['avatar']) => void;
}

export function ProfileForm({ profile, onSaveName, onChangeAvatar }: ProfileFormProps) {
  const [draft, setDraft] = useState(profile.name);
  const trimmed = draft.trim();
  const dirty = trimmed !== profile.name;
  const error = validateName(trimmed);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Your name"
          description="Used in your greeting. Leave it empty to keep the greeting neutral."
        />
        <form
          className="space-y-4 px-6 pb-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (dirty && !error) onSaveName(trimmed);
          }}
        >
          <div>
            <label htmlFor="display-name" className={labelClassName}>
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              maxLength={NAME_MAX_LENGTH}
              value={draft}
              placeholder="How should ORLINA address you?"
              onChange={(event) => setDraft(event.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'display-name-error' : undefined}
              className={fieldClassName}
            />
            {error && (
              <p id="display-name-error" role="alert" className="mt-2 text-sm text-danger">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={!dirty || error !== null}>
              Save name
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Avatar" description="Choose the character that appears across ORLINA." />
        <div className="px-6 pb-6">
          <AvatarPicker value={profile.avatar} onChange={onChangeAvatar} />
        </div>
      </Card>
    </div>
  );
}

export function ProfileSettings() {
  const { workspace, updateProfile } = useWorkspace();
  if (!workspace) return null;

  return (
    <ProfileForm
      profile={workspace.profile}
      onSaveName={(name) => updateProfile({ name })}
      onChangeAvatar={(avatar) => updateProfile({ avatar })}
    />
  );
}
