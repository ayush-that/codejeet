---
title: "How to Solve Department Highest Salary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Department Highest Salary. Medium difficulty, 57.3% acceptance rate. Topics: Database."
date: "2027-02-17"
category: "dsa-patterns"
tags: ["department-highest-salary", "database", "medium"]
---

# How to Solve Department Highest Salary

This problem asks us to find employees who have the highest salary in their respective departments. While it sounds straightforward, the challenge lies in efficiently identifying maximum salaries per department and then joining that information back to the original employee data. The tricky part is that multiple employees can share the same maximum salary within a department, and we need to include all of them.

## Visual Walkthrough

Let's walk through a concrete example:

**Employee Table:**
| id | name | salary | departmentId |
|----|-------|--------|--------------|
| 1 | Joe | 70000 | 1 |
| 2 | Jim | 90000 | 1 |
| 3 | Henry | 80000 | 2 |
| 4 | Sam | 60000 | 2 |
| 5 | Max | 90000 | 1 |

**Department Table:**
| id | name |
|----|-------|
| 1 | IT |
| 2 | Sales |

**Step-by-step reasoning:**

1. First, we need to find the maximum salary for each department:
   - Department 1 (IT): Max salary is 90000 (Jim and Max both earn this)
   - Department 2 (Sales): Max salary is 80000 (Henry earns this)

2. Next, we need to find which employees earn these maximum salaries:
   - For Department 1: Employees with salary 90000 → Jim and Max
   - For Department 2: Employees with salary 80000 → Henry

3. Finally, we join this result with the Department table to get department names:
   - Jim (90000) in IT department
   - Max (90000) in IT department
   - Henry (80000) in Sales department

The final output should be:
| Department | Employee | Salary |
|------------|----------|--------|
| IT | Jim | 90000 |
| IT | Max | 90000 |
| Sales | Henry | 80000 |

## Brute Force Approach

A naive approach would be to:

1. For each department, scan all employees to find the maximum salary
2. Then scan all employees again to find who earns that maximum salary
3. Repeat this for every department

This approach would require nested loops and would be O(n²) in the worst case, where n is the number of employees. If we have m departments, we'd need to scan the employee table m times to find maximum salaries, and then scan it again m times to find employees with those salaries.

While we could write this as correlated subqueries, it would be inefficient:

```sql
SELECT
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE e.salary = (
    SELECT MAX(salary)
    FROM Employee e2
    WHERE e2.departmentId = e.departmentId
)
```

The problem with this approach is that the subquery runs for every row in the Employee table, making it inefficient for large datasets.

## Optimized Approach

The key insight is that we can use window functions (available in most modern SQL databases) or a two-step approach with a derived table to solve this efficiently:

**Approach 1: Window Function (Most Elegant)**
We can use the `RANK()` or `DENSE_RANK()` window function to rank employees within each department by salary. Then we simply select employees with rank 1.

**Approach 2: Derived Table with MAX()**
We can first create a derived table that contains the maximum salary for each department, then join this back to the Employee table to find which employees earn those salaries.

**Approach 3: IN with Multiple Columns**
We can use a subquery that returns both departmentId and maximum salary, then use an IN clause with multiple columns to match employees.

The window function approach is generally preferred because it's more readable and often more efficient, especially when we need to handle ties (multiple employees with the same maximum salary).

## Optimal Solution

Here are complete solutions using different approaches:

<div class="code-group">

```sql
-- Solution 1: Using Window Function (Most Recommended)
-- Time Complexity: O(n log n) for sorting, Space Complexity: O(n) for window function
SELECT
    Department,
    Employee,
    Salary
FROM (
    SELECT
        d.name AS Department,
        e.name AS Employee,
        e.salary AS Salary,
        -- Rank employees within each department by salary in descending order
        -- DENSE_RANK() ensures ties get the same rank (both get rank 1)
        DENSE_RANK() OVER (
            PARTITION BY e.departmentId
            ORDER BY e.salary DESC
        ) AS salary_rank
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
) ranked_employees
-- Select only employees with the highest salary (rank 1) in their department
WHERE salary_rank = 1;

-- Alternative using RANK() instead of DENSE_RANK() - both work the same here
-- since we're only interested in rank 1
```

```sql
-- Solution 2: Using Derived Table with MAX()
-- Time Complexity: O(n), Space Complexity: O(m) where m is number of departments
SELECT
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
-- Join with a derived table containing max salary per department
JOIN (
    SELECT
        departmentId,
        MAX(salary) AS max_salary
    FROM Employee
    GROUP BY departmentId
) dept_max ON e.departmentId = dept_max.departmentId
           AND e.salary = dept_max.max_salary;
```

