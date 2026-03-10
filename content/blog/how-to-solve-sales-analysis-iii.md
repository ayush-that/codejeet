---
title: "How to Solve Sales Analysis III — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sales Analysis III. Easy difficulty, 47.3% acceptance rate. Topics: Database."
date: "2028-07-26"
category: "dsa-patterns"
tags: ["sales-analysis-iii", "database", "easy"]
---

# How to Solve Sales Analysis III

This problem asks us to find products that were only sold in the first quarter of 2019 (between January 1, 2019 and March 31, 2019). The tricky part is understanding the "only" condition - we need products that had sales in Q1 2019 but had NO sales outside that period. Many candidates mistakenly select products that simply had sales in Q1 without checking if they also had sales in other quarters.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Product Table:**

```
product_id | product_name
-----------|-------------
1          | S8
2          | G4
3          | iPhone
```

**Sales Table:**

```
sale_id | product_id | sale_date
--------|------------|-----------
1       | 1          | 2019-01-21  (Q1 2019)
2       | 1          | 2019-04-28  (Q2 2019)
3       | 2          | 2019-02-10  (Q1 2019)
4       | 3          | 2018-12-01  (2018, not Q1 2019)
5       | 3          | 2019-01-01  (Q1 2019)
```

**Step-by-step reasoning:**

1. **Product 1 (S8):** Has sales in Q1 2019 (sale_id 1) AND outside Q1 2019 (sale_id 2 in April). ❌ Should NOT be included.
2. **Product 2 (G4):** Has sales only in Q1 2019 (sale_id 3). ✅ Should be included.
3. **Product 3 (iPhone):** Has sales in Q1 2019 (sale_id 5) AND outside Q1 2019 (sale_id 4 in 2018). ❌ Should NOT be included.

The key insight is we need to check two conditions:

1. The product had at least one sale in Q1 2019
2. The product had NO sales outside Q1 2019

## Brute Force Approach

A naive approach would be to:

1. First find all products sold in Q1 2019
2. Then check each of those products to see if they have any sales outside Q1 2019

While this approach would work, it's inefficient because it requires multiple passes through the data and potentially complex subqueries. More importantly, many candidates try to solve this with a single WHERE clause that only checks for sales in Q1 2019, completely missing the "only" condition.

The common incorrect solution looks like:

```sql
SELECT p.product_id, p.product_name
FROM Product p
JOIN Sales s ON p.product_id = s.product_id
WHERE s.sale_date BETWEEN '2019-01-01' AND '2019-03-31'
```

This fails because it includes products that also have sales outside Q1 2019. The JOIN will match any sale in Q1, but doesn't exclude products with other sales.

## Optimal Solution

The optimal solution uses aggregation with HAVING clause to check both conditions simultaneously. We group by product and then filter groups where:

1. The minimum sale date is on or after January 1, 2019 (ensuring no sales before Q1)
2. The maximum sale date is on or before March 31, 2019 (ensuring no sales after Q1)

This works because if ALL sales for a product fall within Q1 2019, then both the earliest and latest sales must be within that period.

<div class="code-group">

```sql
-- Time: O(n) where n is number of sales records | Space: O(m) where m is number of products
SELECT
    p.product_id,
    p.product_name
FROM
    Product p
    JOIN Sales s ON p.product_id = s.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING
    -- Condition 1: No sales before Q1 2019 (earliest sale is on/after Jan 1, 2019)
    MIN(s.sale_date) >= '2019-01-01'
    -- Condition 2: No sales after Q1 2019 (latest sale is on/before Mar 31, 2019)
    AND MAX(s.sale_date) <= '2019-03-31';
```

```sql
-- Alternative approach using SUM with CASE (more explicit but less efficient)
SELECT
    p.product_id,
    p.product_name
FROM
    Product p
    JOIN Sales s ON p.product_id = s.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING
    -- Count sales in Q1 2019
    SUM(CASE WHEN s.sale_date BETWEEN '2019-01-01' AND '2019-03-31' THEN 1 ELSE 0 END) > 0
    -- Ensure no sales outside Q1 2019
    AND SUM(CASE WHEN s.sale_date NOT BETWEEN '2019-01-01' AND '2019-03-31' THEN 1 ELSE 0 END) = 0;
```

