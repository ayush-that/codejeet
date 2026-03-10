---
title: "How to Solve Rearrange Products Table — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rearrange Products Table. Easy difficulty, 85.5% acceptance rate. Topics: Database."
date: "2026-02-04"
category: "dsa-patterns"
tags: ["rearrange-products-table", "database", "easy"]
---

# How to Solve Rearrange Products Table

This problem asks us to transform a denormalized table where each product's price across three stores is stored in separate columns (`store1`, `store2`, `store3`) into a normalized format where each product-store-price combination appears as a separate row. The challenge is that SQL doesn't have a built-in "unpivot" operation in all dialects, so we need to creatively use what's available to restructure the data.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Products` table contains:

| product_id | store1 | store2 | store3 |
| ---------- | ------ | ------ | ------ |
| 1          | 100    | 200    | 300    |
| 2          | NULL   | 150    | 250    |

We want to transform this into:

| product_id | store  | price |
| ---------- | ------ | ----- |
| 1          | store1 | 100   |
| 1          | store2 | 200   |
| 1          | store3 | 300   |
| 2          | store2 | 150   |
| 2          | store3 | 250   |

Notice that:

1. Each non-NULL price becomes a separate row
2. The store column names become values in the `store` column
3. NULL values are excluded (product 2 has no price in store1)
4. The `product_id` is preserved for each row

The transformation essentially requires us to "melt" or "unpivot" the table - turning columns into rows. In SQL, we can achieve this by creating a union of three separate queries, each selecting from one of the store columns.

## Brute Force Approach

While there's no traditional "brute force" for this SQL problem, a naive approach might involve:

1. Creating three temporary tables (one for each store)
2. Inserting data into each
3. Unioning them together

This would work but is unnecessarily complex. Another suboptimal approach would be to use procedural code (like a cursor or loop) to iterate through each row and generate three output rows - this would be inefficient and not take advantage of SQL's set-based operations.

The key insight is that we need to treat each store column independently while maintaining the product_id, then combine the results.

## Optimal Solution

The cleanest solution uses the `UNION ALL` operator to combine results from three separate queries - one for each store column. Each query selects the `product_id`, a literal string for the store name, and the price from that store's column, filtering out NULL prices.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows in Products table
-- Space: O(n) for the result set
SELECT
    product_id,
    'store1' AS store,  -- Create store column with literal value 'store1'
    store1 AS price      -- Get price from store1 column
FROM
    Products
WHERE
    store1 IS NOT NULL   -- Only include rows where store1 has a price

UNION ALL  -- Combine results, keeping duplicates (though none exist here)

SELECT
    product_id,
    'store2' AS store,  -- Create store column with literal value 'store2'
    store2 AS price      -- Get price from store2 column
FROM
    Products
WHERE
    store2 IS NOT NULL   -- Only include rows where store2 has a price

UNION ALL  -- Combine results from all three queries

SELECT
    product_id,
    'store3' AS store,  -- Create store column with literal value 'store3'
    store3 AS price      -- Get price from store3 column
FROM
    Products
WHERE
    store3 IS NOT NULL   -- Only include rows where store3 has a price

-- Optional: ORDER BY product_id, store for consistent output
ORDER BY
    product_id,
    store;
```

```sql
-- Alternative using CASE statements (less readable but single query)
-- Time: O(n) | Space: O(n)
SELECT
    product_id,
    store,
    price
FROM (
    SELECT
        product_id,
        CASE
            WHEN store1 IS NOT NULL THEN 'store1'
            WHEN store2 IS NOT NULL THEN 'store2'
            WHEN store3 IS NOT NULL THEN 'store3'
        END AS store,
        CASE
            WHEN store1 IS NOT NULL THEN store1
            WHEN store2 IS NOT NULL THEN store2
            WHEN store3 IS NOT NULL THEN store3
        END AS price
    FROM
        Products
    WHERE
        store1 IS NOT NULL
        OR store2 IS NOT NULL
        OR store3 IS NOT NULL
) AS unpivoted
WHERE
    price IS NOT NULL
