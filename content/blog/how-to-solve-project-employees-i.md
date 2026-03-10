---
title: "How to Solve Project Employees I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Project Employees I. Easy difficulty, 66.5% acceptance rate. Topics: Database."
date: "2027-02-11"
category: "dsa-patterns"
tags: ["project-employees-i", "database", "easy"]
---

# How to Solve Project Employees I

This problem asks us to calculate the average experience years of employees working on each project. We're given two tables: `Project` (which links employees to projects) and `Employee` (which contains each employee's experience years). The challenge is joining these tables correctly and calculating a grouped average while handling potential edge cases like employees with zero experience or projects with no employees.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Sample Data:**

```
Project table:
+-------------+-------------+
| project_id  | employee_id |
+-------------+-------------+
| 1           | 1           |
| 1           | 2           |
| 1           | 3           |
| 2           | 1           |
| 2           | 4           |
+-------------+-------------+

Employee table:
+-------------+--------+------------------+
| employee_id | name   | experience_years |
+-------------+--------+------------------+
| 1           | Khaled | 3                |
| 2           | Ali    | 2                |
| 3           | John   | 1                |
| 4           | Doe    | 2                |
+-------------+--------+------------------+
```

**Step-by-step reasoning:**

1. **Join the tables:** First, we need to combine the information. For each project-employee pair in the `Project` table, we find the corresponding experience years from the `Employee` table:

   ```
   Project 1, Employee 1 → 3 years
   Project 1, Employee 2 → 2 years
   Project 1, Employee 3 → 1 year
   Project 2, Employee 1 → 3 years
   Project 2, Employee 4 → 2 years
   ```

2. **Group by project:** Now we group these results by `project_id`:
   - Project 1: [3, 2, 1] years
   - Project 2: [3, 2] years

3. **Calculate average:** For each group, we compute the average:
   - Project 1: (3 + 2 + 1) / 3 = 2.0000
   - Project 2: (3 + 2) / 2 = 2.5000

4. **Round the result:** The problem specifies rounding to 2 decimal places, so we get:
   - Project 1: 2.00
   - Project 2: 2.50

The key insight is that this is a straightforward SQL aggregation problem once we properly join the tables.

## Brute Force Approach

For database problems, there isn't really a "brute force" in the algorithmic sense, but there are inefficient ways to write the query. A naive approach might involve:

1. Writing a subquery for each project to calculate its average
2. Using correlated subqueries that scan the entire table for each project
3. Not using proper joins, leading to Cartesian products

Here's what an inefficient version might look like:

```sql
-- Inefficient: Using correlated subquery
SELECT
    p.project_id,
    (SELECT AVG(e.experience_years)
     FROM Employee e
     WHERE e.employee_id IN (
         SELECT employee_id
         FROM Project p2
         WHERE p2.project_id = p.project_id
     )) as average_years
FROM Project p
GROUP BY p.project_id;
```

**Why this is inefficient:**

- The correlated subquery executes once for each project
- The nested `IN` clause creates additional overhead
- No proper indexing hints for the database optimizer
- Could result in O(n²) performance in worst case

While this might work on small datasets, it would perform poorly on larger tables because of the repeated subquery executions.

## Optimal Solution

The optimal solution uses a simple JOIN followed by GROUP BY and AVG aggregation. This allows the database to:

1. Perform a single pass through the joined data
2. Use indexes effectively (especially on the primary/foreign keys)
3. Calculate averages in a single aggregation step

<div class="code-group">

```sql
-- Time: O(n + m) where n = rows in Project, m = rows in Employee
-- Space: O(n) for the result set
SELECT
    p.project_id,                       -- Select project ID for grouping
    ROUND(AVG(e.experience_years), 2) as average_years  -- Calculate average and round to 2 decimals
FROM
    Project p                           -- Start from Project table (contains all project-employee mappings)
JOIN
    Employee e                          -- Join with Employee table to get experience years
    ON p.employee_id = e.employee_id    -- Match employees by their ID
GROUP BY
    p.project_id                        -- Group results by project to calculate per-project averages
ORDER BY
    p.project_id;                       -- Optional: Order by project_id for consistent output
```

```sql
-- Alternative: Using explicit INNER JOIN for clarity
SELECT
    p.project_id,
    ROUND(AVG(e.experience_years), 2) as average_years
FROM
    Project p
INNER JOIN
    Employee e
    ON p.employee_id = e.employee_id
GROUP BY
    p.project_id
ORDER BY
    p.project_id;
```

