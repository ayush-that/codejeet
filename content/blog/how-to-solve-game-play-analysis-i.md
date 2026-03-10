---
title: "How to Solve Game Play Analysis I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Game Play Analysis I. Easy difficulty, 76.2% acceptance rate. Topics: Database."
date: "2027-05-05"
category: "dsa-patterns"
tags: ["game-play-analysis-i", "database", "easy"]
---

# How to Solve Game Play Analysis I

This problem asks us to find each player's first login date from a game activity table. While it's categorized as "Easy" in database problems, it introduces fundamental SQL concepts that form the building blocks for more complex queries. The interesting part is understanding how to extract specific information from temporal data using aggregation and filtering.

## Visual Walkthrough

Let's walk through a concrete example to understand what we're trying to achieve. Consider this sample data:

| player_id | device_id | event_date | games_played |
| --------- | --------- | ---------- | ------------ |
| 1         | 2         | 2023-01-01 | 5            |
| 1         | 2         | 2023-01-02 | 6            |
| 2         | 3         | 2023-01-02 | 1            |
| 3         | 1         | 2023-01-01 | 0            |
| 3         | 4         | 2023-01-03 | 5            |

We need to find each player's **first login date**. Looking at the data:

- Player 1 has two entries: 2023-01-01 and 2023-01-02. Their first login is 2023-01-01.
- Player 2 has only one entry: 2023-01-02. Their first login is 2023-01-02.
- Player 3 has two entries: 2023-01-01 and 2023-01-03. Their first login is 2023-01-01.

The expected output should be:

| player_id | first_login |
| --------- | ----------- |
| 1         | 2023-01-01  |
| 2         | 2023-01-02  |
| 3         | 2023-01-01  |

Notice that we need exactly one row per player, even if they have multiple activity records.

## Brute Force Approach

A naive approach might try to manually sort the data for each player and pick the earliest date. In SQL terms, a beginner might try to use a subquery with `ORDER BY` and `LIMIT 1` for each player, but this would be inefficient and doesn't scale well.

Another incorrect approach would be to simply select all rows and assume the earliest date appears first in the table, but database tables don't guarantee any particular order unless explicitly sorted.

The key insight is that we need to **group by player_id** and then find the **minimum event_date** for each group. This is exactly what SQL's `GROUP BY` and aggregate functions are designed for.

## Optimal Solution

The optimal solution uses `GROUP BY` with the `MIN()` aggregate function. Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n log n) for grouping | Space: O(n) for grouping result
SELECT
    player_id,                    -- Select the player identifier
    MIN(event_date) AS first_login  -- Find the earliest date for each player
FROM
    Activity                      -- From the activity table
GROUP BY
    player_id;                    -- Group results by each unique player
```

</div>

Let's break down each part of the query:

1. **`SELECT player_id`**: We want to output each player's ID
2. **`MIN(event_date) AS first_login`**: For each group of rows with the same `player_id`, find the minimum (earliest) `event_date`. We alias this as `first_login` for clarity
3. **`FROM Activity`**: We're querying the Activity table
4. **`GROUP BY player_id`**: This tells SQL to group all rows with the same `player_id` together. The `MIN()` function then operates on each group separately

## Complexity Analysis

**Time Complexity: O(n log n)** - The database needs to sort or hash the data by `player_id` to perform the grouping. Most databases use hashing (O(n) average case) or sorting (O(n log n) worst case) for GROUP BY operations. The exact complexity depends on the database implementation and indexing.

**Space Complexity: O(n)** - In the worst case, each player has only one record, so the result set could contain up to n rows. Additionally, the grouping operation itself requires temporary storage proportional to the number of distinct players.

## Common Mistakes

1. **Forgetting the GROUP BY clause**: Without `GROUP BY`, `MIN(event_date)` would return a single value (the earliest date in the entire table), not per player. This would give incorrect results with only one row in the output.

2. **Including non-aggregated columns in SELECT without GROUP BY**: If you try to select `device_id` without including it in GROUP BY or using an aggregate function, you'll get an error in most SQL databases. Each selected column must either be in the GROUP BY clause or wrapped in an aggregate function.

3. **Using MAX() instead of MIN()**: It's easy to mix up which function to use. Remember we want the **first** login, which is the **minimum** (earliest) date, not the maximum (latest) date.

4. **Not using an alias for readability**: While `MIN(event_date)` works, `MIN(event_date) AS first_login` makes the output column name much clearer and is considered good practice.

## When You'll See This Pattern

This pattern of using `GROUP BY` with aggregate functions like `MIN()`, `MAX()`, `COUNT()`, or `SUM()` appears frequently in SQL problems:

1. **Game Play Analysis II (Easy)** - The follow-up problem that builds on this one, asking for additional information about each player's first login.

2. **Department Top Three Salaries (Hard)** - Uses grouping with window functions to find rankings within groups.

3. **Classes More Than 5 Students (Easy)** - Uses `GROUP BY` with `COUNT()` and `HAVING` to filter groups based on aggregate values.

4. **Customer Placing the Largest Number of Orders (Easy)** - Similar pattern of grouping and finding maximum counts.

The core pattern is: when you need to compute statistics (minimum, maximum, count, sum, average) for each distinct value in a column, think `GROUP BY`.

## Key Takeaways

- **GROUP BY transforms rows into groups**: It's the fundamental SQL operation for computing aggregate statistics per category or group.

- **Aggregate functions apply to groups**: Functions like `MIN()`, `MAX()`, `COUNT()`, `SUM()`, and `AVG()` are designed to work with `GROUP BY` to compute values across multiple rows in each group.

- **Every non-aggregated column in SELECT must be in GROUP BY**: This is a key SQL rule that ensures each row in the result is well-defined.

This problem teaches the essential database skill of data aggregation, which is foundational for analytics, reporting, and understanding user behavior patterns.

Related problems: [Game Play Analysis II](/problem/game-play-analysis-ii)
