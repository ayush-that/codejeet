---
title: "How to Solve Product Sales Analysis III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Product Sales Analysis III. Medium difficulty, 45.6% acceptance rate. Topics: Database."
date: "2027-07-13"
category: "dsa-patterns"
tags: ["product-sales-analysis-iii", "database", "medium"]
---

# How to Solve Product Sales Analysis III

This problem asks us to find the first year each product was sold, along with its quantity and price for that first year. The tricky part is that we need to filter the sales data to only include the earliest sale for each product, which requires identifying the minimum year per product before we can retrieve the corresponding quantity and price. This is a classic "groupwise minimum" problem in SQL where we need to join a table with its own aggregated results.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Sales` table contains:

| sale_id | product_id | year | quantity | price |
| ------- | ---------- | ---- | -------- | ----- |
| 1       | 100        | 2008 | 10       | 5000  |
| 2       | 100        | 2009 | 12       | 5000  |
| 3       | 200        | 2011 | 15       | 9000  |
| 4       | 200        | 2011 | 20       | 9000  |
| 5       | 300        | 2010 | 8        | 4000  |

**Step 1: Identify first sale year per product**

- Product 100: Minimum year is 2008
- Product 200: Minimum year is 2011
- Product 300: Minimum year is 2010

**Step 2: Match original sales to first-year records**
We need to find the rows where the (product_id, year) combination matches our first-year findings:

- Product 100, year 2008 → sale_id 1 (quantity 10, price 5000)
- Product 200, year 2011 → sale_id 3 OR 4 (both have same year, we need both)
- Product 300, year 2010 → sale_id 5 (quantity 8, price 4000)

**Step 3: Handle multiple sales in same first year**
Notice product 200 has two sales in 2011 (its first year). Both should be included in the result since they represent different sale events for the same product in its debut year.

**Expected result:**
| product_id | first_year | quantity | price |
|------------|------------|----------|-------|
| 100 | 2008 | 10 | 5000 |
| 200 | 2011 | 15 | 9000 |
| 200 | 2011 | 20 | 9000 |
| 300 | 2010 | 8 | 4000 |

## Brute Force Approach

A naive approach might try to process each product independently: for each product, scan all its sales to find the minimum year, then scan again to find all sales with that year. In SQL, this could be done with correlated subqueries:

```sql
SELECT
    product_id,
    year AS first_year,
    quantity,
    price
FROM Sales s1
WHERE year = (
    SELECT MIN(year)
    FROM Sales s2
    WHERE s2.product_id = s1.product_id
)
```

While this works logically, it's inefficient because the subquery executes for every row in the outer query (O(n²) in worst case). For each product with many sales, we're repeatedly calculating the same minimum year. This approach also doesn't handle large datasets well since database optimizers struggle with correlated subqueries on big tables.

## Optimized Approach

The key insight is that we can compute the minimum year per product once using aggregation, then join this result back to the original table. This transforms an O(n²) problem into O(n log n) or better, depending on join implementation.

**Step-by-step reasoning:**

1. **Compute first sale year per product**: Use `GROUP BY product_id` with `MIN(year)` to create a mapping of each product to its earliest sale year.
2. **Join back to original table**: Match the original sales records where both `product_id` and `year` equal the values from our aggregated result.
3. **Select required columns**: Return `product_id`, `year` (as `first_year`), `quantity`, and `price`.

This approach works because:

- The aggregation step reduces the data to one row per product (or potentially more if there are ties for minimum year)
- The join efficiently filters only the relevant sales records
- It naturally handles multiple sales in the same first year since the join matches on both product_id and year

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for grouping and joining | Space: O(n) for intermediate results
SELECT
    s.product_id,        -- Product identifier
    s.year AS first_year, -- Earliest sale year for this product
    s.quantity,          -- Quantity sold in that first year
    s.price              -- Price per unit in that first year
FROM Sales s
-- Join with a subquery that finds the first sale year for each product
INNER JOIN (
    SELECT
        product_id,
        MIN(year) AS first_year  -- Find the minimum year for each product
    FROM Sales
    GROUP BY product_id          -- Group by product to get per-product minimum
) first_sales
ON s.product_id = first_sales.product_id  -- Match by product
AND s.year = first_sales.first_year       -- Match by the first sale year
-- This ensures we only get sales from the first year each product was sold
```

