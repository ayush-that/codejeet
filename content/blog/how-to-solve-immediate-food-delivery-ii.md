---
title: "How to Solve Immediate Food Delivery II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Immediate Food Delivery II. Medium difficulty, 55.7% acceptance rate. Topics: Database."
date: "2027-07-02"
category: "dsa-patterns"
tags: ["immediate-food-delivery-ii", "database", "medium"]
---

# How to Solve Immediate Food Delivery II

This problem asks us to calculate the percentage of first-time customer orders that were delivered immediately. The tricky part is that we need to identify each customer's **first order** before determining if it was immediate, then calculate the percentage across all customers. This requires careful handling of multiple orders per customer and proper aggregation.

## Visual Walkthrough

Let's walk through a small example. Suppose our `Delivery` table contains:

| delivery_id | customer_id | order_date | customer_pref_delivery_date |
| ----------- | ----------- | ---------- | --------------------------- |
| 1           | 1           | 2019-08-01 | 2019-08-02                  |
| 2           | 2           | 2019-08-02 | 2019-08-02                  |
| 3           | 1           | 2019-08-11 | 2019-08-11                  |
| 4           | 3           | 2019-08-24 | 2019-08-24                  |
| 5           | 3           | 2019-08-21 | 2019-08-22                  |
| 6           | 2           | 2019-08-11 | 2019-08-14                  |

**Step 1: Find each customer's first order**

- Customer 1's first order is delivery_id 1 (2019-08-01)
- Customer 2's first order is delivery_id 2 (2019-08-02)
- Customer 3's first order is delivery_id 5 (2019-08-21)

**Step 2: Check if first orders were immediate**

- Customer 1: order_date (2019-08-01) ≠ pref_date (2019-08-02) → NOT immediate
- Customer 2: order_date (2019-08-02) = pref_date (2019-08-02) → IMMEDIATE
- Customer 3: order_date (2019-08-21) ≠ pref_date (2019-08-22) → NOT immediate

**Step 3: Calculate percentage**

- Total customers with first orders: 3
- Immediate first orders: 1
- Percentage: (1/3) × 100 = 33.33%

## Brute Force Approach

A naive approach might try to process this in multiple steps:

1. For each customer, scan all their orders to find the earliest order_date
2. For each customer, check if that earliest order was immediate
3. Count all customers and immediate first orders separately
4. Calculate percentage

The problem with this approach is efficiency. If we process each customer separately, we might scan the same data multiple times. In SQL terms, a suboptimal solution might use multiple nested subqueries or correlated subqueries that scan the table repeatedly for each customer.

For example, a brute force SQL query might look like:

```sql
-- Inefficient approach using correlated subquery
SELECT
    ROUND(
        100.0 * SUM(
            CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END
        ) / COUNT(*),
        2
    ) AS immediate_percentage
FROM Delivery d
WHERE d.order_date = (
    SELECT MIN(order_date)
    FROM Delivery d2
    WHERE d2.customer_id = d.customer_id
)
```

This query uses a correlated subquery that executes once for each row in the outer query, leading to O(n²) complexity in the worst case.

## Optimized Approach

The key insight is that we need to identify each customer's first order efficiently. We can do this using:

1. **Window functions** (ROW_NUMBER() or RANK()) to assign order numbers per customer
2. **Common Table Expressions (CTEs)** or subqueries to isolate first orders
3. **Aggregation** to count immediate deliveries

The optimal approach uses:

- A CTE or subquery with ROW_NUMBER() to mark each customer's first order
- Filter to keep only first orders (row_num = 1)
- Count total first orders and immediate first orders
- Calculate percentage with proper decimal handling

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, Space: O(n) for window function
WITH FirstOrders AS (
    SELECT
        customer_id,
        -- Assign row number 1 to the earliest order for each customer
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        ) AS order_rank,
        -- Check if this order was immediate (same-day delivery)
        CASE
            WHEN order_date = customer_pref_delivery_date THEN 1
            ELSE 0
        END AS is_immediate
    FROM Delivery
)
SELECT
    -- Calculate percentage with 2 decimal places
    -- Multiply by 100.0 to ensure decimal division
    ROUND(
        100.0 * SUM(is_immediate) / COUNT(*),
        2
    ) AS immediate_percentage
