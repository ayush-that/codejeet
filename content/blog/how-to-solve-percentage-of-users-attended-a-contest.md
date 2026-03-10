---
title: "How to Solve Percentage of Users Attended a Contest — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Percentage of Users Attended a Contest. Easy difficulty, 60.0% acceptance rate. Topics: Database."
date: "2027-04-29"
category: "dsa-patterns"
tags: ["percentage-of-users-attended-a-contest", "database", "easy"]
---

# How to Solve "Percentage of Users Attended a Contest"

This problem asks us to calculate the percentage of users who participated in each contest, rounded to two decimal places and sorted by percentage in descending order, then by contest_id in ascending order. While conceptually straightforward, it's interesting because it requires careful handling of SQL aggregation, percentage calculations, and proper ordering—common pitfalls in SQL interview questions.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have:

**Users table:**

```
user_id | user_name
--------|----------
1       | Alice
2       | Bob
3       | Carol
4       | David
```

**Register table:**

```
contest_id | user_id
-----------|---------
207        | 1
207        | 2
207        | 4
208        | 2
208        | 3
```

**Step 1: Count total users**
Total users = 4 (Alice, Bob, Carol, David)

**Step 2: Count participants per contest**

- Contest 207: 3 participants (Alice, Bob, David)
- Contest 208: 2 participants (Bob, Carol)

**Step 3: Calculate percentages**

- Contest 207: (3/4) × 100 = 75.00%
- Contest 208: (2/4) × 100 = 50.00%

**Step 4: Sort results**
By percentage descending: 75.00% (contest 207) comes before 50.00% (contest 208)
If percentages were equal, we'd sort by contest_id ascending

## Brute Force Approach

A naive approach might involve multiple subqueries or temporary tables. For example:

1. First query to count total users
2. Second query to count participants per contest
3. Manually join these results and calculate percentages

While this would work, it's inefficient and verbose. The main issue isn't performance (SQL handles this well), but rather that it's unnecessarily complex and harder to read/maintain. In SQL interviews, clean, readable queries are often valued as much as performance.

## Optimal Solution

The optimal solution uses a single query with proper aggregation and window functions. We need to:

1. Get the total number of users (using COUNT or a subquery)
2. Count participants per contest (using GROUP BY)
3. Calculate percentage: (participants / total_users) × 100
4. Round to 2 decimal places
5. Sort by percentage descending, then contest_id ascending

<div class="code-group">

```sql
-- Time: O(n) where n is number of registrations | Space: O(m) where m is number of contests
SELECT
    contest_id,
    -- Calculate percentage rounded to 2 decimal places
    ROUND(
        -- Count participants for this contest divided by total users
        (COUNT(DISTINCT user_id) * 100.0) /
        -- Subquery to get total number of users
        (SELECT COUNT(*) FROM Users),
        2
    ) AS percentage
FROM
    Register
-- Group by contest to get counts per contest
GROUP BY
    contest_id
-- Order by percentage descending, then contest_id ascending
ORDER BY
    percentage DESC,
    contest_id ASC;
```

```sql
-- Alternative approach using CTE for better readability
-- Time: O(n) | Space: O(m)
WITH total_users AS (
    SELECT COUNT(*) AS total FROM Users
)
SELECT
    r.contest_id,
    ROUND(
        (COUNT(DISTINCT r.user_id) * 100.0) /
        tu.total,
        2
    ) AS percentage
FROM
    Register r
CROSS JOIN
    total_users tu
GROUP BY
    r.contest_id, tu.total
ORDER BY
    percentage DESC,
    r.contest_id ASC;
```

</div>

**Line-by-line explanation:**

1. **`SELECT contest_id`**: We start by selecting the contest_id since that's our grouping key
2. **`ROUND(... , 2)`**: Wraps our percentage calculation to round to 2 decimal places
3. **`COUNT(DISTINCT user_id) * 100.0`**: Counts unique participants per contest and multiplies by 100.0 (using 100.0 ensures floating-point division)
4. **`/ (SELECT COUNT(*) FROM Users)`**: Divides by total users using a subquery
5. **`FROM Register`**: Our main data comes from the registration table
6. **`GROUP BY contest_id`**: Groups registrations by contest to count participants per contest
7. **`ORDER BY percentage DESC, contest_id ASC`**: Primary sort by percentage (highest first), secondary sort by contest_id (lowest first)

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Register table. The database needs to:

- Scan the Register table once to count participants per contest (O(n))
- Scan the Users table once to count total users (O(u) where u is number of users)
- Sort the results (O(m log m) where m is number of contests, typically small)

**Space Complexity:** O(m) where m is the number of distinct contests. The database needs to store intermediate results for each contest during grouping.

## Common Mistakes

1. **Integer division:** Using `100` instead of `100.0` causes integer division, resulting in 0% or 100% only. Always use `100.0` or `CAST(100 AS FLOAT)`.

2. **Forgetting DISTINCT:** If the same user could register multiple times for the same contest (though unlikely given typical constraints), `COUNT(user_id)` would overcount. Using `COUNT(DISTINCT user_id)` is safer.

3. **Incorrect ordering:** Forgetting the secondary sort by contest_id when percentages are equal. The problem explicitly states: "If two or more contests have the same percentage, sort them by contest_id in ascending order."

4. **Wrong rounding:** Using `FLOOR`, `CEIL`, or incorrect decimal places instead of `ROUND(..., 2)`. Always check the required precision.

## When You'll See This Pattern

This pattern of calculating percentages from grouped data appears frequently in SQL problems:

1. **Queries Quality and Percentage (Easy):** Similar percentage calculation but with multiple conditions and grouping.
2. **Game Play Analysis (Medium):** Calculating various statistics from user activity data.
3. **Market Analysis (Medium):** Calculating percentages of users who made purchases.

The core pattern is: `(COUNT(grouped_data) * 100.0 / total_count)` with proper grouping and ordering.

## Key Takeaways

1. **Always use floating-point for percentages:** Multiply by `100.0` not `100` to avoid integer division truncation.
2. **Consider edge cases:** What if a contest has no participants? The query should return 0.00%. What if there are duplicate registrations? Use `DISTINCT`.
3. **Read ordering requirements carefully:** Multiple sort criteria are common in SQL problems—implement all specified conditions.

Related problems: [Queries Quality and Percentage](/problem/queries-quality-and-percentage)
