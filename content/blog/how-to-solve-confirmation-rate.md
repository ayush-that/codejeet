---
title: "How to Solve Confirmation Rate — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Confirmation Rate. Medium difficulty, 61.7% acceptance rate. Topics: Database."
date: "2027-03-18"
category: "dsa-patterns"
tags: ["confirmation-rate", "database", "medium"]
---

# How to Solve Confirmation Rate

This problem asks us to calculate the confirmation rate for each user who signed up, where confirmation rate is defined as the number of confirmed actions divided by the total number of action requests. The challenge comes from handling users who may have no action requests (resulting in a 0.0 confirmation rate) and properly aggregating data across two tables with potential mismatches.

## Visual Walkthrough

Let's walk through a concrete example with sample data:

**Signups table:**

```
user_id | time_stamp
--------|-----------
3       | 2020-03-21
7       | 2020-01-04
2       | 2020-07-29
6       | 2020-12-09
```

**Confirmations table:**

```
user_id | time_stamp | action
--------|------------|--------
3       | 2021-01-06 | timeout
3       | 2021-01-06 | timeout
7       | 2021-06-12 | confirmed
7       | 2021-06-12 | timeout
6       | 2021-09-16 | timeout
2       | 2021-04-21 | confirmed
3       | 2021-07-14 | confirmed
```

Here's how we calculate confirmation rates step by step:

1. **User 3**: Has 3 action requests (2 timeouts, 1 confirmed) → 1 confirmed / 3 total = 0.333...
2. **User 7**: Has 2 action requests (1 confirmed, 1 timeout) → 1 confirmed / 2 total = 0.5
3. **User 2**: Has 1 action request (1 confirmed) → 1 confirmed / 1 total = 1.0
4. **User 6**: Has 1 action request (1 timeout) → 0 confirmed / 1 total = 0.0

Notice that users with no entries in the Confirmations table (like user 6 in this example) should still appear in the result with a confirmation rate of 0.0. This is a key insight that affects our approach.

## Brute Force Approach

A naive approach might try to process each user individually, scanning the Confirmations table for each user to count their actions. In SQL terms, this would involve correlated subqueries or multiple passes through the data:

```sql
-- Inefficient approach with correlated subqueries
SELECT
    s.user_id,
    CASE
        WHEN total_requests = 0 THEN 0.0
        ELSE confirmed_count / total_requests
    END AS confirmation_rate
FROM Signups s
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_requests
    FROM Confirmations
    GROUP BY user_id
) t ON s.user_id = t.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as confirmed_count
    FROM Confirmations
    WHERE action = 'confirmed'
    GROUP BY user_id
) c ON s.user_id = c.user_id
```

This approach has several issues:

1. It requires multiple passes through the Confirmations table
2. The correlated subqueries can be inefficient for large datasets
3. It doesn't handle NULL values cleanly when users have no confirmations
4. The division needs careful handling to avoid integer division

While this might work for small datasets, it's inefficient and doesn't represent the clean SQL thinking interviewers expect.

## Optimized Approach

The key insight is that we can solve this in a single pass through the Confirmations table using conditional aggregation with `CASE` statements inside aggregate functions. Here's the step-by-step reasoning:

1. **Start with all users**: We need results for ALL users in the Signups table, so we begin with a `LEFT JOIN` from Signups to Confirmations.

2. **Aggregate intelligently**: Instead of multiple subqueries, we can use `SUM(CASE WHEN action = 'confirmed' THEN 1 ELSE 0 END)` to count confirmed actions in a single pass.

3. **Handle division carefully**: We need to avoid integer division (which would give us 0 for 1/3 in some databases). We should use `ROUND()` and ensure we're working with decimal numbers.

4. **Account for NULLs**: Users with no confirmations will have NULL values after the LEFT JOIN. We can handle this with `IFNULL()` or `COALESCE()` functions.

5. **Round appropriately**: The problem specifies rounding to 2 decimal places, which we achieve with `ROUND(..., 2)`.

The elegant solution uses conditional aggregation to compute both the numerator (confirmed actions) and denominator (total actions) in a single query, properly handling edge cases.

## Optimal Solution

Here's the complete, well-commented solution in multiple languages:

<div class="code-group">

```sql
-- Time: O(n + m) where n = signups count, m = confirmations count
-- Space: O(n) for the result set
SELECT
    s.user_id,
    -- Handle users with no confirmations by using IFNULL to convert NULL to 0
    -- ROUND to 2 decimal places as specified in the problem
    ROUND(
        IFNULL(
            -- Calculate confirmation rate: confirmed actions / total actions
            SUM(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END) /
            COUNT(c.action),  -- Count only non-NULL actions (users with confirmations)
            0  -- Default to 0 if user has no confirmations (NULL case)
        ),
        2  -- Round to 2 decimal places
    ) AS confirmation_rate
FROM
    -- Start with all users who signed up
    Signups s
    -- LEFT JOIN ensures we keep users even if they have no confirmations
    LEFT JOIN Confirmations c ON s.user_id = c.user_id
-- Group by user to calculate rates per user
GROUP BY s.user_id
-- Order by user_id as typically expected (though not explicitly required)
ORDER BY s.user_id;
```

