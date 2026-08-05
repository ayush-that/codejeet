-- Personal notes per (user, question slug). Same slug identity as progress.
-- Empty notes are deleted rather than stored as blank rows.
CREATE TABLE IF NOT EXISTS notes (
  user_id    TEXT NOT NULL,   -- Clerk user id
  slug       TEXT NOT NULL,   -- leetcode slug == question.ID
  note       TEXT NOT NULL,
  updated_at TEXT NOT NULL,   -- ISO-8601 UTC
  PRIMARY KEY (user_id, slug)
);
