---
title: "How to Solve Customer Who Visited but Did Not Make Any Transactions — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Customer Who Visited but Did Not Make Any Transactions. Easy difficulty, 67.6% acceptance rate. Topics: Database."
date: "2026-09-22"
category: "dsa-patterns"
tags: ["customer-who-visited-but-did-not-make-any-transactions", "database", "easy"]
---

# How to Solve "Customer Who Visited but Did Not Make Any Transactions"

This problem asks us to find customers who visited a store but didn't make any transactions. While it's categorized as "Easy" in difficulty, it's interesting because it tests your understanding of SQL joins, NULL handling, and set operations. The tricky part is recognizing that we need to find records that exist in one table but have no corresponding records in another table, which is a common pattern in database problems.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Visits table:**

```
visit_id | customer_id
---------|------------
1        | 23
2        | 9
3        | 30
4        | 54
5        | 96
6        | 54
7        | 54
```

**Transactions table:**

```
transaction_id | visit_id | amount
---------------|----------|-------
2              | 5        | 310
3              | 5        | 300
4              | 5        | 200
5              | 1        | 150
6              | 1        | 150
```

**Step-by-step reasoning:**

1. Customer 23 (visit_id 1) made transactions (transaction_id 5 and 6), so they should NOT be in our result.
2. Customer 9 (visit_id 2) visited but has no transactions, so they SHOULD be in our result.
3. Customer 30 (visit_id 3) visited but has no transactions, so they SHOULD be in our result.
4. Customer 54 (visits 4, 6, 7) visited three times but has no transactions for any of those visits, so they SHOULD be in our result (count = 3).
5. Customer 96 (visit_id 5) made transactions (transaction_id 2, 3, 4), so they should NOT be in our result.

**Expected result:**

```
customer_id | count_no_trans
------------|---------------
9           | 1
30          | 1
54          | 3
```

The key insight is that we need to find visits that don't have a matching record in the transactions table.

## Brute Force Approach

A naive approach might try to check each visit individually against all transactions:

```sql
-- Inefficient approach (conceptual, not actual SQL)
SELECT customer_id, COUNT(*) as count_no_trans
FROM Visits
WHERE visit_id NOT IN (
    SELECT DISTINCT visit_id FROM Transactions
)
GROUP BY customer_id
ORDER BY customer_id;
```

While this approach would technically work, it's inefficient because:

1. The `NOT IN` subquery with `DISTINCT` creates an intermediate result set
2. For each visit, we're checking membership in a potentially large list
3. The database might need to scan the entire transactions table multiple times

However, in SQL, this approach is actually acceptable for this problem since both tables are relatively small in typical interview scenarios. The real "brute force" thinking here would be trying to solve this without understanding how joins work with NULL values.

## Optimal Solution

The optimal solution uses a LEFT JOIN to find visits without corresponding transactions. When we LEFT JOIN Visits to Transactions, visits without transactions will have NULL values in the transaction columns. We can then filter for those NULL values and count them per customer.

<div class="code-group">

```sql
-- Time: O(n + m) where n = visits, m = transactions | Space: O(n) for result set
SELECT
    v.customer_id,                    -- Select customer ID from Visits table
    COUNT(*) AS count_no_trans        -- Count how many times each customer visited without transaction
FROM
    Visits v                          -- Start with all visits
    LEFT JOIN Transactions t          -- Join with transactions (keeps all visits)
        ON v.visit_id = t.visit_id    -- Match on visit_id
WHERE
    t.transaction_id IS NULL          -- Filter for visits with no transaction (NULL after LEFT JOIN)
GROUP BY
    v.customer_id                     -- Group results by customer
ORDER BY
    v.customer_id;                    -- Optional: sort by customer_id for consistent output
```

```sql
-- Alternative using NOT EXISTS (same complexity, different approach)
SELECT
    v.customer_id,
    COUNT(*) AS count_no_trans
FROM
    Visits v
WHERE
    NOT EXISTS (                      -- Check for each visit if a transaction exists
        SELECT 1
        FROM Transactions t
        WHERE t.visit_id = v.visit_id
    )
GROUP BY
    v.customer_id
ORDER BY
    v.customer_id;
```

