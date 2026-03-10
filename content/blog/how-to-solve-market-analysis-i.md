---
title: "How to Solve Market Analysis I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Market Analysis I. Medium difficulty, 57.3% acceptance rate. Topics: Database."
date: "2026-06-22"
category: "dsa-patterns"
tags: ["market-analysis-i", "database", "medium"]
---

# How to Solve Market Analysis I

Market Analysis I is a classic SQL problem that tests your ability to combine multiple tables, handle date ranges, and perform conditional aggregations. The tricky part is correctly counting orders placed in 2019 for each user while ensuring all users appear in the result, even those with zero orders. This requires careful JOIN logic and understanding of NULL handling in aggregate functions.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

**Users table:**

```
user_id | join_date  | favorite_brand
1       | 2018-01-01 | Lenovo
2       | 2018-02-09 | Samsung
3       | 2018-01-19 | LG
4       | 2018-05-21 | HP
```

**Orders table:**

```
order_id | order_date | item_id | buyer_id | seller_id
1        | 2019-08-01 | 4       | 1        | 2
2        | 2018-08-02 | 2       | 1        | 3
3        | 2019-06-03 | 3       | 2        | 3
4        | 2018-07-04 | 1       | 4        | 2
5        | 2018-04-05 | 1       | 3        | 4
6        | 2019-05-06 | 2       | 2        | 4
```

**Items table:**

```
item_id | item_brand
1       | Samsung
2       | Lenovo
3       | LG
4       | HP
```

We need to find for each user:

1. Their user_id
2. Their join_date
3. How many orders they placed as buyers in 2019

For user 1: They bought items in orders 1 (2019) and 2 (2018). Only order 1 counts → 1 order in 2019
For user 2: They bought items in orders 3 (2019) and 6 (2019) → 2 orders in 2019
For user 3: They bought item in order 5 (2018) → 0 orders in 2019
For user 4: They bought item in order 4 (2018) → 0 orders in 2019

Expected result:

```
user_id | join_date  | orders_in_2019
1       | 2018-01-01 | 1
2       | 2018-02-09 | 2
3       | 2018-01-19 | 0
4       | 2018-05-21 | 0
```

## Brute Force Approach

A naive approach might try to solve this in multiple steps:

1. First, get all users
2. For each user, run a separate query to count their 2019 orders
3. Combine the results

This would involve a correlated subquery for each user, which is inefficient (O(n²) in the worst case). The SQL might look like:

```sql
SELECT
    u.user_id,
    u.join_date,
    (SELECT COUNT(*)
     FROM Orders o
     WHERE o.buyer_id = u.user_id
     AND YEAR(o.order_date) = 2019) AS orders_in_2019
FROM Users u;
```

While this works, it's inefficient for large datasets because the database has to execute the subquery for every user. Each subquery requires scanning the Orders table, making this approach O(n\*m) where n is users and m is orders.

## Optimized Approach

The key insight is that we need to:

1. Start with ALL users (even those with no orders)
2. Count ONLY orders from 2019
3. Handle users with zero orders correctly

We can achieve this efficiently with a LEFT JOIN between Users and a filtered version of Orders. The LEFT JOIN ensures all users appear in the result, and filtering Orders before the join reduces the data we need to process.

The optimization comes from:

- Filtering Orders by year 2019 BEFORE joining (reduces join size)
- Using COUNT() on a specific column from Orders that will be NULL for non-matching rows
- Understanding that COUNT(column) ignores NULL values, while COUNT(\*) counts all rows

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n + m) where n = users, m = orders in 2019
-- Space: O(n + m) for the result set
SELECT
    u.user_id AS buyer_id,           -- Rename user_id to buyer_id as required
    u.join_date,                     -- Include join_date from Users table
    COUNT(o.order_id) AS orders_in_2019  -- Count only matching orders (NULLs ignored)
FROM
    Users u                          -- Start with all users
LEFT JOIN
    Orders o                         -- Left join to include users with no orders
    ON u.user_id = o.buyer_id        -- Match user with their orders
    AND YEAR(o.order_date) = 2019    -- CRITICAL: Filter for 2019 in JOIN condition
GROUP BY
    u.user_id, u.join_date           -- Group by user to get per-user counts
ORDER BY
    u.user_id;                       -- Optional: Sort by user_id as shown in example
```

```sql
-- Alternative solution using subquery (same complexity)
-- Time: O(n + m) | Space: O(n + m)
SELECT
    u.user_id AS buyer_id,
    u.join_date,
    COALESCE(o.order_count, 0) AS orders_in_2019  -- Handle NULL with COALESCE
FROM
    Users u
