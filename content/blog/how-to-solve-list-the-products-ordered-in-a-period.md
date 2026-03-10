---
title: "How to Solve List the Products Ordered in a Period — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode List the Products Ordered in a Period. Easy difficulty, 71.7% acceptance rate. Topics: Database."
date: "2028-01-05"
category: "dsa-patterns"
tags: ["list-the-products-ordered-in-a-period", "database", "easy"]
---

## How to Solve "List the Products Ordered in a Period"

This SQL problem asks us to find products that were ordered in a specific period and report their total quantities. While conceptually straightforward, it tests your ability to join tables, filter by date ranges, group results, and handle edge cases where products weren't ordered at all. The interesting part is understanding how to properly combine product information with order data while respecting the time constraint.

## Visual Walkthrough

Let's walk through a small example. Suppose we have:

**Products table:**

```
product_id | product_name
-----------|-------------
1          | Keyboard
2          | Mouse
3          | Monitor
```

**Orders table:**

```
order_id | product_id | order_date | unit
---------|------------|------------|------
1        | 1          | 2020-02-05 | 10
2        | 1          | 2020-02-10 | 5
3        | 2          | 2020-02-15 | 8
4        | 1          | 2020-03-01 | 3
```

We want products ordered in February 2020 (between '2020-02-01' and '2020-02-29').

**Step-by-step reasoning:**

1. First, filter the Orders table to only February 2020 orders. This gives us orders 1, 2, and 3.
2. Group these filtered orders by product_id and sum their units:
   - Product 1: 10 + 5 = 15 units
   - Product 2: 8 units
   - Product 3: No orders in February → exclude
3. Join with Products table to get product names:
   - Keyboard (product 1): 15 units
   - Mouse (product 2): 8 units
4. Filter to only include products with at least 100 units? Wait, the problem says we want ALL products ordered in the period, regardless of quantity. The "at least 100" requirement doesn't exist here.

The key insight: We need to join Products with filtered Orders, but we must ensure products with zero orders in the period don't appear in results.

## Brute Force Approach

A naive approach might try to join the entire tables first, then filter:

```sql
SELECT p.product_name, SUM(o.unit) as unit
FROM Products p
JOIN Orders o ON p.product_id = o.product_id
WHERE o.order_date BETWEEN '2020-02-01' AND '2020-02-29'
GROUP BY p.product_id, p.product_name
```

This actually works correctly for this problem! The "brute force" here isn't about performance (SQL optimizes joins well), but about understanding what could go wrong:

1. **Missing products with zero orders**: The INNER JOIN will exclude products not ordered in February. That's actually correct for this problem!
2. **Incorrect date filtering**: If we filter after joining, we might accidentally include products with no February orders but with orders in other months.
3. **Grouping errors**: Forgetting to include product_name in GROUP BY when using MySQL in strict mode.

The main "trickiness" comes from understanding that an INNER JOIN is correct here because we only want products that were actually ordered in the period. If the problem asked for ALL products with their February orders (including zeros), we'd need a LEFT JOIN.

## Optimal Solution

The optimal solution uses an INNER JOIN between Products and filtered Orders, grouping by product to sum quantities. Here's the complete implementation:

<div class="code-group">

```sql
-- Time: O(n + m) where n = products, m = orders in period
-- Space: O(k) where k = products ordered in period

SELECT
    p.product_name,           -- Get the product name from Products table
    SUM(o.unit) AS unit       -- Sum all units ordered for this product
FROM
    Products p                -- Start with all products
INNER JOIN
    Orders o                  -- Join with orders
    ON p.product_id = o.product_id  -- Match by product ID
WHERE
    -- Filter orders to only those in February 2020
    o.order_date BETWEEN '2020-02-01' AND '2020-02-29'
GROUP BY
    p.product_id,             -- Group by product ID for the sum
    p.product_name            -- Also group by name (required in SQL when selecting it)
HAVING
    SUM(o.unit) >= 100        -- Optional: only include if total >= 100
                              -- Note: Problem doesn't require this, but some variations do
ORDER BY
    unit DESC,                -- Sort by total units descending
    p.product_name ASC;       -- Then alphabetically by name
```