ORDER BY
    product_id,
    store;
```

</div>

**Why UNION ALL works better than UNION:**

- `UNION` removes duplicates, which requires additional sorting and comparison
- `UNION ALL` simply concatenates results, which is faster
- In this case, there are no duplicates because each product can only have one price per store, so `UNION ALL` is safe and more efficient

**Step-by-step explanation:**

1. **First query:** Selects all products with prices in store1. For each row, we output `product_id`, the literal string `'store1'`, and the `store1` price value.
2. **Second query:** Same logic for store2. The `UNION ALL` combines these results with the first query's results.
3. **Third query:** Same logic for store3, combined with previous results.
4. **WHERE clauses:** Crucial for excluding NULL values. Without these, we'd get rows with NULL prices.
5. **ORDER BY:** Optional but makes output more readable by sorting first by product, then by store name.

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Products table. Each of the three SELECT queries scans the entire table, but most database optimizers will recognize this pattern and optimize the execution. The UNION ALL operations are linear in the number of rows returned.

**Space Complexity:** O(n) for the result set. In the worst case where every product has a price in all three stores, we generate 3n rows in the output.

**Why this is efficient:**

- Single pass through the data for each store column (or optimized to fewer passes by the query planner)
- No expensive joins or subqueries
- Minimal intermediate storage

## Common Mistakes

1. **Forgetting to filter NULL values:** Without `WHERE storeX IS NOT NULL`, you'll get rows with NULL prices in the output. This violates the requirement that we should only include products that actually have prices in each store.

2. **Using UNION instead of UNION ALL:** While both would produce correct results, `UNION` performs duplicate elimination which is unnecessary overhead since there are no duplicates across the three queries (each product-store combination is unique).

3. **Incorrect column aliasing:** Forgetting to alias the store column (e.g., just using `'store1'` without `AS store`) or price column can lead to mismatched column names in the final result set.

4. **Trying to use PIVOT/UNPIVOT syntax:** Some candidates try to use vendor-specific UNPIVOT syntax (available in SQL Server, Oracle). While this would work in those databases, it's not standard SQL and won't work in MySQL or LeetCode's environment.

5. **Overcomplicating with joins or subqueries:** Some candidates create derived tables or use complex joins, which are unnecessary. The UNION ALL approach is the simplest and most readable.

## When You'll See This Pattern

This "unpivoting" or "melting" pattern appears whenever you need to transform columns into rows. It's common in:

1. **Data normalization tasks:** Converting wide tables with many columns into long format for analysis.
2. **Reporting scenarios:** When you need to compare values that are stored in separate columns.
3. **ETL processes:** Transforming data from source systems into data warehouse schemas.

**Related LeetCode problems:**

- **1795. Rearrange Products Table** (this problem) - The classic unpivoting example
- **1777. Product's Price for Each Store** - The inverse operation (pivoting rows into columns)
- **2253. Dynamic Unpivoting of a Table** (Hard) - A more complex version where the number of stores isn't fixed

The core technique of using `UNION ALL` to convert columns to rows is reusable in many SQL problems where data needs restructuring.

## Key Takeaways

1. **UNION ALL is your friend for unpivoting:** When you need to convert multiple columns into rows, consider creating separate queries for each column and combining them with `UNION ALL`. This approach works in all SQL dialects.

2. **Always handle NULLs explicitly:** When transforming data, NULL values often need special handling. In this case, we filter them out with `WHERE column IS NOT NULL`.

3. **Think in sets, not rows:** SQL works best when you think about operations on entire sets of data. The UNION ALL approach processes all rows at once rather than iterating through them.

4. **Column aliasing matters:** When combining queries with UNION, ensure all queries have the same number of columns with compatible data types and meaningful aliases.

Remember: The ability to restructure data is a fundamental SQL skill. Practice recognizing when you need to pivot (rows to columns) or unpivot (columns to rows), as these transformations are common in real-world data processing tasks.

Related problems: [Product's Price for Each Store](/problem/products-price-for-each-store), [Dynamic Unpivoting of a Table](/problem/dynamic-unpivoting-of-a-table)
