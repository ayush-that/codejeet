---
title: "How to Solve Second Highest Salary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Second Highest Salary. Medium difficulty, 46.4% acceptance rate. Topics: Database."
date: "2026-07-18"
category: "dsa-patterns"
tags: ["second-highest-salary", "database", "medium"]
---

# How to Solve Second Highest Salary

Finding the second highest salary sounds simple, but it's a classic SQL interview question that tests your understanding of ranking, subqueries, and handling edge cases. The challenge comes from what happens when there's no second highest salary (all employees have the same salary, or there's only one employee) - you need to return `NULL` in those cases, not just get an empty result.

## Visual Walkthrough

Let's walk through an example step by step. Consider this `Employee` table:

| id  | salary |
| --- | ------ |
| 1   | 100    |
| 2   | 200    |
| 3   | 300    |
| 4   | 200    |
| 5   | 100    |

We want to find the second highest salary. Notice that:

1. The highest salary is 300
2. The next distinct salary is 200 (even though two employees earn 200)
3. So the answer should be 200

Now consider edge cases:

- If all employees have the same salary (say, all 100), there's no second highest distinct salary
- If there's only one employee, there's no second highest salary
- If there are multiple employees with the same highest salary, we still need the next distinct salary

## Brute Force Approach

A naive approach might try to sort all salaries and pick the second one:

```sql
SELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;
```

But this has problems:

1. It doesn't handle duplicate salaries correctly - if the highest salary appears multiple times, this would still return that same salary, not the second _distinct_ salary
2. It doesn't return `NULL` when there's no second highest salary - it just returns an empty result set

Another brute force approach might use two subqueries:

```sql
SELECT MAX(salary)
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
```

This is actually closer to the right solution, but we need to think about how to handle the `NULL` requirement properly.

## Optimized Approach

The key insight is that we need to:

1. Find all distinct salaries
2. Order them in descending order
3. Skip the highest one and take the next one
4. If there's no second highest, return `NULL`

We can approach this in several ways:

**Approach 1: Using `DISTINCT` and `LIMIT` with subquery**

- Get all distinct salaries
- Order them descending
- Skip first, take next
- Wrap in another query to handle the `NULL` case

**Approach 2: Using `MAX()` with subquery**

- Find the maximum salary
- Then find the maximum salary that's less than that maximum
- This automatically gives us the second highest distinct salary

**Approach 3: Using window functions (more advanced)**

- Use `DENSE_RANK()` to rank salaries
- Filter where rank = 2
- This handles duplicates naturally

The most straightforward and commonly expected solution is Approach 2, as it's clear, efficient, and works across most SQL dialects.

## Optimal Solution

Here's the complete solution with detailed explanations:

<div class="code-group">

```sql
-- Time: O(n) | Space: O(1)
-- Solution using MAX() with subquery

SELECT
    -- Use MAX() to get the second highest salary
    -- If no such salary exists, MAX() returns NULL
    MAX(salary) AS SecondHighestSalary
FROM
    Employee
WHERE
    -- Filter for salaries less than the maximum salary
    -- This gives us all salaries except the highest one
    salary < (
        -- Subquery to find the absolute maximum salary
        SELECT MAX(salary)
        FROM Employee
    );

-- Alternative with LIMIT (MySQL, PostgreSQL, SQLite)
/*
SELECT
    -- Handle NULL case with IFNULL or COALESCE
    IFNULL(
        (SELECT DISTINCT salary
         FROM Employee
         ORDER BY salary DESC
         LIMIT 1 OFFSET 1),
        NULL
    ) AS SecondHighestSalary;
*/
```

```sql
-- For SQL Server (slightly different syntax)
/*
SELECT
    MAX(salary) AS SecondHighestSalary
FROM
    Employee
WHERE
    salary < (SELECT MAX(salary) FROM Employee);
*/

-- Or using TOP with subquery
/*
SELECT
    ISNULL(
        (SELECT DISTINCT TOP 1 salary
         FROM Employee
         WHERE salary < (SELECT MAX(salary) FROM Employee)
         ORDER BY salary DESC),
        NULL
    ) AS SecondHighestSalary;
*/
```

```sql
-- Using window functions (more advanced but elegant)
/*
SELECT
    MAX(salary) AS SecondHighestSalary
FROM (
    SELECT
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) as salary_rank
    FROM
        Employee
) ranked_salaries
WHERE
    salary_rank = 2;
*/
```

</div>

**How the main solution works:**

1. **Inner subquery**: `SELECT MAX(salary) FROM Employee` finds the absolute highest salary in the table.
2. **WHERE clause**: `salary < (subquery)` filters out all rows with the maximum salary, leaving only salaries that are lower.
3. **Outer SELECT**: `MAX(salary)` takes the maximum value from the remaining salaries, which is by definition the second highest distinct salary.
4. **NULL handling**: If there are no salaries lower than the maximum (all employees have the same salary, or there's only one employee), the WHERE clause filters out all rows. The `MAX()` function applied to an empty set returns `NULL`, which is exactly what we want.

## Complexity Analysis

**Time Complexity**: O(n)

- The inner `MAX(salary)` subquery scans the entire table once: O(n)
- The outer query also scans the entire table once: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity**: O(1)

- We're not storing any additional data structures
- We only need a few variables to track the maximum values
- The database might use temporary storage for sorting, but that's implementation-dependent

## Common Mistakes

1. **Not handling duplicate salaries**: Using `ORDER BY salary DESC LIMIT 1 OFFSET 1` without `DISTINCT` will return the second row, not the second distinct salary. If two employees have the same highest salary, this returns that same salary instead of the next lower one.

2. **Not returning NULL for empty results**: Many candidates write queries that return empty result sets when there's no second highest salary. The problem specifically asks to return `NULL`. Using `MAX()` on an empty set naturally returns `NULL`, which is why our solution works.

3. **Forgetting about single-row tables**: When there's only one employee, there's no second highest salary. Our solution handles this because the WHERE clause filters out the only row, leaving an empty set for the outer MAX().

4. **Using wrong ranking function**: If using window functions, `RANK()` vs `DENSE_RANK()` matters. `RANK()` leaves gaps when there are ties (1, 2, 2, 4), while `DENSE_RANK()` doesn't (1, 2, 2, 3). For "second highest salary," we want `DENSE_RANK()`.

## When You'll See This Pattern

This pattern of finding "second highest," "nth highest," or "top k with ties" appears in many database problems:

1. **Nth Highest Salary (LeetCode 177)** - The generalized version of this problem where you need to find the nth highest salary using a function.

2. **Department Top Three Salaries (LeetCode 185)** - Finding top N salaries within each department, which requires partitioning and ranking.

3. **Rank Scores (LeetCode 178)** - Ranking scores with gaps for ties, similar logic but with different ranking requirements.

The core technique of using subqueries with comparison operators (`<`, `>`) or window functions with ranking is fundamental to solving many SQL ranking problems.

## Key Takeaways

1. **Use MAX() with filtering for simple ranking problems**: When you need "second highest" or "second lowest," filtering with `salary < MAX(salary)` is often cleaner than sorting and limiting.

2. **NULL handling is crucial in SQL interviews**: Always consider what should happen when your query finds no results. Functions like `MAX()`, `MIN()`, `SUM()` return `NULL` on empty sets, which can be useful.

3. **Distinct vs. all values matters**: Understand whether the problem asks for distinct values (like "second highest salary") or allows duplicates (like "second highest paid employee").

[Practice this problem on CodeJeet](/problem/second-highest-salary)
