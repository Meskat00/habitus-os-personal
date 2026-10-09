# Habitus OS — Personal

Personal physics, research and quantum computing workspace. Single-owner web application.

- **Live app:** `https://<github-username>.github.io/habitus-os-personal/` (after Pages deployment)
- **Hosting:** GitHub Pages (free, HTTPS enforced)
- **Auth:** Firebase Authentication (Google + email/password, owner UID only)
- **Sync:** Cloud Firestore, Spark plan, persistent local cache
- **Installable:** PWA with offline-capable app shell

## What is public vs private

The source code in this repository is public. **No personal records are committed.**
All personal data (tasks, notes, journal, research, quantum progress) lives in
Cloud Firestore under `users/{ownerUid}/…`, protected by deny-by-default security
rules that allow only the approved owner UID. The deployed login screen reveals
nothing about personal data.

## Setup (owner)

1. Create a Firebase project (Spark plan, no billing) named `Habitus OS Personal`.
2. Enable Authentication providers: **Google** and **Email/Password**.
3. Create a Cloud Firestore database (production mode).
4. Deploy `firestore.rules` and note your owner UID after first sign-in
   (Firebase Console → Authentication → Users → UID).
5. Put the UID into `firestore.rules` (`REPLACE_WITH_OWNER_UID`) and into
   `index.html` (`OWNER_UID`), redeploy rules with `firebase deploy --only firestore:rules`.
6. In `index.html`, fill the `FIREBASE_CONFIG` block with the web app config
   from Firebase Console → Project settings → Your apps.
7. Push to `main`; GitHub Actions deploys to Pages automatically.

Until steps 4–6 are complete, the app runs in **local-only mode**
(browser storage, no sync) and shows a notice in Settings → Account.

## Firestore queries

The app only uses single-field filters (e.g. `where("deletedAt","==",null)`,
single-field ranges on `date`), so no composite indexes are required.
`firestore.indexes.json` is intentionally empty.

## Repository hygiene

- Never commit `*.backup.json`, `*.export.json`, `.env`, or service-account files.
  The deploy workflow fails the build if forbidden files are detected.
- The app never writes Firebase session tokens, passwords, or refresh tokens
  into backups or exports.
