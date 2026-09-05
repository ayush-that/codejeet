# Codejeet Learning Data

Codejeet stores each signed-in learner's private record of their problem-solving activity.

## Language

**Progress**:
A learner's current record of which problems they consider solved.
_Avoid_: Checked items, completion state

**Problem Note**:
A learner's private text attached to one problem.
_Avoid_: Revision note, annotation

**Account Data**:
Progress and Problem Notes belonging to one authenticated learner.
_Avoid_: Cloud data, server data, user data

**Account Cache**:
A device's retained copy of Account Data, kept even after its learner signs out.
_Avoid_: Browser data, offline backup

**Actor**:
One Account Cache's permanent 16-byte replica identity, used to distinguish its offline changes from changes made by other installations.
_Avoid_: Device ID, session ID

**Causal Summary**:
The compact per-actor counters that describe which Progress changes an Account Cache or the server has already observed.
_Avoid_: Sync timestamp, change history

**Canonical Snapshot**:
A complete, server-accepted image of an account's current Progress, Problem Notes, actors, and causal state at one server revision.
_Avoid_: Backup, event log

**Pending Overlay**:
An Account Cache's unacknowledged local Progress and Problem Note mutations applied over its latest canonical generation to produce the learner's current view.
_Avoid_: Optimistic cache, dirty state

**Revocation Handle**:
A random secret belonging to one Account Cache that lets a signed-out installation learn that its former account was deleted, without identifying or authenticating the deleted learner.
_Avoid_: Deletion token, user ID

**Problem Registry**:
The append-only list of every problem slug Codejeet has recognized, including inactive problems retained so old offline changes remain valid.
_Avoid_: Current problem list, route catalog

**Public View**:
The signed-out view of Codejeet's educational content, with empty Progress and Problem Notes regardless of any retained Account Cache.
_Avoid_: Guest mode, anonymous account

**Locally Active Account**:
The last authenticated account whose Account Cache is currently displayed and editable, even while network authentication is temporarily unavailable, until explicit sign-out, account switching, or confirmed deletion.
_Avoid_: Logged-in state, online session
