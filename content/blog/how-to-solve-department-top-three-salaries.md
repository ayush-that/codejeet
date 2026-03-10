---
title: "How to Solve Department Top Three Salaries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Department Top Three Salaries. Hard difficulty, 59.9% acceptance rate. Topics: Database."
date: "2027-02-21"
category: "dsa-patterns"
tags: ["department-top-three-salaries", "database", "hard"]
---

# How to Solve Department Top Three Salaries

This problem asks us to find the top three unique salaries in each department, along with the employees earning those salaries. The challenge comes from needing to handle ties correctly (employees with the same salary should have the same rank) while still limiting to three distinct salary levels per department. This requires careful window function usage and understanding of SQL ranking logic.

## Visual Walkthrough

Let's trace through a concrete example. Suppose we have:

**Employee Table:**
| id | name | salary | departmentId |
|----|------|--------|--------------|
| 1 | Joe | 85000 | 1 |
| 2 | Henry| 80000 | 2 |
| 3 | Sam | 60000 | 2 |
| 4 | Max | 90000 | 1 |
| 5 | Janet| 69000 | 1 |
| 6 | Randy| 85000 | 1 |
| 7 | Will | 70000 | 1 |

**Department Table:**
| id | name |
|----|--------|
| 1 | IT |
| 2 | Sales |

For Department 1 (IT), the unique salaries are: 90000, 85000, 70000, 69000, 60000. The top three unique salaries are 90000, 85000, and 70000. Notice that both Joe and Randy earn 85000, so they should both appear in the result.

For Department 2 (Sales), the unique salaries are: 80000, 60000. There are only two distinct salary levels, so both should appear.

The expected output:
| Department | Employee | Salary |
|------------|----------|--------|
| IT | Max | 90000 |
| IT | Joe | 85000 |
| IT | Randy | 85000 |
| IT | Will | 70000 |
| Sales | Henry | 80000 |
| Sales | Sam | 60000 |

## Brute Force Approach

A naive approach might try to use subqueries with `COUNT(DISTINCT ...)` to find salaries where there are fewer than 3 distinct salaries higher than it. For each employee, we could check how many distinct salaries in their department are greater than their salary:

```sql
SELECT
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (
    SELECT COUNT(DISTINCT e2.salary)
    FROM Employee e2
    WHERE e2.departmentId = e.departmentId
    AND e2.salary > e.salary
) < 3
```

**Why this fails:**

1. **Performance:** This runs a correlated subquery for every row in the Employee table, resulting in O(n²) time complexity in the worst case.
2. **Incorrect handling of ties:** This approach would include all employees whose salary is among the top three unique salary values, which is correct, but the implementation is inefficient.
3. **Readability:** The logic is harder to understand and maintain compared to window functions.

While this brute force approach conceptually works, it's inefficient for large datasets and doesn't leverage SQL's built-in ranking capabilities.

## Optimized Approach

The key insight is to use **window functions** to assign ranks within each department. Specifically, we need `DENSE_RANK()` instead of `RANK()` or `ROW_NUMBER()`:

- `ROW_NUMBER()`: Assigns sequential integers (1, 2, 3...) regardless of ties
- `RANK()`: Leaves gaps when there are ties (e.g., 1, 2, 2, 4...)
- `DENSE_RANK()`: No gaps with ties (e.g., 1, 2, 2, 3...)

For this problem, we want `DENSE_RANK()` because:

1. Employees with the same salary should have the same rank
2. We want exactly three ranks (1, 2, 3) regardless of how many employees share those salaries
3. If there are only two distinct salary levels in a department, we should see ranks 1 and 2 only

The strategy:

1. Join Employee and Department tables to get department names
2. Use `DENSE_RANK()` partitioned by department, ordered by salary descending
3. Filter to keep only rows where the rank ≤ 3
4. Select the required columns

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, O(n) for scanning | Space: O(n) for result set
SELECT
    Department,
    Employee,
    Salary
