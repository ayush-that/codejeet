---
title: "How to Solve Average Selling Price — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Average Selling Price. Easy difficulty, 37.1% acceptance rate. Topics: Database."
date: "2027-02-27"
category: "dsa-patterns"
tags: ["average-selling-price", "database", "easy"]
---

# How to Solve Average Selling Price

This problem asks us to calculate the average selling price for each product by matching sales records with their corresponding price periods. The challenge comes from handling date ranges correctly—when a sale occurs, we need to find which price was active during that sale date, then compute weighted averages based on units sold.

## Visual Walkthrough

Let's walk through a concrete example:

**Prices Table:**

```
product_id | start_date | end_date   | price
1          | 2019-02-17 | 2019-02-28 | 5
1          | 2019-03-01 | 2019-03-22 | 20
```

**UnitsSold Table:**

```
product_id | purchase_date | units
1          | 2019-02-25    | 100
1          | 2019-03-01    | 15
1          | 2019-03-22    | 30
```

**Step-by-step calculation:**

1. For product 1, sale on 2019-02-25 falls in range 2019-02-17 to 2019-02-28 → price = 5
2. Sale on 2019-03-01 falls in range 2019-03-01 to 2019-03-22 → price = 20
3. Sale on 2019-03-22 falls in range 2019-03-01 to 2019-03-22 → price = 20

**Total calculation:**

- Total revenue = (100 × 5) + (15 × 20) + (30 × 20) = 500 + 300 + 600 = 1400
- Total units = 100 + 15 + 30 = 145
- Average price = 1400 ÷ 145 ≈ 9.66

The key insight is that we need to join the tables based on product_id AND date range inclusion, then group by product_id to compute weighted averages.

## Brute Force Approach

A naive approach would be to iterate through all sales and for each sale, scan through all price records to find the matching date range:

```sql
-- Inefficient approach (conceptual)
SELECT
    u.product_id,
    (SELECT SUM(u2.units * p2.price)
     FROM UnitsSold u2
     JOIN Prices p2 ON u2.product_id = p2.product_id
     WHERE u2.purchase_date BETWEEN p2.start_date AND p2.end_date
     AND u2.product_id = u.product_id)
    /
    (SELECT SUM(u3.units)
     FROM UnitsSold u3
     WHERE u3.product_id = u.product_id) as average_price
FROM UnitsSold u
GROUP BY u.product_id
```

**Why this is inefficient:**

1. **Nested queries**: For each product, we're running multiple subqueries
2. **No proper join optimization**: The database can't optimize the date range matching efficiently
3. **Redundant calculations**: We're recalculating sums multiple times
4. **Missing products**: If a product has no sales, it won't appear in the result (but should show 0)

The brute force approach works logically but is inefficient and doesn't handle edge cases well.

## Optimal Solution

The optimal solution uses a proper JOIN with date range conditions, then aggregates with proper grouping. We need to handle products with no sales by using a LEFT JOIN from Prices to UnitsSold.

<div class="code-group">

```sql
-- Time: O(n + m) where n = rows in Prices, m = rows in UnitsSold
-- Space: O(n + m) for the result set
SELECT
    p.product_id,
    -- Use IFNULL to handle products with no sales (return 0)
    IFNULL(
        ROUND(
            SUM(u.units * p.price) / SUM(u.units),  -- Weighted average formula
            2  -- Round to 2 decimal places as required
        ),
        0  -- Default value when no sales exist
    ) AS average_price
FROM
    Prices p
LEFT JOIN
    UnitsSold u
    ON p.product_id = u.product_id  -- Match by product
    AND u.purchase_date BETWEEN p.start_date AND p.end_date  -- Critical: date range check
GROUP BY
    p.product_id  -- Group results by product
ORDER BY
    p.product_id;  -- Optional: sort for consistent output
```

```sql
-- Alternative using COALESCE (works in most SQL dialects)
-- Time: O(n + m) | Space: O(n + m)
SELECT
    p.product_id,
    COALESCE(
        ROUND(
            SUM(u.units * p.price) / NULLIF(SUM(u.units), 0),  -- NULLIF prevents division by zero
            2
        ),
        0
    ) AS average_price
FROM
    Prices p
LEFT JOIN
    UnitsSold u
    ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY
    p.product_id
ORDER BY
    p.product_id;
```

```sql
-- PostgreSQL/MySQL version with explicit handling
-- Time: O(n + m) | Space: O(n + m)
SELECT
    p.product_id,
    CASE
        WHEN SUM(u.units) IS NULL OR SUM(u.units) = 0 THEN 0
        ELSE ROUND(SUM(u.units * p.price)::DECIMAL / SUM(u.units), 2)
    END AS average_price
FROM
    Prices p
LEFT JOIN
    UnitsSold u
    ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY
    p.product_id
ORDER BY
    p.product_id;
```

