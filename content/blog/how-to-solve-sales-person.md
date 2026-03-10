---
title: "How to Solve Sales Person — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sales Person. Easy difficulty, 65.8% acceptance rate. Topics: Database."
date: "2027-09-12"
category: "dsa-patterns"
tags: ["sales-person", "database", "easy"]
---

## How to Solve Sales Person

This problem asks us to find salespeople who haven't made any sales related to a specific company called "RED." The tricky part is that we need to navigate through three interconnected tables: `SalesPerson`, `Company`, and `Orders`. We can't just look at the salespeople directly - we need to check which companies they've sold to by joining the tables together.

## Visual Walkthrough

Let's walk through a small example:

**SalesPerson table:**

```
sales_id | name  | salary | commission_rate | hire_date
---------|-------|--------|-----------------|----------
1        | John  | 100000 | 6               | 2006-04-01
2        | Amy   | 120000 | 5               | 2010-05-01
3        | Mark  | 65000  | 12              | 2008-12-25
```

**Company table:**

```
com_id | name  | city
-------|-------|---------
1      | RED   | Boston
2      | ORANGE| New York
3      | YELLOW| Boston
```

**Orders table:**

```
order_id | order_date | com_id | sales_id | amount
---------|------------|--------|----------|--------
1        | 2014-01-01 | 3      | 1        | 100000
2        | 2014-02-01 | 3      | 1        | 50000
3        | 2014-03-01 | 1      | 2        | 50000
4        | 2014-04-01 | 1      | 3        | 25000
```

Here's how we think through this:

1. **Identify RED company sales**: Look at orders where `com_id` corresponds to "RED" company. From the Orders table, orders 3 and 4 have `com_id = 1`, which matches RED company in the Company table.

2. **Find salespeople who sold to RED**: Order 3 has `sales_id = 2` (Amy), and order 4 has `sales_id = 3` (Mark). So Amy and Mark have sold to RED.

3. **Find salespeople who haven't sold to RED**: John (sales_id = 1) hasn't sold to RED (he only sold to YELLOW company). So our result should be John.

The key insight is that we need to find salespeople who are NOT in the list of those who sold to RED. This is a classic "find elements not in a subset" problem.

## Brute Force Approach

A naive approach might try to check each salesperson individually against all orders:

1. For each salesperson, scan all orders
2. For each order, check if it's from RED company
3. If found, exclude that salesperson

In SQL, this could be done with nested queries or multiple joins without optimization. While this would technically work, it would be inefficient with large datasets because it could involve scanning the Orders table multiple times (once for each salesperson).

The problem with brute force is that it doesn't leverage SQL's set-based operations efficiently. We want to find the set of salespeople who sold to RED once, then find all salespeople not in that set.

## Optimal Solution

The optimal approach uses a subquery to first identify all salespeople who HAVE sold to RED, then selects salespeople who are NOT in that list. Here's the step-by-step reasoning:

1. **Find RED company's ID**: We need to join Orders with Company to find which orders are for RED company
2. **Get salespeople who sold to RED**: From those RED orders, get the distinct sales_id values
3. **Exclude them**: Select all salespeople whose sales_id is NOT in that list

<div class="code-group">

```sql
-- Time: O(n + m) where n = orders, m = salespeople | Space: O(k) where k = salespeople who sold to RED
SELECT name
FROM SalesPerson
WHERE sales_id NOT IN (
    -- Step 1: Find all salespeople who sold to RED company
    SELECT DISTINCT o.sales_id
    FROM Orders o
    -- Step 2: Join with Company table to identify RED company orders
    JOIN Company c ON o.com_id = c.com_id
    -- Step 3: Filter for only RED company
    WHERE c.name = 'RED'
);
```

