---
title: "How to Solve Game Play Analysis IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Game Play Analysis IV. Medium difficulty, 40.8% acceptance rate. Topics: Database."
date: "2027-06-22"
category: "dsa-patterns"
tags: ["game-play-analysis-iv", "database", "medium"]
---

# How to Solve Game Play Analysis IV

This problem asks us to calculate the fraction of players who logged in on the day after their first login. The challenge lies in efficiently identifying each player's first login date, then checking if they logged in the very next day, and finally computing the ratio across all players. This requires careful SQL window functions, subqueries, and date arithmetic.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Activity` table contains:

| player_id | device_id | event_date | games_played |
| --------- | --------- | ---------- | ------------ |
| 1         | 2         | 2023-01-01 | 5            |
| 1         | 2         | 2023-01-02 | 6            |
| 1         | 3         | 2023-01-03 | 1            |
| 2         | 3         | 2023-01-01 | 0            |
| 3         | 1         | 2023-01-02 | 5            |
| 3         | 4         | 2023-01-03 | 10           |
| 3         | 4         | 2023-01-04 | 8            |

**Step 1: Find each player's first login date**

- Player 1: First login on 2023-01-01
- Player 2: First login on 2023-01-01
- Player 3: First login on 2023-01-02

**Step 2: Check if they logged in the next day**

- Player 1: Logged in on 2023-01-02 (2023-01-01 + 1 day) → YES
- Player 2: No login on 2023-01-02 → NO
- Player 3: Logged in on 2023-01-03 (2023-01-02 + 1 day) → YES

**Step 3: Calculate the fraction**

- Total players: 3
- Players who logged in next day: 2 (Players 1 and 3)
- Fraction: 2/3 = 0.6667

## Brute Force Approach

A naive approach would be to:

1. Find each player's first login date using a subquery
2. For each player, check if there exists a login exactly one day after their first login
3. Count how many players satisfy this condition
4. Divide by total number of distinct players

The brute force SQL might look like:

```sql
-- This is inefficient but demonstrates the logic
SELECT
    COUNT(DISTINCT CASE
        WHEN EXISTS (
            SELECT 1
            FROM Activity a2
            WHERE a2.player_id = a1.player_id
            AND a2.event_date = DATE_ADD(
                (SELECT MIN(event_date)
                 FROM Activity a3
                 WHERE a3.player_id = a1.player_id),
                INTERVAL 1 DAY
            )
        ) THEN a1.player_id
    END) * 1.0 / COUNT(DISTINCT a1.player_id) AS fraction
FROM Activity a1;
```

**Why this is inefficient:**

- Multiple nested subqueries for each player
- No reuse of computed first login dates
- Potentially O(n²) complexity for large datasets
- The innermost query runs for every row in the outer query

## Optimized Approach

The key insight is that we need to:

1. **Efficiently find first login dates** for all players using window functions or grouping
2. **Check consecutive logins** by joining or using conditional logic
3. **Compute the ratio** accurately, handling division by zero

**Step-by-step reasoning:**

1. First, identify each player's first login date. We can use `MIN()` with `GROUP BY player_id` or `FIRST_VALUE()` window function.
2. Next, for each player, check if they have a login exactly one day after their first login. We can do this by:
   - Option A: Join the Activity table with the first login dates and check for existence
   - Option B: Use conditional aggregation with a CASE statement
3. Finally, compute the fraction by dividing the count of players with consecutive logins by the total distinct players.

The most efficient approach uses:

- A CTE (Common Table Expression) or subquery to get first login dates
- A LEFT JOIN or EXISTS to check for next-day logins
- Precise division with proper type casting to get a decimal result

## Optimal Solution

Here's the complete, optimized solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n log n) for sorting/grouping | Space: O(n) for intermediate results
WITH FirstLogin AS (
    -- Step 1: Find each player's first login date
    -- Using MIN() with GROUP BY is efficient and clear
    SELECT
        player_id,
        MIN(event_date) AS first_login
    FROM Activity
    GROUP BY player_id
)
SELECT
    -- Step 3: Calculate the fraction
    -- Use ROUND() to format as requested, CAST to ensure decimal division
    ROUND(
        COUNT(DISTINCT a.player_id) * 1.0 /
        (SELECT COUNT(DISTINCT player_id) FROM Activity),
        2
    ) AS fraction
FROM Activity a
-- Step 2: Join with FirstLogin to check for next-day login
INNER JOIN FirstLogin fl ON a.player_id = fl.player_id
-- Check if this login is exactly one day after the first login
WHERE a.event_date = DATE_ADD(fl.first_login, INTERVAL 1 DAY);
```

```sql
-- Alternative solution using EXISTS (often more efficient for large datasets)
-- Time: O(n log n) | Space: O(n)
WITH FirstLogin AS (
    SELECT
        player_id,
        MIN(event_date) AS first_login
    FROM Activity
    GROUP BY player_id
)
SELECT
    ROUND(
        -- Count players who have a login the day after their first login
        COUNT(DISTINCT fl.player_id) * 1.0 /
        (SELECT COUNT(DISTINCT player_id) FROM Activity),
        2
    ) AS fraction
