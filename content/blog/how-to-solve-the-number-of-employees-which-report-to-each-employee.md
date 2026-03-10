---
title: "How to Solve The Number of Employees Which Report to Each Employee — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode The Number of Employees Which Report to Each Employee. Easy difficulty, 53.0% acceptance rate. Topics: Database."
date: "2027-09-14"
category: "dsa-patterns"
tags: ["the-number-of-employees-which-report-to-each-employee", "database", "easy"]
---

# How to Solve "The Number of Employees Which Report to Each Employee"

This problem asks us to generate a report showing each manager's employee ID, name, number of direct reports, and the average age of those reports rounded to the nearest integer. The challenge lies in correctly joining the table with itself to identify reporting relationships while handling aggregation and rounding properly.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this `Employees` table:

| employee_id | name    | reports_to | age |
| ----------- | ------- | ---------- | --- |
| 9           | Hercy   | null       | 43  |
| 6           | Alice   | 9          | 41  |
| 4           | Bob     | 9          | 36  |
| 2           | Winston | null       | 37  |

**Step 1: Identify reporting relationships**

- Alice (employee_id 6) reports to Hercy (employee_id 9)
- Bob (employee_id 4) reports to Hercy (employee_id 9)
- Winston (employee_id 2) has no manager (reports_to is null)
- Hercy (employee_id 9) has no manager (reports_to is null)

**Step 2: Group by manager**

- Hercy (employee_id 9) has 2 direct reports: Alice and Bob
- Winston (employee_id 2) has 0 direct reports
- Alice and Bob have 0 direct reports (no one reports to them)

**Step 3: Calculate metrics for Hercy**

- Number of reports: 2
- Average age: (41 + 36) / 2 = 38.5 → rounded to 39
- Result row: [9, Hercy, 2, 39]

**Step 4: Filter out non-managers**
We only want employees who have at least one direct report, so Winston, Alice, and Bob are excluded from the final result.

## Brute Force Approach

A naive approach might try to process this row-by-row: for each employee, scan the entire table to count how many people report to them and calculate the average age. In SQL terms, this would be a correlated subquery for each row:

```sql
SELECT
    e1.employee_id,
    e1.name,
    (SELECT COUNT(*) FROM Employees e2 WHERE e2.reports_to = e1.employee_id) as reports_count,
    (SELECT ROUND(AVG(e3.age)) FROM Employees e3 WHERE e3.reports_to = e1.employee_id) as average_age
FROM Employees e1
WHERE (SELECT COUNT(*) FROM Employees e2 WHERE e2.reports_to = e1.employee_id) > 0
ORDER BY e1.employee_id;
```

**Why this is inefficient:**

- For each of N employees, we scan the entire table twice (for COUNT and AVG)
- This gives us O(N²) time complexity
- While this might work for small tables, it becomes prohibitively slow as the table grows
- The database has to execute the same subqueries multiple times

## Optimal Solution

The optimal solution uses a self-join to efficiently group reports by their manager, then aggregates the data in a single pass. We join the table with itself where `e2.reports_to = e1.employee_id`, which creates pairs of (manager, report). Then we group by the manager's details and calculate our metrics.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(m) where m is number of managers
SELECT
    e1.employee_id,           -- Select the manager's ID
    e1.name,                  -- Select the manager's name
    COUNT(e2.employee_id) AS reports_count,  -- Count how many employees report to this manager
    ROUND(AVG(e2.age)) AS average_age        -- Calculate and round the average age of reports
FROM
    Employees e1
    INNER JOIN Employees e2 ON e1.employee_id = e2.reports_to  -- Self-join: match managers with their reports
GROUP BY
    e1.employee_id, e1.name   -- Group by manager to aggregate their reports
ORDER BY
    e1.employee_id;           -- Sort by employee_id as required
```

```sql
-- Alternative approach using WHERE clause instead of INNER JOIN
-- Time: O(n) | Space: O(m)
SELECT
    e1.employee_id,
    e1.name,
    COUNT(*) AS reports_count,
    ROUND(AVG(e2.age)) AS average_age
