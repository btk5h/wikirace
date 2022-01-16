let uid = 0;

export function nextUid(): string {
  return String(uid++);
}