```sql
-- Alternative using subquery first for better performance on large datasets
-- Time: O(n + m) | Space: O(k)

SELECT
    p.product_name,
    feb_orders.total_unit AS unit
FROM
    Products p
INNER JOIN (
    -- First filter and aggregate orders in the period
    SELECT
        product_id,
        SUM(unit) AS total_unit
    FROM
        Orders
    WHERE
        order_date BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY
        product_id
    HAVING
        SUM(unit) >= 100  -- Optional quantity filter
) feb_orders ON p.product_id = feb_orders.product_id
ORDER BY
    unit DESC,
    p.product_name ASC;
```

</div>

**Line-by-line explanation:**

1. **`SELECT p.product_name, SUM(o.unit) AS unit`**: We need the product name and the total quantity ordered. The `SUM()` aggregates all units for each product.

2. **`FROM Products p INNER JOIN Orders o`**: We use INNER JOIN (not LEFT JOIN) because we only want products that actually have orders in February. Products with no February orders won't appear in results.

3. **`ON p.product_id = o.product_id`**: Standard join condition matching products to their orders.

4. **`WHERE o.order_date BETWEEN '2020-02-01' AND '2020-02-29'`**: This filters orders to only February 2020. The BETWEEN is inclusive, so it includes both start and end dates.

5. **`GROUP BY p.product_id, p.product_name`**: Groups results by product. We include both ID and name because some SQL engines require all selected non-aggregated columns in GROUP BY.

6. **`ORDER BY unit DESC, p.product_name ASC`**: Sorts by total units (highest first), then alphabetically for ties.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of products
- `m` = number of orders in the filtered period
- The database must scan the Orders table to filter by date (O(m)), then join with Products (O(n) with proper indexing), then group the results.

**Space Complexity: O(k)**

- `k` = number of unique products ordered in the period
- The grouping operation needs to store intermediate results for each product found in the filtered orders.

With proper indexing on `Orders(order_date, product_id)` and `Products(product_id)`, this query runs very efficiently even on large datasets.

## Common Mistakes

1. **Using LEFT JOIN when INNER JOIN is correct**: Many candidates use `LEFT JOIN` thinking they need all products, but the problem specifically asks for products ordered in the period. Products with zero orders in February should not appear. Test this with a product that has orders only in January.

2. **Incorrect date filtering**: Using `MONTH(order_date) = 2` instead of the full date range. While this works for February, it doesn't restrict the year to 2020. Also, `MONTH()` function can't use indexes as efficiently as a direct date comparison.

3. **Forgetting to group by product_name**: In strict SQL mode (like MySQL with ONLY_FULL_GROUP_BY), you must include `product_name` in the GROUP BY clause when selecting it. The error isn't always obvious during interviews.

4. **Misplacing the HAVING clause**: Some problem variations require filtering by total quantity (e.g., "at least 100 units"). Candidates often put this in the WHERE clause, but you can't filter aggregates with WHERE—you need HAVING after GROUP BY.

## When You'll See This Pattern

This problem combines several fundamental SQL patterns:

1. **Date Range Filtering**: Similar to "Find Customer Referee" (LeetCode 584) where you filter by specific conditions, or "Big Countries" (LeetCode 595) with threshold filters.

2. **Aggregation with JOIN**: Like "Department Top Three Salaries" (LeetCode 185) where you join tables then aggregate, or "Game Play Analysis" (LeetCode 511) with date-based grouping.

3. **Time Period Analysis**: Related to "User Activity for the Past 30 Days" (LeetCode 1141) where you filter by relative date ranges, or "Monthly Transactions" (LeetCode 1193) with similar period grouping.

The core pattern—filter, join, aggregate—appears in 30%+ of SQL interview questions. Mastering it means you can solve most medium-difficulty SQL problems.

## Key Takeaways

1. **Understand JOIN types deeply**: Know when to use INNER vs LEFT JOIN. INNER JOIN returns only matching rows from both tables—perfect when you want to exclude records without matches. LEFT JOIN keeps all from the left table—use when you need all records regardless of matches.

2. **Filter early for performance**: When possible, filter tables before joining (like in the subquery alternative). This reduces the amount of data the join must process, especially important with large datasets.

3. **Remember the SQL execution order**: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. You can't use column aliases from SELECT in WHERE, and you can't filter aggregates with WHERE (must use HAVING).

[Practice this problem on CodeJeet](/problem/list-the-products-ordered-in-a-period)
