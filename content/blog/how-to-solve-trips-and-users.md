---
title: "How to Solve Trips and Users — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Trips and Users. Hard difficulty, 37.7% acceptance rate. Topics: Database."
date: "2028-02-07"
category: "dsa-patterns"
tags: ["trips-and-users", "database", "hard"]
---

# How to Solve Trips and Users

This problem asks us to calculate the daily cancellation rate for trips during a specific date range, excluding trips involving banned users. The tricky part is that we need to join multiple tables, filter by multiple conditions, handle date ranges, and calculate percentages—all while dealing with the nuance that a "cancelled" trip can be cancelled by either the client or driver. This is a classic SQL problem that tests your ability to write complex queries with proper joins, filtering, and aggregation.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have these tables:

**Trips:**

```
id | client_id | driver_id | city_id | status      | request_at
1  | 1         | 10        | 1       | completed   | 2013-10-01
2  | 2         | 11        | 1       | cancelled_by_driver | 2013-10-01
3  | 3         | 12        | 6       | cancelled_by_client | 2013-10-01
4  | 1         | 10        | 1       | completed   | 2013-10-02
5  | 2         | 13        | 6       | cancelled_by_driver | 2013-10-02
6  | 3         | 10        | 6       | completed   | 2013-10-03
```

**Users:**

```
users_id | banned | role
1        | No     | client
2        | Yes    | client
3        | No     | client
10       | No     | driver
11       | Yes    | driver
12       | No     | driver
13       | No     | driver
```

**Date range:** '2013-10-01' to '2013-10-03'

Here's how we think through it step by step:

1. **Filter out banned users**: We need to exclude any trip where either the client OR driver is banned. Looking at our data:
   - Trip 1: Client 1 (not banned), Driver 10 (not banned) → KEEP
   - Trip 2: Client 2 (banned), Driver 11 (banned) → EXCLUDE (client banned)
   - Trip 3: Client 3 (not banned), Driver 12 (not banned) → KEEP
   - Trip 4: Client 1 (not banned), Driver 10 (not banned) → KEEP
   - Trip 5: Client 2 (banned), Driver 13 (not banned) → EXCLUDE (client banned)
   - Trip 6: Client 3 (not banned), Driver 10 (not banned) → KEEP

2. **Filter by date range**: All trips are within '2013-10-01' to '2013-10-03', so all remaining trips stay.

3. **Group by date and calculate cancellation rate**:
   - 2013-10-01: Trips 1 and 3. Trip 1 completed, Trip 3 cancelled. Cancellation rate = 1/2 = 0.50
   - 2013-10-02: Only Trip 4 (completed). Cancellation rate = 0/1 = 0.00
   - 2013-10-03: Only Trip 6 (completed). Cancellation rate = 0/1 = 0.00

The final output should be:

```
Day        | Cancellation Rate
2013-10-01 | 0.50
2013-10-02 | 0.00
2013-10-03 | 0.00
```

## Brute Force Approach

A naive approach might try to solve this in multiple separate queries or with suboptimal joins:

1. First, get all trips in the date range
2. For each trip, check if client is banned by querying the Users table
3. For each trip, check if driver is banned by querying the Users table again
4. Manually filter out trips with banned users
5. Group remaining trips by date and calculate cancellation rates

This approach would require multiple passes through the data and potentially O(n²) operations if done incorrectly. The biggest issue is that checking each trip's client and driver status separately would be extremely inefficient, especially with large datasets. Each trip would require two separate lookups in the Users table, leading to poor performance.

## Optimized Approach

The key insight is that we need to **join the Trips table with the Users table twice**—once for clients and once for drivers—to check their banned status efficiently in a single query. Here's the step-by-step reasoning:

1. **Join Trips with Users for clients**: We need to check if the client is banned, so we join `Trips.client_id = Users.users_id` and `Users.role = 'client'`.

2. **Join Trips with Users for drivers**: Similarly, we need to check if the driver is banned, so we join `Trips.driver_id = Users.users_id` and `Users.role = 'driver'`.

3. **Filter conditions**: We need to filter trips where:
   - `request_at` is between '2013-10-01' and '2013-10-03'
   - Client is not banned (`client_banned = 'No'`)
   - Driver is not banned (`driver_banned = 'No'`)

