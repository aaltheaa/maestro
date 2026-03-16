/**
 * Anonymous user identity
 *
 * Maestro doesn't require sign-in. Instead, each browser gets a stable
 * UUID on first visit, stored in localStorage. All Supabase rows are
 * scoped to this ID so each person's progress is private to their device.
 *
 * If a user clears their localStorage they get a fresh identity (and lose
 * progress). For persistence across devices, add Clerk auth later and
 * migrate this ID to a real user record.
 */

const USER_ID_KEY = 'maestro_user_id'

export function getUserId(): string {
  if (typeof window === 'undefined') return 'server'

  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}
