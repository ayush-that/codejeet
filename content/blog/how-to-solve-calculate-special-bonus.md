---
title: "How to Solve Calculate Special Bonus — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Calculate Special Bonus. Easy difficulty, 57.0% acceptance rate. Topics: Database."
date: "2027-10-29"
category: "dsa-patterns"
tags: ["calculate-special-bonus", "database", "easy"]
---

# How to Solve "Calculate Special Bonus"

This problem asks you to calculate a special bonus for employees based on two conditions: employees with odd-numbered employee IDs and names that don't start with 'M' receive a 100% bonus (their full salary), while all others receive 0 bonus. The challenge lies in correctly implementing the conditional logic in SQL while handling the edge cases properly.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Sample Employees Table:**

```
employee_id | name    | salary
----------- | ------- | ------
1           | Alice   | 5000
2           | Bob     | 6000
3           | Mary    | 7000
4           | Michael | 8000
5           | Charlie | 9000
```

**Step-by-step calculation:**

1. **Employee 1 (Alice):** ID is odd (1), name doesn't start with 'M' → Bonus = 100% of 5000 = **5000**
2. **Employee 2 (Bob):** ID is even (2) → Bonus = 0% = **0**
3. **Employee 3 (Mary):** ID is odd (3), but name starts with 'M' → Bonus = 0% = **0**
4. **Employee 4 (Michael):** ID is even (4) → Bonus = 0% = **0**
5. **Employee 5 (Charlie):** ID is odd (5), name doesn't start with 'M' → Bonus = 100% of 9000 = **9000**

**Expected Output:**

```
employee_id | bonus
----------- | -----
1           | 5000
2           | 0
3           | 0
4           | 0
5           | 9000
```

Notice that we need to check BOTH conditions: the employee_id must be odd AND the name must NOT start with 'M'. If either condition fails, the bonus is 0.

## Brute Force Approach

While SQL problems don't typically have "brute force" solutions in the algorithmic sense, there are less efficient or more complex ways to solve this problem that we should consider:

**Inefficient Approach 1: Multiple CASE Statements**

```sql
SELECT
    employee_id,
    CASE
        WHEN employee_id % 2 = 1 THEN
            CASE
                WHEN name NOT LIKE 'M%' THEN salary
                ELSE 0
            END
        ELSE 0
    END AS bonus
FROM Employees
ORDER BY employee_id;
```

**Inefficient Approach 2: Subqueries**

```sql
SELECT
    employee_id,
    (SELECT
        CASE
            WHEN e.employee_id % 2 = 1 AND e.name NOT LIKE 'M%'
            THEN e.salary
            ELSE 0
        END
    ) AS bonus
FROM Employees e
ORDER BY employee_id;
```

**Why these are suboptimal:**

- The nested CASE statements are harder to read and maintain
- The subquery approach adds unnecessary complexity
- Both approaches work correctly but aren't as clean as a single CASE statement with proper conditions

## Optimal Solution

The optimal solution uses a single CASE statement with a compound condition. This is the most readable and efficient approach.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(1) excluding output
SELECT
    employee_id,  -- Select the employee ID column
    CASE
        -- Check both conditions: odd employee_id AND name doesn't start with 'M'
        WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%'
        THEN salary  -- If both conditions true, bonus = full salary
        ELSE 0       -- Otherwise, bonus = 0
    END AS bonus    -- Name the calculated column as 'bonus'
FROM Employees      -- From the Employees table
ORDER BY employee_id;  -- Sort by employee_id as required
```

```sql
-- Alternative using MOD() function instead of % operator
-- Time: O(n) where n is number of rows | Space: O(1) excluding output
SELECT
    employee_id,
    CASE
        -- MOD(employee_id, 2) returns 1 for odd numbers, 0 for even
        WHEN MOD(employee_id, 2) = 1 AND name NOT LIKE 'M%'
        THEN salary
        ELSE 0
    END AS bonus
FROM Employees
ORDER BY employee_id;
```

```sql
-- Alternative using LEFT() function for string comparison
-- Time: O(n) where n is number of rows | Space: O(1) excluding output
SELECT
    employee_id,
    CASE
        -- LEFT(name, 1) gets the first character of the name
        WHEN employee_id % 2 = 1 AND LEFT(name, 1) != 'M'
        THEN salary
        ELSE 0
    END AS bonus
