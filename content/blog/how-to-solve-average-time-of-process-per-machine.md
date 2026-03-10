---
title: "How to Solve Average Time of Process per Machine — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Average Time of Process per Machine. Easy difficulty, 66.9% acceptance rate. Topics: Database."
date: "2027-01-03"
category: "dsa-patterns"
tags: ["average-time-of-process-per-machine", "database", "easy"]
---

# How to Solve Average Time of Process per Machine

This problem asks us to calculate the average processing time for each machine in a manufacturing system. The tricky part is that processing time isn't directly stored in the table - we need to calculate it by finding the difference between "end" and "start" timestamps for each process on each machine, then average those differences per machine. This is a classic SQL self-join problem that tests your ability to work with time intervals and aggregate data.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this data:

| machine_id | process_id | activity_type | timestamp |
| ---------- | ---------- | ------------- | --------- |
| 0          | 0          | start         | 0.712     |
| 0          | 0          | end           | 1.520     |
| 0          | 1          | start         | 3.140     |
| 0          | 1          | end           | 4.120     |
| 1          | 0          | start         | 0.550     |
| 1          | 0          | end           | 1.550     |
| 1          | 1          | start         | 0.430     |
| 1          | 1          | end           | 1.420     |
| 1          | 2          | start         | 4.100     |
| 1          | 2          | end           | 4.512     |

**Step-by-step calculation:**

For machine 0:

- Process 0: 1.520 - 0.712 = 0.808
- Process 1: 4.120 - 3.140 = 0.980
- Total processing time: 0.808 + 0.980 = 1.788
- Number of processes: 2
- Average: 1.788 / 2 = 0.894

For machine 1:

- Process 0: 1.550 - 0.550 = 1.000
- Process 1: 1.420 - 0.430 = 0.990
- Process 2: 4.512 - 4.100 = 0.412
- Total processing time: 1.000 + 0.990 + 0.412 = 2.402
- Number of processes: 3
- Average: 2.402 / 3 = 0.800666...

The key insight is that for each process on each machine, we need to pair the "start" and "end" records to calculate the processing time.

## Brute Force Approach

A naive approach might try to calculate processing times by scanning the table multiple times. For each machine-process combination, you could:

1. Find the start timestamp
2. Find the end timestamp
3. Calculate the difference
4. Accumulate these differences per machine

In SQL, this could be done with correlated subqueries:

```sql
SELECT
    machine_id,
    AVG(processing_time) as processing_time
FROM (
    SELECT
        machine_id,
        process_id,
        (SELECT timestamp FROM Activity a2
         WHERE a2.machine_id = a1.machine_id
         AND a2.process_id = a1.process_id
         AND a2.activity_type = 'end') -
        (SELECT timestamp FROM Activity a2
         WHERE a2.machine_id = a1.machine_id
         AND a2.process_id = a1.process_id
         AND a2.activity_type = 'start') as processing_time
    FROM Activity a1
    WHERE a1.activity_type = 'start'
) as process_times
GROUP BY machine_id;
```

**Why this is inefficient:**

- Correlated subqueries execute for each row in the outer query, leading to O(n²) performance
- Each process requires two separate subquery lookups
- The database has to scan the table multiple times
- For large datasets, this approach becomes prohibitively slow

## Optimal Solution

The optimal solution uses a self-join to pair start and end records in a single query. We join the table with itself, matching start records with their corresponding end records based on machine_id and process_id. Then we calculate the time difference and average it per machine.

<div class="code-group">

```sql
-- Time: O(n) | Space: O(n) for intermediate result
SELECT
    -- Select machine_id for grouping
    start_activity.machine_id,

    -- Calculate average processing time, rounded to 3 decimal places
    -- We use ROUND() to match the expected output format
    ROUND(
        -- Average of (end_time - start_time) for each process
        AVG(end_activity.timestamp - start_activity.timestamp),
        3
    ) AS processing_time

FROM
    -- Self-join: match start records with their corresponding end records
    Activity AS start_activity

    -- Join on machine_id and process_id to pair start and end of same process
    INNER JOIN Activity AS end_activity
        ON start_activity.machine_id = end_activity.machine_id
        AND start_activity.process_id = end_activity.process_id

WHERE
    -- Filter to get only start records from the left table
    start_activity.activity_type = 'start'

    -- Filter to get only end records from the right table
    AND end_activity.activity_type = 'end'

-- Group by machine_id to calculate average per machine
GROUP BY start_activity.machine_id

-- Optional: Order by machine_id for consistent output
ORDER BY start_activity.machine_id;
```

