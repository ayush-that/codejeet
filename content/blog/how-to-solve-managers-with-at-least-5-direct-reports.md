---
title: "How to Solve Managers with at Least 5 Direct Reports — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Managers with at Least 5 Direct Reports. Medium difficulty, 48.9% acceptance rate. Topics: Database."
date: "2026-11-03"
category: "dsa-patterns"
tags: ["managers-with-at-least-5-direct-reports", "database", "medium"]
---

# How to Solve Managers with at Least 5 Direct Reports

This problem asks us to find managers who have at least five direct reports. The tricky part is that we need to count how many employees report to each manager, then filter for those with counts of 5 or more. While conceptually simple, it requires careful handling of SQL joins, grouping, and filtering—common areas where interview candidates make mistakes.

## Visual Walkthrough

Let's walk through a small example. Suppose we have this Employee table:

| id  | name  | department  | managerId |
| --- | ----- | ----------- | --------- |
| 101 | Alice | Sales       | null      |
| 102 | Bob   | Sales       | 101       |
| 103 | Carol | Sales       | 101       |
| 104 | Dave  | Sales       | 101       |
| 105 | Eve   | Sales       | 101       |
| 106 | Frank | Sales       | 101       |
| 107 | Grace | Engineering | null      |
| 108 | Henry | Engineering | 107       |
| 109 | Irene | Engineering | 107       |

**Step 1: Identify reporting relationships**

- Alice (id 101) has 5 reports: Bob, Carol, Dave, Eve, Frank
- Grace (id 107) has 2 reports: Henry, Irene

**Step 2: Count reports per manager**

- Manager 101: count = 5
- Manager 107: count = 2

**Step 3: Filter for counts ≥ 5**
Only Alice (manager 101) qualifies since she has exactly 5 direct reports.

The key insight is that we need to treat the `managerId` column as a foreign key pointing to another employee's `id`. When we join the table to itself, we're matching each employee's `managerId` with the corresponding manager's `id`.

## Brute Force Approach

A naive approach might try to solve this without proper SQL techniques. For example, someone might try to write nested queries that check each manager individually:

```sql
-- Inefficient approach (conceptual, not actual SQL)
For each employee who is a manager:
    Count how many employees have managerId = this employee's id
    If count >= 5, add to results
```

This would require scanning the entire table for each manager, resulting in O(n²) time complexity. In SQL terms, this might look like a correlated subquery for each row:

```sql
SELECT name
FROM Employee e1
WHERE (
    SELECT COUNT(*)
    FROM Employee e2
    WHERE e2.managerId = e1.id
) >= 5
```

While this technically works, it's inefficient because the database has to execute the subquery for every row in the outer query. On large datasets, this performance penalty becomes significant.

## Optimized Approach

The optimal approach uses a single pass through the data with proper grouping. Here's the step-by-step reasoning:

1. **Identify the join**: We need to connect employees with their managers. Since both are in the same table, we use a self-join. The `managerId` in the employee table references the `id` in the manager's row.

2. **Group by manager**: After joining, we group by the manager's information to count how many employees report to each manager.

3. **Filter with HAVING**: We use `HAVING` instead of `WHERE` because we need to filter based on the aggregate result (the count). `WHERE` filters rows before grouping, while `HAVING` filters after grouping.

4. **Handle NULL values**: Managers with `NULL` managerId (top-level managers) won't appear in the results unless they have reports, which is correct for this problem.

The key insight is that we can solve this with a single query using proper SQL aggregation patterns rather than iterative approaches.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows (with proper indexing)
-- Space: O(m) where m is number of managers with direct reports

SELECT m.name
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
-- Join the Employee table with itself:
-- 'e' represents employees (the ones being managed)
-- 'm' represents managers (the ones doing the managing)
-- We join where the employee's managerId matches the manager's id

GROUP BY m.id, m.name
-- Group by manager to count how many employees report to each manager
-- We include both id and name in GROUP BY to ensure proper grouping
-- (Some databases require all non-aggregated columns in SELECT to be in GROUP BY)

HAVING COUNT(e.id) >= 5
-- Filter for managers with at least 5 direct reports
-- HAVING is used instead of WHERE because we're filtering on an aggregate function
-- COUNT(e.id) counts the number of employees for each manager
```

```sql
-- Alternative solution using subquery (also optimal with proper indexing)
-- Time: O(n) | Space: O(m)