FROM FirstOrders
-- Only consider each customer's first order
WHERE order_rank = 1;
```

```sql
-- Alternative solution using MIN() with GROUP BY
-- Time: O(n log n), Space: O(n) for grouping
SELECT
    ROUND(
        100.0 * SUM(
            CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END
        ) / COUNT(*),
        2
    ) AS immediate_percentage
FROM Delivery d
-- Join each customer's record with their earliest order date
INNER JOIN (
    SELECT
        customer_id,
        MIN(order_date) AS first_order_date
    FROM Delivery
    GROUP BY customer_id
) first_orders ON d.customer_id = first_orders.customer_id
    AND d.order_date = first_orders.first_order_date;
```

</div>

**Step-by-step explanation of the window function solution:**

1. **FirstOrders CTE**: Creates a temporary result set where:
   - `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date)` assigns sequential numbers to each customer's orders, starting with 1 for the earliest order_date
   - The `CASE` statement creates a flag (1 for immediate, 0 for scheduled) for each order

2. **Main query**:
   - Filters to keep only first orders (`WHERE order_rank = 1`)
   - `SUM(is_immediate)` counts how many first orders were immediate
   - `COUNT(*)` counts total customers (since each has exactly one first order)
   - `100.0 * SUM() / COUNT()` calculates the percentage
   - `ROUND(..., 2)` rounds to 2 decimal places as required

**Why use 100.0 instead of 100?**
In SQL, integer division truncates decimals. Multiplying by 100.0 (a decimal) ensures we get decimal division and an accurate percentage.

## Complexity Analysis

**Time Complexity: O(n log n)**

- The window function `ROW_NUMBER()` requires sorting the data by `(customer_id, order_date)`
- Sorting n records takes O(n log n) time
- The final aggregation is O(n) but dominated by the sort

**Space Complexity: O(n)**

- The window function needs to maintain the partitioned and sorted data
- In the worst case, this requires O(n) additional space
- The CTE creates a temporary result set of size O(n)

## Common Mistakes

1. **Integer division error**: Using `100 * SUM() / COUNT()` instead of `100.0 * SUM() / COUNT()`. This gives integer results like 0 or 100 instead of decimal percentages.

2. **Missing the "first order" requirement**: Simply calculating percentage of all immediate deliveries without filtering to first orders. This counts repeat customers' immediate deliveries incorrectly.

3. **Handling ties incorrectly**: If a customer has multiple orders on the same earliest date, using `RANK()` instead of `ROW_NUMBER()` would count all tied orders as "first orders." The problem states we should consider the earliest order date, but doesn't specify how to handle ties. `ROW_NUMBER()` arbitrarily picks one, which is acceptable unless specified otherwise.

4. **Forgetting to round**: Not using `ROUND()` or rounding to the wrong number of decimal places. The problem expects 2 decimal places.

5. **Inefficient joins**: Using the GROUP BY approach without proper indexing could be inefficient if not optimized by the database engine.

## When You'll See This Pattern

This pattern of "find first/last record per group" appears frequently in SQL problems:

1. **Nth Highest Salary (LeetCode 177)**: Uses similar window function approach to find the nth ranked salary
2. **Department Top Three Salaries (LeetCode 185)**: Uses `DENSE_RANK()` to find top earners per department
3. **Game Play Analysis (LeetCode 511)**: Finds each player's first login date using `MIN()` with `GROUP BY`

The core technique—using window functions with `PARTITION BY` and `ORDER BY` to rank records within groups—is essential for solving many medium-to-hard SQL problems.

## Key Takeaways

1. **Window functions are powerful**: `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` with `PARTITION BY` are essential tools for solving "per group" problems efficiently.

2. **Watch for integer division**: In SQL, always use decimal numbers (like `100.0`) when calculating percentages to avoid truncation.

3. **CTEs improve readability**: Breaking complex queries into named CTEs makes them easier to understand and debug, even if they don't always improve performance.

4. **Understand the business logic**: The hardest part of this problem isn't the SQL syntax—it's understanding that we need each customer's FIRST order, not just any immediate delivery.

[Practice this problem on CodeJeet](/problem/immediate-food-delivery-ii)