</div>

**Line-by-line explanation:**

1. **`JOIN Sales s ON p.product_id = s.product_id`**: Connect products with their sales records
2. **`GROUP BY p.product_id, p.product_name`**: Group all sales by product (MySQL requires product_name in GROUP BY even though product_id is unique)
3. **`MIN(s.sale_date) >= '2019-01-01'`**: The earliest sale for this product must be in 2019 or later (no sales in 2018 or earlier)
4. **`MAX(s.sale_date) <= '2019-03-31'`**: The latest sale for this product must be in March 2019 or earlier (no sales in April 2019 or later)

The alternative approach using `SUM(CASE...)` is more explicit about the logic but requires scanning through all sales twice (once for each condition), making it slightly less efficient.

## Complexity Analysis

**Time Complexity:** O(N + M) where N is the number of rows in the Sales table and M is the number of rows in the Product table. The database needs to:

1. Perform the JOIN operation (O(N) in the best case with proper indexing)
2. Group the results by product_id (O(N) with hash-based grouping)
3. Apply the HAVING filter (O(M) where M is the number of product groups)

**Space Complexity:** O(M) where M is the number of unique products. The database needs to maintain aggregation state for each product group.

With proper indexing on `Sales(product_id, sale_date)` and `Product(product_id)`, the JOIN and grouping operations become very efficient.

## Common Mistakes

1. **Missing the "only" condition**: The most common mistake is selecting products that were sold in Q1 2019 without checking if they were also sold outside that period. Always remember to verify both inclusion AND exclusion criteria.

2. **Incorrect date boundaries**: Using `BETWEEN '2019-01-01' AND '2019-03-31'` is correct for dates, but some candidates use `'2019-03-30'` or forget that BETWEEN is inclusive. For datetime columns, you might need `'2019-03-31 23:59:59'`.

3. **Forgetting to handle products with no sales**: While not explicitly mentioned in the problem, in real scenarios you might need to consider products with no sales at all. These should NOT be included since they weren't sold in Q1 2019.

4. **Using WHERE instead of HAVING**: Attempting to filter individual sales with WHERE clause won't work because we need to filter based on aggregated properties of the entire product group. WHERE filters rows before grouping, HAVING filters groups after aggregation.

## When You'll See This Pattern

This "bounded range" pattern appears frequently in SQL problems where you need to ensure all values in a group fall within a specific range:

1. **Sales Analysis II**: Similar problem but looking for products sold only to specific customers or in specific quantities.

2. **Big Countries (LeetCode 595)**: Finding countries with area OR population above certain thresholds (though simpler, it uses similar conditional logic).

3. **Classes with More Than 5 Students (LeetCode 596)**: Uses HAVING with COUNT aggregation to filter groups.

4. **Customer Placing the Largest Number of Orders (LeetCode 586)**: Uses aggregation and ordering to find maximum.

The core pattern is: **GROUP BY + HAVING with aggregate functions (MIN, MAX, COUNT, SUM)** when you need to filter groups based on properties of all their members.

## Key Takeaways

1. **Use MIN/MAX for range validation**: When you need to ensure ALL values in a group fall within a range, check that both the minimum AND maximum values are within bounds. This is more efficient than checking each value individually.

2. **Understand WHERE vs HAVING**: WHERE filters individual rows BEFORE grouping. HAVING filters entire groups AFTER aggregation. Use HAVING when your condition involves aggregate functions or properties of the entire group.

3. **Read "only" carefully**: In SQL problems, "only sold in Q1" means "sold in Q1 AND NOT sold outside Q1". Always translate "only" into two conditions: one for inclusion and one for exclusion.

Related problems: [Sales Analysis II](/problem/sales-analysis-ii)