```sql
-- Alternative approach using CASE statements
-- Time: O(n) | Space: O(n)
SELECT
    machine_id,
    ROUND(
        AVG(
            -- Use CASE to subtract end from start directly
            CASE
                WHEN activity_type = 'end' THEN timestamp
                ELSE -timestamp
            END
        ),
        3
    ) AS processing_time
FROM Activity
GROUP BY machine_id, process_id
HAVING COUNT(*) = 2  -- Ensure we have both start and end
ORDER BY machine_id;
```

</div>

**Key steps explained:**

1. **Self-join setup**: We create two aliases of the same table - `start_activity` for start records and `end_activity` for end records.

2. **Join conditions**: We join on both `machine_id` AND `process_id` to ensure we're pairing the start and end of the exact same process on the same machine.

3. **Filtering**: The WHERE clause filters `start_activity` to only include 'start' records and `end_activity` to only include 'end' records.

4. **Time calculation**: For each matched pair, we calculate `end.timestamp - start.timestamp` to get the processing time.

5. **Aggregation**: We GROUP BY `machine_id` and use AVG() to calculate the average processing time per machine.

6. **Formatting**: ROUND() with 3 decimal places ensures our output matches the expected format.

## Complexity Analysis

**Time Complexity: O(n)**

- The self-join operation is essentially matching each start record with its corresponding end record
- With proper indexing on (machine_id, process_id, activity_type), this can be very efficient
- The GROUP BY and AVG operations are linear relative to the number of matched pairs

**Space Complexity: O(n)**

- The intermediate result of the self-join creates a temporary table with one row per process
- This is necessary to calculate the time differences before aggregation
- The final output only has one row per machine, so output space is O(k) where k is number of machines

## Common Mistakes

1. **Forgetting to round the result**: The problem expects the average rounded to 3 decimal places. Without ROUND(), you might get more decimal places than expected and fail test cases.

2. **Incorrect join conditions**: Joining only on `machine_id` without `process_id` would pair wrong start and end records, giving incorrect processing times.

3. **Missing WHERE clause filters**: If you don't filter `activity_type` in the WHERE clause, you'll get Cartesian products and incorrect calculations.

4. **Using wrong aggregation**: Some candidates try to calculate the average by dividing sum by count manually, but SQL's AVG() function handles this correctly and is more readable.

5. **Not handling missing data**: While the problem guarantees each process has both start and end, in real interviews you should mention that you'd need to handle cases where a process might be missing either record.

## When You'll See This Pattern

This self-join pattern appears frequently in SQL problems involving time intervals or paired events:

1. **"Human Traffic of Stadium" (LeetCode 601)**: Similar pattern of finding consecutive records where you need to compare rows with each other.

2. **"Exchange Seats" (LeetCode 626)**: Requires pairing adjacent rows to swap values, using a similar self-join approach.

3. **"Consecutive Numbers" (LeetCode 180)**: Finding consecutive records where values match, often solved with self-joins or window functions.

4. **Employee-manager hierarchies**: When you need to join an employee table with itself to find managers of managers.

The core pattern is: when you need to compare or combine data from different rows of the same table based on relationships between those rows, self-joins are often the solution.

## Key Takeaways

1. **Self-joins solve pairing problems**: When you need to match related records within the same table (like start/end pairs, parent/child relationships, or consecutive records), self-joins are your go-to tool.

2. **Always verify join conditions**: With self-joins, it's crucial to specify all necessary conditions in the ON clause to avoid incorrect pairings. Test with edge cases to ensure correctness.

3. **Consider window functions as alternatives**: For newer SQL versions, window functions like LAG() or LEAD() can sometimes solve these problems more elegantly, but self-joins work in all SQL versions and are important to understand.

4. **Think in terms of relationships**: When approaching SQL problems, ask yourself: "What relationships exist between rows in this table?" If rows need to be compared or combined with other rows in the same table, consider a self-join.

[Practice this problem on CodeJeet](/problem/average-time-of-process-per-machine)
