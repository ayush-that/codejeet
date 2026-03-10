---
title: "How to Solve Employees Whose Manager Left the Company — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Employees Whose Manager Left the Company. Easy difficulty, 48.6% acceptance rate. Topics: Database."
date: "2027-10-16"
category: "dsa-patterns"
tags: ["employees-whose-manager-left-the-company", "database", "easy"]
---

# How to Solve Employees Whose Manager Left the Company

This problem asks us to find employees who earn more than $30,000 and whose managers are no longer with the company. The tricky part is that we need to check if a manager exists in the employee table, which requires correlating data within the same table. This is a classic example of a self-join problem where we need to think about the relationships between rows in the same table.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this data:

| employee_id | name    | manager_id | salary |
| ----------- | ------- | ---------- | ------ |
| 1           | Alice   | null       | 40000  |
| 2           | Bob     | 1          | 35000  |
| 3           | Charlie | 2          | 32000  |
| 4           | David   | 3          | 28000  |
| 5           | Eve     | 4          | 31000  |
| 6           | Frank   | 10         | 32000  |

**Step 1: Filter by salary > 30000**

- Alice: 40000 ✓
- Bob: 35000 ✓
- Charlie: 32000 ✓
- David: 28000 ✗ (below threshold)
- Eve: 31000 ✓
- Frank: 32000 ✓

**Step 2: Check if manager exists**

- Alice: manager_id is null (no manager) ✗
- Bob: manager_id = 1 (Alice exists) ✓
- Charlie: manager_id = 2 (Bob exists) ✓
- Eve: manager_id = 4 (David exists) ✓
- Frank: manager_id = 10 (no employee with ID 10) ✗

**Step 3: Find employees whose manager doesn't exist**
From our filtered list:

- Bob: manager exists ✗
- Charlie: manager exists ✗
- Eve: manager exists ✗
- Frank: manager doesn't exist ✓

So only Frank (employee_id 6) meets both conditions.

## Brute Force Approach

A naive approach would be to first get all employees with salary > 30000, then for each of those employees, scan the entire table to check if their manager_id exists. This would require a subquery or multiple passes through the data.

```sql
-- Inefficient approach using correlated subquery
SELECT employee_id
FROM Employees e1
WHERE e1.salary > 30000
  AND NOT EXISTS (
    SELECT 1
    FROM Employees e2
    WHERE e2.employee_id = e1.manager_id
  )
```

The problem with this approach is performance. For each employee with salary > 30000, we're scanning the entire Employees table to check if their manager exists. If there are n employees meeting the salary criteria, this becomes O(n²) in the worst case. While this might work for small datasets, it's inefficient for larger ones.

## Optimal Solution

The optimal solution uses a LEFT JOIN to efficiently check for missing managers. We join the Employees table with itself on the manager-employee relationship, then filter for cases where the manager doesn't exist.

<div class="code-group">

```sql
-- Time: O(n) | Space: O(n) for the join result
SELECT e.employee_id
FROM Employees e
LEFT JOIN Employees m ON e.manager_id = m.employee_id
WHERE e.salary > 30000
  AND m.employee_id IS NULL
  AND e.manager_id IS NOT NULL
ORDER BY e.employee_id;
```

```sql
-- Alternative using NOT IN (also efficient with proper indexing)
-- Time: O(n) | Space: O(n) for the subquery result
SELECT employee_id
FROM Employees
WHERE salary > 30000
  AND manager_id NOT IN (
    SELECT employee_id
    FROM Employees
  )
ORDER BY employee_id;
```

```sql
-- Alternative using NOT EXISTS (correlated but often optimized)
-- Time: O(n) | Space: O(1) additional space
SELECT employee_id
FROM Employees e
WHERE salary > 30000
  AND NOT EXISTS (
    SELECT 1
    FROM Employees m
    WHERE m.employee_id = e.manager_id
  )
ORDER BY employee_id;
```

</div>

**Line-by-line explanation:**

1. `SELECT e.employee_id` - We only need to return employee IDs
2. `FROM Employees e` - Start with the Employees table, aliased as 'e' for employees
3. `LEFT JOIN Employees m ON e.manager_id = m.employee_id` - Join with the same table to find managers. LEFT JOIN ensures we keep all employees even if their manager doesn't exist
4. `WHERE e.salary > 30000` - First condition: salary must be > 30000
5. `AND m.employee_id IS NULL` - Second condition: the join failed to find a matching manager
6. `AND e.manager_id IS NOT NULL` - Important: exclude employees who have no manager (their manager_id is null)
7. `ORDER BY e.employee_id` - Sort the results as requested

The key insight is that a LEFT JOIN will produce NULL values for all columns from the right table (managers) when no match is found. We can then filter for those NULL values to find employees whose managers don't exist.

## Complexity Analysis

**Time Complexity: O(n)**

- The LEFT JOIN operation typically takes linear time relative to the size of the tables
- With proper indexing on `employee_id` and `manager_id`, the join becomes very efficient
- The WHERE clause filters are applied during the join process

**Space Complexity: O(n)**

- The join creates a temporary result set that could be as large as n rows (if every employee had a different manager)
- In practice, database optimizers may use hash joins or other techniques that don't materialize the entire result

**Why this is optimal:**

- We only scan the Employees table once (or twice for some implementations)
- The join operation is highly optimized in SQL databases
- No nested loops or repeated scans of the entire table

## Common Mistakes

1. **Forgetting to exclude employees with NULL manager_id**: Some employees might not have a manager (like the CEO). These would incorrectly appear in results if we don't add `AND e.manager_id IS NOT NULL`.

2. **Using INNER JOIN instead of LEFT JOIN**: An INNER JOIN would only return employees whose managers exist, which is the opposite of what we want.

3. **Checking for manager_id = NULL incorrectly**: In SQL, you must use `IS NULL` not `= NULL` because NULL represents an unknown value and equality comparisons with NULL always return NULL (not true or false).

4. **Missing the ORDER BY clause**: The problem asks for results in ascending order by employee_id. While some databases might return sorted results by default, it's not guaranteed.

5. **Including employees with salary exactly 30000**: The condition is `salary > 30000`, not `salary >= 30000`. Employees earning exactly 30000 should not be included.

## When You'll See This Pattern

This pattern of checking for missing relationships appears frequently in database problems:

1. **Customers Who Never Order (LeetCode 183)**: Find customers who have never placed an order. Similar LEFT JOIN or NOT EXISTS pattern.

2. **Department Top Three Salaries (LeetCode 185)**: Uses self-joins to compare salaries within departments.

3. **Second Highest Salary (LeetCode 176)**: Finding gaps in ordered data, similar to finding missing relationships.

4. **Consecutive Numbers (LeetCode 180)**: Uses self-joins to find patterns in sequential data.

The core technique is using self-joins or subqueries to compare rows within the same table, often to find missing relationships or hierarchical patterns.

## Key Takeaways

1. **Self-joins are powerful for hierarchical data**: When you need to compare rows within the same table (like employee-manager relationships), self-joins are often the right tool.

2. **LEFT JOIN + IS NULL finds missing relationships**: This is a classic SQL pattern for finding records in table A that don't have a corresponding record in table B (or in the same table).

3. **Always consider NULL handling**: With hierarchical data, root nodes often have NULL parent references. Make sure your logic correctly handles these cases.

4. **Understand the difference between NOT IN, NOT EXISTS, and LEFT JOIN**: All can solve this problem, but they have different behaviors with NULL values. NOT IN can have unexpected results if the subquery returns NULLs.

[Practice this problem on CodeJeet](/problem/employees-whose-manager-left-the-company)
