---
title: "How to Solve Invalid Tweets — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Invalid Tweets. Easy difficulty, 85.2% acceptance rate. Topics: Database."
date: "2026-07-30"
category: "dsa-patterns"
tags: ["invalid-tweets", "database", "easy"]
---

# How to Solve Invalid Tweets

This problem asks us to find tweets with content longer than 15 characters from a database table. While it appears straightforward, it's interesting because it tests your understanding of SQL string functions and filtering logic in database queries. The "trick" is knowing which string function to use and understanding that character length includes spaces and punctuation.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Tweets` table contains:

| tweet_id | content                             |
| -------- | ----------------------------------- |
| 1        | "Hello world"                       |
| 2        | "This is a very long tweet example" |
| 3        | "Short"                             |
| 4        | "Exactly 15 chars"                  |

We need to identify which tweets have content longer than 15 characters. Let's count:

1. "Hello world" → 11 characters (including space) → NOT invalid
2. "This is a very long tweet example" → 32 characters → INVALID
3. "Short" → 5 characters → NOT invalid
4. "Exactly 15 chars" → 15 characters exactly → NOT invalid (needs to be > 15)

So our query should return only tweet_id 2. The key insight is that we need to calculate the length of each tweet's content and filter based on that calculation.

## Brute Force Approach

For SQL problems, there isn't really a "brute force" in the algorithmic sense, but there are less optimal or incorrect approaches that candidates might consider:

1. **Manual inspection approach**: A naive candidate might think about reading all tweets and counting characters manually, but this doesn't work programmatically.

2. **Wrong string function**: Using `LEN()` instead of `CHAR_LENGTH()` or `LENGTH()` depending on the SQL dialect. In MySQL, `LENGTH()` returns the length in bytes, not characters, which can give wrong results for multi-byte characters.

3. **Hardcoding values**: Trying to guess which tweets are invalid without actually calculating lengths.

The correct approach requires using the appropriate string length function and applying a simple filter with `WHERE`.

## Optimal Solution

The optimal solution uses `CHAR_LENGTH()` (or `LENGTH()` in some SQL dialects) to count characters and filters with `WHERE`. Here's the complete solution:

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(1) for the query itself
SELECT tweet_id
FROM Tweets
WHERE CHAR_LENGTH(content) > 15;
-- Step 1: SELECT tweet_id - We only need to return the tweet IDs
-- Step 2: FROM Tweets - Specify the table we're querying
-- Step 3: WHERE CHAR_LENGTH(content) > 15 - Filter rows where content length exceeds 15 characters
-- CHAR_LENGTH() counts characters (not bytes), which is what we want for this problem
```

```sql
-- Alternative using LENGTH() - works in MySQL for ASCII characters
-- Time: O(n) | Space: O(1)
SELECT tweet_id
FROM Tweets
WHERE LENGTH(content) > 15;
-- Note: In MySQL, LENGTH() returns bytes, not characters
-- For ASCII text (single-byte characters), this works fine
-- For multi-byte characters (like emojis), use CHAR_LENGTH()
```

```sql
-- PostgreSQL version using character_length() or length()
-- Time: O(n) | Space: O(1)
SELECT tweet_id
FROM Tweets
WHERE character_length(content) > 15;
-- PostgreSQL supports both character_length() and length() for character count
```

</div>

**Key implementation details:**

1. **Function choice**: We use `CHAR_LENGTH()` because it counts characters regardless of their byte representation. This is important for Unicode text that might contain emojis or special characters.

2. **Comparison operator**: We use `>` (greater than) not `>=` (greater than or equal to) because we want tweets longer than 15 characters, not 15 characters or longer.

3. **Select clause**: We only select `tweet_id` as requested, not the content or length values.

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Tweets table. The database must examine every row to calculate the length of the content and apply the filter condition. In practice, if there's an index on content, some databases might optimize this, but generally it's a linear scan.

**Space Complexity:** O(1) for the query itself. The output space depends on how many tweets meet the criteria, but that's not counted in the space complexity of the query. The database needs temporary space to compute lengths and filter results, but this is minimal.

## Common Mistakes

1. **Using LENGTH() instead of CHAR_LENGTH() in MySQL**:
   - `LENGTH()` returns the number of bytes, while `CHAR_LENGTH()` returns the number of characters.
   - For ASCII text, they're the same (1 byte = 1 character).
   - For Unicode text with multi-byte characters (like emojis: "😀" is 4 bytes but 1 character), `LENGTH()` would give 4 while `CHAR_LENGTH()` gives 1.
   - **How to avoid**: Know your SQL dialect. In MySQL, use `CHAR_LENGTH()` for character count. In PostgreSQL, `LENGTH()` works for characters.

2. **Using >= instead of >**:
   - The problem says "longer than 15 characters," which means `> 15`, not `>= 15`.
   - Tweets with exactly 15 characters should NOT be included.
   - **How to avoid**: Read the problem statement carefully. "Longer than" means strictly greater than.

3. **Selecting unnecessary columns**:
   - The problem asks only for `tweet_id`, but some candidates might include `content` or the calculated length.
   - While not technically wrong, it shows poor attention to requirements.
   - **How to avoid**: Read what the output should be and only SELECT those columns.

4. **Forgetting that spaces count as characters**:
   - "Hello world" has 11 characters (10 letters + 1 space).
   - Some candidates might only count letters or visible characters.
   - **How to avoid**: Remember that in programming, string length includes ALL characters: letters, digits, spaces, punctuation, etc.

## When You'll See This Pattern

This problem teaches the pattern of **applying functions in WHERE clauses** for filtering. You'll see similar patterns in:

1. **Big Countries (LeetCode 595)**: `WHERE area > 3000000 OR population > 25000000`
   - Similar filtering logic but with numerical comparisons instead of string functions.

2. **Find Customer Referee (LeetCode 584)**: `WHERE referee_id != 2 OR referee_id IS NULL`
   - Filtering with conditions that handle NULL values.

3. **Patients With a Condition (LeetCode 1527)**: `WHERE conditions LIKE '% DIAB1%' OR conditions LIKE 'DIAB1%'`
   - Using string functions (`LIKE`) in WHERE clauses for pattern matching.

The core pattern is: **SELECT columns FROM table WHERE [condition involving column values or functions applied to columns]**. This is fundamental to almost all SQL queries.

## Key Takeaways

1. **Know your SQL string functions**: Different SQL dialects have different functions for string operations. MySQL's `CHAR_LENGTH()` vs `LENGTH()` is a classic interview trap. Always clarify which SQL dialect you're using if unsure.

2. **Read requirements precisely**: "Longer than 15" means `> 15`, not `>= 15`. Small wording differences change the comparison operator you need.

3. **Spaces and punctuation count as characters**: When calculating string length in programming, everything between the quotes counts, including invisible characters like spaces, tabs, and newlines (though newlines probably won't appear in tweet content).

[Practice this problem on CodeJeet](/problem/invalid-tweets)