FROM Employees
ORDER BY employee_id;
```

</div>

**Key Components Explained:**

1. **`CASE` statement**: This is the core of the solution. It allows us to implement conditional logic directly in SQL.
2. **`employee_id % 2 = 1`**: Checks if the employee_id is odd. The modulo operator `%` returns the remainder when dividing by 2. Odd numbers have remainder 1.
3. **`name NOT LIKE 'M%'`**: Checks if the name doesn't start with 'M'. The `LIKE` operator with `'M%'` pattern matches any string starting with 'M', and `NOT` negates this condition.
4. **`AND` operator**: Both conditions must be true for the employee to get the bonus.
5. **`ORDER BY employee_id`**: Ensures the output is sorted as required by the problem statement.

## Complexity Analysis

**Time Complexity:** O(n)

- We need to process each row exactly once to calculate the bonus
- The CASE statement operations (modulo and string comparison) are O(1) per row
- Sorting by employee_id takes O(n log n), but since employee_id is likely indexed (as a primary key), this is efficient

**Space Complexity:** O(1) excluding the output

- We only need constant extra space for calculations
- The output itself requires O(n) space to store the results, but this is typically not counted in SQL space complexity analysis

## Common Mistakes

1. **Using OR instead of AND**:

   ```sql
   -- WRONG: This gives bonus if EITHER condition is true
   WHEN employee_id % 2 = 1 OR name NOT LIKE 'M%' THEN salary
   ```

   The problem requires BOTH conditions to be true. With OR, even-numbered employees with non-M names would get bonuses, which is incorrect.

2. **Forgetting the ORDER BY clause**:
   The problem explicitly states results should be ordered by employee_id. While some test cases might not check this, it's a requirement that should be followed.

3. **Case sensitivity with 'M'**:

   ```sql
   -- WRONG: 'm' is lowercase, but names might start with uppercase 'M'
   WHEN name NOT LIKE 'm%' THEN ...
   ```

   SQL string comparisons are typically case-insensitive for `LIKE` with basic characters, but it's safer to be explicit. Use the correct case as shown in examples.

4. **Incorrect modulo check for odd numbers**:
   ```sql
   -- WRONG: This checks for even numbers
   WHEN employee_id % 2 = 0 AND name NOT LIKE 'M%' THEN salary
   ```
   Remember: odd numbers have remainder 1 when divided by 2, not 0.

## When You'll See This Pattern

This problem teaches several important SQL patterns that appear in many database problems:

1. **Conditional Column Calculation**: Using CASE statements to compute values based on conditions appears in:
   - **LeetCode 627: Swap Salary** - Update salaries based on gender
   - **LeetCode 610: Triangle Judgement** - Check if three sides can form a triangle
   - **LeetCode 1393: Capital Gain/Loss** - Calculate profit/loss based on transaction type

2. **String Pattern Matching**: The `LIKE` operator with wildcards is essential for:
   - **LeetCode 1667: Fix Names in a Table** - Capitalize first letter of names
   - **LeetCode 1527: Patients With a Condition** - Find patients with specific conditions in descriptions

3. **Mathematical Conditions**: Using mathematical operators in WHERE or CASE clauses appears in:
   - **LeetCode 620: Not Boring Movies** - Filter odd-numbered IDs
   - **LeetCode 627: Swap Salary** - Use modulo to identify genders

## Key Takeaways

1. **Master the CASE statement**: This is SQL's equivalent of if-else logic and is essential for conditional calculations. Remember the syntax: `CASE WHEN condition THEN value1 ELSE value2 END`.

2. **Combine conditions correctly**: Use AND when all conditions must be true, OR when any condition being true is sufficient. In this problem, we need BOTH the odd ID AND non-M name conditions.

3. **Pay attention to sorting requirements**: Even when not explicitly tested, always include ORDER BY when the problem specifies it. It demonstrates attention to detail.

4. **Test edge cases**: Always consider what happens with NULL values, empty strings, or boundary conditions. In this problem, consider: What if a name is NULL? What if salary is 0?

[Practice this problem on CodeJeet](/problem/calculate-special-bonus)