FROM
    Employees e1,
    Employees e2
WHERE
    e1.employee_id = e2.reports_to  -- Filter to find reporting relationships
GROUP BY
    e1.employee_id, e1.name
ORDER BY
    e1.employee_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT e1.employee_id, e1.name`**: We select the manager's identifying information from the first instance of the Employees table (aliased as `e1`).

2. **`COUNT(e2.employee_id) AS reports_count`**: We count how many rows from the second instance (`e2`) are grouped under each manager. Using `COUNT(e2.employee_id)` instead of `COUNT(*)` ensures we don't count NULL values if any exist.

3. **`ROUND(AVG(e2.age)) AS average_age`**: We calculate the average age of the reports and round it to the nearest integer. The `ROUND()` function without a second parameter defaults to rounding to the nearest whole number.

4. **`INNER JOIN Employees e2 ON e1.employee_id = e2.reports_to`**: This is the key self-join. We're matching each employee in `e1` (potential managers) with employees in `e2` who report to them. The INNER JOIN automatically filters out employees who have no reports.

5. **`GROUP BY e1.employee_id, e1.name`**: We group by the manager's details so our aggregate functions (COUNT and AVG) calculate per-manager statistics.

6. **`ORDER BY e1.employee_id`**: Finally, we sort the results by employee_id as specified in the problem requirements.

## Complexity Analysis

**Time Complexity: O(n)**

- The self-join operation typically takes linear time relative to the number of rows in the table
- The GROUP BY and aggregation operations also operate in linear time
- In database terms, with proper indexing on `reports_to`, this would be very efficient

**Space Complexity: O(m)**

- Where m is the number of managers (employees with at least one report)
- The GROUP BY operation needs to maintain aggregation state for each unique manager
- The result set contains one row per manager

## Common Mistakes

1. **Forgetting to round the average age**: The problem specifically asks for the average age rounded to the nearest integer. Using just `AVG(e2.age)` would give decimal values. Always check output requirements carefully.

2. **Including employees with zero reports**: Some candidates use LEFT JOIN instead of INNER JOIN, which would include all employees. Then they try to filter with `HAVING COUNT(e2.employee_id) > 0`. While this works, INNER JOIN is cleaner and more efficient since it filters during the join.

3. **Incorrect GROUP BY clause**: Forgetting to include `e1.name` in the GROUP BY clause when it's in the SELECT statement will cause an error in most SQL databases (though MySQL might allow it with certain settings).

4. **Counting incorrectly**: Using `COUNT(*)` instead of `COUNT(e2.employee_id)` could give wrong results if there are any NULL values in the joined data, though in this specific join pattern they should be equivalent.

## When You'll See This Pattern

This self-join pattern appears frequently in hierarchical data problems:

1. **"Managers with at Least 5 Direct Reports"** (LeetCode 570): Similar structure but with a different filtering condition.

2. **"Department Top Three Salaries"** (LeetCode 185): Uses self-joins or window functions to compare employees within the same department.

3. **"Consecutive Numbers"** (LeetCode 180): Uses self-joins to find consecutive rows meeting certain criteria.

4. **Employee-manager hierarchies in organizational charts**: Any problem dealing with reporting structures, organizational trees, or chain-of-command queries.

The core technique of joining a table to itself is essential for comparing rows within the same table, finding relationships between entities in the same dataset, or processing hierarchical data.

## Key Takeaways

1. **Self-joins solve hierarchical relationships**: When you need to find relationships between rows in the same table (like manager-employee, parent-child, or consecutive items), a self-join is often the right tool.

2. **INNER JOIN filters during the join**: When you only want rows that have matches in both tables (or both instances of the same table), INNER JOIN automatically excludes non-matching rows, which is cleaner than JOIN + WHERE filter.

3. **Always check aggregation requirements**: Pay close attention to whether you need COUNT, AVG, SUM, etc., and whether you need to round or format the results. These details are easy to miss but critical for correct solutions.

[Practice this problem on CodeJeet](/problem/the-number-of-employees-which-report-to-each-employee)