```sql
-- Alternative using window function (more modern approach)
-- Time: O(n log n) for partitioning and sorting | Space: O(n) for window computation
SELECT
    product_id,
    year AS first_year,
    quantity,
    price
FROM (
    SELECT
        product_id,
        year,
        quantity,
        price,
        -- Assign rank 1 to the earliest year for each product
        RANK() OVER (PARTITION BY product_id ORDER BY year) AS year_rank
    FROM Sales
) ranked_sales
WHERE year_rank = 1  -- Only include sales from the first year
```

</div>

**Line-by-line explanation of the JOIN solution:**

1. `SELECT product_id, MIN(year) AS first_year FROM Sales GROUP BY product_id` - Creates a derived table with one row per product containing its earliest sale year.
2. `INNER JOIN ... ON s.product_id = first_sales.product_id AND s.year = first_sales.first_year` - Joins the original table with our derived table, matching rows where both product_id and year match the first sale year.
3. The SELECT clause then extracts the four required columns from the matched rows.

**Line-by-line explanation of the window function solution:**

1. `RANK() OVER (PARTITION BY product_id ORDER BY year)` - Creates a ranking within each product group, ordered by year. The earliest year gets rank 1.
2. The outer query filters to only include rows where `year_rank = 1`, giving us sales from the first year for each product.
3. This approach is often more readable and performs well on modern database systems.

## Complexity Analysis

**Time Complexity: O(n log n)**

- The `GROUP BY` operation typically requires sorting or hashing, which is O(n log n) in most database implementations.
- The join operation is O(n log n) when using indexes or O(n) with hash joins on modern databases.
- Window functions also require partitioning and sorting, which is O(n log n).

**Space Complexity: O(n)**

- The intermediate result from the `GROUP BY` or window function needs to store aggregated data for each product.
- In worst case, if each product has only one sale, this could be O(n) space.
- The final result could also be O(n) if many products have multiple sales in their first year.

## Common Mistakes

1. **Using `MIN()` without `GROUP BY`**: Some candidates write `SELECT product_id, MIN(year) FROM Sales` without grouping, which returns only one row with the absolute minimum year across all products, not per product.

2. **Forgetting to handle multiple sales in first year**: Using `GROUP BY product_id` in the final SELECT would collapse multiple sales in the same first year into one row. We need to join, not aggregate, in the final step.

3. **Incorrect join conditions**: Joining only on `product_id` without also matching the `year` would include ALL sales for each product, not just first-year sales. The double condition (`ON s.product_id = first_sales.product_id AND s.year = first_sales.first_year`) is crucial.

4. **Using `WHERE year = MIN(year)` directly**: This doesn't work because aggregate functions can't be used in WHERE clauses without subqueries. The correct pattern is to compute aggregates in a subquery or WITH clause first.

## When You'll See This Pattern

This "groupwise minimum/maximum" pattern appears frequently in SQL problems where you need to find extreme values per group along with other columns from the original rows:

1. **Department Highest Salary (LeetCode 184)**: Find employees with the highest salary in each department. Similar pattern: find max salary per department, then join back to employee table.

2. **Nth Highest Salary (LeetCode 177)**: While not exactly the same, it uses similar window function techniques with `RANK()` or `DENSE_RANK()`.

3. **Game Play Analysis (LeetCode 511)**: Find the first login date for each player - identical pattern but with dates instead of years.

4. **Customers Who Bought All Products (LeetCode 1045)**: Uses grouping and counting in a similar way, though with a different aggregation goal.

The core technique of "aggregate then join" or "window function with filtering" is fundamental to solving many medium-to-hard SQL problems.

## Key Takeaways

1. **For "per group" extreme value problems**, first compute the aggregate (MIN, MAX, etc.) with `GROUP BY`, then join back to the original table to retrieve other columns. Don't try to do it all in one step.

2. **Window functions (`RANK()`, `ROW_NUMBER()`, `DENSE_RANK()`)** often provide cleaner solutions for these problems and are worth learning for modern SQL interviews.

3. **Always test with duplicate edge cases** - what if multiple rows share the same extreme value? Should you return all of them (use `RANK()`) or just one (use `ROW_NUMBER()`)? In this problem, we need all sales from the first year, so `RANK()` or a simple join works.

Related problems: [Product Sales Analysis II](/problem/product-sales-analysis-ii), [Product Sales Analysis IV](/problem/product-sales-analysis-iv), [Product Sales Analysis V](/problem/product-sales-analysis-v)
