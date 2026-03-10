---
title: "How to Solve Reformat Department Table — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reformat Department Table. Easy difficulty, 76.3% acceptance rate. Topics: Database."
date: "2026-04-22"
category: "dsa-patterns"
tags: ["reformat-department-table", "database", "easy"]
---

# How to Solve Reformat Department Table

This is a classic SQL pivot table problem where we need to transform rows into columns. The tricky part is that we have a variable number of months (Jan-Dec) that need to become fixed columns in the output, and we need to handle missing months with NULL values. This requires conditional aggregation with CASE statements or the PIVOT operator.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose our `Department` table contains:

| id  | revenue | month |
| --- | ------- | ----- |
| 1   | 8000    | Jan   |
| 1   | 9000    | Feb   |
| 1   | 10000   | Mar   |
| 2   | 7000    | Jan   |
| 2   | 6000    | Feb   |

We want to transform this into:

| id  | Jan_Revenue | Feb_Revenue | Mar_Revenue | ... | Dec_Revenue |
| --- | ----------- | ----------- | ----------- | --- | ----------- |
| 1   | 8000        | 9000        | 10000       | ... | NULL        |
| 2   | 7000        | 6000        | NULL        | ... | NULL        |

The transformation process:

1. **Group by id**: All rows with the same id will become a single row in the output
2. **For each month column**: We need to extract only the revenue for that specific month
3. **Handle missing months**: If an id has no revenue for a particular month, we need NULL

For id=1:

- Jan_Revenue: Look for month='Jan' → revenue=8000
- Feb_Revenue: Look for month='Feb' → revenue=9000
- Mar_Revenue: Look for month='Mar' → revenue=10000
- Apr_Revenue through Dec_Revenue: No matching rows → NULL

For id=2:

- Jan_Revenue: Look for month='Jan' → revenue=7000
- Feb_Revenue: Look for month='Feb' → revenue=6000
- All other months: No matching rows → NULL

## Brute Force Approach

A naive approach might try to solve this with multiple queries or complex joins. For example:

1. Create 12 separate queries, each filtering for a specific month
2. Join all 12 results together on the id column
3. Handle missing ids with outer joins

```sql
-- This is messy and inefficient
SELECT
    COALESCE(jan.id, feb.id, mar.id, ...) as id,
    jan.revenue as Jan_Revenue,
    feb.revenue as Feb_Revenue,
    ...
FROM
    (SELECT id, revenue FROM Department WHERE month = 'Jan') jan
    FULL OUTER JOIN (SELECT id, revenue FROM Department WHERE month = 'Feb') feb ON jan.id = feb.id
    FULL OUTER JOIN (SELECT id, revenue FROM Department WHERE month = 'Mar') mar ON jan.id = mar.id
    ...
```

**Why this fails:**

- **Complexity**: 12 joins make the query extremely verbose and hard to read
- **Performance**: Each subquery scans the table, and 12 joins are inefficient
- **Maintainability**: Adding or removing months requires rewriting the entire query
- **Portability**: FULL OUTER JOIN isn't supported in all SQL dialects

## Optimal Solution

The optimal solution uses conditional aggregation with CASE statements or the PIVOT operator (if available). This approach scans the table once and uses aggregation to create the pivot table.

<div class="code-group">

```sql
-- Solution using CASE statements (works in most SQL dialects)
-- Time: O(n) where n is number of rows in Department table
-- Space: O(m) where m is number of distinct ids (for grouping)

SELECT
    id,
    -- For each month, sum only the revenue for that month
    -- SUM ignores NULL values, so we get the actual revenue or NULL
    SUM(CASE WHEN month = 'Jan' THEN revenue END) AS Jan_Revenue,
    SUM(CASE WHEN month = 'Feb' THEN revenue END) AS Feb_Revenue,
    SUM(CASE WHEN month = 'Mar' THEN revenue END) AS Mar_Revenue,
    SUM(CASE WHEN month = 'Apr' THEN revenue END) AS Apr_Revenue,
    SUM(CASE WHEN month = 'May' THEN revenue END) AS May_Revenue,
    SUM(CASE WHEN month = 'Jun' THEN revenue END) AS Jun_Revenue,
    SUM(CASE WHEN month = 'Jul' THEN revenue END) AS Jul_Revenue,
    SUM(CASE WHEN month = 'Aug' THEN revenue END) AS Aug_Revenue,
    SUM(CASE WHEN month = 'Sep' THEN revenue END) AS Sep_Revenue,
    SUM(CASE WHEN month = 'Oct' THEN revenue END) AS Oct_Revenue,
    SUM(CASE WHEN month = 'Nov' THEN revenue END) AS Nov_Revenue,
    SUM(CASE WHEN month = 'Dec' THEN revenue END) AS Dec_Revenue
FROM
    Department
GROUP BY
    id  -- Group all rows for each id into a single row
ORDER BY
    id; -- Optional: sort by id for consistent output
```

