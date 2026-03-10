---
title: "How to Solve Find Total Time Spent by Each Employee — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Total Time Spent by Each Employee. Easy difficulty, 86.4% acceptance rate. Topics: Database."
date: "2028-08-14"
category: "dsa-patterns"
tags: ["find-total-time-spent-by-each-employee", "database", "easy"]
---

# How to Solve "Find Total Time Spent by Each Employee"

This problem asks us to calculate the total time each employee spends at work each day. Given a table with clock-in and clock-out times, we need to sum the duration for each employee-day combination. While conceptually straightforward, this problem tests your understanding of basic SQL aggregation, grouping, and date arithmetic—skills essential for any data analysis role.

What makes this interesting is that it's a practical, real-world problem disguised as a simple SQL query. You're not just calculating numbers; you're modeling actual employee attendance tracking. The "tricky" part comes from ensuring you handle the grouping correctly and calculate time differences accurately.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose our `Employees` table contains:

| emp_id | event_day  | in_time | out_time |
| ------ | ---------- | ------- | -------- |
| 1      | 2023-10-01 | 9       | 17       |
| 1      | 2023-10-01 | 13      | 14       |
| 2      | 2023-10-01 | 10      | 15       |
| 1      | 2023-10-02 | 8       | 12       |

**Step 1: Understand the data structure**

- Each row represents a single work session (an employee might have multiple sessions per day)
- `in_time` and `out_time` are integers representing hours (e.g., 9 = 9:00 AM, 17 = 5:00 PM)
- The primary key ensures no duplicate sessions for the same employee on the same day at the same in_time

**Step 2: Calculate time per session**
For each row, we need to compute: `out_time - in_time`

- Row 1: 17 - 9 = 8 hours
- Row 2: 14 - 13 = 1 hour
- Row 3: 15 - 10 = 5 hours
- Row 4: 12 - 8 = 4 hours

**Step 3: Group by employee and day**
We need to sum sessions for each employee-day combination:

- Employee 1, 2023-10-01: 8 + 1 = 9 hours
- Employee 2, 2023-10-01: 5 hours
- Employee 1, 2023-10-02: 4 hours

**Step 4: Format the output**
The result should have columns: `day`, `emp_id`, `total_time`:

- 2023-10-01, 1, 9
- 2023-10-01, 2, 5
- 2023-10-02, 1, 4

## Brute Force Approach

For SQL problems, the "brute force" approach would be to manually process each row without using SQL's aggregation capabilities. While you wouldn't actually write this in SQL, a naive candidate might think about:

1. Selecting all rows without grouping
2. Calculating time spent for each row individually
3. Trying to sum them manually or with procedural code

The problem with this thinking is that it misses SQL's core strength: set-based operations. SQL is designed to handle this exact type of aggregation efficiently. The "brute force" in SQL terms would be writing inefficient queries like using correlated subqueries for each employee-day combination, which would have O(n²) complexity instead of the optimal O(n).

## Optimal Solution

The optimal solution uses SQL's `GROUP BY` clause to aggregate data by employee and day, then calculates the sum of time differences for each group. This is efficient because databases are optimized for these types of aggregations.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(m) where m is number of unique employee-day pairs
SELECT
    event_day AS day,           -- Rename event_day to day for output format
    emp_id,                     -- Include employee ID in results
    SUM(out_time - in_time) AS total_time  -- Calculate total time for each group
FROM
    Employees                   -- From the Employees table
GROUP BY
    event_day, emp_id           -- Group by both day and employee
ORDER BY
    event_day, emp_id;          -- Optional: sort for consistent output
