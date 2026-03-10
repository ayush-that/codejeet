---
title: "How to Solve Restaurant Growth — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Restaurant Growth. Medium difficulty, 58.2% acceptance rate. Topics: Database."
date: "2028-05-23"
category: "dsa-patterns"
tags: ["restaurant-growth", "database", "medium"]
---

# How to Solve Restaurant Growth

This problem asks us to calculate the moving average revenue for a restaurant over a 7-day window for each day where we have at least 7 days of prior data. The tricky part is that we need to handle multiple transactions per day, calculate cumulative sums efficiently, and ensure we only include days where we have a full 7-day window.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have this data:

```
visited_on    amount
2023-01-01    100
2023-01-01    50      (same day, different transaction)
2023-01-02    200
2023-01-03    150
2023-01-04    300
2023-01-05    250
2023-01-06    100
2023-01-07    200
2023-01-08    150
```

First, we need to aggregate by day since there can be multiple transactions per day:

```
Day         Total Amount
2023-01-01  150  (100 + 50)
2023-01-02  200
2023-01-03  150
2023-01-04  300
2023-01-05  250
2023-01-06  100
2023-01-07  200
2023-01-08  150
```

Now for the 7-day moving average:

- For 2023-01-07: Sum of days 2023-01-01 through 2023-01-07 = 150+200+150+300+250+100+200 = 1350, average = 1350/7 = 192.86
- For 2023-01-08: Sum of days 2023-01-02 through 2023-01-08 = 200+150+300+250+100+200+150 = 1350, average = 1350/7 = 192.86

Notice that 2023-01-01 through 2023-01-06 don't have 7 days of prior data, so we don't include them in the result.

## Brute Force Approach

A naive approach would be to:

1. Aggregate amounts by date
2. For each date in the result, check if there are at least 6 previous days
3. If yes, sum the amounts for that date and the previous 6 days
4. Calculate the average

The SQL might look like this:

```sql
SELECT
    c1.visited_on,
    SUM(c2.amount) AS amount,
    ROUND(SUM(c2.amount)/7, 2) AS average_amount
FROM (
    SELECT visited_on, SUM(amount) AS amount
    FROM Customer
    GROUP BY visited_on
) c1
JOIN (
    SELECT visited_on, SUM(amount) AS amount
    FROM Customer
    GROUP BY visited_on
) c2
ON c2.visited_on BETWEEN DATE_SUB(c1.visited_on, INTERVAL 6 DAY) AND c1.visited_on
GROUP BY c1.visited_on
HAVING COUNT(DISTINCT c2.visited_on) = 7
ORDER BY c1.visited_on;
```

This approach has several problems:

1. It performs a self-join that can be expensive with large datasets
2. The `BETWEEN` condition with `DATE_SUB` needs to be evaluated for every pair of dates
3. The `HAVING COUNT(DISTINCT c2.visited_on) = 7` check requires counting distinct dates for each window
4. Performance degrades quadratically with more data

## Optimized Approach

The key insight is that we can use a **window function with a rolling sum** to efficiently calculate the 7-day totals. Here's the step-by-step reasoning:

1. **First, aggregate by date**: Since there can be multiple transactions per day, we need to sum all amounts for each day first.

2. **Use a window function for cumulative sum**: We can use `SUM() OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` to get the sum of the current day plus the previous 6 days. This is much more efficient than joining or subqueries.

3. **Filter for complete windows**: We only want dates where we have a full 7-day window. We can use `ROW_NUMBER()` or check the minimum date to ensure we have at least 7 days of data.

4. **Calculate the average**: Once we have the 7-day sum, we divide by 7 to get the average.

The window function approach is optimal because:

- It processes the data in a single pass
- The rolling window calculation is built into SQL and highly optimized
- We avoid expensive joins and multiple subqueries

## Optimal Solution

Here's the complete, optimized solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, O(n) for window functions | Space: O(n) for intermediate results
SELECT
    visited_on,
    amount,
    ROUND(average_amount, 2) AS average_amount
FROM (
    SELECT
        visited_on,
        -- Calculate the sum of amounts for the current day and previous 6 days
        -- This gives us the 7-day total revenue
        SUM(amount) OVER (
            ORDER BY visited_on
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS amount,
        -- Calculate the 7-day average by dividing the sum by 7
        -- We use AVG() which automatically handles the division
        AVG(amount) OVER (
            ORDER BY visited_on
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS average_amount,
        -- We need to ensure we only include rows with a full 7-day window
        -- ROW_NUMBER helps us identify which rows have enough preceding days
        ROW_NUMBER() OVER (ORDER BY visited_on) AS rn
    FROM (
        -- First, aggregate amounts by date since there can be multiple transactions per day
        SELECT
            visited_on,
            SUM(amount) AS amount
        FROM Customer
        GROUP BY visited_on
    ) daily_totals
) window_calculations
-- Filter: Only include rows where we have at least 7 days of data (rn >= 7)
-- This ensures we only show dates with a complete 7-day window
WHERE rn >= 7
ORDER BY visited_on;
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The `GROUP BY visited_on` requires sorting the data by date, which is O(n log n) where n is the number of rows
- The window functions process the data in O(n) time after sorting
- Overall dominated by the sorting operation

**Space Complexity: O(n)**

- We need to store the intermediate results of the daily aggregates
- The window functions may use additional memory for maintaining the sliding window
- In practice, most databases can stream this efficiently

## Common Mistakes

1. **Forgetting to aggregate by date first**: The most common mistake is not realizing there can be multiple transactions per day. If you don't sum amounts by date first, your 7-day window calculations will be incorrect because you might have different numbers of rows per day.

2. **Incorrect window frame specification**: Using `RANGE BETWEEN INTERVAL 6 DAY PRECEDING AND CURRENT ROW` instead of `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`. The `RANGE` version looks at actual date ranges and can be slower, while `ROWS` is simpler and works correctly since we've already aggregated by date.

3. **Wrong filtering for complete windows**: Some candidates try to filter by checking if `MIN(visited_on) OVER () <= DATE_SUB(visited_on, INTERVAL 6 DAY)`. The `ROW_NUMBER()` approach is cleaner and more efficient.

4. **Not rounding the average correctly**: The problem specifies rounding to 2 decimal places. Forgetting the `ROUND()` function or rounding to the wrong precision will give incorrect results.

## When You'll See This Pattern

This sliding window pattern appears in many time-series analysis problems:

1. **LeetCode 1070 - Product Sales Analysis III**: Similar concept of analyzing sales over time with window functions.

2. **LeetCode 1321 - Restaurant Growth**: This is the exact same problem pattern.

3. **LeetCode 185 - Department Top Three Salaries**: Uses window functions with ranking, similar to how we use them for aggregation here.

4. **Any moving average problem**: Stock price analysis, website traffic analysis, sensor data processing - anytime you need to calculate metrics over a rolling time window.

The core technique is using SQL window functions with frame specifications to efficiently calculate rolling aggregates without expensive self-joins.

## Key Takeaways

1. **Window functions are powerful for time-series analysis**: When you need to calculate moving averages, running totals, or other metrics over sliding windows, window functions with `ROWS BETWEEN` or `RANGE BETWEEN` clauses are your best tool.

2. **Always check for data aggregation needs**: Before applying window functions, check if you need to aggregate data first (like summing amounts by day). Multiple transactions per time unit is a common twist.

3. **Filter complete windows carefully**: When calculating N-day moving averages, you need to exclude days without a full N-day history. Using `ROW_NUMBER()` is an elegant way to do this filtering.

[Practice this problem on CodeJeet](/problem/restaurant-growth)