```sql
-- Solution 3: Using IN with Multiple Columns
-- Time Complexity: O(n²) in worst case, Space Complexity: O(m)
SELECT
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
-- Check if the (departmentId, salary) pair exists in the max salaries per department
WHERE (e.departmentId, e.salary) IN (
    SELECT
        departmentId,
        MAX(salary)
    FROM Employee
    GROUP BY departmentId
);
```

</div>

## Complexity Analysis

**Solution 1 (Window Function):**

- **Time Complexity:** O(n log n) - The window function needs to sort employees within each department by salary. Sorting n items takes O(n log n) time.
- **Space Complexity:** O(n) - The window function creates a temporary result set with rank information for each employee.

**Solution 2 (Derived Table with MAX):**

- **Time Complexity:** O(n) - We scan the Employee table once to compute max salaries per department (O(n)), then join back (O(n) with proper indexing).
- **Space Complexity:** O(m) - Where m is the number of departments. We store max salary for each department.

**Solution 3 (IN with Multiple Columns):**

- **Time Complexity:** O(n²) in worst case - The IN clause with subquery can be inefficient as it might need to compare each employee against all department max salaries.
- **Space Complexity:** O(m) - We store max salary for each department.

The window function solution (Solution 1) is generally preferred in interviews because:

1. It clearly demonstrates knowledge of advanced SQL features
2. It handles ties naturally (multiple employees with same max salary)
3. It's more extensible (easy to get top N salaries per department)

## Common Mistakes

1. **Using MAX() without GROUP BY correctly:** Forgetting to group by departmentId when finding maximum salaries.

   ```sql
   -- WRONG: This returns overall max salary, not per department
   SELECT MAX(salary) FROM Employee

   -- CORRECT: Group by department to get max per department
   SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId
   ```

2. **Not handling ties properly:** Using `ROW_NUMBER()` instead of `RANK()` or `DENSE_RANK()` when multiple employees can have the same maximum salary.

   ```sql
   -- WRONG: ROW_NUMBER() gives different numbers to ties, so only one employee gets selected
   ROW_NUMBER() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rn

   -- CORRECT: DENSE_RANK() gives same rank to ties
   DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rn
   ```

3. **Forgetting to join with Department table:** Returning departmentId instead of department name.

   ```sql
   -- WRONG: Returns departmentId (number) instead of department name
   SELECT e.departmentId, e.name, e.salary

   -- CORRECT: Join with Department table to get name
   SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
   ```

4. **Incorrect JOIN conditions:** When using the derived table approach, forgetting to join on both departmentId AND salary.

   ```sql
   -- WRONG: Only joining on departmentId
   JOIN dept_max ON e.departmentId = dept_max.departmentId

   -- CORRECT: Need to also match on salary
   JOIN dept_max ON e.departmentId = dept_max.departmentId
                 AND e.salary = dept_max.max_salary
   ```

## When You'll See This Pattern

This "group-wise maximum" pattern appears frequently in SQL interview questions:

1. **Highest Grade For Each Student (LeetCode 1112):** Find the highest grade for each student - identical pattern but with students instead of departments.
2. **Department Top Three Salaries (LeetCode 185):** A variation where you need the top N salaries per department instead of just the maximum. The window function approach extends naturally to this.

3. **Customers Who Bought All Products (LeetCode 1045):** Uses similar grouping and filtering logic, though with a different aggregation (COUNT instead of MAX).

The core technique of using window functions with `PARTITION BY` and `ORDER BY` is applicable whenever you need to rank or compare rows within groups. This pattern is also useful for:

- Finding the most recent record per group
- Calculating running totals within categories
- Identifying top performers in each category

## Key Takeaways

1. **Window functions are powerful for "per-group" analysis:** When you need to find extreme values (max/min) or rank items within groups, `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` with `PARTITION BY` are your best tools.

2. **Always consider ties:** When multiple items can share the same extreme value (like multiple employees with the same max salary), use `RANK()` or `DENSE_RANK()` instead of `ROW_NUMBER()`.

3. **Know multiple approaches:** While window functions are elegant, understanding the derived table approach shows you can solve the problem even in databases that don't support window functions (though these are rare in modern SQL).

Related problems: [Highest Grade For Each Student](/problem/highest-grade-for-each-student)