LEFT JOIN (
    SELECT
        buyer_id,
        COUNT(*) AS order_count      -- Count orders per buyer in 2019
    FROM
        Orders
    WHERE
        YEAR(order_date) = 2019      -- Filter in subquery
    GROUP BY
        buyer_id
) o ON u.user_id = o.buyer_id        -- Join aggregated results
ORDER BY
    u.user_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT u.user_id AS buyer_id`**: We select user_id but rename it to buyer_id as specified in the problem requirements.

2. **`COUNT(o.order_id) AS orders_in_2019`**: We count order_id from the Orders table. When there's no matching order (LEFT JOIN returns NULL), COUNT() ignores it, giving us 0 for users with no 2019 orders.

3. **`FROM Users u LEFT JOIN Orders o`**: LEFT JOIN ensures ALL users appear in results, even those with no orders. This is crucial for getting users with 0 orders.

4. **`ON u.user_id = o.buyer_id AND YEAR(o.order_date) = 2019`**: The key insight! We filter for 2019 orders IN THE JOIN CONDITION, not in a WHERE clause. If we put `YEAR(o.order_date) = 2019` in WHERE, it would turn the LEFT JOIN into an INNER JOIN for users with orders, excluding users with no orders entirely.

5. **`GROUP BY u.user_id, u.join_date`**: We group by user to aggregate their orders. join_date is included because it's in SELECT but not aggregated.

## Complexity Analysis

**Time Complexity:** O(n + m) where n is the number of users and m is the number of orders in 2019. The database needs to:

- Scan the Users table once (O(n))
- Filter the Orders table for 2019 orders (O(m_total) where m_total is all orders)
- Perform the join operation (O(n + m_2019) with proper indexing)
- Group and aggregate the results (O(n + m_2019))

**Space Complexity:** O(n + m) for the result set, which contains all users and their aggregated order counts. The intermediate join result could be O(n + m_2019) in memory or temporary storage.

With proper indexing on `Orders(buyer_id, order_date)`, the performance would be even better as the database can quickly find orders by buyer and filter by date.

## Common Mistakes

1. **Using WHERE instead of AND in JOIN condition**:

   ```sql
   -- WRONG: Turns LEFT JOIN into INNER JOIN for users with orders
   SELECT u.user_id, u.join_date, COUNT(o.order_id)
   FROM Users u
   LEFT JOIN Orders o ON u.user_id = o.buyer_id
   WHERE YEAR(o.order_date) = 2019  -- This excludes NULL rows!
   GROUP BY u.user_id, u.join_date;
   ```

   **Fix**: Move the date filter to the JOIN condition as shown in the optimal solution.

2. **Using COUNT(\*) instead of COUNT(o.order_id)**:

   ```sql
   -- WRONG: COUNT(*) counts all rows, including those with NULL from LEFT JOIN
   SELECT u.user_id, u.join_date, COUNT(*) AS orders_in_2019
   FROM Users u
   LEFT JOIN Orders o ON u.user_id = o.buyer_id AND YEAR(o.order_date) = 2019
   GROUP BY u.user_id, u.join_date;
   ```

   This would return 1 for users with no orders instead of 0. **Fix**: Use `COUNT(o.order_id)` which ignores NULL values.

3. **Forgetting to handle the year 2019 filter correctly**: Some candidates filter by `order_date >= '2019-01-01' AND order_date < '2020-01-01'` which is actually more efficient than `YEAR(order_date) = 2019` because it allows index usage. The YEAR() function prevents index usage on order_date.

4. **Missing users in the result**: If you use INNER JOIN instead of LEFT JOIN, users with zero orders won't appear. Always check if the problem says "each user" or "all users" - that's your clue to use LEFT JOIN.

## When You'll See This Pattern

This pattern of "count with conditions while preserving all rows" appears in many SQL problems:

1. **LeetCode 1075 - Project Employees I**: Similar structure where you need to aggregate employee experience per project while handling projects with no employees.

2. **LeetCode 1211 - Queries Quality and Percentage**: Requires conditional aggregation with multiple COUNT() and AVG() operations.

3. **LeetCode 1393 - Capital Gain/Loss**: Involves conditional aggregation based on transaction type (buy/sell).

The core pattern is: **LEFT JOIN + conditional aggregation + GROUP BY**. You'll recognize it when:

- The problem asks for "all X" but some X might have zero related records
- You need to count/sum/average with specific conditions
- The result should include zeros or NULLs for missing relationships

## Key Takeaways

1. **Use LEFT JOIN when you need to preserve all rows from the left table**, especially when counting related records that might not exist. The ON clause is where you put relationship conditions AND filters for the right table.

2. **COUNT(column) ignores NULLs, COUNT(\*) doesn't**. When using LEFT JOIN, COUNT(o.column) gives you 0 for non-matching rows, while COUNT(\*) gives you 1. Choose based on whether you want to count existing relationships or all rows.

3. **Filter the right table in the JOIN condition, not WHERE clause**, when using LEFT JOIN. WHERE clauses filter the final result and can unintentionally exclude rows with NULLs from the LEFT JOIN.

[Practice this problem on CodeJeet](/problem/market-analysis-i)