FROM FirstLogin fl
-- EXISTS is efficient because it stops searching when a match is found
WHERE EXISTS (
    SELECT 1
    FROM Activity a
    WHERE a.player_id = fl.player_id
    AND a.event_date = DATE_ADD(fl.first_login, INTERVAL 1 DAY)
);
```

</div>

**Code Explanation:**

1. **FirstLogin CTE**: This identifies the earliest login date for each player using `MIN(event_date)` with `GROUP BY player_id`. The CTE makes the query more readable and reusable.

2. **Main Query Logic**:
   - The `INNER JOIN` version joins the Activity table with first login dates, filtering for logins that occur exactly one day after the first login.
   - The `EXISTS` version checks for existence of such logins, which can be more efficient as it stops searching once a match is found.
   - `DATE_ADD(fl.first_login, INTERVAL 1 DAY)` calculates the date exactly one day after the first login.

3. **Fraction Calculation**:
   - `COUNT(DISTINCT a.player_id)` counts unique players with consecutive logins.
   - Multiplying by `1.0` ensures decimal division (not integer division).
   - The denominator is the total distinct players from the Activity table.
   - `ROUND(..., 2)` formats the result to 2 decimal places as typically required.

## Complexity Analysis

**Time Complexity: O(n log n)**

- Finding first login dates requires grouping/sorting: O(n log n)
- Joining or checking existence: O(n) with proper indexing
- Overall dominated by the grouping operation

**Space Complexity: O(n)**

- Storing the FirstLogin CTE: O(k) where k is number of players
- Intermediate join results: O(m) where m is number of matching rows
- In worst case, could be O(n) if all players have consecutive logins

**Index Optimization**: The query benefits greatly from indexes on:

- `(player_id, event_date)` for efficient grouping and date comparisons
- `player_id` alone for the EXISTS subquery

## Common Mistakes

1. **Integer Division**: Forgetting to convert to decimal before division

   ```sql
   -- WRONG: Returns 0 for 2/3
   SELECT COUNT(...) / COUNT(...) AS fraction

   -- CORRECT: Use * 1.0 or CAST
   SELECT COUNT(...) * 1.0 / COUNT(...) AS fraction
   ```

2. **Counting Duplicate Players**: Not using DISTINCT when counting

   ```sql
   -- WRONG: May count same player multiple times
   SELECT COUNT(a.player_id) / ...

   -- CORRECT: Count distinct players
   SELECT COUNT(DISTINCT a.player_id) / ...
   ```

3. **Incorrect Date Arithmetic**: Using wrong date functions

   ```sql
   -- WRONG in some SQL dialects
   WHERE a.event_date = fl.first_login + 1

   -- CORRECT: Use DATE_ADD or equivalent
   WHERE a.event_date = DATE_ADD(fl.first_login, INTERVAL 1 DAY)
   ```

4. **Handling Players with No Activity**: The denominator should be all players, not just those with consecutive logins

   ```sql
   -- WRONG: Denominator only counts players with consecutive logins
   SELECT COUNT(...) / COUNT(DISTINCT fl.player_id)

   -- CORRECT: Denominator counts all players
   SELECT COUNT(...) / (SELECT COUNT(DISTINCT player_id) FROM Activity)
   ```

## When You'll See This Pattern

This problem combines several important SQL patterns:

1. **Time-Series Analysis**: Similar to problems where you need to find consecutive events
   - _Human Traffic of Stadium_: Find consecutive days with high traffic
   - _Consecutive Available Seats_: Find consecutive available seats

2. **Player/User Behavior Analysis**: Common in gaming and app analytics
   - _Game Play Analysis III_: Cumulative sum of games played
   - _Game Play Analysis V_: More complex retention analysis

3. **Window Function Applications**: While this solution uses GROUP BY, window functions like `FIRST_VALUE()` or `ROW_NUMBER()` could also solve it
   - _Department Top Three Salaries_: Ranking within groups
   - _Nth Highest Salary_: Using window functions for ranking

The core pattern is: "For each entity, find the first/last event, then check for related subsequent events."

## Key Takeaways

1. **CTEs Improve Readability**: Use Common Table Expressions to break complex queries into logical steps. They make your SQL more maintainable and easier to debug.

2. **Date Arithmetic Requires Care**: Different SQL dialects have different date functions. Know your platform's date functions (DATE_ADD in MySQL, DATEADD in SQL Server, + INTERVAL in PostgreSQL).

3. **Always Test Edge Cases**:
   - Single login players (should not count as consecutive)
   - Multiple logins on first day (still only one first login)
   - Logins exactly two days after (should not count)
   - Players with no activity (though not possible given table constraints)

4. **Performance Matters**: For large datasets, EXISTS is often faster than JOIN because it can short-circuit. Indexes on player_id and event_date are crucial.

Related problems: [Game Play Analysis III](/problem/game-play-analysis-iii), [Game Play Analysis V](/problem/game-play-analysis-v)
