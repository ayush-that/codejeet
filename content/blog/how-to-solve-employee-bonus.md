---
title: "How to Solve Employee Bonus — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Employee Bonus. Easy difficulty, 77.2% acceptance rate. Topics: Database."
date: "2026-10-15"
category: "dsa-patterns"
tags: ["employee-bonus", "database", "easy"]
---

# How to Solve Employee Bonus

This problem asks us to find employees who have a bonus less than 1000. The tricky part is that we need to join the `Employee` table with the `Bonus` table, but some employees might not have a corresponding bonus entry. When an employee has no bonus record, we should treat their bonus as 0 (or NULL, depending on the requirement). This is a classic **LEFT JOIN** scenario where we need to handle missing data appropriately.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Employee Table:**

```
empId | name    | supervisor | salary
------|---------|------------|-------
1     | John    | 3          | 1000
2     | Alice   | 3          | 2000
3     | Bob     | null       | 3000
4     | Charlie | 3          | 4000
```

**Bonus Table:**

```
empId | bonus
------|------
1     | 500
2     | 2000
4     | 800
```

Notice that:

- Employee 1 has bonus 500 (< 1000)
- Employee 2 has bonus 2000 (≥ 1000)
- Employee 3 has no bonus record (bonus should be treated as 0 or NULL)
- Employee 4 has bonus 800 (< 1000)

After performing a LEFT JOIN, we get:

```
empId | name    | bonus
------|---------|------
1     | John    | 500    ← Include (bonus < 1000)
2     | Alice   | 2000   ← Exclude (bonus ≥ 1000)
3     | Bob     | null   ← Include (bonus is null, which we treat as < 1000)
4     | Charlie | 800    ← Include (bonus < 1000)
```

The key insight is that we need to include employees whose bonus is either:

1. Less than 1000, OR
2. NULL (meaning they have no bonus record)

## Brute Force Approach

A naive approach might try to handle this with multiple queries or suboptimal joins:

1. First, get all employees with bonuses less than 1000
2. Then, get all employees not in the Bonus table
3. Combine the results with UNION

While this would work, it's inefficient because:

- It requires multiple passes over the data
- The UNION operation adds overhead
- It's more complex to write and maintain
- It doesn't leverage the database's optimized JOIN operations

The optimal solution uses a single LEFT JOIN with proper filtering conditions.

## Optimal Solution

The optimal solution uses a LEFT JOIN to include all employees, then filters for those with bonus < 1000 OR bonus IS NULL. The LEFT JOIN ensures employees without bonus records are still included in the result.

<div class="code-group">

```sql
-- Time: O(n + m) for the join operation
-- Space: O(n + m) for the result set
SELECT
    e.name,
    b.bonus
FROM
    Employee e
LEFT JOIN
    Bonus b ON e.empId = b.empId
WHERE
    b.bonus < 1000 OR
    b.bonus IS NULL;
```

```sql
-- Alternative formulation with COALESCE
-- Time: O(n + m) | Space: O(n + m)
SELECT
    e.name,
    b.bonus
FROM
    Employee e
LEFT JOIN
    Bonus b ON e.empId = b.empId
WHERE
    COALESCE(b.bonus, 0) < 1000;
```

</div>

**Line-by-line explanation:**

1. `SELECT e.name, b.bonus` - We want to return the employee name and their bonus (if any)
2. `FROM Employee e` - Start with the Employee table, aliased as 'e' for brevity
3. `LEFT JOIN Bonus b ON e.empId = b.empId` - Perform a LEFT JOIN with the Bonus table
   - LEFT JOIN ensures ALL employees are included, even if they don't have a matching bonus
   - Employees without bonuses will have NULL in the bonus column
4. `WHERE b.bonus < 1000 OR b.bonus IS NULL` - Filter the results
   - `b.bonus < 1000` includes employees with bonuses less than 1000
   - `b.bonus IS NULL` includes employees without any bonus record
   - The OR operator combines both conditions

**Alternative with COALESCE:**

- `COALESCE(b.bonus, 0)` returns the first non-NULL value
- If `b.bonus` is NULL, it returns 0 instead
- This simplifies the WHERE clause to a single condition

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in Employee table
- `m` = number of rows in Bonus table
- The LEFT JOIN operation typically uses hash joins or merge joins, which are O(n + m) in practice
- The WHERE clause filtering adds O(n) in the worst case

**Space Complexity: O(n + m)**

- The result set contains at most `n` rows (all employees)
- Each row contains data from both tables
- Temporary storage for the join operation may also require O(n + m) space

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**
   - INNER JOIN only returns employees with matching bonus records
   - Employees without bonuses would be excluded entirely
   - **Fix:** Always use LEFT JOIN when you need to include rows without matches

2. **Forgetting to handle NULL values in the WHERE clause**
   - `WHERE b.bonus < 1000` alone would exclude employees with NULL bonuses
   - NULL < 1000 evaluates to NULL (not TRUE), so those rows are filtered out
   - **Fix:** Add `OR b.bonus IS NULL` to explicitly include NULL values

3. **Incorrect placement of the WHERE condition**
   - Placing the filter in the ON clause: `LEFT JOIN Bonus b ON e.empId = b.empId AND b.bonus < 1000`
   - This still filters out employees without bonuses during the join
   - **Fix:** Keep the filter in the WHERE clause to apply it after the join

4. **Assuming 0 instead of NULL for missing bonuses**
   - The problem doesn't specify whether missing bonuses should be treated as 0 or NULL
   - Most SQL implementations treat missing JOIN results as NULL
   - **Fix:** Use `COALESCE(b.bonus, 0)` if you need to treat NULL as 0, or handle NULL explicitly

## When You'll See This Pattern

This LEFT JOIN with NULL handling pattern appears frequently in database problems:

1. **Combine Two Tables (LeetCode 175)** - Similar LEFT JOIN pattern to combine person and address tables
2. **Customers Who Never Order (LeetCode 183)** - Uses LEFT JOIN to find customers without orders
3. **Department Top Three Salaries (LeetCode 185)** - Uses complex joins with filtering conditions
4. **Rising Temperature (LeetCode 197)** - Uses self-join with date comparisons

The core pattern is: "Find records in table A that do/don't have corresponding records in table B, with additional filtering conditions."

## Key Takeaways

1. **Use LEFT JOIN when you need to preserve all rows from the left table**, even if there are no matches in the right table. This is crucial for "find all X that don't have Y" type problems.

2. **Always consider NULL handling in WHERE clauses**. SQL's three-valued logic (TRUE, FALSE, NULL) means that comparisons with NULL often don't work as expected. Use `IS NULL` or `COALESCE()` to handle NULL values explicitly.

3. **Understand the difference between filtering in ON vs WHERE clauses**:
   - Conditions in ON clause filter before the join
   - Conditions in WHERE clause filter after the join
   - For LEFT JOINs, this distinction is critical for preserving unmatched rows

Related problems: [Combine Two Tables](/problem/combine-two-tables)
