---
title: "How to Solve Analyze Organization Hierarchy — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Analyze Organization Hierarchy. Hard difficulty, 59.5% acceptance rate. Topics: Database."
date: "2026-07-05"
category: "dsa-patterns"
tags: ["analyze-organization-hierarchy", "database", "hard"]
---

# How to Solve Analyze Organization Hierarchy

This problem asks us to analyze an organization's hierarchy by calculating the number of direct and indirect reports for each employee, along with their average salary. The tricky part is that we need to traverse multiple levels of management hierarchy in a single SQL query, which requires understanding recursive relationships in hierarchical data.

## Visual Walkthrough

Let's consider a small organization with this structure:

```
CEO (id: 1, salary: 100000)
├── Manager A (id: 2, manager_id: 1, salary: 80000)
│   ├── Employee X (id: 3, manager_id: 2, salary: 60000)
│   └── Employee Y (id: 4, manager_id: 2, salary: 55000)
└── Manager B (id: 5, manager_id: 1, salary: 75000)
    └── Employee Z (id: 6, manager_id: 5, salary: 50000)
```

For the CEO (employee_id: 1):

- Direct reports: Manager A (id: 2) and Manager B (id: 5) → 2 direct reports
- Indirect reports: Employee X, Y, Z → 3 indirect reports
- Total reports: 5
- Average salary of reports: (80000 + 75000 + 60000 + 55000 + 50000) / 5 = 64000

For Manager A (employee_id: 2):

- Direct reports: Employee X and Y → 2 direct reports
- Indirect reports: None (no one reports to X or Y) → 0 indirect reports
- Total reports: 2
- Average salary: (60000 + 55000) / 2 = 57500

The challenge is that we need to traverse down the hierarchy tree for each employee to find all their reports, not just immediate ones.

## Brute Force Approach

A naive approach would be to write multiple self-joins, but this has a fundamental limitation: we don't know how many levels deep the hierarchy goes. If we try to handle it with fixed joins:

```sql
-- This only handles up to 3 levels and doesn't scale
SELECT
    e1.employee_id,
    e1.employee_name,
    COUNT(DISTINCT e2.employee_id) +
    COUNT(DISTINCT e3.employee_id) +
    COUNT(DISTINCT e4.employee_id) as total_reports,
    AVG(CASE WHEN e2.employee_id IS NOT NULL THEN e2.salary END) as avg_salary
FROM Employees e1
LEFT JOIN Employees e2 ON e2.manager_id = e1.employee_id
LEFT JOIN Employees e3 ON e3.manager_id = e2.employee_id
LEFT JOIN Employees e4 ON e4.manager_id = e3.employee_id
GROUP BY e1.employee_id, e1.employee_name;
```

**Why this fails:**

1. We need to know the maximum depth in advance (impossible for arbitrary hierarchies)
2. Even if we guess a depth, the query becomes extremely complex with many joins
3. Performance degrades exponentially with each additional level
4. We can't properly calculate averages across all levels

## Optimized Approach

The key insight is that we need a **recursive traversal** of the hierarchy. In SQL, we can achieve this using **Common Table Expressions (CTEs) with recursion**. Here's the step-by-step reasoning:

1. **Identify the hierarchy traversal**: For each employee, we need to find all employees who report to them directly or indirectly. This is a classic tree traversal problem.

2. **Use recursive CTE**: A recursive CTE has two parts:
   - **Anchor member**: The starting point (employees who directly report to a specific manager)
   - **Recursive member**: The recursive step (employees who report to those in the previous level)

3. **Build the hierarchy for each employee**: We need to run this recursive traversal for every employee in the organization. We can do this by starting the recursion from each employee as the root.

4. **Aggregate the results**: Once we have all report relationships, we can count and average salaries for each manager.

The recursive approach automatically handles any depth of hierarchy without needing to know the maximum depth in advance.

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n²) in worst case (each employee manages all others)
-- Space: O(n) for the recursive CTE
WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor member: Start with each employee as the root of their own hierarchy
    SELECT
        employee_id as manager_id,  -- The employee we're analyzing
        employee_id as report_id,   -- Start with themselves (will exclude later)
        salary as report_salary,
        0 as level                  -- Track depth for debugging (optional)
    FROM Employees

    UNION ALL

    -- Recursive member: Find employees who report to current level
    SELECT
        eh.manager_id,              -- Keep the original manager we're analyzing
        e.employee_id as report_id, -- Employee who reports to someone in current level
        e.salary as report_salary,
        eh.level + 1                -- Increment depth
    FROM EmployeeHierarchy eh
    INNER JOIN Employees e ON e.manager_id = eh.report_id
    -- No need for termination condition beyond no more matches
)
SELECT
    e.employee_id,
    e.employee_name,
    -- Count distinct reports excluding the employee themselves
    COUNT(DISTINCT CASE WHEN eh.report_id != e.employee_id THEN eh.report_id END) as total_reports,
    -- Calculate direct reports (one level down)
    COUNT(DISTINCT CASE WHEN eh.level = 1 THEN eh.report_id END) as direct_reports,
    -- Calculate indirect reports (more than one level down)
    COUNT(DISTINCT CASE WHEN eh.level > 1 THEN eh.report_id END) as indirect_reports,
    -- Average salary of all reports (excluding the employee themselves)
    ROUND(AVG(CASE WHEN eh.report_id != e.employee_id THEN eh.report_salary END), 0) as avg_salary