```sql
-- Alternative using PIVOT (SQL Server, Oracle, PostgreSQL with extensions)
-- Time: O(n) | Space: O(m)

SELECT *
FROM Department
PIVOT (
    SUM(revenue)  -- Aggregate function to apply
    FOR month IN (  -- Columns to create
        [Jan], [Feb], [Mar], [Apr],
        [May], [Jun], [Jul], [Aug],
        [Sep], [Oct], [Nov], [Dec]
    )
) AS PivotTable
ORDER BY id;
```

</div>

**Line-by-line explanation of the CASE statement solution:**

1. **`SELECT id`**: We'll output one row per unique id
2. **`SUM(CASE WHEN month = 'Jan' THEN revenue END)`**:
   - `CASE WHEN month = 'Jan' THEN revenue END` returns revenue for Jan rows, NULL for others
   - `SUM()` aggregates these values for each id group
   - Since SUM ignores NULLs, we get the Jan revenue if it exists, otherwise NULL
3. **Repeat for each month**: Same logic for Feb through Dec
4. **`FROM Department`**: Source table
5. **`GROUP BY id`**: Crucial! Groups all rows with the same id, allowing us to aggregate monthly revenues
6. **`ORDER BY id`**: Optional but good practice for consistent output

**Why SUM() instead of MAX() or other aggregate?**

- Both SUM() and MAX() work because each id-month combination is unique (primary key)
- SUM() is more intuitive: we're "summing" the revenue for each month (though there's only one value)
- MAX() would also work but might confuse readers thinking we're taking maximum of multiple values

## Complexity Analysis

**Time Complexity: O(n)**

- We scan the entire `Department` table once
- The CASE statements are evaluated for each row, but this is constant time per row
- GROUP BY requires sorting or hashing, which is O(n log n) worst case, but with proper indexing on (id, month), it can be more efficient

**Space Complexity: O(m)**

- Where m is the number of distinct ids
- The GROUP BY operation needs to store intermediate results for each id
- The output has m rows × 13 columns (id + 12 months)

**Index Optimization:**

- Since (id, month) is the primary key, the database can use this index for efficient grouping
- This makes the GROUP BY operation much faster than a full table scan with sorting

## Common Mistakes

1. **Forgetting GROUP BY**: Without GROUP BY, you'll get only one row with aggregated values from all ids. The query will still run but give incorrect results.

2. **Using wrong aggregate function**: Some candidates use `MAX(revenue)` which works but is less intuitive than `SUM()`. Avoid `AVG()` or `COUNT()` as they give wrong results.

3. **Not handling NULLs properly**: If you use `SUM(revenue)` without CASE, you'll sum all revenues for each id. The CASE statement ensures we only include revenue for the specific month.

4. **Misspelling month names**: 'Jan' not 'January', 'Feb' not 'Februrary'. The month values in the table are three-letter abbreviations.

5. **Incorrect column aliases**: The problem expects exact column names like 'Jan_Revenue', not 'Jan' or 'January_Revenue'.

6. **Assuming every id has data for all months**: Always handle missing months with NULL. Don't assume inner joins will work.

## When You'll See This Pattern

This pivot table pattern appears whenever you need to transform rows into columns:

1. **LeetCode 1179 - Reformat Department Table**: This exact problem
2. **LeetCode 1795 - Rearrange Products Table**: Similar pivot/transpose problem with product prices
3. **Monthly Sales Reports**: Any reporting system that shows metrics across time periods
4. **Student Grade Books**: Transforming assignment scores (rows) into student report cards (columns)
5. **Survey Data**: Converting respondent answers (rows) into respondent profiles (columns)

The core technique is **conditional aggregation**: using CASE statements inside aggregate functions to create multiple calculated columns from grouped data.

## Key Takeaways

1. **Pivot tables = GROUP BY + conditional aggregation**: To transform rows to columns, group by the row identifier and use CASE statements to create columns for each category.

2. **SUM() with CASE is versatile**: `SUM(CASE WHEN condition THEN value END)` gives you the value when condition is true, NULL otherwise. This pattern works for any conditional aggregation.

3. **Know your SQL dialect's pivot features**: Some databases have PIVOT operators that make this cleaner, but CASE statements work everywhere.

4. **Always test edge cases**: Empty tables, ids with only some months, duplicate data (though primary key prevents this here).

Remember: SQL problems often test your understanding of aggregation and conditional logic more than algorithmic complexity. Practice identifying when a problem needs row-to-column transformation.

[Practice this problem on CodeJeet](/problem/reformat-department-table)