```sql
-- Alternative using NOT IN (similar to brute force but optimized by database)
SELECT
    v.customer_id,
    COUNT(*) AS count_no_trans
FROM
    Visits v
WHERE
    v.visit_id NOT IN (               -- Find visits not in transactions
        SELECT visit_id
        FROM Transactions
    )
GROUP BY
    v.customer_id
ORDER BY
    v.customer_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT v.customer_id`**: We want to report which customers had visits without transactions.
2. **`COUNT(*) AS count_no_trans`**: Count how many such visits each customer had.
3. **`FROM Visits v`**: Start with the Visits table (aliased as 'v' for brevity).
4. **`LEFT JOIN Transactions t ON v.visit_id = t.visit_id`**: This is the key operation. A LEFT JOIN keeps ALL records from the left table (Visits), matching them with Transactions where possible. If no match exists, NULL values are filled in for the Transaction columns.
5. **`WHERE t.transaction_id IS NULL`**: After the LEFT JOIN, visits without transactions will have NULL in all Transaction columns. We filter for these.
6. **`GROUP BY v.customer_id`**: Group the filtered results by customer to count visits per customer.
7. **`ORDER BY v.customer_id`**: Optional but good practice for consistent output ordering.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in Visits table
- `m` = number of rows in Transactions table
- The LEFT JOIN operation needs to scan both tables once. Modern databases use hash joins or merge joins that are linear in the size of the tables.
- The GROUP BY operation adds O(n log n) in worst case, but since we're filtering first (WHERE clause), we're only grouping the visits without transactions, which is typically smaller than n.

**Space Complexity: O(k)**

- `k` = number of customers with visits but no transactions (output size)
- The database needs to store the result set, which contains one row per customer with at least one visit without a transaction.
- Intermediate join results might use O(n) space, but this is managed by the database engine.

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**: This is the most common mistake. INNER JOIN only returns records that have matches in both tables, so you'd only get customers who made transactions, which is the opposite of what we want.

2. **Forgetting to handle NULL values correctly**: After a LEFT JOIN, you must check for NULL in a column that would always exist if there was a match (like transaction_id). Checking `t.visit_id IS NULL` would also work.

3. **Incorrect GROUP BY placement**: Some candidates try to GROUP BY before filtering, which gives wrong counts. You must filter first (visits without transactions), THEN group by customer.

4. **Counting wrong column in SELECT**: Using `COUNT(t.transaction_id)` instead of `COUNT(*)` would give 0 for all rows (since transaction_id is NULL), not the count of visits. Always use `COUNT(*)` when you want to count rows.

5. **Not considering duplicate visit_ids**: While visit_id is unique in Visits, the problem doesn't specify it's unique in Transactions. A visit could have multiple transactions. Our solution handles this correctly because a visit with ANY transaction won't have NULL after the LEFT JOIN.

## When You'll See This Pattern

This "find records in A with no match in B" pattern appears frequently in database problems:

1. **"Sellers With No Sales" (Easy)**: Find sellers who made no sales in a given period. Same pattern: LEFT JOIN sellers to sales, filter for NULL.

2. **"Employees With Missing Information" (Easy)**: Find employees missing either salary or department information. Uses FULL OUTER JOIN or UNION of two LEFT JOINs.

3. **"Patients With a Condition" (Easy)**: While not exactly the same, it involves filtering records based on the absence/presence of certain patterns in text fields.

4. **"Market Analysis I" (Medium)**: More complex version where you need to count orders in 2019 for each buyer, with 0 for those who made no orders.

The core technique is using OUTER JOINs (LEFT, RIGHT, or FULL) to find mismatches between two tables, then filtering for NULL values in key columns from the "optional" table.

## Key Takeaways

1. **Use LEFT JOIN for "A without B" queries**: When you need to find records in one table that don't have corresponding records in another table, LEFT JOIN with NULL check is the standard pattern.

2. **Check for NULL in non-nullable columns**: After a LEFT JOIN, filter using a column that would always have a value if a match existed (like a primary key from the right table).

3. **Understand the difference between JOIN types**:
   - INNER JOIN: Only matching records
   - LEFT JOIN: All from left, matching from right (NULL if no match)
   - RIGHT JOIN: All from right, matching from left (NULL if no match)
   - FULL OUTER JOIN: All from both (NULL where no match)

4. **Filter before grouping when possible**: Apply WHERE conditions to reduce the dataset before GROUP BY operations for better performance.

Related problems: [Sellers With No Sales](/problem/sellers-with-no-sales)
