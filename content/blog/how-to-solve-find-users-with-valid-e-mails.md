---
title: "How to Solve Find Users With Valid E-Mails — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Users With Valid E-Mails. Easy difficulty, 36.7% acceptance rate. Topics: Database."
date: "2028-02-24"
category: "dsa-patterns"
tags: ["find-users-with-valid-e-mails", "database", "easy"]
---

# How to Solve "Find Users With Valid E-Mails"

This problem asks us to filter a `Users` table to find only those users with valid email addresses according to specific rules. While it's categorized as "Easy," the challenge lies in crafting the correct regular expression pattern that captures all the edge cases precisely. A single misplaced character in the pattern can cause valid emails to be rejected or invalid ones to be accepted.

## Visual Walkthrough

Let's walk through a concrete example to understand what makes an email valid according to the problem statement:

**Rules for valid emails:**

1. Must have exactly one `@` symbol
2. The prefix (part before `@`) must:
   - Start with a letter (a-z or A-Z)
   - Contain only letters, digits, underscores `_`, periods `.`, and/or dashes `-`
3. The domain (part after `@`) must be `@leetcode.com`

**Example Users table:**

| user_id | name      | mail                    |
| ------- | --------- | ----------------------- |
| 1       | Winston   | winston@leetcode.com    |
| 2       | Jonathan  | jonathanisgreat         |
| 3       | Annabelle | bella-@leetcode.com     |
| 4       | Sally     | sally.come@leetcode.com |
| 5       | Marwan    | quarz#2020@leetcode.com |
| 6       | David     | david69@gmail.com       |
| 7       | Shapiro   | .shapo@leetcode.com     |

**Step-by-step evaluation:**

1. **Winston** (`winston@leetcode.com`):
   - Prefix "winston" starts with letter `w`, contains only letters ✓
   - Domain is exactly "leetcode.com" ✓
   - **VALID**

2. **Jonathan** (`jonathanisgreat`):
   - No `@` symbol at all ✗
   - **INVALID**

3. **Annabelle** (`bella-@leetcode.com`):
   - Prefix "bella-" ends with dash (allowed in middle but okay at end? Actually dashes are allowed anywhere in prefix)
   - Starts with letter `b` ✓
   - Domain is "leetcode.com" ✓
   - **VALID** (dashes are allowed anywhere in prefix)

4. **Sally** (`sally.come@leetcode.com`):
   - Prefix "sally.come" contains period (allowed)
   - Starts with letter `s` ✓
   - Domain is "leetcode.com" ✓
   - **VALID**

5. **Marwan** (`quarz#2020@leetcode.com`):
   - Prefix "quarz#2020" contains `#` which is NOT allowed ✗
   - **INVALID**

6. **David** (`david69@gmail.com`):
   - Domain is "gmail.com" not "leetcode.com" ✗
   - **INVALID**

7. **Shapiro** (`.shapo@leetcode.com`):
   - Prefix ".shapo" starts with period `.` not a letter ✗
   - **INVALID**

The key insight is that we need a regular expression that checks ALL these conditions simultaneously.

## Brute Force Approach

A naive approach might try to check each condition separately with string operations:

1. Check if email contains exactly one `@`
2. Split on `@` and verify we have exactly two parts
3. Check if first character of prefix is a letter
4. Check each character in prefix is allowed (letters, digits, `_`, `.`, `-`)
5. Check if domain equals "leetcode.com"

While this approach would work, it's verbose and error-prone. More importantly, in SQL we want a single, clean query rather than multiple nested operations. The "brute force" in SQL terms would be writing a complex CASE statement or multiple nested string functions, which becomes hard to read and maintain.

The optimal approach uses a single regular expression that encapsulates all rules.

## Optimal Solution

The key is constructing the correct regular expression pattern:

- `^[A-Za-z]`: Must start with a letter
- `[A-Za-z0-9_.-]*`: Followed by zero or more of: letters, digits, underscore, period, or dash
- `@leetcode\\.com$`: Ends with exactly "@leetcode.com" (note the double backslash to escape the period)