```sql
-- With explicit column aliasing
SELECT
    p.project_id AS project_id,
    ROUND(AVG(e.experience_years), 2) AS average_years
FROM
    Project AS p
JOIN
    Employee AS e
    ON p.employee_id = e.employee_id
GROUP BY
    p.project_id
ORDER BY
    p.project_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT p.project_id`**: We select the project ID from the Project table. This will be our grouping key.

2. **`ROUND(AVG(e.experience_years), 2) as average_years`**: This is the core calculation:
   - `AVG(e.experience_years)`: Calculates the average experience years for each group
   - `ROUND(..., 2)`: Rounds the result to 2 decimal places as specified
   - `as average_years`: Gives the column a descriptive name

3. **`FROM Project p JOIN Employee e ON p.employee_id = e.employee_id`**: The join operation:
   - `FROM Project p`: Starts with the Project table (aliased as 'p')
   - `JOIN Employee e`: Combines with the Employee table (aliased as 'e')
   - `ON p.employee_id = e.employee_id`: Uses employee_id as the join key

4. **`GROUP BY p.project_id`**: Groups all rows by project_id. After joining, we have one row per project-employee combination. Grouping collects all employees for each project together.

5. **`ORDER BY p.project_id`**: (Optional) Orders the results by project_id for consistent output. Some database systems don't guarantee order without ORDER BY.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n`: Number of rows in the Project table
- `m`: Number of rows in the Employee table
- The JOIN operation typically uses hash joins or merge joins which are O(n + m) in practice
- GROUP BY and AVG operations are O(n) after the join

**Space Complexity: O(n)**

- The intermediate joined result has at most n rows (one per project-employee pair)
- The final output has at most k rows, where k is the number of distinct projects

**Database-specific optimizations:**

- Most databases will use indexes on the primary keys (project_id, employee_id) and foreign keys
- The query planner can optimize the join order based on table statistics
- Aggregation can be done in a streaming fashion, reducing memory usage

## Common Mistakes

1. **Forgetting to round to 2 decimal places**: The problem explicitly states "rounded to two digits." Without ROUND(), you might get many decimal places.

   ```sql
   -- WRONG: No rounding
   SELECT p.project_id, AVG(e.experience_years) as average_years
   ```

   **Fix**: Always use `ROUND(AVG(...), 2)`

2. **Using wrong join type**: Using LEFT JOIN when INNER JOIN is appropriate, or vice versa.

   ```sql
   -- WRONG if all employees in Project exist in Employee (which they should per constraints)
   SELECT p.project_id, AVG(e.experience_years)
   FROM Project p
   LEFT JOIN Employee e ON p.employee_id = e.employee_id
   ```

   **Fix**: Use INNER JOIN unless the problem specifies otherwise. Check constraints: employee_id is a foreign key to Employee table, so INNER JOIN is correct.

3. **Grouping by wrong column**: Forgetting to include non-aggregated columns in GROUP BY.

   ```sql
   -- WRONG: Missing GROUP BY
   SELECT p.project_id, AVG(e.experience_years)
   FROM Project p JOIN Employee e ON p.employee_id = e.employee_id
   ```

   **Fix**: Always include all non-aggregated columns in GROUP BY clause.

4. **Not handling NULL values**: If an employee has NULL experience_years, AVG() will ignore it. This is usually correct, but be aware.
   ```sql
   -- If you need to treat NULL as 0:
   SELECT p.project_id, ROUND(AVG(COALESCE(e.experience_years, 0)), 2)
   ```

## When You'll See This Pattern

This pattern of JOIN + GROUP BY + AGGREGATE appears frequently in SQL problems:

1. **Department Top Three Salaries** (Hard): Similar JOIN + GROUP BY, but with window functions for ranking
2. **Customer Placing the Largest Number of Orders** (Easy): GROUP BY with COUNT() aggregation
3. **Game Play Analysis** series: Time-based aggregations with self-joins
4. **Sales Analysis** problems: Multiple joins with complex aggregations

The core technique is: **Join relevant tables → Group by the dimension of interest → Apply aggregate functions**. This pattern solves about 30% of LeetCode's database problems.

## Key Takeaways

1. **SQL aggregation follows a predictable pattern**: JOIN to combine data, GROUP BY to create buckets, then aggregate functions (AVG, SUM, COUNT, etc.) to compute metrics per bucket.

2. **Always check rounding requirements**: Many database problems require specific rounding. Use ROUND() with the appropriate precision.

3. **Understand join types**: INNER JOIN vs LEFT JOIN can give different results. Check foreign key constraints to determine which is appropriate.

4. **Test edge cases**: What if a project has no employees? What if experience_years is NULL? What if multiple employees have the same ID? (Shouldn't happen with proper constraints.)

Related problems: [Project Employees II](/problem/project-employees-ii)
