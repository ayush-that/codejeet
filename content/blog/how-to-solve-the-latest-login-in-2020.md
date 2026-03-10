---
title: "How to Solve The Latest Login in 2020 — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode The Latest Login in 2020. Easy difficulty, 77.0% acceptance rate. Topics: Database."
date: "2026-11-03"
category: "dsa-patterns"
tags: ["the-latest-login-in-2020", "database", "easy"]
---

## How to Solve The Latest Login in 2020

This problem asks us to find the latest login timestamp for each user in the year 2020. While it's categorized as "Easy," it tests your ability to filter data by date ranges and aggregate results using SQL's grouping functions—skills that frequently appear in real-world data analysis tasks. The tricky part is handling the datetime filtering correctly and understanding how `GROUP BY` works with aggregate functions.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose our `Logins` table contains:

| user_id | time_stamp          |
| ------- | ------------------- |
| 1       | 2020-01-01 10:00:00 |
| 1       | 2020-03-15 14:30:00 |
| 2       | 2019-12-31 23:59:59 |
| 2       | 2020-06-01 09:15:00 |
| 3       | 2021-01-01 00:00:01 |

**Step 1: Filter to 2020 logins only**  
We only care about logins where the year is 2020. This eliminates:

- User 2's 2019 login (wrong year)
- User 3's 2021 login (wrong year)

**Step 2: Group by user_id**  
After filtering, we group the remaining records:

- Group 1: User 1 has two logins (2020-01-01 and 2020-03-15)
- Group 2: User 2 has one login (2020-06-01)

**Step 3: Find latest timestamp in each group**  
For each user group, we find the maximum timestamp:

- User 1: max(2020-01-01, 2020-03-15) = 2020-03-15
- User 2: only 2020-06-01, so that's the latest

**Step 4: Return results**  
Our final output should be:

| user_id | last_stamp          |
| ------- | ------------------- |
| 1       | 2020-03-15 14:30:00 |
| 2       | 2020-06-01 09:15:00 |

Notice that User 3 doesn't appear because they had no logins in 2020.

## Brute Force Approach

A naive approach might try to process each user individually: for each distinct user, scan through all their logins, check if each is in 2020, and keep track of the maximum. While this is logically correct, it would be inefficient because:

1. You'd need to query the database multiple times (once per user)
2. You'd process the same data multiple times
3. You'd write procedural code instead of letting the database optimize the operation

In SQL, the equivalent brute force would be using a correlated subquery for each user:

```sql
SELECT
    user_id,
    (SELECT MAX(time_stamp)
     FROM Logins L2
     WHERE L2.user_id = L1.user_id
     AND YEAR(time_stamp) = 2020) AS last_stamp
FROM Logins L1
GROUP BY user_id
HAVING last_stamp IS NOT NULL;
```

This is inefficient because for each user in the outer query, the database executes the inner subquery, leading to O(n²) performance in the worst case. The optimal solution uses a single pass through the data.

## Optimal Solution

The optimal approach uses `WHERE` to filter logins to 2020 first, then `GROUP BY user_id` with `MAX(time_stamp)` to find the latest login for each user. This processes the data in one efficient pass.

<div class="code-group">

```sql
-- Time: O(n) where n = rows in Logins | Space: O(m) where m = distinct users in 2020
SELECT
    user_id,                     -- Select user identifier
    MAX(time_stamp) AS last_stamp -- Find latest timestamp for each user
FROM Logins                     -- From the logins table
WHERE YEAR(time_stamp) = 2020   -- Filter: only logins from year 2020
GROUP BY user_id;               -- Group results by user to aggregate per user
```

```sql
-- Alternative using BETWEEN for date range (also optimal)
SELECT
    user_id,
    MAX(time_stamp) AS last_stamp
FROM Logins
WHERE time_stamp BETWEEN '2020-01-01 00:00:00' AND '2020-12-31 23:59:59'
GROUP BY user_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT user_id`**: We need to output each user's ID
2. **`MAX(time_stamp) AS last_stamp`**: The `MAX()` function finds the latest timestamp for each group. We alias it as `last_stamp` for clear column naming
3. **`FROM Logins`**: Specify our source table
4. **`WHERE YEAR(time_stamp) = 2020`**: Filter rows before grouping. `YEAR()` extracts the year from datetime. Only 2020 logins proceed
5. **`GROUP BY user_id`**: Group remaining rows by user_id. All rows with same user_id become one group, then `MAX()` applies to each group

**Why this is optimal:**

- Filtering with `WHERE` first reduces the dataset before grouping
- `GROUP BY` with `MAX()` is optimized in databases using indexes and hash tables
- Single pass through filtered data: O(n) time

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Logins table. The database must scan through the table (or use an index if available) to apply the WHERE filter, then perform grouping operations. With proper indexing on `time_stamp` and `user_id`, this can be even faster.

**Space Complexity:** O(m) where m is the number of distinct users who logged in during 2020. The database needs to maintain aggregation state for each user group while processing rows.

**Index Optimization:** If performance is critical, a composite index on `(user_id, time_stamp)` or `(time_stamp, user_id)` could help. The former supports efficient grouping, the latter supports efficient date filtering.

## Common Mistakes

1. **Forgetting the WHERE filter entirely**: Some candidates jump straight to `GROUP BY user_id` with `MAX(time_stamp)`, which returns the overall latest login for each user across all years, not just 2020.

2. **Using HAVING instead of WHERE for filtering**:

   ```sql
   -- WRONG: Filters after grouping (inefficient and logically incorrect)
   SELECT user_id, MAX(time_stamp) AS last_stamp
   FROM Logins
   GROUP BY user_id
   HAVING YEAR(MAX(time_stamp)) = 2020;
   ```

   This excludes users whose latest login overall wasn't in 2020, but might include users who had a 2020 login that wasn't their latest.

3. **Incorrect date range boundaries**: Using `BETWEEN '2020-01-01' AND '2020-12-31'` without time components might exclude logins from December 31st after 00:00:00. Always include the full day: `'2020-12-31 23:59:59'`.

4. **Not handling users with no 2020 logins**: The problem implicitly handles this—users without 2020 logins won't appear in results because the WHERE filter removes all their rows before grouping.

## When You'll See This Pattern

This "filter-then-group-then-aggregate" pattern appears frequently in SQL problems:

1. **Department Highest Salary (LeetCode 184)**: Similar structure—filter employees, group by department, find max salary per group.

2. **Game Play Analysis (LeetCode 511)**: Find first login date for each player—uses `GROUP BY` with `MIN()` instead of `MAX()`.

3. **Customer Placing the Largest Number of Orders (LeetCode 586)**: Group orders by customer, count orders per customer, find maximum count.

The core pattern is: when you need to find an extreme value (max/min) for each category, think `GROUP BY` with aggregate function after appropriate filtering.

## Key Takeaways

1. **Filter before grouping when possible**: Use `WHERE` to reduce dataset size before `GROUP BY` operations. This improves performance and often simplifies logic.

2. **Understand aggregate function scope**: `MAX()`, `MIN()`, `COUNT()`, etc., apply to each group independently when used with `GROUP BY`. Without grouping, they apply to the entire result set.

3. **Date filtering requires precision**: When working with datetime ranges, ensure you include the entire range. Functions like `YEAR()`, `BETWEEN`, or `>= AND <=` with exact timestamps all work, but understand their boundaries.

[Practice this problem on CodeJeet](/problem/the-latest-login-in-2020)
