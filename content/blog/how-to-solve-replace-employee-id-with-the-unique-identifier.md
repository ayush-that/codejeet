---
title: "How to Solve Replace Employee ID With The Unique Identifier — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Replace Employee ID With The Unique Identifier. Easy difficulty, 83.5% acceptance rate. Topics: Database."
date: "2026-08-21"
category: "dsa-patterns"
tags: ["replace-employee-id-with-the-unique-identifier", "database", "easy"]
---

# How to Solve "Replace Employee ID With The Unique Identifier"

This problem asks us to combine two database tables: `Employees` (containing employee IDs and names) and `EmployeeUNI` (containing unique IDs and corresponding employee IDs). The challenge is to produce a result that shows employee names alongside their unique IDs, even when some employees don't have a unique ID in the second table. What makes this interesting is handling the NULL values correctly when there's no matching unique ID - a common real-world scenario where data might be incomplete.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Employees table:**

```
id | name
---|------
1  | Alice
7  | Bob
11 | Meir
13 | Winston
```

**EmployeeUNI table:**

```
id | unique_id
---|----------
3  | 1
11 | 2
```

We need to match each employee with their unique_id. Think of it like this:

- Alice (id=1) → Check EmployeeUNI for id=1 → No match → unique_id should be NULL
- Bob (id=7) → Check EmployeeUNI for id=7 → No match → unique_id should be NULL
- Meir (id=11) → Check EmployeeUNI for id=11 → Found! unique_id=2
- Winston (id=13) → Check EmployeeUNI for id=13 → No match → unique_id should be NULL

The final result should be:

```
unique_id | name
----------|-------
NULL      | Alice
NULL      | Bob
2         | Meir
NULL      | Winston
```

Notice that we're keeping ALL employees from the Employees table, even those without matches in EmployeeUNI. This is a classic "left join" scenario.

## Brute Force Approach

In SQL problems, there's rarely a true "brute force" in the algorithmic sense, but there are inefficient or incorrect approaches beginners might try:

1. **Using INNER JOIN instead of LEFT JOIN**: This would only return employees who have a matching unique_id, missing Alice, Bob, and Winston.
2. **Using a subquery with CASE statements**: While this works, it's unnecessarily complex for what a simple join can accomplish.
3. **Trying to manually match rows with procedural logic**: In a programming language, you might try nested loops (O(n×m) time), but SQL is designed to handle this efficiently with joins.

The key insight is that we need to preserve all rows from the Employees table, which immediately points to a LEFT JOIN operation.

## Optimal Solution

The optimal solution uses a LEFT JOIN to combine the tables. A LEFT JOIN returns all records from the left table (Employees), and the matched records from the right table (EmployeeUNI). If there's no match, NULL values are returned for columns from the right table.

<div class="code-group">

```sql
-- Time: O(n + m) for joining, Space: O(n) for result set
SELECT
    eu.unique_id,  -- Select unique_id from EmployeeUNI (will be NULL if no match)
    e.name         -- Select name from Employees
FROM
    Employees e    -- Start with all employees
LEFT JOIN
    EmployeeUNI eu -- Join with unique IDs table
    ON e.id = eu.id  -- Match on employee ID
ORDER BY
    e.name;        -- Optional: sort by name for consistent output
```

```sql
-- Time: O(n + m) for joining, Space: O(n) for result set
SELECT
    eu.unique_id,  -- Select unique_id from EmployeeUNI (will be NULL if no match)
    e.name         -- Select name from Employees
FROM
    Employees e    -- Start with all employees
LEFT JOIN
    EmployeeUNI eu -- Join with unique IDs table
    ON e.id = eu.id  -- Match on employee ID
ORDER BY
    e.name;        -- Optional: sort by name for consistent output
```

```sql
-- Time: O(n + m) for joining, Space: O(n) for result set
SELECT
    eu.unique_id,  -- Select unique_id from EmployeeUNI (will be NULL if no match)
    e.name         -- Select name from Employees
FROM
    Employees e    -- Start with all employees
LEFT JOIN
    EmployeeUNI eu -- Join with unique IDs table
    ON e.id = eu.id  -- Match on employee ID
ORDER BY
    e.name;        -- Optional: sort by name for consistent output
```

</div>

**Line-by-line explanation:**

1. **`SELECT eu.unique_id, e.name`**: We want two columns - the unique_id (which may be NULL) and the employee name.
2. **`FROM Employees e`**: Start with the Employees table and give it an alias 'e' for brevity.
3. **`LEFT JOIN EmployeeUNI eu`**: Perform a LEFT JOIN with the EmployeeUNI table (alias 'eu'). The "LEFT" means keep ALL rows from Employees.
4. **`ON e.id = eu.id`**: This is the join condition. We match rows where the id in Employees equals the id in EmployeeUNI.
5. **`ORDER BY e.name`**: Optional but good practice - sorts results alphabetically by name.

The magic of LEFT JOIN: For employees with no match in EmployeeUNI, `eu.unique_id` will be NULL, which is exactly what we want.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in Employees table
- `m` = number of rows in EmployeeUNI table
- The database needs to scan both tables once to perform the join. Modern databases use hash joins or merge joins that are linear in the size of the tables.

**Space Complexity: O(n)**

- The result set contains one row for each employee (n rows), each with 2 columns.
- Temporary space for the join operation depends on the database implementation but is typically O(min(n, m)).

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**: This is the most common mistake. INNER JOIN only returns matching rows, so employees without unique_ids would be excluded. Always ask: "Do I need to keep all rows from the primary table?"

2. **Forgetting that NULL appears automatically**: Some candidates try to use COALESCE or CASE statements to handle missing matches, but LEFT JOIN already returns NULL for non-matching rows from the right table.

3. **Incorrect column selection order**: The problem asks for `unique_id` then `name`, but it's easy to reverse them. Always check the expected output format.

4. **Adding unnecessary WHERE clauses**: Some candidates add `WHERE eu.unique_id IS NOT NULL` or similar conditions, which defeats the purpose of the LEFT JOIN by filtering out the NULL values we need to keep.

## When You'll See This Pattern

This LEFT JOIN pattern appears frequently in database problems where you need to preserve all records from one table while optionally including data from another:

1. **Combine Two Tables (LeetCode 175)**: Similar structure - person information in one table, address in another, need all persons even without addresses.

2. **Customers Who Never Order (LeetCode 183)**: Uses LEFT JOIN to find customers with NULL orders (those who never ordered).

3. **Employee Bonus (LeetCode 577)**: Find employees with bonus < 1000 or NULL bonus - another case where LEFT JOIN with NULL check is essential.

The pattern also extends to:

- Finding missing data (where LEFT JOIN produces NULL)
- Calculating metrics with optional dimensions
- Merging user profiles with optional attributes

## Key Takeaways

1. **LEFT JOIN vs INNER JOIN**: When the problem says "show all X even if Y doesn't exist" or mentions "may be NULL", think LEFT JOIN. INNER JOIN is for when you only want matches.

2. **NULL is your friend**: In LEFT JOIN scenarios, NULL values indicate missing relationships. Don't filter them out unless explicitly asked to.

3. **Start with the complete set**: Identify which table contains the "complete set" of entities (here, Employees). That table goes on the LEFT side of the JOIN.

Remember: Database problems often test your understanding of JOIN types more than complex algorithms. Knowing when to use LEFT, RIGHT, INNER, or FULL JOIN is a fundamental skill for working with relational data.

[Practice this problem on CodeJeet](/problem/replace-employee-id-with-the-unique-identifier)
