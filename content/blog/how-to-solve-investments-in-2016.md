---
title: "How to Solve Investments in 2016 — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Investments in 2016. Medium difficulty, 50.8% acceptance rate. Topics: Database."
date: "2028-01-16"
category: "dsa-patterns"
tags: ["investments-in-2016", "database", "medium"]
---

# How to Solve Investments in 2016

This SQL problem asks us to calculate the total sum of 2016 investment amounts (tiv_2016) for policyholders who meet two specific conditions: they must have the same tiv_2015 value as at least one other policyholder, AND they must have a unique geographic location (unique latitude/longitude combination). The challenge lies in efficiently filtering records based on both column value duplication and tuple uniqueness while avoiding common SQL pitfalls with aggregation and filtering.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this sample data:

| pid | tiv_2015 | tiv_2016 | lat | lon |
| --- | -------- | -------- | --- | --- |
| 1   | 10       | 100      | 1   | 1   |
| 2   | 10       | 200      | 2   | 2   |
| 3   | 10       | 300      | 1   | 1   |
| 4   | 20       | 400      | 3   | 3   |
| 5   | 20       | 500      | 4   | 4   |

**Step 1: First condition - Same tiv_2015 as another policyholder**

- Policyholder 1 has tiv_2015 = 10. Others with tiv_2015 = 10: pid 2 and 3 ✓
- Policyholder 2 has tiv_2015 = 10. Others with tiv_2015 = 10: pid 1 and 3 ✓
- Policyholder 3 has tiv_2015 = 10. Others with tiv_2015 = 10: pid 1 and 2 ✓
- Policyholder 4 has tiv_2015 = 20. Others with tiv_2015 = 20: pid 5 ✓
- Policyholder 5 has tiv_2015 = 20. Others with tiv_2015 = 20: pid 4 ✓

**Step 2: Second condition - Unique (lat, lon) location**

- Policyholder 1: (1, 1) - pid 3 has same location ✗
- Policyholder 2: (2, 2) - unique ✓
- Policyholder 3: (1, 1) - pid 1 has same location ✗
- Policyholder 4: (3, 3) - unique ✓
- Policyholder 5: (4, 4) - unique ✓

**Step 3: Combine conditions**

- Policyholder 2: meets both conditions ✓ (tiv_2016 = 200)
- Policyholder 4: meets both conditions ✓ (tiv_2016 = 400)
- Policyholder 5: meets both conditions ✓ (tiv_2016 = 500)

**Result:** Total = 200 + 400 + 500 = **1100**

## Brute Force Approach

A naive approach would be to use correlated subqueries to check both conditions for each row:

```sql
SELECT SUM(tiv_2016) AS tiv_2016
FROM Insurance i1
WHERE
    -- Check if another policy has same tiv_2015
    EXISTS (
        SELECT 1
        FROM Insurance i2
        WHERE i2.pid != i1.pid
        AND i2.tiv_2015 = i1.tiv_2015
    )
    AND
    -- Check if location is unique
    NOT EXISTS (
        SELECT 1
        FROM Insurance i3
        WHERE i3.pid != i1.pid
        AND i3.lat = i1.lat
        AND i3.lon = i1.lon
    );
```

**Why this is inefficient:**

- For each of N rows, we execute two subqueries that scan the entire table
- Time complexity: O(N²) - with 10,000 rows, that's 100 million operations
- The database has to repeatedly scan the same data
- No indexes are leveraged effectively
- This approach becomes painfully slow with large datasets

## Optimized Approach

The key insight is to use window functions and aggregation to check conditions efficiently in a single pass:

1. **For tiv_2015 duplication check**: Use `COUNT()` window function to count how many policies share the same tiv_2015 value. We need at least 2 (including current row).

2. **For location uniqueness check**: Use `COUNT()` window function to count how many policies share the same (lat, lon) combination. We need exactly 1 (only the current row).

3. **Combine both conditions**: Filter rows where tiv_2015_count ≥ 2 AND location_count = 1, then sum their tiv_2016 values.

This approach is efficient because:

- Window functions compute aggregates in a single pass over sorted/partitioned data
- We avoid correlated subqueries that cause O(N²) complexity
- The database can optimize window function execution with indexes
- We handle both conditions simultaneously without multiple table scans

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for window functions | Space: O(n) for window partitions
SELECT
    -- ROUND to 2 decimal places as specified in problem
    ROUND(SUM(tiv_2016), 2) AS tiv_2016
FROM (
    SELECT
        pid,
        tiv_2015,
        tiv_2016,
        lat,
        lon,
        -- Count how many policies have the same tiv_2015 value
        -- Including the current row, so we need count > 1
        COUNT(*) OVER (PARTITION BY tiv_2015) AS tiv_2015_count,
        -- Count how many policies have the same (lat, lon) combination
        -- Should be exactly 1 for unique locations
        COUNT(*) OVER (PARTITION BY lat, lon) AS location_count
    FROM Insurance
) AS subquery
-- Filter policies that meet both conditions:
-- 1. Same tiv_2015 as at least one other policy (count > 1)
-- 2. Unique location (count = 1)
WHERE tiv_2015_count > 1
  AND location_count = 1;
