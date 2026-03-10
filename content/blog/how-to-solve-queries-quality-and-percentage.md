---
title: "How to Solve Queries Quality and Percentage — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Queries Quality and Percentage. Easy difficulty, 52.3% acceptance rate. Topics: Database."
date: "2027-05-12"
category: "dsa-patterns"
tags: ["queries-quality-and-percentage", "database", "easy"]
---

# How to Solve Queries Quality and Percentage

This problem asks us to calculate two metrics for each query name: quality (average rating divided by position) and poor query percentage (percentage of queries with rating less than 3). While the calculations are straightforward, the challenge lies in properly aggregating data, handling potential NULL values, and formatting results correctly. The interesting part is combining multiple aggregate functions with conditional logic in a single query.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this sample data:

| query_name | result           | position | rating |
| ---------- | ---------------- | -------- | ------ |
| Dog        | Golden Retriever | 1        | 5      |
| Dog        | German Shepherd  | 2        | 5      |
| Dog        | Mule             | 200      | 1      |
| Cat        | Shirazi          | 5        | 2      |
| Cat        | Siamese          | 3        | 3      |
| Cat        | Sphynx           | 7        | 4      |

**For "Dog" queries:**

1. Calculate quality: (5/1 + 5/2 + 1/200) / 3 = (5 + 2.5 + 0.005) / 3 = 7.505 / 3 = 2.50167
2. Calculate poor_query_percentage: Only the third query has rating < 3, so 1 out of 3 = 33.33%

**For "Cat" queries:**

1. Calculate quality: (2/5 + 3/3 + 4/7) / 3 = (0.4 + 1 + 0.5714) / 3 = 1.9714 / 3 = 0.65714
2. Calculate poor_query_percentage: First query has rating 2 (< 3), so 1 out of 3 = 33.33%

Our final output should be:
| query_name | quality | poor_query_percentage |
|------------|---------|----------------------|
| Dog | 2.50 | 33.33 |
| Cat | 0.66 | 33.33 |

## Brute Force Approach

A naive approach might involve multiple passes through the data or suboptimal calculations. For example:

1. First, calculate quality by grouping and averaging rating/position
2. Then, calculate poor query percentage separately
3. Finally, join these results together

This approach would work but is inefficient because it requires multiple passes over the data or complex joins. In SQL, we can do everything in a single pass using appropriate aggregate functions.

Here's what the inefficient approach might look like:

```sql
-- Inefficient approach with multiple subqueries
WITH quality_cte AS (
    SELECT query_name, AVG(rating * 1.0 / position) AS quality
    FROM Queries
    GROUP BY query_name
),
poor_cte AS (
    SELECT query_name,
           COUNT(CASE WHEN rating < 3 THEN 1 END) * 100.0 / COUNT(*) AS poor_query_percentage
    FROM Queries
    GROUP BY query_name
)
SELECT q.query_name, q.quality, p.poor_query_percentage
FROM quality_cte q
JOIN poor_cte p ON q.query_name = p.query_name;
```

While this works, it's inefficient because it processes the table twice and requires a join operation.

## Optimal Solution

The optimal solution uses a single pass through the data with conditional aggregation. We calculate both metrics in one GROUP BY query using AVG() for quality and conditional counting for the percentage.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(m) where m is number of unique query_names
SELECT
    query_name,
    -- Calculate quality: average of rating/position for each query_name
    -- Use ROUND() to format to 2 decimal places
    ROUND(AVG(rating * 1.0 / position), 2) AS quality,
    -- Calculate poor query percentage: percentage of queries with rating < 3
    -- Multiply by 100.0 to convert to percentage, then ROUND to 2 decimal places
    ROUND(
        SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
        2
    ) AS poor_query_percentage
FROM
    Queries
-- Filter out rows where query_name is NULL to avoid division by NULL groups
WHERE query_name IS NOT NULL
-- Group by query_name to calculate metrics for each unique query
GROUP BY query_name;
```

```sql
-- Alternative using AVG() with CASE for percentage calculation
-- Time: O(n) where n is number of rows | Space: O(m) where m is number of unique query_names
SELECT
    query_name,
    ROUND(AVG(rating * 1.0 / position), 2) AS quality,
    -- Using AVG() with CASE: when rating < 3, count as 1, else 0
    -- AVG() of 0s and 1s gives the proportion, multiply by 100 for percentage
    ROUND(
        AVG(CASE WHEN rating < 3 THEN 1.0 ELSE 0 END) * 100,
        2
    ) AS poor_query_percentage
