---
title: "How to Solve Employees Earning More Than Their Managers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Employees Earning More Than Their Managers. Easy difficulty, 72.9% acceptance rate. Topics: Database."
date: "2026-09-25"
category: "dsa-patterns"
tags: ["employees-earning-more-than-their-managers", "database", "easy"]
---

# How to Solve Employees Earning More Than Their Managers

This problem asks us to find employees who earn more than their direct managers. While conceptually simple, it's a classic SQL self-join problem that tests your understanding of how to relate a table to itself. The tricky part is recognizing that you need to compare rows within the same table based on a relationship defined by the `managerId` column.

## Visual Walkthrough

Let's walk through a concrete example. Consider this `Employee` table:

| id  | name  | salary | managerId |
| --- | ----- | ------ | --------- |
| 1   | Joe   | 70000  | 3         |
| 2   | Henry | 80000  | 4         |
| 3   | Sam   | 60000  | null      |
| 4   | Max   | 90000  | null      |

We need to find employees whose salary is greater than their manager's salary. Let's trace the relationships:

1. **Employee Joe (id=1)**: His `managerId` is 3, which points to Sam. Joe's salary is 70000, Sam's salary is 60000. Since 70000 > 60000, Joe should be in our result.

2. **Employee Henry (id=2)**: His `managerId` is 4, which points to Max. Henry's salary is 80000, Max's salary is 90000. Since 80000 < 90000, Henry should NOT be in our result.

3. **Employee Sam (id=3)**: His `managerId` is null, meaning he has no manager (he's likely a top-level manager). We skip him since we can't compare to a non-existent manager.

4. **Employee Max (id=4)**: Similarly, his `managerId` is null, so we skip him.

The expected result is just Joe. The key insight is that we need to join the Employee table with itself: one instance for employees and another for managers, matching employees to their managers via `employee.managerId = manager.id`.

## Brute Force Approach

For SQL problems, there isn't really a "brute force" in the algorithmic sense, but there are less efficient or incorrect approaches that candidates sometimes try:

**Incorrect approach**: Trying to solve this with a single table scan and subqueries for each row. While this would technically work, it's inefficient and not how SQL is designed to solve this type of problem.

**Common naive attempt**: Some candidates try to use window functions or complex subqueries when a simple self-join is cleaner and more efficient.

The optimal approach uses a self-join, which is the standard way to compare rows within the same table based on relationships between them.

## Optimal Solution

The solution uses a self-join: we create two aliases of the same table—one for employees and one for managers. We join them on the condition that an employee's `managerId` equals a manager's `id`. Then we filter for cases where the employee's salary is greater than the manager's salary.

<div class="code-group">

```sql
-- Time: O(n²) in worst case, but typically O(n log n) with indexes
-- Space: O(n) for the result set
SELECT
    e.name AS Employee  -- Select employee name from employee table alias
FROM
    Employee e          -- Alias 'e' for employees
INNER JOIN
    Employee m          -- Alias 'm' for managers (same table!)
ON
    e.managerId = m.id  -- Join condition: employee's managerId matches manager's id
WHERE
    e.salary > m.salary -- Filter: employee earns more than manager
```

```sql
-- Alternative using explicit column selection
SELECT
    e.name AS Employee
FROM
    Employee e,
    Employee m
WHERE
    e.managerId = m.id
    AND e.salary > m.salary
```

</div>

**Line-by-line explanation:**

1. **`SELECT e.name AS Employee`**: We only need the employee names in the result. The `AS Employee` gives the output column a clear name.

2. **`FROM Employee e`**: This creates the first instance of the Employee table with alias 'e' representing employees.

3. **`INNER JOIN Employee m`**: This creates the second instance of the same table with alias 'm' representing managers. The self-join is what makes this solution work.

4. **`ON e.managerId = m.id`**: The join condition connects employees to their managers. An employee's `managerId` should match a manager's `id`. This is the crucial link that establishes the reporting relationship.

5. **`WHERE e.salary > m.salary`**: After joining, we filter to keep only rows where the employee's salary exceeds their manager's salary.

**Why INNER JOIN works best**:

- It automatically excludes employees with `managerId = NULL` (top-level executives with no manager)
- It only includes employees who actually have a manager in the system
- If an employee's manager isn't in the table (orphaned `managerId`), they won't appear in results

## Complexity Analysis

**Time Complexity**:

- In the worst case without indexes, the self-join could take O(n²) time where n is the number of rows, as it might need to compare each employee with every manager.
- With proper indexing on `id` (primary key) and `managerId` (foreign key), the join becomes much more efficient, typically O(n log n).
- In practice, for interview purposes, we say O(n²) worst-case but note that with indexes it's much better.

**Space Complexity**:

- O(k) where k is the number of employees in the result set (we only store their names).
- The join operation itself might use temporary space, but that's handled by the database engine.

## Common Mistakes

1. **Forgetting to handle NULL managerId**: If you use a LEFT JOIN instead of INNER JOIN without proper NULL handling, you might include employees with no manager, leading to incorrect comparisons. The INNER JOIN approach naturally excludes these.

2. **Joining on the wrong columns**: A common error is `ON e.id = m.managerId`, which reverses the relationship. Always verify: employee's managerId should equal manager's id.

3. **Not using table aliases**: Without aliases, column references become ambiguous. For example, `salary` could refer to either the employee's or manager's salary. Always use clear aliases like `e` and `m`.

4. **Including unnecessary columns**: Some candidates select `e.salary` and `m.salary` in the output, but the problem only asks for employee names. Keep your SELECT clause minimal.

5. **Using WHERE instead of JOIN condition**: Placing `e.managerId = m.id` in the WHERE clause instead of the ON clause can sometimes work but is less clear and may affect performance with outer joins.

## When You'll See This Pattern

The self-join pattern appears whenever you need to compare rows within the same table based on relationships between them:

1. **Finding pairs within the same table**: Like "Find all users who are friends with each other" where friendships are stored in a single table with user1 and user2 columns.

2. **Hierarchical data traversal**: In organizational charts, product categories, or comment threads where parent-child relationships exist within one table.

3. **Related LeetCode problems**:
   - **181. Employees Earning More Than Their Managers** (this problem)
   - **197. Rising Temperature** (compare dates between consecutive rows)
   - **184. Department Highest Salary** (comparing salaries within departments)
   - **180. Consecutive Numbers** (finding consecutive occurrences in a sequence)

The core technique is always: create multiple aliases of the same table, join them on the relationship condition, then apply your comparison logic.

## Key Takeaways

1. **Self-joins solve intra-table comparisons**: When you need to compare rows within the same table based on relationships between them, think "self-join."

2. **Clear aliases are crucial**: Use meaningful aliases (like `e` for employees, `m` for managers) to keep your logic clear and avoid ambiguous column references.

3. **NULL handling matters**: Consider whether you want to include or exclude rows with NULL relationship values. INNER JOIN excludes them; LEFT JOIN includes them but requires NULL checks.

4. **The pattern extends to multiple relationships**: You can self-join a table multiple times to traverse longer chains (e.g., employee → manager → senior manager).

Remember: Self-joins aren't actually joining different tables—you're joining the same table to itself to view it from different perspectives simultaneously.

[Practice this problem on CodeJeet](/problem/employees-earning-more-than-their-managers)
