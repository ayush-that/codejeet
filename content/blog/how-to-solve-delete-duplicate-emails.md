---
title: "How to Solve Delete Duplicate Emails — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Delete Duplicate Emails. Easy difficulty, 65.6% acceptance rate. Topics: Database."
date: "2026-10-31"
category: "dsa-patterns"
tags: ["delete-duplicate-emails", "database", "easy"]
---

# How to Solve Delete Duplicate Emails

This problem asks us to delete duplicate email records from a database table while keeping only the record with the smallest ID for each unique email. What makes this interesting is that we're performing a deletion operation based on comparisons between rows in the same table, which requires careful handling to avoid deleting all records or creating infinite loops.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this `Person` table:

| id  | email            |
| --- | ---------------- |
| 1   | john@example.com |
| 2   | bob@example.com  |
| 3   | john@example.com |
| 4   | john@example.com |
| 5   | bob@example.com  |

We need to delete duplicate emails while keeping the smallest ID for each email. Let's trace the logic:

1. **For "john@example.com"**: IDs are 1, 3, and 4. The smallest ID is 1, so we keep ID 1 and delete IDs 3 and 4.
2. **For "bob@example.com"**: IDs are 2 and 5. The smallest ID is 2, so we keep ID 2 and delete ID 5.

After deletion, the table should look like:

| id  | email            |
| --- | ---------------- |
| 1   | john@example.com |
| 2   | bob@example.com  |

The key insight is that for each email, we want to keep exactly one row—the one with the minimum ID—and delete all other rows with the same email.

## Brute Force Approach

A naive approach might involve multiple passes through the table or creating a temporary table. One brute force method would be:

1. For each row in the table
2. For each other row in the table
3. If they have the same email and the current row has a larger ID, delete it

This approach has several problems:

- It would be O(n²) in time complexity
- It could delete rows incorrectly if not careful about the order of operations
- In SQL, it's difficult to iterate through rows in this nested fashion without cursors, which are inefficient

The main issue with brute force in SQL problems like this is that SQL is set-based, not iterative. Trying to solve it with row-by-row processing goes against SQL's strengths and leads to inefficient, complex code.

## Optimal Solution

The optimal solution uses a self-join or subquery to identify which rows to delete. We need to find all rows where there exists another row with the same email but a smaller ID. These are the duplicate rows we should delete.

<div class="code-group">

```sql
-- Time: O(n²) in worst case, but optimized by database indexes
-- Space: O(1) additional space
DELETE p1
FROM Person p1, Person p2
WHERE p1.email = p2.email
AND p1.id > p2.id;

-- Alternative using JOIN syntax (more explicit):
DELETE p1
FROM Person p1
JOIN Person p2 ON p1.email = p2.email
WHERE p1.id > p2.id;
```

```sql
-- Alternative approach using subquery (often more readable):
DELETE FROM Person
WHERE id NOT IN (
    -- Find the minimum ID for each email
    SELECT MIN(id)
    FROM Person
    GROUP BY email
);

-- Note: Some databases require an alias for the subquery:
DELETE FROM Person
WHERE id NOT IN (
    SELECT MIN(id)
    FROM Person
    GROUP BY email
) AND id IN (SELECT id FROM Person);  -- Handle NULL cases
```

```sql
-- Using Common Table Expression (CTE) for clarity:
WITH MinIds AS (
    SELECT MIN(id) as min_id
    FROM Person
    GROUP BY email
)
DELETE FROM Person
WHERE id NOT IN (SELECT min_id FROM MinIds);
```

</div>

**Line-by-line explanation:**

1. **Self-join approach**: We join the `Person` table with itself (`Person p1, Person p2` or explicit `JOIN`). This creates pairs of rows where both have the same email.
2. **The WHERE clause**: `p1.email = p2.email` ensures we only compare rows with the same email. `p1.id > p2.id` selects rows where the current row (`p1`) has a larger ID than some other row (`p2`) with the same email.

3. **Why this works**: For each email, the row with the smallest ID will never satisfy `p1.id > p2.id` because there's no other row with the same email and a smaller ID. All other rows (with larger IDs) will satisfy this condition for at least one pair (when `p2` is the row with the smallest ID).

4. **Subquery approach**: The subquery `SELECT MIN(id) FROM Person GROUP BY email` finds the smallest ID for each unique email. We then delete all rows whose IDs are NOT in this list of minimum IDs.

## Complexity Analysis

**Time Complexity**:

- The self-join approach is O(n²) in the worst case where n is the number of rows, as it compares each row with every other row. However, with proper indexing on the `email` column, this can be significantly optimized by the database engine.
- The subquery approach involves: O(n) to scan the table for grouping + O(n) for the deletion check = O(n) overall, assuming the database can optimize the `NOT IN` clause efficiently.

**Space Complexity**:

- O(1) additional space for the self-join approach (the database may use temporary storage but it's not proportional to input size).
- O(k) where k is the number of unique emails for the subquery approach, to store the minimum IDs.

In practice, database optimizers and indexes make a big difference. With an index on `email`, both approaches perform well even on large tables.

## Common Mistakes

1. **Deleting all rows**: Using `p1.id <> p2.id` instead of `p1.id > p2.id` would delete ALL rows with duplicates, including the ones you want to keep. The `>` comparison ensures we only delete rows with larger IDs.

2. **Infinite deletion loops**: Some candidates try to delete and update in the same statement or use circular logic. SQL handles the deletion atomically, but complex logic can lead to unexpected results.

3. **Forgetting that DELETE affects all matching rows**: In the self-join, if there are multiple duplicates, a single row might match multiple times in the WHERE clause. This is fine—DELETE will still only remove the row once.

4. **NULL handling in subquery approach**: In some databases, `NOT IN` behaves unexpectedly with NULL values. If the subquery could return NULL, use `NOT EXISTS` instead or add a condition to exclude NULLs.

5. **Assuming order of operations**: Some candidates think they need to sort or process in a specific order. Remember that SQL is declarative—you specify WHAT you want, not HOW to do it.

## When You'll See This Pattern

This "keep one, delete duplicates" pattern appears in various data cleaning scenarios:

1. **Remove Duplicates from Sorted Array (LeetCode 26)** - While not a database problem, it uses the same "keep first occurrence, remove others" logic.

2. **Second Highest Salary (LeetCode 176)** - Uses similar self-join or subquery logic to compare rows within the same table.

3. **Department Highest Salary (LeetCode 184)** - Uses grouping with MAX/MIN similar to our subquery approach, but for selecting instead of deleting.

4. **Customers Who Never Order (LeetCode 183)** - Uses `NOT IN` pattern similar to our subquery approach.

The core technique is using self-joins or subqueries to compare rows within the same table based on some criteria—a common pattern in SQL interview questions.

## Key Takeaways

1. **Self-joins are powerful for row comparisons**: When you need to compare rows within the same table (like finding duplicates or relative rankings), joining a table with itself is often the solution.

2. `>` vs `<>` matters for "keep one" logic\*\*: When keeping one instance (like the smallest ID), use `>` to compare with the keeper. Using `<>` would delete all instances.

3. **Multiple approaches exist**: Self-joins, subqueries with `NOT IN`, and CTEs can all solve this problem. Knowing multiple approaches shows depth of SQL knowledge.

4. **Think in sets, not loops**: The most efficient SQL solutions work on entire sets of data at once, not row-by-row. This is the key mindset shift for database programming.

[Practice this problem on CodeJeet](/problem/delete-duplicate-emails)
