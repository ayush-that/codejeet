---
title: "How to Solve Find Customer Referee — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Customer Referee. Easy difficulty, 72.6% acceptance rate. Topics: Database."
date: "2026-05-29"
category: "dsa-patterns"
tags: ["find-customer-referee", "database", "easy"]
---

# How to Solve Find Customer Referee

This problem asks us to find all customer names from a table where their referee is NOT customer ID 2. While seemingly straightforward, the subtlety lies in handling NULL values correctly—customers with no referee should still be included in the results, which trips up many candidates who forget that NULL comparisons behave differently in SQL.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this `Customer` table:

| id  | name | referee_id |
| --- | ---- | ---------- |
| 1   | Will | NULL       |
| 2   | Jane | NULL       |
| 3   | Alex | 2          |
| 4   | Bill | 1          |
| 5   | Zack | 1          |
| 6   | Mark | 2          |

We want customers whose referee is NOT ID 2. Let's examine each row:

1. **Will (id=1, referee_id=NULL)**: NULL means no referee. Should be included since NULL ≠ 2.
2. **Jane (id=2, referee_id=NULL)**: Also no referee. Should be included.
3. **Alex (id=3, referee_id=2)**: Referee is ID 2. Should be EXCLUDED.
4. **Bill (id=4, referee_id=1)**: Referee is ID 1 (not 2). Should be included.
5. **Zack (id=5, referee_id=1)**: Referee is ID 1 (not 2). Should be included.
6. **Mark (id=6, referee_id=2)**: Referee is ID 2. Should be EXCLUDED.

The correct result should be: Will, Jane, Bill, Zack.

The key insight: In SQL, `referee_id != 2` evaluates to UNKNOWN (not TRUE) when `referee_id` is NULL. Since WHERE clauses only include rows where the condition is TRUE, rows with NULL referee_id would be incorrectly excluded if we only check `referee_id != 2`.

## Brute Force Approach

A naive approach might be to simply filter with `WHERE referee_id != 2`. Let's see why this fails:

```sql
-- INCORRECT SOLUTION
SELECT name
FROM Customer
WHERE referee_id != 2;
```

This would only return: Bill and Zack.

Why? Because:

- `NULL != 2` evaluates to UNKNOWN (not TRUE)
- WHERE clauses exclude rows where the condition is UNKNOWN or FALSE
- Will and Jane (with NULL referee_id) get filtered out

This demonstrates why we need to explicitly handle NULL values. The brute force approach fails because it doesn't account for SQL's three-valued logic (TRUE, FALSE, UNKNOWN).

## Optimal Solution

The correct solution handles NULL values explicitly. We have two main approaches:

**Approach 1: Using OR to include NULLs**
We explicitly check for NULL values OR values not equal to 2.

**Approach 2: Using COALESCE**
We convert NULL to a value that's definitely not 2, then compare.

Both approaches are optimal with O(n) time complexity where n is the number of rows in the table.

<div class="code-group">

```sql
-- Approach 1: Using OR (Most intuitive)
-- Time: O(n) where n = number of rows | Space: O(1)
SELECT name
FROM Customer
WHERE referee_id != 2  -- Include rows where referee is not 2
   OR referee_id IS NULL;  -- Also include rows with no referee

-- Step-by-step explanation:
-- 1. SELECT name: We only need the customer names
-- 2. FROM Customer: Query the Customer table
-- 3. WHERE clause has two conditions joined by OR:
--    - referee_id != 2: TRUE when referee exists and is not ID 2
--    - referee_id IS NULL: TRUE when there's no referee
-- 4. Rows satisfy the WHERE clause if EITHER condition is TRUE
-- 5. This correctly includes customers with NULL referee_id
```