```

</div>

**Line-by-line explanation:**

1. **`SELECT event_day AS day`**: We select the event_day column and rename it to 'day' as specified in the output format. The `AS` keyword creates an alias.

2. **`emp_id`**: We include the employee ID in our selection so we can identify which employee the total time belongs to.

3. **`SUM(out_time - in_time) AS total_time`**: This is the core calculation. For each row in a group, we compute `out_time - in_time` to get the duration of that work session. The `SUM()` function then adds up all these durations within each group. We alias this sum as 'total_time'.

4. **`FROM Employees`**: Specifies the table we're querying from.

5. **`GROUP BY event_day, emp_id`**: This tells SQL to group rows that have the same combination of event_day and emp_id. All rows for employee 1 on 2023-10-01 will be in one group, all rows for employee 1 on 2023-10-02 in another, etc. The aggregation functions (like `SUM`) will operate on each group separately.

6. **`ORDER BY event_day, emp_id`**: While not strictly required by the problem, ordering the results makes them more readable and is good practice. We order by day first, then by employee ID within each day.

## Complexity Analysis

**Time Complexity: O(n)**

- The database needs to scan through all `n` rows in the Employees table once
- For each row, it computes `out_time - in_time` (O(1) per row)
- The grouping operation is typically implemented using hashing or sorting, but modern databases optimize this efficiently
- The dominant factor is the single pass through the table, giving us linear time complexity

**Space Complexity: O(m) where m = number of unique employee-day pairs**

- The database needs to maintain aggregation state for each unique group
- In the worst case, if every row has a unique employee-day combination, m = n
- In practice, m is usually much smaller than n since employees typically work multiple sessions per day

## Common Mistakes

1. **Forgetting to group by both columns**: A common error is writing `GROUP BY emp_id` only, which would sum all time for each employee across all days into a single total. You must group by both `event_day` and `emp_id` to get daily totals.

2. **Incorrect column order in GROUP BY**: While `GROUP BY emp_id, event_day` would technically work (the grouping would be the same), it's better to follow the logical order of day then employee, as this often aligns with how the data is indexed and can improve performance.

3. **Using AVG instead of SUM**: Some candidates mistakenly calculate average time instead of total time. Read the problem carefully: "total time spent" means sum, not average.

4. **Not handling NULL values**: While not an issue in this problem (the primary key ensures in_time is not NULL), in real-world scenarios you should consider what happens if `out_time` is NULL (employee forgot to clock out). A robust solution might use `COALESCE(out_time, in_time)` or similar to handle edge cases.

5. **Missing the column alias**: The problem specifies the output columns should be `day`, `emp_id`, and `total_time`. Forgetting to use `AS day` and `AS total_time` would result in column names that don't match the expected output format.

## When You'll See This Pattern

This problem uses the **aggregation with grouping** pattern, which is fundamental to SQL and appears in many database problems:

1. **LeetCode 1173: "Immediate Food Delivery I"** - Similar grouping and aggregation, but with conditional logic using `CASE` statements or `IF` functions.

2. **LeetCode 1141: "User Activity for the Past 30 Days"** - Groups by day and counts activities, requiring date filtering and aggregation.

3. **LeetCode 1084: "Sales Analysis III"** - Multiple aggregations with grouping and filtering using `HAVING` clause.

4. **LeetCode 1693: "Daily Leads and Partners"** - Exactly the same pattern: group by date and another column, then count distinct values.

The core pattern is: when you need to compute statistics (sum, count, average, etc.) for different categories in your data, think `GROUP BY`. The categories become your grouping columns, and the statistics become your aggregation functions.

## Key Takeaways

1. **GROUP BY is for categorization**: Whenever you need to analyze data by categories (employee, day, department, etc.), `GROUP BY` is your tool. The grouping columns define the categories, and aggregation functions compute statistics for each category.

2. **Choose the right aggregation function**: `SUM()` adds values, `COUNT()` counts rows, `AVG()` computes averages, `MIN()`/`MAX()` find extremes. For this problem, since we want "total time," we need `SUM()` of individual time differences.

3. **Real-world SQL problems model real scenarios**: This isn't abstract algorithm design—it's practical data analysis. Think about what the data represents (employee work sessions) and what business question you're answering (how much time did each employee work each day).

[Practice this problem on CodeJeet](/problem/find-total-time-spent-by-each-employee)
