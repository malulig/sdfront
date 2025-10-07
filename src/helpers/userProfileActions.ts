/**
 * Извлекает имя и фамилию из email.
 * Примеры:
 *  - "john.doe@example.com" → "John Doe"
 *  - "mary@example.com" → "Mary"
 */
export function extractNameFromEmail(email: string): string {
  if (!email || !email.includes("@")) return "";

  const localPart = email.split("@")[0]; // до @
  const parts = localPart.split(".");

  // если есть точка — предполагаем имя.фамилия
  if (parts.length >= 2) {
    const [first, last] = parts;
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    return `${cap(first)} ${cap(last)}`.trim();
  }

  // если точки нет — просто капитализируем всё до @
  const name = localPart.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
