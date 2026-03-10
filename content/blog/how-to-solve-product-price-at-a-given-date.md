---
title: "How to Solve Product Price at a Given Date — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Product Price at a Given Date. Medium difficulty, 57.7% acceptance rate. Topics: Database."
date: "2027-11-19"
category: "dsa-patterns"
tags: ["product-price-at-a-given-date", "database", "medium"]
---

# How to Solve Product Price at a Given Date

This problem asks us to find the price of each product at a specific date, given a table of price changes over time. The tricky part is handling products that had no price change before the target date — they should keep their original price of 10. This requires careful handling of missing data and date comparisons in SQL.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this data:

```
product_id | new_price | change_date
-----------|-----------|-------------
1          | 20        | 2019-08-14
1          | 30        | 2019-08-15
1          | 35        | 2019-08-16
2          | 50        | 2019-08-14
```

And our target date is `2019-08-17`.

**Step 1: Find the most recent price change before or on the target date**

- For product 1: The most recent change before 2019-08-17 is on 2019-08-16 with price 35
- For product 2: The most recent change before 2019-08-17 is on 2019-08-14 with price 50

**Step 2: Handle products with no price changes before the target date**

- What if we had a product 3 with no entries before 2019-08-17? It should default to price 10

**Step 3: Combine results**
We need to produce a result that includes ALL products (even those not in the price change table before the target date) with their appropriate prices.

## Brute Force Approach

A naive approach might try to:

1. Get all distinct product IDs
2. For each product, find all price changes before the target date
3. Take the most recent one
4. If none exist, use price 10

In SQL pseudocode:

```sql
-- This is inefficient and doesn't handle missing products well
SELECT
    p.product_id,
    COALESCE(
        (SELECT new_price
         FROM Products p2
         WHERE p2.product_id = p.product_id
           AND p2.change_date <= '2019-08-17'
         ORDER BY p2.change_date DESC
         LIMIT 1),
        10
    ) as price
FROM (SELECT DISTINCT product_id FROM Products) p
```

**Why this is problematic:**

- The correlated subquery runs for each product, which is O(n²) in the worst case
- It doesn't efficiently handle the "most recent before date" logic
- While it might work on small datasets, it would be inefficient on larger ones

## Optimized Approach

The key insight is that we need to:

1. **Find the most recent price for each product before the target date** — We can do this by filtering for dates ≤ target date, then using `MAX(change_date)` grouped by product_id
2. **Include all products** — Even those that never had a price change before the target date should appear with price 10
3. **Handle the default price elegantly** — Use a `LEFT JOIN` and `COALESCE` to provide the default value

**Step-by-step reasoning:**

1. First, get all distinct product IDs (we need to include every product)
2. For each product, find the most recent change date before the target date
3. Join back to get the price at that date
4. Use COALESCE to handle missing prices (default to 10)

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n log n) for the GROUP BY and JOIN operations
-- Space: O(n) for storing intermediate results
SELECT
    -- Step 1: Get all distinct products from the table
    -- We need to include every product, even those with no price changes
    -- before our target date
    all_products.product_id,

    -- Step 2: Use COALESCE to handle missing prices
    -- If a product has no price before the target date, use 10
    -- Otherwise, use the price from the most recent change
    COALESCE(latest_prices.new_price, 10) AS price
FROM
    -- Get all unique product IDs from the Products table
    (SELECT DISTINCT product_id FROM Products) AS all_products

    -- Step 3: LEFT JOIN to include products even if they have no price
    -- before the target date
    LEFT JOIN (
        -- Step 4: Find the most recent price change for each product
        -- before or on the target date
        SELECT
            product_id,
            -- Get the actual price at the most recent change date
            new_price
        FROM Products
        -- Step 5: Only consider price changes on or before our target date
        WHERE change_date <= '2019-08-17'
          AND (product_id, change_date) IN (
              -- Step 6: For each product, find the MAX change date
              -- that's ≤ target date
              SELECT
                  product_id,
                  MAX(change_date)
              FROM Products
              -- Same filter for dates
              WHERE change_date <= '2019-08-17'
              -- Group by product to get most recent per product
              GROUP BY product_id
          )
    ) AS latest_prices
    -- Join on product_id to match products with their latest prices
    ON all_products.product_id = latest_prices.product_id

