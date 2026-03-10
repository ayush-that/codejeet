---
title: "How to Solve Top Travellers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Top Travellers. Easy difficulty, 57.1% acceptance rate. Topics: Database."
date: "2028-09-17"
category: "dsa-patterns"
tags: ["top-travellers", "database", "easy"]
---

# How to Solve Top Travellers

This problem asks us to combine data from two tables (`Users` and `Rides`) to calculate the total distance traveled by each user, then sort the results by distance traveled in descending order. What makes this problem interesting is that it requires careful handling of users who haven't taken any rides—they should still appear in the output with zero distance traveled. This is a classic SQL problem that tests your understanding of `LEFT JOIN` and `GROUP BY` with aggregation functions.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Users table:**

```
id | name
1  | Alice
2  | Bob
3  | Charlie
```

**Rides table:**

```
id | user_id | distance
1  | 1       | 120
2  | 1       | 80
3  | 2       | 50
```

**Step-by-step reasoning:**

1. We need to combine these tables so we can calculate total distance per user
2. Alice (id=1) has two rides: 120 + 80 = 200
3. Bob (id=2) has one ride: 50
4. Charlie (id=3) has no rides, so his total distance should be 0
5. After calculating totals, we sort: Alice (200), Bob (50), Charlie (0)

The key insight is that we must use a `LEFT JOIN` from Users to Rides, not an `INNER JOIN`. An inner join would exclude Charlie since he has no matching rides, but the problem requires all users to appear in the output.

## Brute Force Approach

While SQL problems don't typically have "brute force" solutions in the same way as algorithmic problems, there are inefficient approaches that candidates might try:

1. **Using correlated subqueries for each user**: This would involve running a separate query for each user to calculate their total distance. For a table with N users, this would run N queries, resulting in O(N²) performance.

2. **Using multiple queries and manual combination**: Fetch all users, then for each user, fetch their rides separately. This is inefficient and doesn't leverage SQL's set-based operations.

3. **Using INNER JOIN instead of LEFT JOIN**: This would exclude users with no rides, failing the requirement that all users should appear in the output.

The optimal solution uses a single query with proper joins and aggregation, which is what we'll implement next.

## Optimal Solution

The optimal approach uses a `LEFT JOIN` to ensure all users are included, then groups by user to calculate the sum of distances. We use `COALESCE()` or `IFNULL()` to handle NULL values (which occur when a user has no rides) by converting them to 0.

<div class="code-group">

```sql
-- Time: O(n + m) where n = number of users, m = number of rides
-- Space: O(n) for the result set
SELECT
    u.name,                       -- Select the user's name
    COALESCE(SUM(r.distance), 0) AS travelled_distance  -- Sum distances, default to 0 if NULL
FROM
    Users u                       -- Start with all users
LEFT JOIN
    Rides r                       -- Left join to include users with no rides
    ON u.id = r.user_id           -- Match users to their rides
GROUP BY
    u.id, u.name                  -- Group by both id and name for correctness
ORDER BY
    travelled_distance DESC,      -- Primary sort: distance descending
    u.name ASC;                   -- Secondary sort: name ascending for ties
```

```sql
-- Alternative using IFNULL (MySQL-specific, works similarly to COALESCE)
SELECT
    u.name,
    IFNULL(SUM(r.distance), 0) AS travelled_distance
FROM
    Users u
LEFT JOIN
    Rides r
    ON u.id = r.user_id
GROUP BY
    u.id, u.name
ORDER BY
    travelled_distance DESC,
    u.name ASC;
```

</div>

**Line-by-line explanation:**

1. **`SELECT u.name`**: We start by selecting the user's name from the Users table.
2. **`COALESCE(SUM(r.distance), 0) AS travelled_distance`**: This is the core calculation. `SUM(r.distance)` adds up all distances for each user. `COALESCE()` returns the first non-NULL value, so if `SUM(r.distance)` is NULL (user has no rides), it returns 0 instead.
3. **`FROM Users u`**: We begin with the Users table and give it the alias `u` for brevity.
4. **`LEFT JOIN Rides r ON u.id = r.user_id`**: The `LEFT JOIN` ensures all users are included, even those without matching rides. Users with no rides will have NULL values in the rides columns.
5. **`GROUP BY u.id, u.name`**: We group by both id and name. While functionally we could group by just id (since id is unique), including name in the GROUP BY clause is good practice and required by some SQL implementations when selecting non-aggregated columns.
6. **`ORDER BY travelled_distance DESC, u.name ASC`**: First, sort by total distance in descending order (highest distance first). For users with the same distance, sort by name in ascending alphabetical order.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of users in the Users table
- `m` = number of rides in the Rides table
- The join operation needs to process each user and each ride once
- The GROUP BY operation processes the joined result, which has at most `n` rows (since LEFT JOIN preserves all users)

**Space Complexity: O(n)**

- The result set contains one row per user, so it requires O(n) space
- Temporary storage for grouping and aggregation also scales with the number of users

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**: This is the most common mistake. An INNER JOIN would exclude users with no rides, while the problem explicitly requires all users to appear in the output. Always check if you need to preserve all rows from the "left" table.

2. **Forgetting to handle NULL values**: When a user has no rides, `SUM(r.distance)` returns NULL. If you don't use `COALESCE()` or `IFNULL()`, these users will show NULL instead of 0 in the output. The problem expects 0, not NULL.

3. **Incorrect GROUP BY clause**: Some candidates group by only `u.name`, but names might not be unique. Always include the primary key (`u.id`) in the GROUP BY to ensure correct grouping. Some SQL implementations also require all selected non-aggregated columns to be in the GROUP BY clause.

4. **Missing the secondary sort**: The problem requires sorting by name ascending when distances are equal. Forgetting the `u.name ASC` in the ORDER BY clause will produce incorrect ordering for ties.

## When You'll See This Pattern

This pattern of combining tables with LEFT JOIN and handling NULL values with COALESCE/IFNULL appears in many SQL problems:

1. **Combine Two Tables (LeetCode 175)**: Similar structure—joining two tables with a LEFT JOIN to include all records from the primary table.

2. **Customer Placing the Largest Number of Orders (LeetCode 586)**: Requires grouping and aggregation with sorting, though it uses INNER JOIN since it only cares about customers with orders.

3. **Employees Earning More Than Their Managers (LeetCode 181)**: Uses self-join pattern but shares the concept of joining tables on related keys.

4. **Department Top Three Salaries (LeetCode 185)**: More complex version involving ranking within groups, but builds on the same foundation of joining and grouping.

The core pattern is: when you need to preserve all records from one table while optionally including related data from another table, think LEFT JOIN with COALESCE/IFNULL for handling missing data.

## Key Takeaways

1. **Use LEFT JOIN when you need to preserve all records from the "left" table**, even if there are no matches in the "right" table. INNER JOIN excludes non-matching records.

2. **Always handle NULL values from LEFT JOINS** using COALESCE() or IFNULL() when you need a default value (like 0) instead of NULL.

3. **When using GROUP BY with SELECT**, include all non-aggregated columns in the GROUP BY clause to avoid errors and ensure correct results, even if your SQL implementation allows otherwise.

4. **Pay attention to sorting requirements**—many problems require secondary sort criteria for tie-breaking.

[Practice this problem on CodeJeet](/problem/top-travellers)