</div>

**Line-by-line explanation:**

1. **`FROM Prices p LEFT JOIN UnitsSold u`**: Start with all price records and left join sales. This ensures products with no sales still appear in results.

2. **`ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date`**: The crucial join condition. We match not just by product_id, but also ensure the sale date falls within the price's active period.

3. **`SUM(u.units * p.price)`**: Calculates total revenue for each product. When there are no matching sales, `u.units` is NULL, and NULL \* price = NULL.

4. **`SUM(u.units)`**: Calculates total units sold. For products with no sales, this is NULL.

5. **`ROUND(..., 2)`**: Rounds the result to 2 decimal places as typically required.

6. **`IFNULL(..., 0)` or `COALESCE(..., 0)`**: Handles products with no sales by returning 0 instead of NULL.

7. **`GROUP BY p.product_id`**: Aggregates results at the product level.

8. **`NULLIF(SUM(u.units), 0)`**: In the COALESCE version, prevents division by zero by returning NULL if total units is 0.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in Prices table
- `m` = number of rows in UnitsSold table
- The JOIN operation needs to compare each price record with potentially multiple sales records
- With proper indexing on (product_id, start_date, end_date) and (product_id, purchase_date), this can be optimized further

**Space Complexity: O(k)**

- `k` = number of distinct products (size of the result set)
- The intermediate join result could be O(n × m) in worst case, but with date constraints it's typically much smaller
- Final output stores one row per product

**Why this is optimal:**

1. Single pass through both tables with proper join conditions
2. Aggregation happens at the database level (efficient)
3. No nested queries or multiple scans of the same data

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**
   - **Mistake**: `FROM Prices p JOIN UnitsSold u ON ...`
   - **Result**: Products with no sales disappear from results
   - **Fix**: Always use `LEFT JOIN` to include all products

2. **Forgetting the date range condition in JOIN**
   - **Mistake**: `ON p.product_id = u.product_id` (missing date check)
   - **Result**: Wrong price assignments (sales matched with wrong price periods)
   - **Fix**: Always include `AND u.purchase_date BETWEEN p.start_date AND p.end_date`

3. **Not handling division by zero or NULL values**
   - **Mistake**: `SUM(u.units * p.price) / SUM(u.units)` without NULL check
   - **Result**: NULL results for products with no sales or division errors
   - **Fix**: Use `IFNULL()`, `COALESCE()`, or `CASE WHEN SUM(u.units) = 0 THEN 0`

4. **Incorrect rounding or not rounding at all**
   - **Mistake**: Forgetting `ROUND(..., 2)` or using wrong decimal places
   - **Result**: Might fail test cases that check specific output format
   - **Fix**: Always check problem requirements for rounding specifications

5. **Grouping by wrong columns**
   - **Mistake**: `GROUP BY u.product_id` (using UnitsSold table)
   - **Result**: Products with no sales won't appear
   - **Fix**: `GROUP BY p.product_id` to include all products from Prices table

## When You'll See This Pattern

This problem teaches **date range matching with aggregation**, a common pattern in:

1. **LeetCode 550: Game Play Analysis IV** - Analyzing player retention with date calculations
   - Similarity: Working with date intervals and calculating metrics over time periods

2. **LeetCode 1097: Game Play Analysis V** - Calculating player installs and Day 1 retention
   - Similarity: Matching events within specific time windows after an initial event

3. **LeetCode 1321: Restaurant Growth** - Calculating moving averages over time windows
   - Similarity: Aggregating data over sliding date ranges

4. **Real-world scenarios**:
   - Subscription pricing with different rate periods
   - Employee salary calculations with effective dates
   - Inventory cost averaging with price changes over time

The core pattern is: **JOIN tables on overlapping date ranges + GROUP BY + aggregate functions**.

## Key Takeaways

1. **Date range matching is a JOIN condition**: When working with time-based data, include date range checks directly in your JOIN conditions rather than filtering in WHERE clause.

2. **LEFT JOIN preserves all records**: When you need to include entities that might not have related records (like products with no sales), start with the primary table and use LEFT JOIN.

3. **Weighted averages need proper aggregation**: Calculate `SUM(weight * value) / SUM(weight)` at the group level, not average of averages.

4. **Always handle edge cases**: Products with no sales should return 0, not NULL or error. Use `IFNULL()`, `COALESCE()`, or `CASE` statements.

5. **Check rounding requirements**: Many database problems require specific rounding. Always use `ROUND(value, decimal_places)` as specified.

[Practice this problem on CodeJeet](/problem/average-selling-price)
