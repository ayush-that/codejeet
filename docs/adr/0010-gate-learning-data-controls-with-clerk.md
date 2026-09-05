# Gate learning-data controls with Clerk

All educational content remains public, while Progress and Problem Note controls require authentication through Codejeet's existing prebuilt Clerk modal. Google is enabled only as a Clerk social connection with production OAuth credentials, verified-email linking, one active Clerk session, and a verified `user.deleted` webhook; Google One Tap and custom OAuth are outside scope.

A signed-out Progress click opens sign-in and, after success and Account Cache activation, applies that one intended tick. Activating the signed-out Problem Note area opens sign-in and restores focus after success without retaining unauthenticated keystrokes. Screen-reader text describes these focus and sign-in behaviors even though the visible interface contains no synchronization statuses or errors.

Problem Notes retain explicit Save and Clear actions. Typing is an in-memory draft, Save commits the latest value and pending mutation to IndexedDB, and Clear commits an explicit delete; neither waits for the network or displays saving, saved, failed, or synchronized state. Public privacy, developer, and agent-facing documentation must describe sign-in gating, retained browser Account Caches, and authenticated synchronization rather than the former signed-out `localStorage` behavior.
