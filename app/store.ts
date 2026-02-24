// DEV STORE — NO PERSISTENCE (resets every app restart)

export let userId: number | null = null;

/**
 * Set logged-in user
 */
export function setUser(id: number) {
  userId = id;
}

/**
 * Clear user (logout)
 */
export function clearUser() {
  userId = null;
}

/**
 * Check if stored user still exists in backend
 */
export async function validateUser(apiBase: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const res = await fetch(`${apiBase}/users/${userId}`);
    return res.ok;
  } catch {
    return false;
  }
}