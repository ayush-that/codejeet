---
title: "How to Solve Customers Who Never Order — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Customers Who Never Order. Easy difficulty, 71.5% acceptance rate. Topics: Database."
date: "2026-08-24"
category: "dsa-patterns"
tags: ["customers-who-never-order", "database", "easy"]
---

# How to Solve "Customers Who Never Order"

This problem asks us to find customers who have never placed an order. While it seems straightforward, it's interesting because it teaches the fundamental concept of relational database operations—specifically, how to identify records in one table that have no corresponding records in another table. The tricky part is understanding the different SQL approaches and why some are more efficient than others.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Customers table:**

```
id | name
---|------
1  | Joe
2  | Henry
3  | Sam
4  | Max
```

**Orders table:**

```
id | customerId
---|-----------
1  | 3
2  | 1
```

We need to find customers who never ordered. Looking at the data:

- Customer 1 (Joe) has an order (id 2 in Orders table)
- Customer 2 (Henry) has no orders
- Customer 3 (Sam) has an order (id 1 in Orders table)
- Customer 4 (Max) has no orders

So our result should be:

```
Customers
---------
Henry
Max
```

The challenge is how to efficiently find these customers without scanning through all possible combinations.

## Brute Force Approach

A naive approach would be to check each customer against every order:

```sql
SELECT name AS Customers
FROM Customers
WHERE id NOT IN (
    SELECT customerId FROM Orders
)
```

While this works, it's inefficient for large datasets because:

1. The subquery runs for every customer in the worst case
2. `NOT IN` with NULL values can produce unexpected results
3. It doesn't leverage database indexes optimally

However, in this specific problem, the brute force approach is actually acceptable because the problem constraints are small. But in real-world scenarios or interviews, you'd want to discuss more efficient alternatives.

## Optimal Solution

The most efficient and readable solution uses a `LEFT JOIN` with a `WHERE` clause checking for NULL values. This approach leverages database indexing and is generally the fastest way to find records with no matches in another table.

<div class="code-group">

```sql
-- Time: O(n + m) where n = customers, m = orders | Space: O(n)
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.customerId IS NULL;

-- Step-by-step explanation:
-- 1. SELECT c.name AS Customers: We want to output customer names
-- 2. FROM Customers c: Start with all customers (aliased as 'c')
-- 3. LEFT JOIN Orders o ON c.id = o.customerId:
--    - LEFT JOIN keeps ALL customers from the Customers table
--    - For customers with orders, it joins their order information
--    - For customers without orders, the order columns will be NULL
-- 4. WHERE o.customerId IS NULL: Filter to only customers where
--    no matching order was found (customerId from Orders is NULL)
```

```sql
-- Alternative using NOT EXISTS (often more efficient for large datasets)
SELECT name AS Customers
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.customerId = c.id
);

-- Step-by-step explanation:
-- 1. SELECT name AS Customers: Output customer names
-- 2. FROM Customers c: Iterate through each customer
-- 3. WHERE NOT EXISTS (...): Keep customers where no matching order exists
-- 4. SELECT 1 FROM Orders o WHERE o.customerId = c.id:
--    - Subquery checks if any order exists for the current customer
--    - Returns a row if a match is found
--    - NOT EXISTS keeps customers where this subquery returns no rows
```

```sql
-- Alternative using NOT IN (simplest but watch for NULLs)
SELECT name AS Customers
FROM Customers
WHERE id NOT IN (
    SELECT customerId FROM Orders WHERE customerId IS NOT NULL
);

-- Step-by-step explanation:
-- 1. SELECT name AS Customers: Output customer names
-- 2. FROM Customers: From all customers
-- 3. WHERE id NOT IN (...): Keep customers whose ID is not in the list
-- 4. SELECT customerId FROM Orders WHERE customerId IS NOT NULL:
--    - Get all customer IDs that have placed orders
--    - IMPORTANT: The WHERE customerId IS NOT NULL prevents issues
--      if there are NULL values in the customerId column
```

</div>

## Complexity Analysis

**Time Complexity:**

- **LEFT JOIN approach:** O(n + m) where n = number of customers, m = number of orders. The database performs a hash join or merge join, scanning each table once.
- **NOT EXISTS approach:** O(n × m) in worst case, but databases optimize this with semi-joins, making it O(n + m) in practice.
- **NOT IN approach:** O(n × m) in worst case, but with indexing it approaches O(n + m).

**Space Complexity:**

- **LEFT JOIN approach:** O(n) in worst case to store the joined result before filtering.
- **NOT EXISTS approach:** O(1) as it processes one customer at a time.
- **NOT IN approach:** O(m) to store the list of customer IDs with orders.

In practice, all three approaches are efficient for this problem, but `LEFT JOIN` is generally preferred for its clarity and consistent performance.

## Common Mistakes

1. **Forgetting to handle NULL values with NOT IN:**

   ```sql
   -- WRONG: If customerId contains NULL, this returns no results
   SELECT name FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders)

   -- RIGHT: Add WHERE customerId IS NOT NULL
   SELECT name FROM Customers WHERE id NOT IN (
       SELECT customerId FROM Orders WHERE customerId IS NOT NULL
   )
   ```

2. **Using INNER JOIN instead of LEFT JOIN:**

   ```sql
   -- WRONG: This only shows customers WITH orders
   SELECT c.name FROM Customers c JOIN Orders o ON c.id = o.customerId

   -- RIGHT: Use LEFT JOIN to keep all customers
   SELECT c.name FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId
   ```

3. **Checking the wrong column for NULL in LEFT JOIN:**

   ```sql
   -- WRONG: o.id might be NULL for valid reasons other than no match
   SELECT c.name FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL

   -- RIGHT: Check a column that should always exist if there's a match
   SELECT c.name FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.customerId IS NULL
   ```

4. **Not using table aliases for clarity:**

   ```sql
   -- Harder to read, especially with joins
   SELECT Customers.name FROM Customers LEFT JOIN Orders ON Customers.id = Orders.customerId

   -- Better: Clear and concise
   SELECT c.name FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId
   ```

## When You'll See This Pattern

This "find records with no match" pattern appears frequently in database problems:

1. **Employees Without Managers** (similar structure, find employees whose managerId doesn't exist in employee table)
2. **Products Never Ordered** (exact same pattern with different table names)
3. **Students Without Enrollment** (find students not enrolled in any course)
4. **LeetCode 183: Customers Who Never Order** (this exact problem)
5. **LeetCode 1965: Employees With Missing Information** (variation with two tables)

The core technique—using `LEFT JOIN ... WHERE IS NULL` or `NOT EXISTS`—is fundamental to relational database querying and appears in many real-world scenarios like finding inactive users, unsold products, or unassigned tasks.

## Key Takeaways

1. **LEFT JOIN with NULL check** is the most intuitive and generally efficient way to find records with no matches in another table. It clearly expresses the intent: "Keep all from table A, join with table B, show where B has no match."

2. **Understand NULL behavior**: SQL's three-valued logic (TRUE, FALSE, NULL) can surprise you, especially with `NOT IN`. Always consider if your comparison columns could contain NULLs.

3. **Choose the right tool**:
   - Use `LEFT JOIN` for clarity and when you need columns from both tables
   - Use `NOT EXISTS` for large datasets (often optimized better by query planners)
   - Use `NOT IN` for simple cases with no NULL values

4. **This pattern teaches set operations**: At its core, this is about finding the difference between two sets (all customers minus customers with orders).

[Practice this problem on CodeJeet](/problem/customers-who-never-order)