```

```sql
-- Alternative approach using CTE for better readability
-- Time: O(n log n) | Space: O(n)
WITH policy_counts AS (
    SELECT
        pid,
        tiv_2016,
        -- Count policies with same tiv_2015 (including current)
        COUNT(*) OVER (PARTITION BY tiv_2015) AS same_tiv_count,
        -- Count policies with same location (including current)
        COUNT(*) OVER (PARTITION BY lat, lon) AS same_location_count
    FROM Insurance
)
SELECT
    ROUND(SUM(tiv_2016), 2) AS tiv_2016
FROM policy_counts
-- Apply both filtering conditions
WHERE same_tiv_count > 1
  AND same_location_count = 1;
```

</div>

**Line-by-line explanation:**

1. **Window function for tiv_2015**: `COUNT(*) OVER (PARTITION BY tiv_2015)` groups all rows by their tiv_2015 value and counts how many are in each group. This tells us if a policy's tiv_2015 value appears elsewhere.

2. **Window function for location**: `COUNT(*) OVER (PARTITION BY lat, lon)` groups rows by their (lat, lon) combination. A count of 1 means this location is unique.

3. **Filtering logic**: `WHERE tiv_2015_count > 1` ensures the policy shares its tiv_2015 with at least one other policy. `AND location_count = 1` ensures the location is unique.

4. **Final aggregation**: `SUM(tiv_2016)` adds up all qualifying investment values, and `ROUND(..., 2)` formats the result to two decimal places.

## Complexity Analysis

**Time Complexity: O(n log n)**

- Window functions with PARTITION BY typically require sorting or hashing
- Partitioning by tiv_2015: O(n log n) for sorting or O(n) with hash partition
- Partitioning by (lat, lon): Another O(n log n) operation
- In practice, modern databases optimize this to approximately O(n log n)

**Space Complexity: O(n)**

- Window functions need to maintain partition groups in memory
- Each partition (tiv_2015 and location) requires storing group information
- Additional space for the derived table/CTE results

**Why this is optimal:**

- We must examine every row at least once: Ω(n) lower bound
- Window functions approach this lower bound with minimal overhead
- Any solution requires checking relationships between rows, which inherently has some logarithmic factor

## Common Mistakes

1. **Using GROUP BY incorrectly**:

   ```sql
   -- WRONG: This loses individual policy information
   SELECT SUM(tiv_2016)
   FROM Insurance
   GROUP BY tiv_2015
   HAVING COUNT(*) > 1;
   ```

   **Fix**: Use window functions instead of GROUP BY to preserve individual rows while computing aggregates.

2. **Forgetting that COUNT includes current row**:

   ```sql
   -- WRONG: Looking for count > 2 instead of > 1
   WHERE tiv_2015_count > 2 AND location_count = 1
   ```

   **Fix**: Remember COUNT(\*) OVER includes the current row, so > 1 means at least one other row.

3. **Not handling floating-point precision in location comparison**:
   - If lat/lon are floats, exact equality comparisons might fail due to floating-point errors
     **Fix**: The problem guarantees float type works, but in real scenarios consider tolerance ranges or use decimal types.

4. **Missing the ROUND() function**:
   ```sql
   -- WRONG: Returns unformatted result
   SELECT SUM(tiv_2016) AS tiv_2016
   ```
   **Fix**: Always check output requirements. The problem specifies 2 decimal places: `ROUND(SUM(tiv_2016), 2)`

## When You'll See This Pattern

This problem combines several important SQL patterns:

1. **Window Functions for Conditional Aggregation**: Similar to problems where you need to compare each row to aggregates of its group
   - **LeetCode 185: Department Top Three Salaries** - Uses `DENSE_RANK()` window function to find top N per group
   - **LeetCode 178: Rank Scores** - Uses window functions to compute ranks while preserving individual rows

2. **Multiple Condition Filtering with Aggregates**: Problems requiring filtering based on multiple aggregate conditions
   - **LeetCode 570: Managers with at Least 5 Direct Reports** - Filters based on count of relationships
   - **LeetCode 197: Rising Temperature** - Compares rows based on date differences

3. **Finding Duplicates and Uniques**: Common in data cleaning and validation scenarios
   - **LeetCode 182: Duplicate Emails** - Simple GROUP BY/HAVING for duplicates
   - **LeetCode 196: Delete Duplicate Emails** - More complex version requiring row comparison

## Key Takeaways

1. **Window functions are powerful for row-level comparisons**: When you need to filter rows based on aggregate conditions while preserving individual rows, window functions (`COUNT() OVER`, `SUM() OVER`, etc.) are often the right tool.

2. **Understand the difference between GROUP BY and window functions**: GROUP BY collapses rows into groups, while window functions compute aggregates without collapsing, giving you the best of both worlds.

3. **Pay attention to what "count > 1" means**: With window functions, COUNT includes the current row, so "> 1" means "at least one other." With GROUP BY HAVING, "> 1" means "more than one total."

4. **Always check output formatting requirements**: Don't just solve the logic—ensure your output matches the exact specification (data types, rounding, column names).

[Practice this problem on CodeJeet](/problem/investments-in-2016)
