const STORAGE_KEY = "fmcg-openai-api-key";

export function getUserOpenAIKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setUserOpenAIKey(key: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (key?.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