```sql
-- Alternative approach using LEFT JOIN for better performance in some databases
-- Time: O(n + m) | Space: O(k)
SELECT s.name
FROM SalesPerson s
-- Step 1: Left join to find salespeople with RED orders
LEFT JOIN (
    -- Step 2: Get distinct salespeople who sold to RED
    SELECT DISTINCT o.sales_id
    FROM Orders o
    JOIN Company c ON o.com_id = c.com_id
    WHERE c.name = 'RED'
) AS red_sales ON s.sales_id = red_sales.sales_id
-- Step 3: Only keep salespeople where no RED sales were found
WHERE red_sales.sales_id IS NULL;
```

</div>

**Line-by-line explanation of the main solution:**

1. `SELECT name FROM SalesPerson` - We want to output just the names of qualifying salespeople
2. `WHERE sales_id NOT IN (` - We're filtering salespeople based on who is NOT in a certain group
3. `SELECT DISTINCT o.sales_id` - Get unique salesperson IDs (DISTINCT is important because a salesperson might have multiple RED orders)
4. `FROM Orders o JOIN Company c ON o.com_id = c.com_id` - Join Orders with Company to know which company each order is for
5. `WHERE c.name = 'RED'` - Filter to only orders for the RED company
6. `)` - Close the subquery, completing our exclusion filter

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of orders (we need to scan all orders to find RED company orders)
- `m` = number of salespeople (we need to check each salesperson against the exclusion list)
- The JOIN operation between Orders and Company is typically O(n) if properly indexed
- The NOT IN check against the subquery result is O(m × k) in worst case, but most databases optimize this

**Space Complexity: O(k)**

- `k` = number of salespeople who sold to RED (we need to store this intermediate result)
- The DISTINCT operation reduces the size of the intermediate result
- Additional space for the final result set of salespeople not in RED sales

## Common Mistakes

1. **Forgetting DISTINCT in the subquery**: If a salesperson has multiple orders with RED company, they'll appear multiple times in the subquery. Without DISTINCT, the NOT IN check might behave unexpectedly or be less efficient.

2. **Not joining Company table**: Some candidates try to filter by company name directly in the Orders table, but company names are in the Company table, not the Orders table. You MUST join with Company to get the company name.

3. **Using wrong comparison operator**: Using `!=` instead of `NOT IN` when dealing with multiple values. For example: `WHERE sales_id != (SELECT sales_id FROM ...)` won't work correctly if multiple salespeople sold to RED.

4. **Case sensitivity with 'RED'**: SQL string comparisons are often case-sensitive. If the data has 'red', 'Red', or 'RED', make sure your comparison matches exactly. Some databases allow case-insensitive collations, but it's safer to match the exact case.

## When You'll See This Pattern

This "find elements not in a subset" pattern appears frequently in database problems:

1. **LeetCode 183: Customers Who Never Order** - Find customers who have never placed an order (similar structure: find customers not in the set of order placers)

2. **LeetCode 607: Sales Person** - This exact problem with the same pattern

3. **LeetCode 1965: Employees With Missing Information** - Find employees missing either salary or department information (using UNION and NOT IN)

4. **Any problem involving "find X without Y"** - Whenever you need to find records that don't have a related record meeting certain criteria, this NOT IN or LEFT JOIN WHERE NULL pattern is the go-to solution.

The core technique is identifying a subset (people/items with a certain property) and then finding all elements not in that subset.

## Key Takeaways

1. **Use NOT IN for exclusion logic**: When you need to find records that are NOT in a specific subset, NOT IN with a subquery is often the cleanest approach. The alternative LEFT JOIN WHERE NULL pattern can be more efficient in some databases.

2. **Always consider DISTINCT in subqueries**: When your subquery might return duplicates, use DISTINCT to avoid unexpected behavior and improve performance.

3. **Trace through table relationships**: For multi-table problems, draw the relationships mentally or on paper. In this case: SalesPerson → Orders → Company. Understanding how tables connect is crucial for writing correct JOIN conditions.

[Practice this problem on CodeJeet](/problem/sales-person)
