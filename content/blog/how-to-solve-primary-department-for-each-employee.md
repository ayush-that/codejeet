---
title: "How to Solve Primary Department for Each Employee — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Primary Department for Each Employee. Easy difficulty, 73.9% acceptance rate. Topics: Database."
date: "2027-10-22"
category: "dsa-patterns"
tags: ["primary-department-for-each-employee", "database", "easy"]
---

# How to Solve Primary Department for Each Employee

This problem asks us to find the primary department for each employee from a table where employees can belong to multiple departments. The tricky part is handling cases where an employee has only one department (automatically primary) versus multiple departments where we must rely on the `primary_flag` column to identify which one is marked as primary.

## Visual Walkthrough

Let's trace through a concrete example. Suppose we have this data:

| employee_id | department_id | primary_flag |
| ----------- | ------------- | ------------ |
| 1           | 1             | 'N'          |
| 1           | 2             | 'Y'          |
| 2           | 1             | 'N'          |
| 3           | 3             | 'Y'          |
| 4           | 4             | 'N'          |

**Step 1: Identify employees with only one department**

- Employee 2 has only department 1 (even though flag is 'N', it's their only department)
- Employee 3 has only department 3 (flag is 'Y')
- Employee 4 has only department 4 (flag is 'N')

**Step 2: Identify employees with multiple departments**

- Employee 1 has two departments (1 and 2)

**Step 3: Determine primary department for each**

- Employee 1: Has multiple departments, so we take the one with `primary_flag = 'Y'` → department 2
- Employee 2: Only one department, so it's primary regardless of flag → department 1
- Employee 3: Only one department, so it's primary → department 3
- Employee 4: Only one department, so it's primary → department 4

**Final result:**
| employee_id | department_id |
|-------------|---------------|
| 1 | 2 |
| 2 | 1 |
| 3 | 3 |
| 4 | 4 |

## Brute Force Approach

A naive approach might involve multiple passes through the data:

1. First, find all employees with only one department
2. Then, for employees with multiple departments, find the one with `primary_flag = 'Y'`
3. Combine these results

While this could work with multiple queries or procedural logic, it's inefficient because:

- It requires multiple scans of the table
- The logic becomes complex with multiple subqueries
- It doesn't leverage SQL's set-based operations effectively

The main issue isn't performance (the table is likely small in an easy problem), but rather that the solution becomes unnecessarily complex and hard to maintain.

## Optimal Solution

The key insight is that we need to handle two cases separately:

1. Employees with only one department (regardless of primary_flag)
2. Employees with multiple departments (must have primary_flag = 'Y')

We can solve this elegantly with a UNION approach: first get all single-department employees, then get all employees with explicitly marked primary departments from multi-department cases.

<div class="code-group">

```sql
-- Time: O(n) | Space: O(n) for result set
-- Solution using UNION to handle two cases separately

-- First part: Employees with only one department
-- They are automatically in their primary department regardless of primary_flag
SELECT employee_id, department_id
FROM Employee
WHERE employee_id IN (
    -- Find employees with exactly one department
    SELECT employee_id
    FROM Employee
    GROUP BY employee_id
    HAVING COUNT(*) = 1
)

UNION

-- Second part: Employees with multiple departments
-- We need the department where primary_flag = 'Y'
SELECT employee_id, department_id
FROM Employee
WHERE primary_flag = 'Y';
```

```sql
-- Alternative solution using CASE/WHEN logic
-- Time: O(n) | Space: O(n) for result set

SELECT employee_id, department_id
FROM Employee
WHERE primary_flag = 'Y'
   OR employee_id IN (
       -- Employees with only one department
       SELECT employee_id
       FROM Employee
       GROUP BY employee_id
       HAVING COUNT(*) = 1
   );
```

</div>

**Line-by-line explanation:**

1. **First query (single-department employees):**
   - The subquery `SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1` identifies all employees who appear exactly once in the table
   - The outer query selects those employees along with their only department_id
   - This handles employees like #2, #3, and #4 in our example

2. **Second query (explicit primary flag):**
   - Simply selects all rows where `primary_flag = 'Y'`
   - This captures employees with multiple departments who have explicitly marked one as primary (like employee #1)

3. **UNION operator:**
   - Combines both result sets
   - Automatically removes duplicates (though there shouldn't be any overlap since the two cases are mutually exclusive)
   - Ensures we get all required rows

## Complexity Analysis

**Time Complexity:** O(n)

- The GROUP BY operation with COUNT requires a full table scan: O(n)
- The UNION operation combines two subsets: O(n)
- Overall linear time relative to the number of rows in the Employee table

**Space Complexity:** O(n) for the result set

- In the worst case, every employee has only one department, so we return all rows
- The intermediate GROUP BY result also requires O(n) space
- Database operations may use temporary storage, but it scales linearly with input size

## Common Mistakes

1. **Forgetting employees with only one department:** Some candidates only check for `primary_flag = 'Y'`, missing employees who have only one department but with `primary_flag = 'N'`. Always remember: single department = automatically primary.

2. **Incorrect GROUP BY logic:** Using `HAVING COUNT(primary_flag) = 1` instead of `HAVING COUNT(*) = 1`. The former counts non-null primary_flag values, which could give incorrect results if flags are missing.

3. **Using UNION ALL instead of UNION:** While UNION removes duplicates, UNION ALL keeps them. In this problem, there shouldn't be duplicates, but using UNION is safer and more semantically correct since we're combining distinct logical cases.

4. **Overcomplicating with multiple joins:** Some candidates try to solve this with self-joins or window functions, which work but are more complex than necessary for an Easy problem. The UNION approach is cleaner and easier to understand.

## When You'll See This Pattern

This "multiple cases with different rules" pattern appears in several database problems:

1. **Second Highest Salary (LeetCode #176):** Similar logic where you need to handle cases where there might not be a second highest salary (NULL result).

2. **Department Top Three Salaries (LeetCode #185):** Requires handling different ranking scenarios within groups, similar to how we handle different employee scenarios here.

3. **Exchange Seats (LeetCode #626):** Another problem requiring CASE/WHEN logic or UNION to handle different scenarios (odd/even number of students, last student with no partner).

The core pattern is: when data requires different business rules for different subsets, consider using UNION or CASE statements to handle each scenario separately.

## Key Takeaways

1. **Identify distinct logical cases first:** Before writing any code, clearly separate the different scenarios that require different handling rules. Here: single department vs. multiple departments.

2. **UNION is your friend for separate logic paths:** When different subsets of data need completely different selection criteria, UNION often provides the cleanest solution.

3. **Test edge cases systematically:** Always check: employees with one department (Y flag), employees with one department (N flag), employees with multiple departments (one Y flag), and ensure no employee appears twice in results.

[Practice this problem on CodeJeet](/problem/primary-department-for-each-employee)