The `^` anchors to start of string, `$` anchors to end of string, ensuring the entire string matches the pattern.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(1)
SELECT *
FROM Users
-- The regular expression checks all validity rules in one pattern
WHERE mail REGEXP '^[A-Za-z][A-Za-z0-9_.-]*@leetcode\\.com$';
-- ^           : Start of string anchor
-- [A-Za-z]    : First character must be a letter
-- [A-Za-z0-9_.-]* : Zero or more allowed characters in prefix
-- @leetcode\\.com : Literal domain with escaped period
-- $           : End of string anchor
```

```sql
-- Alternative for databases that use different regex syntax
-- Time: O(n) where n is number of rows | Space: O(1)
SELECT *
FROM Users
-- Using LIKE for simple pattern matching (less flexible but works here)
WHERE mail LIKE '%@leetcode.com'
  -- Check first character is a letter
  AND SUBSTRING(mail, 1, 1) REGEXP '[A-Za-z]'
  -- Check prefix contains only allowed characters
  AND SUBSTRING_INDEX(mail, '@', 1) REGEXP '^[A-Za-z][A-Za-z0-9_.-]*$';
```

</div>

**Note:** Different SQL dialects have slightly different regular expression syntax:

- MySQL uses `REGEXP` or `RLIKE`
- PostgreSQL uses `~` for regex matching
- SQL Server doesn't have built-in regex but can use `LIKE` with character ranges

## Complexity Analysis

**Time Complexity:** O(n × m)

- `n` is the number of rows in the Users table
- `m` is the average length of email addresses
- Each email string needs to be checked against the regular expression
- In practice, regex engines are optimized, so this is usually close to O(n) for reasonable string lengths

**Space Complexity:** O(1)

- We're only filtering rows, not creating additional data structures
- The output space isn't counted in complexity analysis for SQL queries
- Regular expression matching uses constant additional space

## Common Mistakes

1. **Forgetting to escape the period in `leetcode.com`**:
   - `.` in regex means "any character"
   - Must use `\\.` or `[.]` to match literal period
   - **Fix**: Always escape special regex characters: `@leetcode\\.com`

2. **Not anchoring with `^` and `$`**:
   - Without anchors, `@leetcode.com` could match anywhere in the string
   - `test@leetcode.com.test` would incorrectly match
   - **Fix**: Always use `^` at start and `$` at end for exact matching

3. **Incorrect character range for prefix**:
   - Using `[A-Za-z0-9_.-]` but forgetting it allows underscore, period, dash
   - Placing `-` at wrong position in character class (should be first or last)
   - **Fix**: Use `[A-Za-z0-9_.-]` with dash at end to avoid being interpreted as range

4. **Assuming case-insensitive matching by default**:
   - Some SQL implementations are case-sensitive by default
   - `[A-Z]` won't match lowercase letters unless also include `[a-z]`
   - **Fix**: Use `[A-Za-z]` or check your database's case-sensitivity settings

## When You'll See This Pattern

This pattern of using regular expressions for data validation appears in many database problems:

1. **1517. Find Users With Valid E-Mails** (this problem) - Validating email format
2. **1527. Patients With a Condition** - Finding patients with specific condition codes using `LIKE` patterns
3. **1667. Fix Names in a Table** - Formatting names with string functions that could use regex
4. **196. Delete Duplicate Emails** - While not using regex directly, involves filtering based on email patterns

The core technique is using pattern matching to filter or validate string data according to specific rules. This is essential for data cleaning, validation, and extraction tasks in real-world databases.

## Key Takeaways

1. **Regular expressions are powerful for pattern matching**: When you need to validate strings against complex rules (like email formats, phone numbers, IDs), regex is often the most concise solution.

2. **Anchor your patterns**: Always use `^` (start of string) and `$` (end of string) when you need exact matches, unless you intentionally want to find substrings.

3. **Escape special characters**: In regex, characters like `.`, `*`, `+`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, `$`, `|`, `\` have special meanings. Escape them with `\` when you want their literal meaning.

4. **Test edge cases**: Always test your pattern with various inputs including empty strings, strings with special characters, and boundary cases.

[Practice this problem on CodeJeet](/problem/find-users-with-valid-e-mails)