4. **Group and calculate**: After filtering, we group by `request_at` (which we'll alias as `Day`) and calculate:
   - Total trips per day: `COUNT(*)`
   - Cancelled trips per day: `SUM(CASE WHEN status LIKE 'cancelled%' THEN 1 ELSE 0 END)`
   - Cancellation rate: `cancelled_trips / total_trips` rounded to 2 decimal places

The critical optimization is using proper JOINs instead of subqueries for each trip, which allows the database to efficiently filter trips with banned users in a single pass.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n) where n is number of trips | Space: O(m) where m is number of valid trips after filtering
SELECT
    -- Step 1: Select the request date as 'Day'
    t.request_at AS Day,

    -- Step 2: Calculate cancellation rate rounded to 2 decimal places
    -- We use ROUND() to format the output as required
    -- The cancellation rate is: (cancelled trips) / (total trips)
    -- We use CASE to identify cancelled trips (both client and driver cancellations)
    ROUND(
        SUM(
            CASE
                -- Step 3: Identify cancelled trips
                -- Both 'cancelled_by_driver' and 'cancelled_by_client' count as cancellations
                WHEN t.status LIKE 'cancelled%' THEN 1
                ELSE 0
            END
        ) / COUNT(*),
        2
    ) AS 'Cancellation Rate'

FROM
    -- Step 4: Start from the Trips table as our base
    Trips t

    -- Step 5: First join with Users table to check client status
    -- We need to ensure the client is not banned
    INNER JOIN Users u1 ON
        t.client_id = u1.users_id AND
        u1.role = 'client' AND
        u1.banned = 'No'

    -- Step 6: Second join with Users table to check driver status
    -- We need to ensure the driver is not banned
    INNER JOIN Users u2 ON
        t.driver_id = u2.users_id AND
        u2.role = 'driver' AND
        u2.banned = 'No'

WHERE
    -- Step 7: Filter by the specified date range
    -- Using BETWEEN is clearer than separate >= and <= conditions
    t.request_at BETWEEN '2013-10-01' AND '2013-10-03'

    -- Note: We don't need to check banned status in WHERE clause
    -- because the INNER JOIN already filters out banned users

-- Step 8: Group by date to calculate daily statistics
GROUP BY t.request_at

-- Step 9: Order by date for chronological output
ORDER BY t.request_at;
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where n is the number of trips and m is the number of users. In practice, with proper indexing, this becomes approximately O(n) since we need to process each trip once. The joins are efficient because they're based on primary/foreign key relationships.

**Space Complexity:** O(k) where k is the number of trips that pass all filters (date range and not involving banned users). The database needs to store the intermediate result set before grouping.

The key factors affecting performance:

1. Number of trips in the date range
2. Efficiency of joins (indexes on `users_id`, `client_id`, `driver_id` help)
3. Size of the Users table for banned status checks

## Common Mistakes

1. **Forgetting to check both client AND driver banned status**: Some candidates only check if the client is banned, forgetting that trips with banned drivers should also be excluded. Remember: a trip involves two users (client and driver), and if either is banned, the trip shouldn't count.

2. **Using OR instead of AND in banned checks**: Incorrect: `WHERE u1.banned = 'No' OR u2.banned = 'No'`. This would include trips where only one user is not banned. Correct: Both must be not banned.

3. **Not handling the date range correctly**: Forgetting to convert dates or using wrong comparison operators. The problem specifies "between" inclusive, so use `BETWEEN` or `>= AND <=`.

4. **Incorrect cancellation detection**: Only checking for exact string match like `status = 'cancelled'` instead of using `LIKE 'cancelled%'` to catch both `'cancelled_by_client'` and `'cancelled_by_driver'`.

5. **Division by zero**: While not an issue with the given constraints, in real scenarios you might need to handle days with no valid trips. You could add `HAVING COUNT(*) > 0` or use `NULLIF()` to avoid division by zero.

## When You'll See This Pattern

This problem combines several important SQL patterns that appear in other LeetCode problems:

1. **Multiple joins to the same table**: Problems where you need to check multiple relationships from a single table. Similar to: "Employees Earning More Than Their Managers" where you join the Employee table to itself.

2. **Conditional aggregation with CASE**: Calculating different metrics based on conditions within groups. Similar to: "Market Analysis I" where you count orders in a specific date range.

3. **Date filtering and grouping**: Daily/weekly/monthly aggregation problems. Similar to: "Game Play Analysis I" where you find each player's first login date.

4. **Complex filtering with multiple conditions**: Problems requiring filtering based on multiple related tables. Similar to: "Human Traffic of Stadium" where you need to find consecutive records meeting certain conditions.

## Key Takeaways

1. **Self-joins for multiple relationships**: When you need to check multiple relationships from the same table (like client and driver both coming from Users), join the table multiple times with different aliases and conditions.

2. **Use CASE for conditional counting**: Instead of writing complex subqueries, use `CASE` inside aggregation functions like `SUM()` or `COUNT()` to conditionally include values in your calculations.

3. **Filter early, calculate late**: Apply all filtering conditions (date range, banned status) before grouping and calculating aggregates. This reduces the amount of data the database needs to process.

4. **Test edge cases**: Always consider days with no trips, all trips cancelled, no cancelled trips, and trips with various banned user combinations.

Related problems: [Hopper Company Queries I](/problem/hopper-company-queries-i), [Hopper Company Queries II](/problem/hopper-company-queries-ii), [Hopper Company Queries III](/problem/hopper-company-queries-iii)