SELECT name
FROM Employee
WHERE id IN (
    SELECT managerId
    FROM Employee
    WHERE managerId IS NOT NULL
    -- Exclude employees who aren't managers of anyone
    GROUP BY managerId
    HAVING COUNT(id) >= 5
)
-- This approach first finds managerIds with ≥5 reports,
-- then gets the names of those managers
-- Some databases optimize this differently than the JOIN approach
```

</div>

**Explanation of key parts:**

1. **Self-join**: `Employee e INNER JOIN Employee m` creates two "copies" of the table. The `ON e.managerId = m.id` clause connects employees to their managers.

2. **GROUP BY m.id, m.name**: We group by both columns to ensure unique grouping. In some SQL dialects, you could group by just `m.id` if `id` is the primary key.

3. **HAVING COUNT(e.id) >= 5**: This is the crucial filter. We count the number of employees (`e.id`) in each group. The `HAVING` clause runs after grouping, so it filters the grouped results.

4. **Why not WHERE?**: If we tried `WHERE COUNT(e.id) >= 5`, it would fail because aggregate functions can't be used in `WHERE` clauses. `WHERE` filters individual rows before grouping; `HAVING` filters groups after aggregation.

## Complexity Analysis

**Time Complexity: O(n)**

- The join operation typically requires scanning the table(s) involved. With proper indexing on `managerId` and `id`, this can be done efficiently.
- The grouping operation also requires a single pass through the joined data.
- In the worst case without indexes, it could be O(n²) for the join, but interviewers generally assume proper indexing for database problems.

**Space Complexity: O(m)**

- Where `m` is the number of distinct managers with direct reports.
- The database needs to store intermediate results for grouping: one entry per manager found in the join.
- In practice, this is much smaller than `n` (total employees) since not every employee is a manager.

## Common Mistakes

1. **Using WHERE instead of HAVING for aggregate filtering**

   ```sql
   -- WRONG: This will cause an error
   SELECT m.name
   FROM Employee e
   JOIN Employee m ON e.managerId = m.id
   WHERE COUNT(*) >= 5  -- Aggregate function in WHERE clause
   GROUP BY m.name
   ```

   **Fix**: Always use `HAVING` when filtering based on aggregate functions like `COUNT()`, `SUM()`, or `AVG()`.

2. **Forgetting to handle NULL managerId in the join**

   ```sql
   -- This implicitly handles NULLs correctly
   INNER JOIN Employee m ON e.managerId = m.id
   -- Employees with NULL managerId won't join to any manager
   -- This is correct for this problem
   ```

   If you need to include top-level managers with no manager above them, you'd use `LEFT JOIN`, but that's not required here.

3. **Incomplete GROUP BY clause**

   ```sql
   -- Might fail in some SQL dialects
   SELECT m.name
   FROM Employee e
   JOIN Employee m ON e.managerId = m.id
   GROUP BY m.name  -- Missing m.id
   HAVING COUNT(*) >= 5
   ```

   **Fix**: Include all non-aggregated columns from SELECT in GROUP BY, or use `ANY_VALUE()` in MySQL.

4. **Counting the wrong column**
   ```sql
   -- Less clear but technically works
   HAVING COUNT(*) >= 5
   -- Better to be explicit
   HAVING COUNT(e.id) >= 5
   ```
   Being explicit about what you're counting makes the query more readable and maintainable.

## When You'll See This Pattern

This problem combines several fundamental SQL patterns that appear in many database interview questions:

1. **Self-joins**: Used when a table references itself. Similar problems:
   - **LeetCode 181: Employees Earning More Than Their Managers** - Compare employee salary with manager salary using self-join
   - **LeetCode 197: Rising Temperature** - Compare rows with previous rows (though this uses date functions more)

2. **Aggregation with HAVING**: Filtering grouped results appears in:
   - **LeetCode 182: Duplicate Emails** - `GROUP BY email HAVING COUNT(*) > 1`
   - **LeetCode 586: Customer Placing the Largest Number of Orders** - `GROUP BY customer_number ORDER BY COUNT(*) DESC LIMIT 1`

3. **Hierarchical data queries**: This is a simple form of hierarchical query (manager-employee relationships). More complex versions appear in problems about organizational structures, family trees, or category hierarchies.

## Key Takeaways

1. **Self-joins are for self-referential data**: When a table has a foreign key pointing to its own primary key (like `managerId` → `id`), you need a self-join to connect the related rows.

2. **HAVING vs WHERE**: Remember that `WHERE` filters rows before grouping, while `HAVING` filters groups after aggregation. Use `HAVING` when your filter condition involves aggregate functions.

3. **Explicit is better than implicit**: When writing SQL for interviews, be explicit about what you're joining on, what you're grouping by, and what you're counting. This shows clarity of thought and helps avoid subtle bugs.

[Practice this problem on CodeJeet](/problem/managers-with-at-least-5-direct-reports)
