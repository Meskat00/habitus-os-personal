# Security Policy

## Scope

Habitus OS Personal is a single-owner personal application. It is not a public
service and accepts no other users.

## Access control

- Firebase Authentication (Google and/or email/password) is required.
- Cloud Firestore rules are deny-by-default.
- Only the approved owner UID can read or write `users/{ownerUid}/…`.
- The login screen discloses no personal data and uses neutral error messages.
- There is no self-registration path to owner access; the owner UID is
  configured at deployment time, never by browser clients.

## What is never in this repository

- Personal tasks, notes, journal entries, research data
- Passwords, tokens, session credentials
- Firebase Admin SDK credentials or service-account files
- Backup or export JSON files

The CI workflow scans for forbidden file patterns on every deploy.

## Reporting

This is a personal project without a bug-bounty program. If you discover a
vulnerability in the published source, please avoid accessing any personal data
and describe the issue without including personal records.