FROM Employees e
LEFT JOIN EmployeeHierarchy eh ON e.employee_id = eh.manager_id
GROUP BY e.employee_id, e.employee_name
ORDER BY e.employee_id;
```

```sql
-- Alternative approach: More efficient by excluding self in anchor
-- Time: O(n²) in worst case | Space: O(n)
WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor: Direct reports for each employee (exclude self)
    SELECT
        e1.employee_id as manager_id,
        e2.employee_id as report_id,
        e2.salary as report_salary,
        1 as level  -- Direct reports are level 1
    FROM Employees e1
    LEFT JOIN Employees e2 ON e2.manager_id = e1.employee_id
    WHERE e2.employee_id IS NOT NULL  -- Only include actual reports

    UNION ALL

    -- Recursive: Indirect reports (follow the chain)
    SELECT
        eh.manager_id,
        e.employee_id as report_id,
        e.salary as report_salary,
        eh.level + 1
    FROM EmployeeHierarchy eh
    INNER JOIN Employees e ON e.manager_id = eh.report_id
)
SELECT
    e.employee_id,
    e.employee_name,
    -- Total reports (direct + indirect)
    COUNT(DISTINCT eh.report_id) as total_reports,
    -- Direct reports (level = 1)
    COUNT(DISTINCT CASE WHEN eh.level = 1 THEN eh.report_id END) as direct_reports,
    -- Indirect reports (level > 1)
    COUNT(DISTINCT CASE WHEN eh.level > 1 THEN eh.report_id END) as indirect_reports,
    -- Average salary of reports
    ROUND(AVG(eh.report_salary), 0) as avg_salary
FROM Employees e
LEFT JOIN EmployeeHierarchy eh ON e.employee_id = eh.manager_id
GROUP BY e.employee_id, e.employee_name
ORDER BY e.employee_id;
```

</div>

**Key parts explained:**

1. **Recursive CTE structure**: The CTE builds a table linking each manager to all their reports at all levels.
2. **Anchor member**: Starts the recursion. The first version includes the employee themselves (filtered out later), while the alternative starts with direct reports only.
3. **Recursive member**: Joins the current level of reports with employees who report to them, building the hierarchy downward.
4. **Aggregation**: The main query joins each employee with their hierarchy and calculates counts and averages.
5. **CASE statements**: Used to separate direct (level 1) from indirect (level > 1) reports.
6. **LEFT JOIN**: Ensures employees with no reports are still included in results (with 0 counts).

## Complexity Analysis

**Time Complexity: O(n²) in worst case**

- In the worst-case scenario (a completely flat organization where everyone reports to one person), the recursive CTE will generate n-1 records for the top manager, n-2 for the next, etc., leading to O(n²) total records.
- In practice, most organizational hierarchies are tree-structured with branching factor > 1, making it closer to O(n log n).

**Space Complexity: O(n)**

- The recursive CTE stores at most O(n) records at any time (all employees in the current traversal path).
- The final result set has n rows (one per employee).

**Why not O(n²) space?** Each employee appears in the hierarchy of each of their ancestors, but in a tree structure, the total number of manager-report relationships is O(n), not O(n²).

## Common Mistakes

1. **Forgetting to exclude the employee themselves**: When counting reports, employees shouldn't count themselves. This leads to off-by-one errors where everyone has at least 1 report.

2. **Not handling employees with no reports**: Using INNER JOIN instead of LEFT JOIN excludes employees with no reports from results. They should appear with 0 counts.

3. **Infinite recursion cycles**: If the data has a cycle (A manages B, B manages C, C manages A), the recursive CTE will run forever. Real employee data shouldn't have cycles, but it's good practice to add a depth limit: `WHERE eh.level < 100`.

4. **Incorrect average calculation**: Averaging NULL values (when employees have no reports) gives NULL, not 0. Use COALESCE or ensure the CASE statement handles NULLs properly.

5. **Counting duplicates in deep hierarchies**: If using multiple joins without DISTINCT, employees who are reachable through multiple paths might be counted multiple times.

## When You'll See This Pattern

This recursive hierarchy traversal pattern appears in many tree and graph problems:

1. **Employee Hierarchy Problems**: Similar to LeetCode's "Department Top Three Salaries" or "Managers with at Least 5 Direct Reports", but with multi-level traversal.

2. **Tree Traversal in SQL**: Any problem requiring traversal of parent-child relationships, like "Find all ancestors/descendants of a node" or "Calculate subtree sums".

3. **Graph Path Finding**: While not identical, the recursive CTE approach is similar to finding all reachable nodes in a directed acyclic graph (DAG).

4. **Nested Comment Threads**: Displaying comment hierarchies where comments can have replies, which can have their own replies.

5. **Bill of Materials**: In manufacturing, where products are made from subcomponents, which are made from smaller parts.

## Key Takeaways

1. **Recursive CTEs are essential for hierarchical data**: When you need to traverse unknown depths in SQL, recursive CTEs are the standard solution. Remember the two-part structure: anchor + recursive member.

2. **Watch for cycles in real data**: Always consider adding a depth limit or cycle detection in production code, even if the problem statement assumes valid data.

3. **Test edge cases thoroughly**: Empty hierarchies, single employee organizations, deep chains (A→B→C→D), and wide flat structures all behave differently.

4. **Understand the difference between INNER and LEFT joins**: In hierarchy traversal, INNER JOIN finds paths, but LEFT JOIN ensures all root nodes appear in results.

[Practice this problem on CodeJeet](/problem/analyze-organization-hierarchy)
