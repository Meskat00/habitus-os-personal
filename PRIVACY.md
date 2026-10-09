# Privacy

Habitus OS Personal stores the owner's personal workspace data in:

1. **Cloud Firestore** (`users/{ownerUid}/…`) — the synchronized record source,
   protected by owner-only security rules.
2. **This device** — IndexedDB/localStorage for local operation, timer recovery,
   snapshots and backups; Firestore persistent cache on trusted devices only.

## Data handling

- The application collects no analytics and serves no advertising.
- `robots.txt` and meta tags request no search indexing; this is discovery
  reduction only, not access control. Authentication and Firestore rules
  provide access protection.
- Backups/exports are created only by explicit owner action and are never
  uploaded to the repository.
- On untrusted devices, the app uses in-memory Firestore cache only and does
  not persist personal Firestore data after logout.
- "Sign out and remove local data" clears trusted-device personal cache and
  local records from that device.

## Third parties

- **GitHub Pages** hosts the static application files (no personal data).
- **Google Firebase** (Authentication + Firestore, Spark plan) stores the
  synchronized personal data under the owner's Google account.