-- Step 7: Order by product_id as typically expected
ORDER BY all_products.product_id;
```

```sql
-- Alternative approach using window functions (more modern SQL)
-- Time: O(n log n) | Space: O(n)
SELECT
    DISTINCT
    p.product_id,
    COALESCE(
        -- Use FIRST_VALUE window function to get the most recent price
        FIRST_VALUE(p.new_price) OVER (
            PARTITION BY p.product_id
            ORDER BY p.change_date DESC
        ),
        10
    ) AS price
FROM Products p
-- Filter for dates before target date
WHERE p.change_date <= '2019-08-17'

UNION

-- Add products that have no entries before the target date
SELECT
    p2.product_id,
    10 AS price
FROM Products p2
WHERE p2.product_id NOT IN (
    SELECT product_id
    FROM Products
    WHERE change_date <= '2019-08-17'
)

ORDER BY product_id;
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The `DISTINCT` operation requires sorting or hashing: O(n log n) or O(n)
- The `GROUP BY` with `MAX(change_date)` also requires sorting: O(n log n)
- The `JOIN` operations are O(n) with proper indexing
- Overall, the dominant factor is the sorting operations, giving us O(n log n)

**Space Complexity: O(n)**

- We need to store intermediate results:
  - The list of distinct product IDs: O(k) where k ≤ n
  - The filtered products before target date: O(m) where m ≤ n
  - The grouped results: O(k)
- In worst case, all products have changes before target date, so O(n)

## Common Mistakes

1. **Forgetting to include products with no price changes before the target date**
   - Many candidates only select from the filtered set (change_date ≤ target)
   - Solution: Start with `(SELECT DISTINCT product_id FROM Products)` to get ALL products

2. **Incorrect handling of the "most recent before date" logic**
   - Using `MAX(change_date)` without filtering dates first gives the overall max, not the max before target
   - Solution: Filter dates in both the outer query and subquery: `WHERE change_date <= '2019-08-17'`

3. **Not using COALESCE for the default price**
   - Trying to use CASE statements or UNION for default prices can get messy
   - Solution: `COALESCE(price, 10)` cleanly handles NULL values from the LEFT JOIN

4. **Missing the ORDER BY clause**
   - While not always required, most interviewers expect ordered output
   - Solution: Add `ORDER BY product_id` at the end

## When You'll See This Pattern

This problem combines several important SQL patterns:

1. **Time-based filtering with aggregation** — Similar to:
   - "Last Person to Fit in the Bus" (LeetCode 1204) — Finding cumulative sums up to a point
   - "Game Play Analysis" series — Analyzing player activity over time windows

2. **Handling missing data with defaults** — Similar to:
   - "Customers Who Never Order" (LeetCode 183) — Using NOT IN or LEFT JOIN with NULL check
   - "Department Top Three Salaries" (LeetCode 185) — Handling cases with fewer than 3 employees

3. **Most recent record per group** — A very common pattern in:
   - "Department Highest Salary" (LeetCode 184) — Using GROUP BY with MAX
   - "Nth Highest Salary" (LeetCode 177) — Using window functions for ranking

## Key Takeaways

1. **For "most recent before date" queries**, filter first (`WHERE date <= target`), then find the maximum date per group. Don't find the overall maximum and then check if it's before the target.

2. **When you need to include all items (even those without matches)**, start with the full list and use `LEFT JOIN`. The `DISTINCT` keyword helps get unique identifiers.

3. **COALESCE is your friend for default values** — It's cleaner than complex CASE statements when handling NULL results from joins.

4. **Window functions (FIRST_VALUE, ROW_NUMBER) can simplify** "most recent per group" problems, though they may not be available in all SQL dialects.

[Practice this problem on CodeJeet](/problem/product-price-at-a-given-date)
