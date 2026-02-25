// DEV STORE — NO PERSISTENCE (resets every app restart)

export let userId: number | null = null;
export let groupId: number | null = null;

export function setGroup(id: number) {
  groupId = id;
}

export async function loadUserGroup(apiBase: string): Promise<number | null> {
  if (!userId) return null;

  try {
    const res = await fetch(`${apiBase}/users/${userId}/groups`);
    if (!res.ok) return null;

    const groups = await res.json();

    if (groups.length > 0) {
      groupId = groups[0].id;
      return groupId;
    }

    return null;
  } catch {
    return null;
  }
}

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
  groupId = null;
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