const DEVICE_ID_KEY = 'orlina.deviceId';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getDeviceId(): string {
  const stored = window.localStorage.getItem(DEVICE_ID_KEY);
  if (stored && UUID_PATTERN.test(stored)) return stored;
  const id = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}