FROM
    Queries
WHERE query_name IS NOT NULL
GROUP BY query_name;
```

</div>

**Line-by-line explanation:**

1. **`SELECT query_name`**: We're selecting the query name as our grouping key
2. **`ROUND(AVG(rating * 1.0 / position), 2)`**:
   - `rating * 1.0 / position`: Calculates rating divided by position. Multiplying by 1.0 ensures floating-point division
   - `AVG()`: Takes the average of these values for each group
   - `ROUND(..., 2)`: Rounds the result to 2 decimal places
3. **`ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)`**:
   - `CASE WHEN rating < 3 THEN 1 ELSE 0 END`: Creates a 1 for poor queries (rating < 3), 0 otherwise
   - `SUM()`: Counts how many poor queries in the group
   - `* 100.0 / COUNT(*)`: Converts to percentage (multiply by 100, divide by total count)
   - `ROUND(..., 2)`: Rounds to 2 decimal places
4. **`WHERE query_name IS NOT NULL`**: Filters out rows with NULL query_name to avoid grouping NULL values together
5. **`GROUP BY query_name`**: Groups rows by query_name to calculate metrics per query

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Queries table. The database needs to scan each row once to perform the calculations and grouping.

**Space Complexity:** O(m) where m is the number of distinct query_name values. The database needs to maintain aggregation state for each unique query_name during the GROUP BY operation.

The operations breakdown:

- Scanning the table: O(n)
- Grouping by query_name: O(n) with hash-based grouping
- Aggregate calculations: O(1) per row during aggregation
- Total: O(n) linear time complexity

## Common Mistakes

1. **Integer division**: Forgetting to convert to float before division. In SQL, `rating / position` with integer types performs integer division. Solution: Multiply by 1.0 or use CAST: `rating * 1.0 / position` or `CAST(rating AS FLOAT) / position`.

2. **Not handling NULL query_name**: If query_name can be NULL, these rows will form their own group, which is usually not desired. Solution: Add `WHERE query_name IS NOT NULL` or handle NULL in the SELECT clause.

3. **Incorrect rounding or formatting**: The problem specifies rounding to 2 decimal places. Forgetting ROUND() or using the wrong number of decimal places will fail. Solution: Always use `ROUND(value, 2)`.

4. **Missing GROUP BY clause**: Attempting to use aggregate functions without GROUP BY results in a single row output. Solution: Ensure `GROUP BY query_name` is included when calculating per-query metrics.

5. **Percentage calculation errors**: Calculating percentage as integer division (e.g., `COUNT(CASE WHEN rating < 3 THEN 1 END) * 100 / COUNT(*)`) which gives integer result. Solution: Multiply by `100.0` instead of `100` to force floating-point arithmetic.

## When You'll See This Pattern

This pattern of conditional aggregation with GROUP BY appears frequently in SQL interview problems:

1. **Percentage of Users Attended a Contest (Easy)**: Similar structure - calculate percentages of users from each country attending contests using COUNT() with conditions.

2. **Game Play Analysis (Medium)**: Calculating player retention rates using date comparisons and conditional aggregation.

3. **Customer Placing the Largest Number of Orders (Easy)**: Finding maximum counts with GROUP BY and ORDER BY.

4. **Department Top Three Salaries (Hard)**: More complex conditional aggregation using window functions.

The core pattern is: **GROUP BY + aggregate functions (often with CASE statements) + formatting**. Whenever you need to calculate metrics broken down by categories with conditional logic, this is the approach to use.

## Key Takeaways

1. **Conditional aggregation is powerful**: Use `CASE` statements inside aggregate functions like `SUM()`, `AVG()`, and `COUNT()` to perform calculations based on conditions.

2. **Watch for data type issues**: Integer division in SQL truncates decimal places. Always convert to float when dividing integers if you need decimal results.

3. **Single-pass aggregation**: Most SQL aggregation problems can be solved in a single query with appropriate GROUP BY and aggregate functions, avoiding multiple subqueries or joins.

4. **NULL handling matters**: Consider whether NULL values should be included in calculations and use WHERE clauses or COALESCE() to handle them appropriately.

Related problems: [Percentage of Users Attended a Contest](/problem/percentage-of-users-attended-a-contest)