```sql
-- Alternative using COALESCE (more standard SQL)
-- Time: O(n + m) | Space: O(n)
SELECT
    s.user_id,
    ROUND(
        COALESCE(
            AVG(CASE WHEN c.action = 'confirmed' THEN 1.0 ELSE 0.0 END),
            0.0
        ),
        2
    ) AS confirmation_rate
FROM Signups s
LEFT JOIN Confirmations c ON s.user_id = c.user_id
GROUP BY s.user_id
ORDER BY s.user_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT s.user_id`**: We start by selecting the user ID from the Signups table.
2. **`ROUND(..., 2)`**: Wraps our calculation to ensure 2 decimal places of precision.
3. **`IFNULL(..., 0)`**: Handles the case where a user has no confirmations (NULL result).
4. **`SUM(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END)`**: Counts only confirmed actions. The CASE statement returns 1 for 'confirmed', 0 otherwise.
5. **`COUNT(c.action)`**: Counts total action requests. Using `c.action` ensures we only count non-NULL rows (users with at least one confirmation).
6. **`FROM Signups s LEFT JOIN Confirmations c`**: LEFT JOIN preserves all users from Signups, even those without matching Confirmations.
7. **`GROUP BY s.user_id`**: Aggregates results per user.
8. **`ORDER BY s.user_id`**: Provides sorted output (good practice even if not required).

The alternative solution using `AVG()` is particularly elegant because:

- `AVG(CASE WHEN c.action = 'confirmed' THEN 1.0 ELSE 0.0 END)` automatically calculates the ratio
- Using `1.0` instead of `1` ensures floating-point division
- `COALESCE` handles NULL results from users with no confirmations

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in Signups table
- `m` = number of rows in Confirmations table
- The LEFT JOIN requires scanning both tables once
- The GROUP BY operation aggregates the results, which is linear in the number of unique users

**Space Complexity: O(n)**

- The result set contains one row per user in the Signups table
- Intermediate aggregation requires space proportional to the number of unique users
- In the worst case, if every user has many confirmations, the join result before aggregation could be O(m), but most database optimizations handle this efficiently

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**: This is the most common mistake. INNER JOIN would exclude users with no confirmations, while the problem requires all users to appear in the result. Always check if you need to preserve all rows from the primary table.

2. **Integer division**: Writing `SUM(...) / COUNT(...)` without ensuring at least one operand is a decimal can result in integer division (e.g., 1/3 = 0 instead of 0.33). Solution: Use `1.0` instead of `1` in CASE statements or multiply by `1.0`.

3. **Forgetting to handle NULLs**: When a user has no confirmations, aggregate functions return NULL. Without `IFNULL()` or `COALESCE()`, these users would show NULL instead of 0.0.

4. **Incorrect rounding or no rounding**: The problem explicitly asks for rounding to 2 decimal places. Forgetting `ROUND(..., 2)` or using the wrong number of decimal places is a subtle but important error.

5. **Counting wrong denominator**: Using `COUNT(*)` instead of `COUNT(c.action)` would count 1 for users with no confirmations (due to LEFT JOIN), giving incorrect 0/1 = 0 instead of 0/0 = 0. While both give 0 in this case, it's conceptually incorrect.

## When You'll See This Pattern

This problem combines several important SQL patterns that appear frequently in interview questions:

1. **Conditional Aggregation**: Using `CASE` inside aggregate functions like `SUM()` or `AVG()`.
   - Related problem: _Calculate Special Bonus_ (LeetCode 1873) - uses CASE in SELECT
   - Related problem: _Market Analysis I_ (LeetCode 1158) - similar LEFT JOIN with conditional counting

2. **Handling Missing Data with LEFT JOIN**: Preserving all rows from one table regardless of matches.
   - Related problem: _Customer Who Visited but Did Not Make Any Transactions_ (LeetCode 1581)
   - Related problem: _Employees With Missing Information_ (LeetCode 1965)

3. **Rate/Percentage Calculations**: Computing ratios with proper NULL handling and rounding.
   - Related problem: _Percentage of Users Attended a Contest_ (LeetCode 1633)
   - Related problem: _Immediate Food Delivery II_ (LeetCode 1174)

The core technique of `AVG(CASE WHEN ... THEN 1.0 ELSE 0.0 END)` for calculating rates is particularly powerful and worth memorizing.

## Key Takeaways

1. **Use LEFT JOIN when you need to preserve all records** from the primary table, especially for "find all X" type problems. INNER JOIN silently filters out non-matching rows.

2. **Conditional aggregation with CASE statements** is more efficient than multiple subqueries for calculating different metrics per group. You can compute multiple aggregates in a single pass through the data.

3. **Always handle division carefully in SQL** - ensure at least one operand is a decimal to avoid integer division, and use `IFNULL()`/`COALESCE()` to handle NULL results from empty groups.

4. **Read problem requirements carefully** - details like rounding precision and whether to include users with no activity are easy to miss but critical for correctness.

[Practice this problem on CodeJeet](/problem/confirmation-rate)