FROM (
    SELECT
        d.name AS Department,
        e.name AS Employee,
        e.salary AS Salary,
        -- Step 1: Assign dense rank within each department
        -- DENSE_RANK() ensures no gaps in ranking when salaries are tied
        DENSE_RANK() OVER (
            -- Partition by department to rank separately for each department
            PARTITION BY e.departmentId
            -- Order by salary descending so highest salary gets rank 1
            ORDER BY e.salary DESC
        ) AS salary_rank
    FROM Employee e
    -- Step 2: Join with Department table to get department names
    INNER JOIN Department d ON e.departmentId = d.id
) ranked_employees
-- Step 3: Filter to keep only top 3 unique salary ranks
WHERE salary_rank <= 3;
```

</div>

**Step-by-step explanation:**

1. **Subquery with DENSE_RANK()**: The inner query joins the Employee and Department tables, then uses `DENSE_RANK()` to assign ranks. The `PARTITION BY e.departmentId` ensures ranking happens separately for each department. `ORDER BY e.salary DESC` makes the highest salary rank 1.

2. **Filtering**: The outer query filters results where `salary_rank <= 3`, keeping only employees whose salary is in the top three unique salary levels for their department.

3. **Column selection**: Finally, we select the department name, employee name, and salary for the output.

## Complexity Analysis

**Time Complexity:** O(n log n) in the worst case, where n is the number of employees. The dominant operation is sorting within each partition for the `DENSE_RANK()` function. Some databases may optimize this differently, but generally, sorting is required for ranking operations.

**Space Complexity:** O(n) for storing the intermediate result set with ranks. The final output could be smaller if many employees don't make the top three, but in the worst case (when all employees are in the top three), it's O(n).

## Common Mistakes

1. **Using RANK() instead of DENSE_RANK()**:
   - **Mistake**: `RANK()` leaves gaps when there are ties. If two employees tie for rank 1, the next distinct salary gets rank 3, not 2.
   - **Example**: Salaries 100, 100, 90 would get ranks 1, 1, 3 with `RANK()`, causing you to miss the 90 salary.
   - **Fix**: Always use `DENSE_RANK()` for "top N unique values" problems.

2. **Forgetting to handle NULL departmentId**:
   - **Mistake**: Not considering employees with NULL departmentId or departments with no employees.
   - **Impact**: May include employees without departments or exclude departments with no top earners.
   - **Fix**: Use appropriate JOIN type based on requirements. Usually `INNER JOIN` is correct as specified.

3. **Incorrect ORDER BY direction**:
   - **Mistake**: Using `ORDER BY e.salary ASC` instead of `DESC`.
   - **Result**: Would get the bottom three salaries instead of top three.
   - **Fix**: Always double-check sort direction for "top N" problems.

4. **Misunderstanding "top three salaries"**:
   - **Mistake**: Using `LIMIT 3` or `TOP 3` without window functions.
   - **Problem**: This would give only three total rows, not three per department, and wouldn't handle ties correctly.
   - **Fix**: Use window functions with partitioning for per-group limits.

## When You'll See This Pattern

This pattern of using `DENSE_RANK()` for "top N per group" problems appears frequently in SQL interview questions:

1. **"Nth Highest Salary" (LeetCode 177)**: Similar ranking logic but for a single group.
2. **"Rank Scores" (LeetCode 178)**: Uses `DENSE_RANK()` to assign ranks to scores with ties getting the same rank.
3. **"Department Highest Salary" (LeetCode 184)**: A simpler version of this problem asking for only the top salary per department.

The core technique applies whenever you need to:

- Select top/bottom N records per group
- Handle ties appropriately (same rank for equal values)
- Work with hierarchical data (employees within departments, products within categories, etc.)

## Key Takeaways

1. **Use DENSE_RANK() for "top N unique values" problems**: When you need to select the top N distinct values per group and include all records with those values, `DENSE_RANK()` is the right tool. Remember the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()`.

2. **Window functions are essential for complex grouping**: Problems that require per-group calculations with ordering often need window functions. The pattern is: partition by group column, order by value column, then filter or select based on the rank.

3. **Test with tie cases**: Always test your solution with duplicate values to ensure ties are handled correctly. This is a common interview follow-up question.

[Practice this problem on CodeJeet](/problem/department-top-three-salaries)
