---
title: "How to Solve Customer Placing the Largest Number of Orders — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Customer Placing the Largest Number of Orders. Easy difficulty, 64.3% acceptance rate. Topics: Database."
date: "2027-05-24"
category: "dsa-patterns"
tags: ["customer-placing-the-largest-number-of-orders", "database", "easy"]
---

# How to Solve "Customer Placing the Largest Number of Orders"

This problem asks us to find the customer who has placed the most orders from an `Orders` table. While it's categorized as "Easy," what makes it interesting is that it tests your understanding of SQL aggregation, grouping, and ordering—skills that are fundamental for any data-related role. The tricky part isn't the complexity but ensuring you handle ties correctly (though the problem guarantees a single customer with the most orders) and structure your query efficiently.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Orders` table contains:

| order_number | customer_number |
| ------------ | --------------- |
| 1            | 1               |
| 2            | 2               |
| 3            | 1               |
| 4            | 3               |
| 5            | 3               |
| 6            | 1               |
| 7            | 2               |

**Step 1: Count orders per customer**  
We need to group by `customer_number` and count how many orders each has:

- Customer 1: orders 1, 3, 6 → 3 orders
- Customer 2: orders 2, 7 → 2 orders
- Customer 3: orders 4, 5 → 2 orders

**Step 2: Find the maximum count**  
From the counts above, the maximum is 3 orders.

**Step 3: Identify the customer with that count**  
Customer 1 has 3 orders, so they are the customer who placed the largest number of orders.

The key insight is that we need to perform aggregation (counting) first, then find which customer has the highest count. This naturally leads to using `GROUP BY` with `COUNT()`, then ordering or filtering to get the top result.

## Brute Force Approach

In SQL problems, a "brute force" approach often means writing an inefficient query that might work on small datasets but fails on larger ones due to poor performance. For this problem, a naive approach might involve:

1. Creating a subquery that counts orders for each customer
2. Using that subquery in a `WHERE` clause with a nested `MAX()` to find the maximum count
3. This could lead to multiple scans of the table or suboptimal execution plans

While SQL doesn't have the same Big-O notation as algorithmic problems, inefficient approaches might involve:

- Multiple passes through the data
- Unnecessary joins or subqueries
- Not leveraging indexes properly

However, for this specific problem, even the "brute force" approach using a subquery with `MAX()` would likely be acceptable since the table structure is simple. The real distinction is between clear, readable SQL and unnecessarily complex solutions.

## Optimal Solution

The optimal solution uses `GROUP BY` to aggregate orders by customer, `COUNT()` to get the order counts, `ORDER BY` to sort descending, and `LIMIT` to get just the top result. This approach is clean, efficient, and easy to understand.

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, Space: O(n) for grouping
-- Step 1: Group orders by customer to count each customer's orders
SELECT customer_number
FROM Orders
-- Step 2: Group by customer to aggregate their orders
GROUP BY customer_number
-- Step 3: Order by count in descending order to get highest first
ORDER BY COUNT(order_number) DESC
-- Step 4: Limit to just the top result (customer with most orders)
LIMIT 1;
```

```sql
-- Alternative approach using a subquery (also valid)
-- Time: O(n) for counting + O(n) for filtering, Space: O(n)
SELECT customer_number
FROM Orders
GROUP BY customer_number
-- Having clause ensures we only get customers with the maximum count
HAVING COUNT(order_number) = (
    -- Subquery finds the maximum order count across all customers
    SELECT MAX(order_count)
    FROM (
        SELECT COUNT(order_number) AS order_count
        FROM Orders
        GROUP BY customer_number
    ) AS counts
);
```

</div>

**Line-by-line explanation of the first (preferred) approach:**

1. **`SELECT customer_number`**: We only need to return the customer identifier, not the count.
2. **`FROM Orders`**: Specify the table we're querying.
3. **`GROUP BY customer_number`**: This groups all rows with the same `customer_number` together, allowing us to perform aggregate operations per customer.
4. **`ORDER BY COUNT(order_number) DESC`**: After grouping, we count the orders per customer using `COUNT(order_number)`. The `DESC` (descending) puts the customer with the highest count first.
5. **`LIMIT 1`**: Since we sorted descending, the first row has the highest count. `LIMIT 1` returns only that row.

The second approach uses a subquery to find the maximum count first, then filters to only customers with that count. While correct, it's more verbose and may be less efficient depending on the database optimizer.

## Complexity Analysis

**Time Complexity: O(n log n)**

- The `GROUP BY` operation typically requires sorting or hashing, which takes O(n log n) time where n is the number of rows in the Orders table.
- The `ORDER BY` with `COUNT()` also requires sorting, adding to the O(n log n) complexity.
- In practice, database optimizers may combine these operations, but the dominant factor is the sorting for grouping and ordering.

**Space Complexity: O(n)**

- The `GROUP BY` creates groups for each unique customer. In the worst case, if every order is from a different customer, we'd have n groups.
- The intermediate result set containing customer numbers and their counts also requires O(n) space.

## Common Mistakes

1. **Forgetting to handle NULL values**: While not an issue in this specific problem (since `order_number` is primary key and thus non-null), in real-world scenarios, `COUNT(*)` and `COUNT(column_name)` behave differently with NULLs. `COUNT(*)` counts all rows, while `COUNT(column_name)` counts only non-null values in that column.

2. **Using `SELECT *` instead of `SELECT customer_number`**: The problem asks specifically for the customer number. While `SELECT *` might work if the table only has two columns, it's poor practice and could fail if the table schema changes.

3. **Not using `LIMIT 1` or handling ties incorrectly**: Without `LIMIT 1`, you'd get all customers sorted by order count. If there were ties for most orders, you'd get multiple customers. The problem states there will be exactly one customer with the most orders, but in interviews, you should mention how you'd handle ties (using `RANK()` or `DENSE_RANK()` window functions).

4. **Confusing `WHERE` and `HAVING`**: Attempting to filter by count in the `WHERE` clause instead of `HAVING`. `WHERE` filters rows before grouping, `HAVING` filters after grouping. `COUNT()` can only be used in `HAVING`, `ORDER BY`, or `SELECT` clauses when used with `GROUP BY`.

## When You'll See This Pattern

This pattern of "find the record with the maximum/minimum aggregated value" appears frequently in SQL problems:

1. **Department Highest Salary (LeetCode 184)**: Find employees with the highest salary in each department. Similar pattern but requires partitioning by department.
2. **Nth Highest Salary (LeetCode 177)**: Find the nth highest salary using similar ordering and limiting techniques.
3. **Biggest Single Number (LeetCode 619)**: Find the largest number that appears only once in a table, using grouping and counting.

The core technique—grouping, aggregating, then finding extreme values—is fundamental to data analysis SQL. You'll use it whenever you need to answer questions like "who has the most X," "what is the average Y per Z," or "find records above the group average."

## Key Takeaways

1. **`GROUP BY` + `COUNT()` + `ORDER BY` + `LIMIT` is a powerful pattern** for finding records with maximum/minimum aggregated values. This combination solves a wide range of "top N" problems in SQL.

2. **Understand the difference between `WHERE` and `HAVING`**: `WHERE` filters individual rows before aggregation; `HAVING` filters groups after aggregation. This distinction is crucial for writing correct aggregate queries.

3. **Consider window functions for more complex scenarios**: While not needed here, problems with ties or requiring rankings within groups often benefit from `RANK()`, `DENSE_RANK()`, or `ROW_NUMBER()` window functions.

[Practice this problem on CodeJeet](/problem/customer-placing-the-largest-number-of-orders)