```sql
-- Approach 2: Using COALESCE
-- Time: O(n) where n = number of rows | Space: O(1)
SELECT name
FROM Customer
WHERE COALESCE(referee_id, 0) != 2;

-- Step-by-step explanation:
-- 1. COALESCE(referee_id, 0): Returns the first non-NULL value
--    - If referee_id is not NULL, returns referee_id
--    - If referee_id is NULL, returns 0
-- 2. We then compare this result to 2
-- 3. Since 0 != 2, rows with NULL referee_id are included
-- 4. Note: We use 0 assuming no customer has ID 0
--    Could use any value definitely not equal to 2
```

```sql
-- Approach 3: Using NOT IN (Alternative approach)
-- Time: O(n) where n = number of rows | Space: O(1)
SELECT name
FROM Customer
WHERE referee_id NOT IN (2);

-- Step-by-step explanation:
-- 1. NOT IN (2): Check if referee_id is not in the list containing only 2
-- 2. In most SQL dialects, NOT IN handles NULLs correctly
--    (NULL NOT IN (2) evaluates to TRUE)
-- 3. However, be cautious: NOT IN can behave unexpectedly with NULLs
--    in some edge cases when the list contains NULL
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Customer table. The database must scan each row to evaluate the WHERE condition. Even with indexes, the database typically needs to examine each row to check the condition.

**Space Complexity:** O(1) for the query itself, not counting the result set. The database only needs to store the result set temporarily before returning it to the client. The memory usage for processing is constant regardless of input size.

## Common Mistakes

1. **Forgetting NULL handling**: The most common mistake is writing `WHERE referee_id != 2` without considering NULL values. Remember: `NULL != 2` evaluates to UNKNOWN, not TRUE.

2. **Using AND instead of OR**: Some candidates write `WHERE referee_id != 2 AND referee_id IS NULL`, which would return no rows because a column cannot be both not equal to 2 AND NULL simultaneously.

3. **Incorrect COALESCE value**: When using `COALESCE(referee_id, X) != 2`, ensure X is a value that doesn't exist as a valid customer ID. If a customer could have ID 0, using 0 would incorrectly include customers whose referee is ID 0.

4. **Misunderstanding NOT IN with NULLs**: While `WHERE referee_id NOT IN (2)` often works, `WHERE referee_id NOT IN (2, NULL)` behaves differently. `NULL NOT IN (2, NULL)` evaluates to UNKNOWN, not TRUE, because the presence of NULL in the list makes the entire expression UNKNOWN.

## When You'll See This Pattern

This problem teaches the crucial SQL concept of **NULL handling in comparisons**, which appears in many database problems:

1. **Second Highest Salary (LeetCode 176)**: Requires handling cases where there's no second highest salary (NULL result).

2. **Employees Earning More Than Their Managers (LeetCode 181)**: Involves joining tables and comparing salaries, where NULL manager IDs need consideration.

3. **Combine Two Tables (LeetCode 175)**: Uses LEFT JOIN which produces NULLs for non-matching rows, requiring proper handling in the result.

4. **Customers Who Never Order (LeetCode 183)**: Similar NULL pattern when finding customers with no orders using LEFT JOIN and IS NULL check.

The pattern also appears in **three-valued logic problems** where you need to consider TRUE, FALSE, and UNKNOWN states in conditional expressions.

## Key Takeaways

1. **Always consider NULLs in SQL comparisons**: In SQL, any comparison with NULL (except `IS NULL` and `IS NOT NULL`) returns UNKNOWN, not TRUE or FALSE. WHERE clauses only include rows where the condition evaluates to TRUE.

2. **Use OR or COALESCE for inclusive NULL handling**: When you want to include rows where a column is either a specific non-NULL value OR NULL, use `WHERE column = value OR column IS NULL` or `WHERE COALESCE(column, default) = value`.

3. **Test with NULL cases**: When solving SQL problems, always create test cases with NULL values to ensure your query handles them correctly. This is especially important for LEFT/RIGHT JOIN results and optional foreign key references.

[Practice this problem on CodeJeet](/problem/find-customer-referee)
