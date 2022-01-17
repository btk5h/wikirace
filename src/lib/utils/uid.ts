let uid = 0;

export function nextUid(): string {
  return `${uid++}${new Date()}`;
}